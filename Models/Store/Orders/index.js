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
            tyep: Object,
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
        Store: {
            type: Schema.Types.ObjectId,
            required: [true, "Store id is Required"],
            ref: "stores",
        },
    },
    {timestamps: true}
);
const OrdersModel = mongoose.model("orders", OrderSchema);
module.exports = OrdersModel;
