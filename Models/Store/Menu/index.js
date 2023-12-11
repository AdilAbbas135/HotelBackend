const mongoose = require("mongoose");
const {Schema} = mongoose;

const MenuSchema = Schema({
    Name: {
        type: String,
        required: [true, "Menu Name is Required"]
    },
    Description: {
        type: String,
    },
    MainImage:{
        type:Schema.Types.ObjectId,
        ref:"galleries",
    },
    Products: {
        type: [Schema.Types.ObjectId]
    },
    Store: {
        type: Schema.Types.ObjectId,
        required: [true, "Store id is Required"],
        ref: "stores",
    }
},{timestamps:true})
const MenuModel = mongoose.model("menus", MenuSchema);
module.exports = MenuModel;