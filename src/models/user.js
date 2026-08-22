const mongoose = require('mongoose');
const Validator = require('validator')
const jwt = require('JsonWebToken')
const bycrypt = require('bcrypt')
const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        minLength:3
    },
    lastName: {
        type: String
    },
    emailId: {
        type: String,
        unique: true,
        required: true,
        lowercase: true,
        trim: true,
        // validate(value) {
        //     if (!Validator.isEmail(value)) {
        //         throw new Error("Invalid Email Adress " + value)
        //     }
        // }
    },
    password: {
        type: String,
        required: true,
        // validate(value) {
        //     if (!Validator.isStrongPassword(value)) {
        //         throw new Error("Enter a Strong Password " + value)
        //     }
        // }
    },
    age: {
        type: Number,
        min: 18
    },
    gender: {
        type: String,
        enum: {
            values: ["male", "female", "others"],
            message: `{VALUE} is not a valid Gender type`
            
        }
        // validate(value) {
        //     if(!["male","female","others"].includes(value)) {
        //         throw new Error("Gender must be either male, female or others")
        //     }
        // }
    },
    photoUrl: {
        type: String,
        validate(value) {
            if (!Validator.isURL(value)) {
                throw new Error("Invalid Photo Url" + value)
            }
        }
    },
    about: {
        type: String,
        default: "Hey there! I am using devTinder."
    },
    skills: {
        type: [String],
        validate(value) {
            if (value.length > 5) {
               throw new Error("Array should not exceed 5")
           }
       }
    }

}, { timestamps: true })
userSchema.methods.getJWT = async function () {
    const user = this
    const token = await jwt.sign({ _id: user._id }, "DEV@TINDER$391", { expiresIn: '7d' })
    return token
}
userSchema.methods.verifyPassword = async function (passwordInputByUser) {
    const user = this
    const isPasswordValid = await bycrypt.compare(passwordInputByUser, user.password)
    return isPasswordValid
}
module.exports = mongoose.model('User', userSchema)