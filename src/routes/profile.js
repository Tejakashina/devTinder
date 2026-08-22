const express = require('express')
const profileRouter = express.Router()
const User = require('../models/user')
const { userAuth } = require('../middlewares/auth')
const { validateProfileEditData } = require('../utils/validator')
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
profileRouter.patch('/updateProfile', userAuth, async (req, res) => {
    try {
        if (!validateProfileEditData(req)) {
            throw new Error("Invalid Edit Request")
        }
        const loggedInUser = req.user
        Object.keys(req.body).forEach((key) => loggedInUser[key] = req.body[key])
        await loggedInUser.save()
        res.json({ Message: `${loggedInUser.firstName} + Your Profile Updated succesfully`, data: loggedInUser })

    }
    catch (err) {
        res.status(400).send("Error: " + err.message)
    }
})
profileRouter.delete('/deleteProfile', userAuth, async (req, res) => {
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