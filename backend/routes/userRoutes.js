const express = require('express');
const { registerUser, authUser, getAllUsers } = require('../controllers/userController');
const router = express.Router()
const {protect} = require('../middleware/authMiddleware')
//post routing for creating a new user
router.route('/').post(registerUser).get(protect,getAllUsers)

//post routing for authenticating a user
router.post('/login',authUser)


module.exports = router
