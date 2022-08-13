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
    useToast,
    FormControl,
    Input,
    Button,
    Box,
  } from '@chakra-ui/react'
import ChatContext from '../../context/ChatContext'
import axios from 'axios'
import ChatLoading from '../ChatLoading'
import UserListItem from '../UserAvatar/UserListItem'
import UserBadgeItem from '../UserAvatar/UserBadgeItem'
const GroupChatModel = ({children}) => {

    const { isOpen, onOpen, onClose } = useDisclosure()
    const [groupChatName,setGroupChatName] = useState()
    const [selectedUsers,setSelectedUsers] = useState([])
    const [search,setSearch] = useState('')
    const [searchResult,setSearchResult] = useState([])
    const [loading,setLoading] = useState(false)

    const toast = useToast()

    const {user,chats,setChats} = useContext(ChatContext)

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
            console.log(data);
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
    const handleSubmit = async()=>{
      if(!groupChatName || ! selectedUsers){
        toast({
          title: 'Fields cannot be empty',
          status: 'error',
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
            const {data} = await axios.post('/api/chat/group',{
              name:groupChatName,
              users : JSON.stringify(selectedUsers.map((u)=>u._id))
            },config)

            setChats([data,...chats])
            setLoading(false)
            onClose()
            toast({
              title: 'New group Chat created',
              status: 'success',
              duration: 2000,
              isClosable: true,
              position: 'top-right'   
          })
      } catch (error) {
        toast({
          title: 'Group cannot be created due to some reasons',
          status: 'error',
          duration: 2000,
          isClosable: true,
          position: 'top-right'   
      })
      }
    }
    const handleGroup = (userToAdd)=>{
      if(selectedUsers.includes(userToAdd)){
        toast({
          title: 'User alreasy exists in the group',
          status: 'warning',
          duration: 2000,
          isClosable: true,
          position: 'top-right'
      })
      return
      }
      setSelectedUsers([...selectedUsers,userToAdd])
    }

    const handleDelete = (user)=>{
      setSelectedUsers(selectedUsers.filter(sel => sel._id !== user._id))
    }
  return (
    <>
    <span onClick={onOpen}>{children}</span>

    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader
            fontSize='35px'
            display='flex'
            justifyContent='center'
            alignContent='center'
            h='100vh'
        >Create Group Chat
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody
            display='flex'
            flexDir='column'
            alignItems='center'
        >
          <FormControl>
            <Input placeholder='chat Name' mb={3} onChange={(e)=>setGroupChatName(e.target.value)} />
          </FormControl>
          <FormControl>
            <Input placeholder='Add users' mb={1} onChange={(e)=>handleSearch(e.target.value)} />
          </FormControl>
          <Box
            display='flex'
            width='100%'
            flexWrap='wrap'
          >

            {selectedUsers.map((u)=>{
              return(
                <UserBadgeItem key={u._id} user={u} handleFunction={()=>handleDelete(u)} />
                )
              })}
              </Box>
            {loading ? <ChatLoading/> : 
            searchResult?.slice(0,4).map((user=>{
                return(
                    <UserListItem key={user._id} user={user} handleFunction={()=>handleGroup(user)} />
                )
            }))}
        </ModalBody>

        <ModalFooter>
          <Button colorScheme='blue' onClick={handleSubmit}>
            Create Chat
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  </>

  )
}

export default GroupChatModel
