import React, { useEffect } from 'react'
import ChatContext from './ChatContext'
const ChatState = (props) => {

    const host = "http://localhost:5000";
    const [user,setUser] = useState()

    useEffect(()=>{
      const userInfo = JSON.parse(localStorage.getItem('userInfo'))
        setUser(userInfo)
        console.log(user)
    },[])
  return (
    <ChatContext.Provider value={{user,setUser}}>
        {props.children}
    </ChatContext.Provider>
  )
}

export default ChatState
