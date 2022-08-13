import { Box } from '@chakra-ui/react'
import React, { useContext } from 'react'
import ChatContext from '../../context/ChatContext'
import SingleChat from '../SingleChat/SingleChat'

const ChatBox = ({fetchAgain,setFetchAgain}) => {

  const {selectedChat} = useContext(ChatContext)
  return (
    <Box
      display={{base : selectedChat ? 'flex' : "none" , md:"flex"}}
      alignItems='center'
      flexDir='column'
      p={3}
      bg='white'
      w={{base : "100%" ,md:"68%"}}
      borderRadius='lg'
      borderWidth='1px'
    >
      <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain}/>
      
    </Box>
  )
}

export default ChatBox
