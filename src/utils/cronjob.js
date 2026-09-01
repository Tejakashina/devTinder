const cron = require('node-cron')
const { subDays, startOfDay, endOfDay } = require('date-fns')
const sendEmail = require('./sendEmail')
const connectionRequestModel = require('../models/connectionRequest')
cron.schedule('57 23 * * *', async () => {
    //send mails to all people who got request the previous day
    try {
        const yesterday = subDays(new Date(), 0)
        const yesterdayStart = startOfDay(yesterday)
        const yesterdayEnd = endOfDay(yesterday)
        const pendingRequests = await connectionRequestModel.find({
            status: "interested",
            createdAt: {
                $gte: yesterdayStart,
                $lt:yesterdayEnd
            }
        }).populate("fromUserId toUserId")
        const listOfEmails = [...new Set(pendingRequests.map(req => req.toUserId.emailId))]
        console.log(listOfEmails)
        for (const email of listOfEmails) {
            try {
                const res = await sendEmail.run(
                    email,
                    "New friend request pending",

                    `
                    <h2>You have a pending connection request</h2>

                    <p>
                        You have one or more pending connection requests
                        waiting for your response.
                    </p>

                    <p>
                        Please login to
                        <a href="https://tinderdev.in">
                            tinderdev.in
                        </a>
                        to accept or reject the request.
                    </p>

                    <br>

                    <p>
                        Thanks,<br>
                        DevTinder Team
                    </p>
                    `
                )
            }
            catch (err) {
                console.error(err)
            }
        }
    }
    catch (err) {
        
    }
});