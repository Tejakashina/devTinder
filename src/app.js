const express = require('express')
const app = express()
app.use('/', (err, req, res, next) => {
    res.status(500).send('Something broke 1!')
})
app.get('/user', (req, res, next) => {
    // try {
        throw new Error('User route error') 
    // }
    // catch (err) {
        res.status(500).send('Something went wrong in user route')  
    // }
   
})
app.use('/', (err, req, res, next) => {
    if (err) {
        res.status(500).send('Something broke!')
    }
   
})
app.listen(7777, () => {
    console.log("Server is running on port 7777")
})