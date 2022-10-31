import { ArrowBackIcon } from '@chakra-ui/icons'
import { Box, FormControl, IconButton, Input, Spinner, Text, useToast } from '@chakra-ui/react'
import axios from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import ChatContext from '../../context/ChatContext'
import { getSender, getSenderFull } from '../config/ChatLogics'
import UpdateGroupChatModal from '../miscellanous/UpdateGroupChatModal'
import ProfileModal from '../ProfileModal/ProfileModal'
import ScrollableChat from '../UserAvatar/ScrollableChat'
import io from 'socket.io-client'
import Lottie from 'react-lottie'
import animationData from '../../animations/typing.json'
import './Messages.css'
const SingleChat = ({fetchAgain,setFetchAgain}) => {

  const ENDPOINT = "http://localhost:5000"
  var socket
  
  var selectedChatCompare
  socket = io(ENDPOINT) 
  

  
    const {user,selectedChat,setSelectedChat,notfications, setNotifications} = useContext(ChatContext)
    const [messages,setMessages]  = useState([])
    const [loading, setLoading] = useState(false)
    const [newMessage, setNewMessage] = useState()
    const [socketConnected, setSocketConnected] = useState(false)
    const toast = useToast()
    const [typing, setTyping] = useState(false)
    const [isTyping, setIsTyping] = useState(false)
    const defaultOptions = {
      loop:true,
      autoplay:true,
      animationData : animationData,
      renderSettings : {
        perserveAspectRatio : "xMidYMid slice",
      }
    }
    const fetchMessages = async()=>{
      if(!selectedChat){
        return
      }
      
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`
          }  
        }
        setLoading(true)

        const {data} = await axios.get(`/api/message/${selectedChat._id}`,config)
        setMessages(data)
        setLoading(false)
        socket.emit("join_chat",selectedChat._id)


      } catch (error) {
        toast({
          title: "some error occurred",
          status: 'error',
          duration: 2000,
          isClosable: true,
          position: 'top-right'
      })
      console.log(error)
      }
    }

    useEffect(() => {   

      socket.emit("setup",user)
      socket.on("connected", ()=> setSocketConnected(!socketConnected))
      socket.on("typing",()=>setIsTyping(true))
      socket.on("stop_typing",()=>setIsTyping(false))
    })

    useEffect(() => {
      fetchMessages()
      selectedChatCompare = selectedChat
      
    }, [selectedChat])

    const sendMessage = async(e)=>{
      if(e.key === 'Enter' && newMessage){
        socket.emit("stop_typing",selectedChat._id)
        try {
          const config = {
            headers: {
              "Content-type": 'application/json',
              Authorization: `Bearer ${user.token}`
            }
          }
          setNewMessage('')
          const {data} = await axios.post('/api/message',{
              content:newMessage,
              chatId:selectedChat._id
          },config)
          socket.emit("new_message",data)
          setMessages([...messages,data])
          
        } catch (error) {
          toast({
            title:"Some error occurred",
            status: 'error',
            duration: 2000,
            isClosable: true,
            position: 'top-right'
        })
        }
      }

    }
    const typingHandler = (e)=>{
      setNewMessage(e.target.value)

      if(!socketConnected) return
      if(!typing){
        setTyping(true)
        socket.emit("typing",selectedChat._id)
      }
      let lastTypingTime = new Date().getTime()
      var timerLength = 3000
      setTimeout(()=>{
        var timeNow = new Date().getTime()
        var timeDiff = timeNow - lastTypingTime

        if (timeDiff >= timerLength && typing) {
          socket.emit("stop_typing",selectedChat._id)
          setTyping(false)
        }
      },timerLength)
    }

    
    

    useEffect(()=>{
      socket.on("message_received",(newMessageReceived)=>{
        if (!selectedChatCompare || selectedChatCompare._id !== newMessageReceived.chat._id) {
          if(notfications.includes(newMessageReceived)){
            setNotifications([newMessageReceived,...notfications])
            setFetchAgain(!fetchAgain)
          }
          console.log("first")
        }
        else{
          setMessages([...messages,newMessageReceived])
          console.table(messages)
        }
      })
    })
    
    
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
                {<UpdateGroupChatModal fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} fetchMessages={fetchMessages}/>}
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
            style={{overflowY:"hidden"}}
        >
          {loading ? <Spinner 
            size='xl'
            width={20}
            height={20}
            alignSelf='center'
            margin='auto'
          /> :
            <div className='messages'>
              <ScrollableChat messages={messages}/>
            </div>}

            <FormControl onKeyDown={sendMessage} mt={3} isRequired>
              {isTyping ? <div>
                <Lottie 
                options={defaultOptions}
                  width={70}
                  style={{marginBottom:15,marginLeft:0}}
                />
              </div> : <></>}
                  <Input 
                    variant='filled'
                    bg='#E0E0E0'
                    placeholder='Enter the message'
                    onChange={typingHandler}
                    value={newMessage}
                  />
            </FormControl>
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
