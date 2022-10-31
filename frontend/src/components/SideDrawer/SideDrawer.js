import { Box, Button, Input, Menu, MenuButton, MenuDivider, MenuItem, MenuList, Spinner, Text, Tooltip, useDisclosure, useToast } from '@chakra-ui/react'
import React, { useContext, useState } from 'react'
import { FiSearch } from 'react-icons/fi';
import { FaBell } from 'react-icons/fa';
import { MdKeyboardArrowDown, MdNotifications } from 'react-icons/md';
import { Avatar, AvatarBadge, AvatarGroup } from '@chakra-ui/react'
import { ChevronDownIcon,BellIcon } from '@chakra-ui/icons'
import {
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
} from '@chakra-ui/react'
import ChatContext from '../../context/ChatContext';
import ProfileModal from '../ProfileModal/ProfileModal';
import {useNavigate } from 'react-router-dom';
import axios from 'axios';
import ChatLoading from '../ChatLoading';
import UserListItem from '../UserAvatar/UserListItem';
import { getSender } from '../config/ChatLogics';
const SideDrawer = () => {

  const [search,setSearch] = useState('')
  const [searchResult,setSearchResult] = useState([])
  const [loading,setLoading] = useState(false)
  const [loadingChat,setLoadingChat] = useState(false)
  const {user,setSelectedChat,chats,setChats,notfications, setNotifications} = useContext(ChatContext)
  const { isOpen, onOpen, onClose } = useDisclosure()
  const toast = useToast()
  const navigate = useNavigate()
  const logoutHandler = ()=>{
    localStorage.removeItem('userInfo')
    navigate('/')
  }

  const handleSearch = async()=>{
    if(!search){
      toast({
          title: 'Please enter something',
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

      const {data} = await axios.get(`/api/user?search=${search}`,config)
      setSearchResult(data)
      setLoading(false)
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
  const accessChat = async(userId)=>{
    try {
      setLoadingChat(true)

      const config = {
        headers : {
          'Content-type':'application/json',
          Authorization : `Bearer ${user.token}`
        }
      }

      const {data} = await axios.post('/api/chat', {userId},config)
      
      if(!chats.find((c)=> c._id === data._id)) setChats([data,...chats])
      setLoadingChat(true)
      setSelectedChat(data)
      onClose()
    } catch (error) {
      toast({
        title: 'Error Occured',
        description:error.message,
        status: 'error',
        duration: 2000,
        isClosable: true,
        position: 'top-right'
    })
    }
  }
  return (
    <>
    <Box
      display='flex'
      justifyContent='space-between'
      alignItems='center'
      bg='white'
      width='100%'  
      p='5px 10px'
      borderWidth='5px'
    >
      <Tooltip label='Search users to chat' hasArrow placement='bottom-end'>
        <Button variant='ghost' onClick={onOpen}>
          <FiSearch/>
          <Text display={{base:'none',md:'flex'}} px='4'>
            Search user
          </Text>
        </Button>
      </Tooltip>

      <Text fontSize='2xl'>
        Chit-Chat
      </Text>

      <div>
        <Menu>
          <MenuButton p={1}>
            <BellIcon fontSize='2xl' mr={5}/>
          </MenuButton>
          <MenuList pl={2}>
            {!notfications.length && "no new messages"}
            {
              notfications.map((notif)=>{
                return(
                  <MenuItem key={notif._id} onClick={()=>{
                    setSelectedChat(notif.chat)
                    setNotifications(notfications.filter((n)=> n !== notif))
                  }}>
                    {notif.chat.isGroupChat ? `New message in ${notif.chat.chatName}` :
                      `New message from ${getSender(user,notif.chat.users)}`
                    }
                  </MenuItem>
                )
              })
            }
          </MenuList>
        <Menu>
            <MenuButton as={Button} p={1} rightIcon={<ChevronDownIcon />}>
              <Avatar size='sm' name={user.name} cursor='pointer' src={user.pic}/>
            </MenuButton>

            <MenuList>
              <ProfileModal user={user}>
                <MenuItem>My Profile</MenuItem>
              </ProfileModal>
              <MenuDivider/>
              <MenuItem onClick={logoutHandler}>Logout</MenuItem>
            </MenuList>
        </Menu>

        </Menu>
      </div>
    </Box>

    <Drawer placement='left' isOpen={isOpen} onClose={onClose}>
         <DrawerOverlay />
         <DrawerContent>
          <DrawerHeader borderBottomWidth='1px'>Search Users</DrawerHeader>

          <DrawerBody>
            <Box display='flex' pb={2}>
              <Input placeholder='Search by name or email' value={search} mr={2} onChange={(e)=>setSearch(e.target.value)} />
              <Button onClick={handleSearch}>Go</Button>
            </Box>
            {loading ? <ChatLoading/> : 
              searchResult.map((user)=>{
                return(
                  <UserListItem user={user} key={user._id} handleFunction={()=>accessChat(user._id)}/>
                )
              })}
              {loadingChat && <Spinner display='flex' ml='auto' />}
          </DrawerBody>

        </DrawerContent>
    </Drawer>

    </>
  )
}

export default SideDrawer
