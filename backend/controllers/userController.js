const asyncHandler = require('express-async-handler')
const generateToken = require('../db/token')
const User = require('../models/User')
const bcrypt = require('bcryptjs')

//creating a new user
const registerUser = asyncHandler(async(req,res)=>{
    const {name,email,password,pic} = req.body

    //if all the fields are empty
    if(!name || !email || !password){
        res.status(400).json({"error":"Please fill in all the input fields"})
    }

    //if email is already registered
    const userExists = await User.findOne({email});
    if(userExists){
        res.status(400).json({"error":"User with this email already exists"})
    }

    //salting the password 
    var salt = bcrypt.genSaltSync(10);

    //if there is no error while signing up then a create a new user model
    const user = new User({
        name,email,
        password:bcrypt.hashSync(password, salt),
        pic
    })
    //saving the user
    const result = user.save()

    //if the user gets registered then res the document
    if(result){
        res.status(201).json({
            _id:user.id,
            name:user.name,
            email:user.email,
            password:user.password,
            pic:user.pic,
            token : generateToken(user.id)
        })
    }
    //if the user does not gets registered for any reason
    else{
        res.status(400).json({"error":"Failed to create the user"})
    }
})

//verifying a user
const authUser = asyncHandler(async(req,res)=>{
    const {email,password} = req.body;

    //finding the email
    const userFound = await User.findOne({email});
    console.log(password);
    //comparing the password
    if(bcrypt.compareSync(password,userFound.password)){
        res.status(201).json({
            _id:userFound.id,
            name:userFound.name,
            email:userFound.email,
            password:userFound.password,
            pic:userFound.pic,
            token : generateToken(userFound.id)
        })
    }
    else{
        res.status(400).json({"error":"Invalid Credentials"})
    }
})

// get req on this /api/user
const getAllUsers = asyncHandler(async(req,res)=>{
    const key = req.query.search ? 
    {
        $or:[
            {name : {$regex : req.query.search , $options : 'i'}},
            {email : {$regex : req.query.search , $options : 'i'}},
        ]
    }
    :{}
    console.log(key);
    const users = await User.find(key).find({_id :{$ne : req.user.id}})
    res.send(users)
})
module.exports = {registerUser,authUser,getAllUsers}

