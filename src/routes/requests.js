const express = require('express')
const { userAuth } = require('../middlewares/auth')
const requestRouter = express.Router()
const connectionRequest = require('../models/connectionRequest')
const user = require('../models/user')
const sendEmailConnection = require('../utils/sendEmail')
requestRouter.post('/request/send/:status/:toUserId', userAuth, async (req, res) => {
    try {
        const fromUserId = req.user._id;
        const toUserId = req.params.toUserId;
        const status = req.params.status;
        const allowedstatus = ["interested", "ignored"]
        if (!allowedstatus.includes(status)) {
            return res.status(400).json({ Message: "Invalid status : " + status })
        }
        const toUser = await user.findById(toUserId)
        if (!toUser) {
            return res.status(404).json({ Message: "User Not Found" })
        }
        const connectionReqExist = await connectionRequest.findOne({
            '$or': [
                { fromUserId, toUserId },
                { fromUserId: toUserId, toUserId: fromUserId }
            ]
        })
        if (connectionReqExist) {
            return res.status(400).send({ Message: "Connection Request Already Exists" })
        }
        if (fromUserId.equals(toUserId)) {
            throw new Error("Cannot send connection request to yourself")

        }
        const connectionReq = new connectionRequest({
            fromUserId,
            status,
            toUserId
        })
        const data = await connectionReq.save()
        const emailResponse = await sendEmailConnection.run(
            toUser.emailId,
            "A New Friend Request from " + req.user.firstName,
            `<h1>New Connection Request</h1>
     <p>${req.user.firstName} is ${status} in ${toUser.firstName}.</p>`
        );
        console.log(emailResponse)
        res.json({
            Message: `${req.user.firstName} is ${status} in ${toUser.firstName}`,
            data
        })
    }
    catch (err) {
        res.status(400).send("Error creating user: " + err.message)
    }

})
requestRouter.post('/request/review/:status/:requestId', userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user
        const { status, requestId } = req.params
        //validate th status
        //Teja to kiran
        //loggedInUser === toUserId
        //status=Interested
        //reqId should be valid
        const allowedStatus = ["accepted", "rejected"]
        if (!allowedStatus.includes(status)) {
            return res.status(400).json({ Message: "Status not allowed:" + status })
        }
        const connectionReq = await connectionRequest.findOne({
            _id: requestId,
            toUserId: loggedInUser._id,
            status:"interested"
        })
        if (!connectionReq) {
            return res.status(404).json({Message:"connection Request not Found"})
        }
        connectionReq.status = status
        const data = await connectionReq.save()
        res.json({Message:"Connection Request" + 'is' + status, data})
    }
    catch (err) {
        res.status(400).send("Error creating user: " + err.message)
    }
})
module.exports = requestRouter