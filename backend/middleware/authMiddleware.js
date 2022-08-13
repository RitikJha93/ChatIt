const jwt = require('jsonwebtoken')
const User = require('../models/User')
const asyncHandler = require('express-async-handler')

const protect = asyncHandler(async(req,res,next)=>{
    let token;

    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token,process.env.JWT_SECRET)
            req.user = await User.findById(decoded.id).select('password')
            console.log(req.user);
            next()
        } catch (error) {
            res.status(401).send("Failed error occured")
        }   
    }

    if(!token){
        res.status(401).send("Not authrized no token")
    }
})

module.exports = {protect}