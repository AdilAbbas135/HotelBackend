const mongoose = require("mongoose");
const {Schema} = mongoose;

const UserSchema = Schema({
    FirstName: {
        type: String,
        required: [true, "First Name is Required"]
    },
    MiddleName: {
        type: String,
    },
    LastName: {
        type: String,
        required: [true, "Last Name is Required"]
    },
    Email: {
        type: String,
        required: [true, "Email is Required"],
        unique: [true, "This Email is Already Registered"]
    },
    Password: {
        type: String,
    },
    isEmailVerified: {
        type: Boolean,
        default: false,
    },
    CompanyName: {
        type: String,
    },
    PhoneNumber: {
        type: Number,
        required: [true, "Phone Number is Required"]
    },
    EstablishmentType: {
        type: Number,
        required: [true, "Establishment Type is Required"]
    },
    TotalLocations: {
        type: Number,
        required: [true, "Total Locations is Required"]
    },
    SelectedPackage:{
        type:Schema.Types.ObjectId,
        ref: "pricing-plans"
    },
    StripeDetails:{
        type:Object
    },
    Status:{
        type:Number,
        //0 MEANS ORDER RECIEVED AND WEB IN UNDER PROGRESS
        //1 MEANS STORE IS LAUNCHED AND IS WORKING
        default: 0
    }
}, {timestamps: true})
const AllUsersModel = mongoose.model("users", UserSchema);
module.exports = AllUsersModel;