const mongoose = require('mongoose')
const connectionReqSchema = new mongoose.Schema({
    fromUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref:"User", //reference to the user collection
        required: true
    },
    toUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", //reference to the user collection
        required: true
    },
    status: {
        type: String,
        required: true,
        enum: {
            values: ["ignored", "accepted", "rejected", "interested"],
            message: `{VALUE} is incorrect status Type`
        }
    }
}, { timestamps: true })
// connectionReqSchema.pre("save", function (next) {
//     const connectionReq = this;

//     if (connectionReq.fromUserId.equals(connectionReq.toUserId)) {
//          throw new Error("Cannot send connection request to yourself")
//         );
//     }
//     next();
// });
module.exports = mongoose.model('connectionRequest', connectionReqSchema)