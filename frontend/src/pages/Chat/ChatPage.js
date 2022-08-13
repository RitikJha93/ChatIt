import { Box } from '@chakra-ui/react'
import React, { useContext, useEffect,useState } from 'react'
import MyChats from '../../components/MyChats/MyChats'
import ChatBox from '../../components/ChatBox/ChatBox'
import SideDrawer from '../../components/SideDrawer/SideDrawer'
import ChatContext from '../../context/ChatContext'
import './Chat.css'
import { useNavigate } from 'react-router-dom'
const ChatPage = () => {

  const context = useContext(ChatContext)
  const {user,setUser,selectedChat,setSelectedChat,chats,setChats} = useContext(ChatContext)
  const [fetchAgain,setFetchAgain] = useState(false)
  const navigate = useNavigate()
  useEffect(()=>{
    const userInfo = JSON.parse(localStorage.getItem('userInfo'))
    setUser(userInfo)
    if(!userInfo){
      navigate('/')
    }
  },[navigate])
  return (
    <div className='chatContainer'>
      {user && <SideDrawer/>}
      <div className='chatCont'>
        {user && <MyChats fetchAgain={fetchAgain}/>}
        {user && <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain}/>}
      </div>
    </div>
  )
}

export default ChatPage
