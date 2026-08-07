const express = require('express')
const app = express()
// app.get('/user/:userId/:age', (req, res) => {
//     console.log(req.params)
//     res.send({"firstName": "Teja", "lastName": "Kiran"})
// })
// app.get(/^\/ab*c$/, (req, res) => {
//     res.send({"firstName": "kiran", "lastName": "payyavula"})
// })
app.use('/user', [(req, res, next) => {
    console.log('Handling request 1')
    next()
},
    (req, res) => {
        console.log('Handling request 2')
        res.send("Response 2")
    }],
    (req, res) => {
        console.log('Handling request 3')
        res.send("Response 3")
    },
    (req, res) => {
        console.log('Handling request 4')
        res.send("Response 4")
    })

app.listen(7777, () => {
    console.log("Server is running on port 7777")
})