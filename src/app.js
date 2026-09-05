require('dotenv').config()
const express = require('express')
const cors = require('cors')
const app = express()
const connectDB = require('./config/database')
const cookieParser = require('cookie-parser')
const http = require('http')
const PORT = process.env.PORT || 7777
require('./utils/cronjob')
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}))
app.use(express.json())
app.use(cookieParser())
const authRouter = require('./routes/auth')
const profileRouter = require('./routes/profile')
const requestRouter = require('./routes/requests')
const userRouter = require('./routes/user')
const paymentRouter = require('./routes/payment')
const intializeSocket = require('./utils/socket')
app.use('/', authRouter)
app.use('/', profileRouter)
app.use('/', requestRouter)
app.use('/', userRouter)
app.use('/',paymentRouter)
const server = http.createServer(app)
intializeSocket(server)

connectDB().then(() => {
    console.log("Database connected successfully")
    server.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`)
    })

}).catch((err) => {
    console.log("Database connection failed", err)
})

