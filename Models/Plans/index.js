const mongoose = require("mongoose");
const {Schema} = mongoose;

const PlansSchema = Schema({
    Name: {
        type: String,
        required: [true, "Plan Name is Required"]
    },
    Price: {
        type: Number,
        required: [true, "Plan Price is Required"]
    },
}, {timestamps: true})
const PlansModel = mongoose.model("pricing-plans", PlansSchema);
module.exports = PlansModel;