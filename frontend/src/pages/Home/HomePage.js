import React, { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './Home.css'
import Login from '../../components/Login/Login'
const HomePage = () => {
  
  return (
    <div className='home-cont'>
      <Login/>
    </div>
  )
}

export default HomePage
