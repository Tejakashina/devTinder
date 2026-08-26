const express = require('express')
const { userAuth } = require('../middlewares/auth')
const connectionRequest = require('../models/connectionRequest')
const user = require('../models/user')
const userRouter = express.Router()
//Get all pending requests for the loggedIn user
USER_SAVE_DATA = "firstName lastName emailId photoUrl about skills" 
userRouter.get('/user/requests/received', userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user
        const connectionReq = await connectionRequest.find({
            toUserId: loggedInUser._id,
            status: "interested"  //getting pending list pending means interested
        }).populate("fromUserId", ["firstName", "lastName","photoUrl","age","gender","about"])
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
        }).populate("fromUserId", ["firstName", "lastName", "emailId","photoUrl","about","age","gender"])
            .populate("toUserId", ["firstName", "lastName", "emailId","photoUrl","about","age","gender"])
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
userRouter.get('/feed', userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user
        const page = req.query.page || 1
        let limit = req.query.limit || 10
        const skip = (page - 1) * limit
        limit = limit > 50 ? 50 : limit

        //finding connectionreq  that i have sent or recived
        const connectionReq = await connectionRequest.find({
            '$or': [
                { fromUserId: loggedInUser._id },
                { toUserId: loggedInUser._id }

            ]
        }).select("fromUserId toUserId")
        const hideFromFeed = new Set()
        connectionReq.forEach((req) => {
            hideFromFeed.add(req.fromUserId.toString())
            hideFromFeed.add(req.toUserId.toString())
        })
        const usersList = await user.find({
            '$and': [
                { _id: { '$nin': Array.from(hideFromFeed) } }, //nin=notin
                { _id: { '$ne': loggedInUser._id } }  //ne=notequalto

            ]
        }).select(USER_SAVE_DATA).skip(skip).limit(limit)
        res.send(usersList)
        //Todo: User can see all the users except
        //0.his own card
        //1.his connections
        //2.Igonred people
        //3.already sent the connection Requests


    }
    catch (err) {
        res.status(400).send("Error creating user: " + err.message)
    }
})
module.exports = userRouter