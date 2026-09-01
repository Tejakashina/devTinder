#DEVTINDER APIs

##authRouter
-POST /signup
-POST /login
-POST /logout

##profileRouter
-GET /profile/view
-PATCH /profile/edit
-PATCH /profile/password

##connectionRequestRouter
-POST /request/send/:status/:userId
-POST /request/review/:status/:requestId

##userRouter
-GET /user/connections
-GET /user/requests/received     //get pending requests
-GET /user/feed - Gets you the profiles of other users on platform

status:ignored, interested, accepted, rejected

#scheduling cronjobs
-installing node-cron
-Learning cron expression syntax by - crontab.guru
-schedule a job-//date fns npm to know abt dates easily
-find all the unique emailId who got connection req in previous day
-Send email
-Explore queue mechanism to send bulk emails - npm bee and bull packages
-Amazon SES bulk email sending
-Make sendEmail function dynamics








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

   const userId = req.params?.userId
    const data = req.body
    try {
        const ALLOWED_UPDATES = ['photoUrl', 'about', 'skills', 'age', 'gender']
        const isUpdateAllowed = Object.keys(data).every((update) => ALLOWED_UPDATES.includes(update))
        if (!isUpdateAllowed) {
            throw new Error("Update not Allowed")
        }
        const user = await User.findByIdAndUpdate(userId, data, { returnDocument: 'before', runValidators: true }) // Update user by ID in the database
        res.send("User updated successfully")
        console.log("Updated user:", user)
    }
    catch (err) {
        res.status(400).send("Error Updating user: " + err.message)
    }