const express = require('express');
const dotenv = require('dotenv');
const PORT = process.env.PORT || 5000;
const chats = require('./data');
const connectDB = require('./db/db');
const userRoutes = require('./routes/userRoutes')
const chatRoutes = require('./routes/chatRoutes')
 
//configuring .env file
dotenv.config()

const app = express()
//connecting database
connectDB()
//for accepting json response from the frontend
app.use(express.json())
app.get('/',(req,res)=>{
    res.status(200).send("Hello My name is Ritik!");
})

app.use('/api/user',userRoutes)
app.use('/api/chat',chatRoutes)

app.listen(PORT,(req,res)=>{
    console.log("Server started succesfully");
})