#DEVTINDER APIs

authRouter
-POST /signup
-POST /login
-POST /logout

profileRouter
-GET /profile/view
-PATCH /profile/edit
-PATCH /profile/password

connectionRequestRouter
-POST /request/send/intrested/:userId
-POST /request/send/ignored/:userId
-POST /request/review/accepted/:requestId
-POST /request/review/rejected/:requestId

-GET /user/connections
-GET /user/requests
-GET /user/feed - Gets you the profiles of other users on platform

status:ignored, interested, accepted, rejected








//Get user API - GET /getUser - get a user from the database by email
app.get('/getUser', userAuth, async (req, res) => {
    const userEmail = req.body.emailId
    try {
        const user = await User.findOne({ emailId: userEmail }) // Fetch user by email from the database
        // const user = await User.find({}) // Fetch all users from the database
        res.send(user)
    }
    catch (err) {
        res.status(400).send("Error fetching user: " + err.message)
    }

})