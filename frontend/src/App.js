import { React, useEffect, useState } from 'react'
import axios from 'axios';
import './App.css'
import {
  BrowserRouter as Router,
  Navigate,
  Route,
  Routes,
  Switch,
  useNavigate
} from "react-router-dom";
import HomePage from './pages/Home/HomePage';
import ChatPage from './pages/Chat/ChatPage';
import Signup from './components/Signup/Signup';
import Login from './components/Login/Login';
import ChatContext from './context/ChatContext';
function App() {
  const navigate = useNavigate()
  const [user,setUser] = useState()
  const [selectedChat,setSelectedChat] = useState()
  const [chats,setChats] = useState([])

  // useEffect(()=>{
  //   const userInfo = JSON.parse(localStorage.getItem('userInfo'))
  //     setUser(userInfo)
  //     if(!userInfo){
  //       navigate('/')
  //     }
  //     console.log(user)
  // },[navigate])
  return (


      <ChatContext.Provider value={{user,setUser,selectedChat,setSelectedChat,chats,setChats}}>
        <div className="App">
          <Routes>
            <Route exact path='/' element={<HomePage />} />
            <Route exact path='/chat' element={<ChatPage />} />
            <Route exact path='/signup' element={<Signup />} />
            <Route exact path='/login' element={<Login />} />
          </Routes>
        </div>
      </ChatContext.Provider>
    
  );
}

export default App;
