const express = require('express');
const paymentRouter = express.Router();
const { userAuth } = require('../middlewares/auth')
const razorpayInstance = require('../utils/razorpay');
const Payment = require('../models/payments');
const { membershipAmount } = require('../utils/constants');
const { validateWebhookSignature } = require('razorpay/dist/utils/razorpay-utils')
const User = require('../models/user');
paymentRouter.post('/payment/create', userAuth, async (req, res) => {
    const membershipType = req.body.membershipType;
    const { firstName, lastName, emailId } = req.user;
    try {
        const order = await razorpayInstance.orders.create({
            "amount": membershipAmount[membershipType] * 100, // Convert to paise
            "currency": "INR",
            receipt: `receipt_${Date.now()}`,
            "notes": {
                firstName,
                lastName,
                emailId,
                "membershipType": membershipType
            }
        })
        const payment = new Payment({
            userId: req.user._id,
            orderId: order.id,
            status: order.status,
            amount: order.amount,
            currency: order.currency,
            receipt: order.receipt,
            notes: order.notes,
        })
        const savedPayment = await payment.save();
        res.json({ ...savedPayment.toJSON(), keyId: process.env.RAZOR_KEY_ID });
    }
    catch (err) {
        res.status(400).json({ error: "Error processing payment: " + err.message })
    }
})
paymentRouter.post('/payment/webhook', async (req, res) => {
    //req.get and req.headers are equivalent, but req.get is more convenient
    try {
        const isWebHookValid = validateWebhookSignature(JSON.stringify(req.body), req.get('X-Razorpay-Signature'), process.env.RAZOR_WEBHOOK_SECRET)
        if (!isWebHookValid) {
            return res.status(400).json({ error: "Invalid webhook signature" })
        }
        //if my webhook is valid i will make update my payment status in my database
        const paymentDetails = req.body.payload.payment.entity;
        const payment = await Payment.findOne({ orderId: paymentDetails.order_id })
        payment.status = paymentDetails.status;
        await payment.save();
        //Update the user as premium user if payment is successful
        const user = await User.findOne({
            _id: payment.userId
        });
       
       
        if (req.body.event === 'payment.captured') {
            user.isPremium = true;
            user.membershipType = payment.notes.membershipType;
            await user.save();
        }
        // if (req.body.event === 'payment.failed') {
        // }
        //return success response to razorpay
        res.status(200).json({ message: "Webhook processed successfully" })
    }
    catch (err) {
        res.status(400).json({ error: "Error processing webhook: " + err.message })
    }
})
module.exports = paymentRouter;