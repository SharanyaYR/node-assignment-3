const User = require('../models/userModel');
const asyncHandler = require('express-async-handler')
const logger = require('../logger/log');

//create user api:postmethod
const createUser = asyncHandler(async (req, res) => {
const {username,name,country,city,isAdult} = req.body

if( !username || !name || !country || !city)
{
 logger.warn('Missing fields in createUser request');
 res.status(400).send({message:'Please add all fields!'})
return 'Please add all fields'
}

const userExists= await User.findOne({username})
if(userExists){
logger.warn(`User with username ${username} already exists`);
res.status(400).send({message:"user already present"})
return 'already a user'
}
const createUser= await User.create({username,name,country,city,isAdult});
if(createUser){
    logger.info(`User created: ${username}`);
    res.status(201).send({success:true,data:{Name:name,contry:country,cityname:city,isAdult:isAdult},message:'created a user'})
}else{
    logger.error('Failed to create user');
    res.status(400).send({message:'Invalid userdata'});
}
})
//update user api:putmethod

const updateUser = asyncHandler(async (req, res) => {
    const { username } = req.params;
    const { name, country, city, isAdult } = req.body;

    const user = await User.findOne({ username });

    if (!user) {
        logger.warn('usernotfound');
        res.status(404).send({ message: 'User not found' });
        return;
    }
    if (Object.keys(req.body).length === 0) {
        logger.warn('Empty update request body');
        res.status(400).send({ message: 'No data provided for update' });
        return;
    }

    user.name = name || user.name;
    user.country = country || user.country;
    user.city = city || user.city;
    user.isAdult = isAdult !== undefined ? isAdult : user.isAdult;

    const updatedUser = await user.save();

    logger.info(`User updated: ${username}`);
    res.status(200).send({
        success: true,
        data: { 
            username: updatedUser.username, 
            Name: updatedUser.name, 
            country: updatedUser.country, 
            cityname: updatedUser.city, 
            isAdult: updatedUser.isAdult 
        },
        message: 'User updated successfully'
    });
});

//update user api:putmethod

const getUserList = asyncHandler(async (req, res) => {
    const users = await User.find();

    if (users.length === 0) {
        logger.info('No users found');
        res.status(404).send({ message: 'No users found' });
        return;
    }   
    logger.info(`Retrieved ${users.length} users`);
    res.status(200).send({
        success: true,
        data: users,
        message: 'Users retrieved successfully'
    });
});
module.exports = { createUser, updateUser,getUserList };