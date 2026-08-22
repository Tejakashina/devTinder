const validator = require('validator')
const validateSignupData = (req) => {
    const { firstName, lastName, emailId, password } = req.body
    if (!firstName || !lastName) {
        throw new Error("Please Enter FirstName and LastName")
    }
    else if (!validator.isEmail(emailId)) {
        throw new Error("Enter valid EmailId")
    }
    else if (!validator.isStrongPassword(password)) {
        throw new Error("Please Entrer a strong Password")
    }
}
const validateProfileEditData = (req) => {
    data = req.body
    const alowedEditFields = ['firstName', 'lastName', 'age', 'gender', 'photoUrl', 'about', 'skills']
    const isEditAllowed = Object.keys(data).every((update) => alowedEditFields.includes(update))
    return isEditAllowed

}
module.exports = { validateSignupData, validateProfileEditData }