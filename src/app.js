const express = require('express')
const app = express()
const connectDB = require('./config/database')
const cookieParser = require('cookie-parser')
const authRouter = require('./routes/auth')
const profileRouter = require('./routes/profile')
const requestRouter = require('./routes/requests')

app.use(cookieParser())
app.use(express.json())
app.use('/', authRouter)
app.use('/', profileRouter)
app.use('/', requestRouter)

connectDB().then(() => {
    console.log("Database connected successfully")
    app.listen(7777, () => {
        console.log("Server is running on port 7777")
    })

}).catch((err) => {
    console.log("Database connection failed", err)
})

