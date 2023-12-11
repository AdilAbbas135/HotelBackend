const mongoose = require("mongoose");
const { Schema } = mongoose;

const AttributeValuesSchema=Schema({
    Name:{
        type: String,
        required: [true, "Attribute Value is Required"]
    },
    ParentAttribute:{
        type:Schema.Types.ObjectId,
        required: [true, "Parent Attribute id is Required"],
        ref:"attributes",
    },
    Store:{
        type:Schema.Types.ObjectId,
        required: [true, "Store id is Required"],
        ref:"stores",
    },
}, {timestamps:true})
const AttributeValuesModel = mongoose.model("attribute-values", AttributeValuesSchema);
module.exports =AttributeValuesModel;