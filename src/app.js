const express = require('express')
const app = express()

app.get('/user', (req, res, next) => {
    console.log('Handling request 1')
    // res.send('Response 1')
    next()
})
app.get('/user', (req, res, next) => {
    console.log('Handling request 2')
    // next() 
})
app.listen(7777, () => {
    console.log("Server is running on port 7777")
})