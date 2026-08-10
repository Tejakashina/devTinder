const express = require('express')
const app = express()
const connectDB = require('./config/database')
const User = require('./models/user')
require('./config/database')
app.use(express.json())
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
connectDB().then(() => {
    console.log("Database connected successfully")
    app.listen(7777, () => {
        console.log("Server is running on port 7777")
    })

}).catch((err) => {
    console.log("Database connection failed", err)
})

