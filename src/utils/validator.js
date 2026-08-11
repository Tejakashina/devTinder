const validator = require('validator')
const validateSignupData = (req) => {
    const { firstName, lastName, emailId, password } = req.body
    if (!firstName || !lastName) {
        throw new Error("Please Enter FirstName and LastName")
    }
    else if (!validator.isEmail(emailId)) {
        throw new Error ("Enter valid EmailId")
    }
    else if (!validator.isStrongPassword(password)) {
        throw new Error("Please Entrer a strong Password")
    }
}
module.exports = {validateSignupData}