const express = require('express')
const app = express()
app.get('/user/:userId/:age', (req, res) => {
    console.log(req.params)
    res.send({"firstName": "Teja", "lastName": "Kiran"})
})
app.get(/^\/ab*c$/, (req, res) => {
    res.send({"firstName": "kiran", "lastName": "payyavula"})
})
app.listen(7777, () => {
    console.log("Server is running on port 7777")
})