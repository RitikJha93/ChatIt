import { ArrowBackIcon } from '@chakra-ui/icons'
import { Box, IconButton, Text } from '@chakra-ui/react'
import React, { useContext } from 'react'
import ChatContext from '../../context/ChatContext'
import { getSender, getSenderFull } from '../config/ChatLogics'
import UpdateGroupChatModal from '../miscellanous/UpdateGroupChatModal'
import ProfileModal from '../ProfileModal/ProfileModal'

const SingleChat = ({fetchAgain,setFetchAgain}) => {
    const {user,selectedChat,setSelectedChat} = useContext(ChatContext)
  return (
    <>
      {selectedChat ? (<>
        <Text
            fontSize={{base:"28px",md:"30px"}}
            pb={3}
            px={2}
            w='100%'
            display='flex'
            justifyContent={{base:'space-between'}}
            alignItems='center'
        >
            <IconButton 
                display={{base:"flex",md:"none"}}
                icon={<ArrowBackIcon/>}
                onClick={()=>setSelectedChat('')}
            />
            {!selectedChat.isGroupChat ? (<>
                {getSender(user,selectedChat.users)}
                <ProfileModal user={getSenderFull(user,selectedChat.users)}/>
            </>) :
             (
                <>
                {selectedChat.chatName.toUpperCase()}
                {<UpdateGroupChatModal fetchAgain={fetchAgain} setFetchAgain={setFetchAgain}/>}
                </>
             )
            }
        </Text>

        <Box
            display='flex'
            flexDir='column'
            justifyContent='flex-end'
            p={3}
            bg='#E8E8E8'
            w='100%'
            h='100%'
            borderRadius='lg'
            overFlowY='hidden'
        >

        </Box>
      </>) : 
      (
        <Box display='flex' justifyContent='center' alignItems='center' h="100%" >
            <Text fontSize='3xl' pb={3} >
                Click a the user to start chatting
            </Text>
        </Box>
      )
      }
    </>
  )
}

export default SingleChat
