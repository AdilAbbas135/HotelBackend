const mongoose = require("mongoose");
const {Mongoose} = require("mongoose");
const { Schema } = mongoose;

const StoreSchema=Schema({
    Name:{
        type: String,
        required: [true, "Store Name is Required"]
    },
    WebsiteUrl:{
        type: String,
        required: [true, "Store Url is Required"]
    },
   Owner:{
     type:Schema.Types.ObjectId,
       required: [true, "Owner id is Required"],
        ref:"users",
   },
    Locations:{
        type: Array,
    }
} , { timestamps:true})
const StoreModel = mongoose.model("stores", StoreSchema);
module.exports =StoreModel;