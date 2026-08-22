const express = require('express')
const { userAuth } = require('../middlewares/auth')
const connectionRequest = require('../models/connectionRequest')
const userRouter = express.Router()
//Get all pending requests for the loggedIn user
userRouter.get('/user/requests/received', userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user
        const connectionReq = await connectionRequest.find({
            toUserId: loggedInUser._id,
            status: "interested"  //getting pending list pending means interested
        }).populate("fromUserId", ["firstName", "lastName"])
        //populate("fromUserId","firstName lastName")

        res.json({ Message: "Data fetched sucessfully", data: connectionReq })
    }
    catch (err) {
        res.status(400).send("Error creating user: " + err.message)
    }
})
userRouter.get('/user/connections', userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user
        const connectionReqs = await connectionRequest.find({
            '$or': [
                { fromUserId: loggedInUser._id, status: "accepted" },
                { toUserId: loggedInUser._id, status: "accepted" }

            ]
        }).populate("fromUserId", ["firstName",  "lastName", "emailId"])
            .populate("toUserId", ["firstName", "lastName", "emailId"])
        const data = connectionReqs.map((row) => {
            if (row.fromUserId.equals(loggedInUser._id)) {
                return row.toUserId
            }
            else {
                return row.fromUserId
            }

        })
        res.json({ Message: "Connections fetched succesfully", data })
    }
    catch (err) {
        res.status(400).send("Error creating user: " + err.message)
    }


})
module.exports = userRouter