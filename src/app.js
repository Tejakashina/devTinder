const express = require('express')
const app = express()

app.use('/user', (req, res) => {
    res.send("Request received from user")
}) //will match all http methods api calls to /user
app.get('/user', (req, res) => {
    res.send({"firstName": "Teja", "lastName": "Kiran"})
})
app.post('/user', (req, res) => {
    res.send("User Added successfully")
})
app.delete('/user', (req, res) => {
    res.send("User Deleted Successfully")
})
app.listen(7777, () => {
    console.log("Server is running on port 7777")
})