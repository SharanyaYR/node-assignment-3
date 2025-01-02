const express=require('express')
const router=express.Router()
const {createUser,updateUser,getUserList}=require('../controllers/UserController')

router.post('/user',createUser)
router.put('/user/:username', updateUser); 
router.get('/users', getUserList); 
module.exports=router