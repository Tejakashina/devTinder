const express = require('express')
const app = express()
const connectDB = require('./config/database')
const User = require('./models/user')
require('./config/database')
app.use(express.json())
//Signup API - POST /signup - create a new user in the database
app.post('/signup', async (req, res) => {
    //creating a new instance of the User model and saving it to the database
    const user = new User(req.body)
    try {
        await user.save()
        res.send("User created successfully")
    }
    catch (err) {
        res.status(400).send("Error creating user: " + err.message)
    }

})
//Get user API - GET /getUser - get a user from the database by email
app.get('/getUser', async (req, res) => {
    const userEmail = req.body.emailId
    try {
        const user = await User.findOne({ emailId: userEmail }) // Fetch user by email from the database
        // const user = await User.find({}) // Fetch all users from the database
        res.send(user)
    }
    catch (err) {
        res.status(400).send("Error fetching user: " + err.message)
    }
  
})
//Update user API - PUT /updateUser - update a user in the database
app.patch('/updateUser/:userId', async (req, res) => {
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
//Delete user API - DELETE /deleteUser - delete a user from the database
app.delete('/deleteUser', async (req, res) => {
    const userId = req.body.userId
    try {
        const user = await User.findByIdAndDelete(userId)
        res.send("User deleted successfully")
    }
    catch (err) {
        res.status(400).send("Error deleting user: " + err.message)
    }

})
//Feed API - GET /feed - get all users from the database
app.get('/feed', async(req, res)=> {
    
})
connectDB().then(() => {
    console.log("Database connected successfully")
    app.listen(7777, () => {
        console.log("Server is running on port 7777")
    })

}).catch((err) => {
    console.log("Database connection failed", err)
})

