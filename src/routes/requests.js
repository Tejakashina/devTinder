const express = require('express')
const requestRouter = express.Router()
requestRouter.get('/sendConnectionrequest', async (req, res) => {
    const user = req.user
    console.log("Sending Connection request")
    res.send(user.firstName + "Sent the connect request")
})
module.exports = requestRouter