const mongoose = require("mongoose");
const { Schema } = mongoose;

const AttributesSchema=Schema({
    Name:{
        type: String,
        required: [true, "Attribute Name is Required"]
    },
    Store:{
        type:Schema.Types.ObjectId,
        required: [true, "Store id is Required"],
        ref:"stores",
    },
})
const AttributesModel = mongoose.model("attributes", AttributesSchema);
module.exports =AttributesModel;