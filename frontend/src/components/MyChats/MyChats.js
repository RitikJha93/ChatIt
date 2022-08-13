import { AddIcon } from '@chakra-ui/icons'
import { Box, Button, Stack, Text, useToast } from '@chakra-ui/react'
import axios from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import ChatContext from '../../context/ChatContext'
import ChatLoading from '../ChatLoading'
import { getSender } from '../config/ChatLogics'
import GroupChatModel from '../miscellanous/GroupChatModel'

const MyChats = ({fetchAgain}) => {
  const [loggedUser, setLoggedUser] = useState()
  const { user, selectedChat, setSelectedChat, chats, setChats } = useContext(ChatContext)
  const [loading,setLoading] =useState(false)
  const toast = useToast()

  const fetchChats = async () => {
    setLoading(true)
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      }

      const { data } = await axios.get(`/api/chat`, config)
      console.log(data)
      setChats(data)
      setLoading(false)

    } catch (error) {
      toast({
        title: 'Error Occured',
        description: 'Failed to load the chats',
        status: 'error',
        duration: 2000,
        isClosable: true,
        position: 'top-right'
      })
    }
  }

  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem('userInfo')))
    fetchChats()
  }, [fetchAgain])
  return (
    
    <Box
      display={{ base: selectedChat ? 'none' : "flex", md: 'flex' }}
      flexDir='column'
      alignItems='center'
      p={3}
      bg='white'
      w={{ base: '100%', md: '31%' }}
      borderRadius='lg'
      borderWidth='1px'
    >
      <Box
        pb={3}
        px={3}
        fontSize={{ base: "28px", md: '30px' }}
        display='flex'
        width='100%'
        justifyContent='space-between'
        alignItems='center'
      >
        My Chats
        <GroupChatModel>
          <Button
            display='flex'
            fontSize={{ base: "17px", md: "10px", lg: "17px" }}
            rightIcon={<AddIcon />}
          >
            New Group Chat
          </Button>
        </GroupChatModel>


      </Box>

      <Box
        display="flex"
        flexDirection='column'
        p={3}
        bg='#F8F8F8'
        w='100%'
        h='100%'
        borderRadius='lg'
        overflowY='hidden'
      >
        {chats ? (
          <Stack overflowY='scroll'>
            {chats.map((chat) => {
              return (
                <Box
                  onClick={() => setSelectedChat(chat)}
                  cursor='pointer'
                  bg={selectedChat === chat ? '#38B2AC' : '#E8E8E8'}
                  color={selectedChat === chat ? 'white' : '#black'}
                  px={3}
                  py={2}
                  borderRadius='lg'
                  key={chat._id}
                >
                  <Text>
                    {!chat.isGroupChat ? getSender(loggedUser, chat.users) : chat.chatName}
                  </Text>
                </Box>
              )
            })}
          </Stack>
        ) : (<ChatLoading />)}
      </Box>
    </Box>
  )
}

export default MyChats
