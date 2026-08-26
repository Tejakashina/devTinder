const express = require('express')
const authRouter = express.Router()
const { validateSignupData } = require('../utils/validator')
const bycrypt = require('bcrypt')
const User = require('../models/user')
//Signup API - POST /signup - create a new user in the database
authRouter.post('/signup', async (req, res) => {
    //creating a new instance of the User model and saving it to the database
    try {
        //Validation of Data
        validateSignupData(req)
        //Encrypt the password
        const { firstName, lastName, emailId, password } = req.body
        const hashPassword = await bycrypt.hash(password, 10);
        const user = new User({
            firstName,
            lastName,
            emailId,
            password: hashPassword
        })
        const savedUser = await user.save() //User save into DB   
        const token = await savedUser.getJWT()
        res.cookie("token", token, { expires: new Date(Date.now() + 7 * 3600000), httpOnly: true }) 
        res.send({ message: "User created successfully" , data:savedUser})
    }
    catch (err) {
        res.status(400).send("Error creating user: " + err.message)
    }

})
authRouter.post('/login', async (req, res) => {
    try {
        const { emailId, password } = req.body
        const isUser = await User.findOne({ emailId: emailId })
        if (!isUser) {
            throw new Error("Invaid Credentials")
        }
        const isPasswordValid = await isUser.verifyPassword(password)
        if (isPasswordValid) {
            const token = await isUser.getJWT()
            res.cookie("token", token,{expires:new Date(Date.now() + 7 * 3600000) , httpOnly:true}) //1hr expiry
            res.send(isUser)
        }
        else {
            throw new Error("Invalid Credentials")
        }
    }
    catch (err) {
        res.status(400).send("Error: " + err.message)
    }
})
authRouter.post('/logout', async (req, res) => {
    res.cookie('token', null, {expires: new Date(Date.now()) })
    // res.clearCookie('token')
    res.send("Logout Succesfull")
})
module.exports = (authRouter)
