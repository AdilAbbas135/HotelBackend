const mongoose = require("mongoose");
const { Schema } = mongoose;

const SingleVariantSchema = new Schema(
    {
        RegularPrice: {
            type: Number,
        },
        SalesPrice: {
            type: Number,
        },
        WPM:{
            type: Number,
        },
        PricingLable:{
            type: String,
        },
        PricingUnit:{
            type: String,
        },
        Calories:{
            type: Number,
        },
        CaloriesMax:{
            type: Number,
        }
    },
    { timestamps: true }
);
const ProductSchema=Schema({
    Name:{
        type: String,
        required: [true, "Product Name is Required"]
    },
    Description:{
        type: String,
    },
    MainImage:{
        type:Schema.Types.ObjectId,
        ref:"galleries",
    },
    isVariable:{
        type: Boolean,
        required: [true, "Product Variation Type is Required"]
    },
    SingleVariant:{
        type: SingleVariantSchema,

    },
    DietTypes:{
        type:[String]
    },
    SpiceRatings:{
        type:[String]
    },
    Allergens:{
        type:[String]
    },
   Store:{
     type:Schema.Types.ObjectId,
       required: [true, "Store id is Required"],
        ref:"stores",
   }
},{timestamps:true})
const ProductModel = mongoose.model("products",ProductSchema);
module.exports =ProductModel;