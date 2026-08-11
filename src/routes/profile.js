const express = require('express')
const profileRouter = express.Router()
const User = require('../models/user')
const { userAuth } = require('../middlewares/auth')
profileRouter.get('/profile', userAuth, async (req, res) => {
    try {
        const user = req.user
        res.send(user)
    }
    catch (err) {
        res.status(400).send("Error: " + err.message)
    }
})
//Update user API - PUT /updateUser - update a user in the database
profileRouter.patch('/updateProfile/:userId', async (req, res) => {
    const userId = req.params?.userId
    const data = req.body
    try {
        const ALLOWED_UPDATES = ['photoUrl', 'about', 'skills', 'age', 'gender']
        const isUpdateAllowed = Object.keys(data).every((update) => ALLOWED_UPDATES.includes(update))
        if (!isUpdateAllowed) {
            throw new Error("Update not Allowed")
        }
        const user = await User.findByIdAndUpdate(userId, data, { returnDocument: 'before', runValidators: true }) // Update user by ID in the database
        res.send("User updated successfully")
        console.log("Updated user:", user)
    }
    catch (err) {
        res.status(400).send("Error Updating user: " + err.message)
    }
})
profileRouter.delete('/deleteProfile', async (req, res) => {
    const userId = req.body.userId
    try {
        const user = await User.findByIdAndDelete(userId)
        res.send("User deleted successfully")
    }
    catch (err) {
        res.status(400).send("Error deleting user: " + err.message)
    }

})
module.exports = profileRouter