import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { FaUserAlt } from 'react-icons/fa';
import { FaLock } from 'react-icons/fa';
import './Login.css'
import {useNavigate } from 'react-router-dom'
import axios from 'axios';
// import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useToast } from '@chakra-ui/react';
const Login = () => {

  const [email,setEmail] = useState('')
  const [password,setPassword] = useState('')
  const [loading,setLoading] = useState(false)
  let navigate = useNavigate()
  const toast = useToast()
  const submitHandler = async()=>{
    if(!email || !password ){
      toast({
        title: 'Fields cannot be empty!',
        status: 'warning',
        duration: 2000,
        isClosable: true,
        position: 'top-right'
    })
        
      setLoading(false)
      return
    }

    try {
      const config = {
        headers : {"Content-type":'application/json'}
      }

      const {data} = await axios.post('/api/user/login',{email,password},config)
      toast({
        title: 'Logged in Successfully',
        status: 'success',
        duration: 2000,
        isClosable: true,
        position: 'top-right'
    })
      localStorage.setItem("userInfo",JSON.stringify(data))
      setLoading(false)
      
        navigate('/chat')

    } catch (error) {
      console.log(error.response.data.error)
        toast({
          title: error.response.data.error,
          status: 'error',
          duration: 2000,
          isClosable: true,
          position: 'top-right'
      })
      setLoading(false)
    }
  }
   
    useEffect(()=>{
        const user = JSON.parse(localStorage.getItem('userInfo'))
        if(user){
            navigate('/chat')
        }
    },[navigate])
  return (

    <div className="home-cont">
      <div className="header">
        <h1>ChitChat</h1>
      </div>
    
    <div className='loginCont'>
      <div className="up">

      </div>
      <div className="down">
        
      </div>
      <div className="mainBox">
        <h2>Login</h2>
        <div className="input">
          <div className="inputBox">
            <FaUserAlt/>
            <input type="text" placeholder='Enter your Email' onChange={(e)=>setEmail(e.target.value)}/>
          </div>
          <div className="inputBox">
            <FaLock/>
            <input type="password" placeholder='Enter your Password' onChange={(e)=>setPassword(e.target.value)}/>
          </div>
        </div>
        <p>Don't have an account? <Link to='/signup'>Signup</Link></p>

        <button className='loginBtn' onClick={submitHandler}>Login</button>
      
      </div>
    </div>
    </div>
  )
}

export default Login
