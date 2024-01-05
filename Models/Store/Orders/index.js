const mongoose = require("mongoose");
const {Schema} = mongoose;

const OrderSchema = Schema(
    {
        Email: {
            type: String,
            required: [true, "Email is Required"],
        },
        Name: {
            type: String,
            required: [true, "Name is Required"],
        },
        Mobile: {
            type: Number,
        },
        // Delivery: {
        //   type: Object,
        // },
        Items: {
            type: [Object],
        },
        PaymentDetails: {
            type: Object,
        },
        Note: {
            type: String,
        },
        Status: {
            type: Number,
            default: 0
            // 0 MEANS IN PROGRESS
            // 1 MEANS COMPLETED
            // 2 MEANS CANCELLED
        },
        ServiceStatus:{
            type: Number,
            default: 0,
            // 0 Means PickUp
            // 1  Means Deleivery
            required:[true,"Kindly Select that either you want pickup service or wanted delivery service"]
        },
        Store: {
            type: Schema.Types.ObjectId,
            required: [true, "Store  id is Required"],
            ref: "stores",
        },
    },
    {timestamps: true}
);
const OrdersModel = mongoose.model("orders", OrderSchema);
module.exports = OrdersModel;