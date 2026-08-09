const express = require('express')
const app = express()
const { adminAuth } = require('./middlewares/auth')
const { userAuth } = require('./middlewares/auth')
app.use('/admin', adminAuth)
app.get('/admin/getAllUserData', (req, res, next) => {
    res.send('All user data')
})
app.get('/admin/deleteUser', (req, res, next) => {
    res.send('User deleted')
})
app.get('/user', userAuth, (req, res, next) => {
res.send('User data')
})
app.listen(7777, () => {
    console.log("Server is running on port 7777")
})