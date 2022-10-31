import React, { useContext, useState } from 'react'
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    useDisclosure,
    IconButton,
    Button,
    useToast,
    Box,
    FormControl,
    Input,
    Spinner,
  } from '@chakra-ui/react'
import { ViewIcon } from '@chakra-ui/icons'
import ChatContext from '../../context/ChatContext'
import UserBadgeItem from '../UserAvatar/UserBadgeItem'
import axios from 'axios'
import UserListItem from '../UserAvatar/UserListItem'
const UpdateGroupChatModal = ({fetchAgain,setFetchAgain,fetchMessages}) => {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const {user,selectedChat,setSelectedChat} = useContext(ChatContext)
    const [groupChatName,setGroupChatName] = useState()
    const [search,setSearch] = useState('')
    const [searchResult,setSearchResult] = useState([])
    const [loading,setLoading] = useState(false)
    const [renameLoading,setRenameLoading] = useState(false)

    const toast = useToast()

    const handleRename = async()=>{
        if(!groupChatName) return

        try {
            setRenameLoading(true)
            const config = {
                headers : {
                    Authorization : `Bearer ${user.token}`
                }
            }

            const {data} = await axios.put('/api/chat/rename',{
                chatId : selectedChat._id,
                chatName : groupChatName
            },config)
  
            setSelectedChat(data)
            setFetchAgain(!fetchAgain)
            setRenameLoading(false)
        } catch (error) {
            toast({
                title: 'Error occurred',
                description:error.response.data.message,
                status: 'error',
                duration: 2000,
                isClosable: true,
                position: 'top-right'
            })
        }
        setGroupChatName('')
    }
    const handleSearch = async(query)=>{
        setSearch(query)
        if(!query){
            return
        }
        try {
            setLoading(true)
            const config = {
                headers : {
                    Authorization : `Bearer ${user.token}`
                }
            }

            const {data} = await axios.get(`/api/user?search=${search}`,config)
            setLoading(false)
            setSearchResult(data)
        } catch (error) {
            toast({
                title: 'Error Occured',
                description:"Failed to load the search results",
                status: 'error',
                duration: 2000,
                isClosable: true,
                position: 'top-right'   
            })
        }
    }
    const handleRemove = async(user1)=>{
        if(selectedChat.groupAdmin._id !== user._id && user1._id !== user._id ){
            toast({
                title: `Only admins can remove someone!`,
                status: 'warning',
                duration: 2000,
                isClosable: true,
                position: 'top-right'   
            })
            return
        }
        try {
            setLoading(true)
            const config = {
                headers : {
                    Authorization : `Bearer ${user.token}`
                }
            }

            const {data} = await axios.put(`/api/chat/groupremove`, 
            {
                chatId : selectedChat._id,
                userId : user1._id
            },config)
            user1._id === user._id ? setSelectedChat() : setSelectedChat(data)
            setFetchAgain(!fetchAgain)
            fetchMessages()
            setRenameLoading(false)
        } catch (error) {
            toast({
                title: 'Error Occured',
                description:"Failed to remove",
                status: 'error',
                duration: 2000,
                isClosable: true,
                position: 'top-right'   
            })
            setLoading(false)
        }
    }
    const handleAddUser = async(user1)=>{
        if(selectedChat.users.find((u)=>u._id === user1._id)){
            toast({
                title: 'User already exists in the group',
                status: 'warning',
                duration: 2000,
                isClosable: true,
                position: 'top-right'   
            })
            return
        }
        if(selectedChat.groupAdmin._id !== user._id){
            toast({
                title: `You don't have the admin access`,
                status: 'warning',
                duration: 2000,
                isClosable: true,
                position: 'top-right'   
            })
            return
        }

        try {
            setLoading(true)
            const config = {
                headers : {
                    Authorization : `Bearer ${user.token}`
                }
            }

            const {data} = await axios.put(`/api/chat/groupadd`, 
            {
                chatId : selectedChat._id,
                userId : user1._id
            },config)
            setSelectedChat(data)
            setFetchAgain(!fetchAgain)
            setRenameLoading(false)
        } catch (error) {
            toast({
                title: 'Error Occured',
                description:"Failed to load the search results",
                status: 'error',
                duration: 2000,
                isClosable: true,
                position: 'top-right'   
            })
        }
    }
  return (
    <>
      <IconButton display='flex' icon={<ViewIcon/>}  onClick={onOpen}/>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            display='flex'
            fontSize='35px'
            justifyContent='center'
          >{selectedChat.chatName}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box display='flex' w='100%' flexWrap='wrap' pb={3}>
                {selectedChat.users.map((u)=>{
                    return(
                        <UserBadgeItem key={u._id} user={u} handleFunction={()=>handleRemove(u)} />

                    )
                })}
            </Box> 
            <FormControl display='flex'>
                <Input 
                    placeholder='chat Name'
                    mb={3}
                    value={groupChatName}
                    onChange={(e)=>setGroupChatName(e.target.value)}
                />
                <Button 
                    variant='solid'
                    colorScheme='teal'
                    ml={1}
                    isLoading={renameLoading}
                    onClick={handleRename}
                >
                    Update
                </Button>
            </FormControl>
            <FormControl>
                <Input 
                    placeholder='Add user to group'
                    mb={1}
                    onChange={(e)=>handleSearch(e.target.value)}
                />
            </FormControl>
            {loading ? <Spinner/> : 
            searchResult?.map((user=>{
                return(
                    <UserListItem key={user._id} user={user} handleFunction={()=>handleAddUser(user)} />
                )
            }))}
          </ModalBody>

          <ModalFooter>
            <Button colorScheme='red' onClick={()=>handleRemove(user)}>
              Leave Group
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default UpdateGroupChatModal
