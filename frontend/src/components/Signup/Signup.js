import React, { useEffect, useState } from 'react'
import './Signup.css'
import { Link } from 'react-router-dom'
import { FaUserAlt } from 'react-icons/fa';
import { FaLock } from 'react-icons/fa';
import { MdEmail } from 'react-icons/md';
import { useToast } from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const Signup = () => {

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [cnfrmPassword, setCnfrmPassword] = useState('')
  const [pic, setPic] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  // const history = useHistory()
  const toast = useToast()
  const postDetails = (pics) => {
    setLoading(true)
    if (pics === undefined) {
      toast({
        title: 'Please select an Image!',
        status: 'error',
        duration: 2000,
        isClosable: true,
        position: 'top-right'
    })
      return
    }

    if (pics.type === 'image/jpeg' || pics.type === 'image/png') {
      const data = new FormData();
      data.append('file', pics)
      data.append('upload_preset', 'Chat_app')
      data.append('cloud_name', 'ritikjha')
      fetch('https://api.cloudinary.com/v1_1/ritikjha/image/upload', {
        method: 'post',
        body: data
      }).then((res) => res.json())
        .then((data) => {
          console.log(data)
          setPic(data.url.toString())
          setLoading(false)
        }).catch((err) => {
          console.log(err);
          setLoading(false)
        })
    }

    else {
      toast({
        title: 'Please select an Image!',
        status: 'error',
        duration: 2000,
        isClosable: true,
        position: 'top-right'
    })
      setLoading(false)
      return
    }
  }

  const submitHandler = async () => {
    if (!name || !email || !password || !cnfrmPassword) {
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

    if (password !== cnfrmPassword) {
      toast({
        title: 'Passwords do not match',
        status: 'error',
        duration: 2000,
        isClosable: true,
        position: 'top-right'
    })
      setLoading(false)
      return
    }

    try {
      const config = {
        headers: { "Content-type": 'application/json' }
      }

      const { data } = await axios.post('/api/user', { name, email, password, pic }, config)
      toast({
        title: 'Account Created successfully',
        status: 'success',
        duration: 2000,
        isClosable: true,
        position: 'top-right'
    })
      localStorage.setItem("userInfo", JSON.stringify(data))
      setLoading(false)

      navigate('/')
    } catch (error) {
      console.log(error)

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
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('userInfo'))
    if (user) {
      navigate('/chat')
    }
  }, [navigate])
  return (
    <div className="home-cont">
      <div className="header">
        <h1>ChitChat</h1>
      </div>

      <div className="signupCont">
        <div className="up">

        </div>
        <div className="down">

        </div>
        <div className="signMainBox">
          <h2>Signup</h2>
          <div className="input">
            <div className="inputBox">
              <FaUserAlt />
              <input type="text" placeholder='Enter your name' onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="inputBox">
              <MdEmail />
              <input type="text" placeholder='Enter your Email' onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="inputBox">
              <FaLock />
              <input type="password" placeholder='Enter your Password' onChange={(e) => setPassword(e.target.value)} />
            </div>
            <div className="inputBox">
              <FaLock />
              <input type="password" placeholder='Confirm your Password' onChange={(e) => setCnfrmPassword(e.target.value)} />
            </div>
            <div className="inputBox">
              <input type="file" accept='/image*' onChange={(e) => postDetails(e.target.files[0])} />
            </div>
          </div>
          <p>Already have an account? <Link to='/login'>Login</Link></p>

          <button className='loginBtn' onClick={submitHandler}>Signup</button>

        </div>
      </div>
    </div>
  )
}

export default Signup
