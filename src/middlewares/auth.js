const jwt = require('JsonWebToken')
const User = require('../models/user')
const userAuth = async (req, res, next) => {
    //Read the token from the req cookies,
    //validate token
    //find the user
    try {
        const { token } = req.cookies
        if (!token) {
            throw new Error(" Token is not valid")
        }
        const decodedMessage = await jwt.verify(token, "DEV@TINDER$391")
        const { _id } = decodedMessage
        const user = await User.findById(_id)
        if (!user) {
            throw new Error("User not Exist")
        }
        req.user = user
        next()
    }
    catch (err) {
        res.status(400).send("ERROR" + err.message)
    }

}

module.exports = { userAuth }