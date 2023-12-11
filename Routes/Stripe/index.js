const express = require("express")
const router =express.Router()
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);


// Create a Payment Intent and Return Secret Key Of a Payment Intent
router.post("/make-payment-intent", async (req,res)=>{
    try{
        const {Email, SelectedPlan}=req.body
        console.log("Body in the Stripe Payment Intent is", req.body);
        const paymentIntent = await stripe.paymentIntents.create({
            // payment_method_types: ["card",],
            amount: SelectedPlan.Price *100, // The amount in cents
            currency: 'usd',
            description: `${SelectedPlan.name} Package payment`,
            automatic_payment_methods: {
                enabled: true
            },
        });
        const clientSecret = paymentIntent.client_secret;
        return res.status(200).json({clientSecret},);
    }catch (error) {
        console.log(error)
        return res.status(500).json({error:"Internal Server Error"})
    }
})
module.exports=router

