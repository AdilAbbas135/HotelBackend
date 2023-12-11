const mongoose = require("mongoose");
const { Schema } = mongoose;

const GallerySchema=Schema({
    Name:{
        type: String,
    },
    AltText:{
        type: String,
    },
    Path:{
        type: String,
        required: [true, "File PathName is Required"],
    },
    Store:{
        type:Schema.Types.ObjectId,
        required: [true, "Store id is Required"],
        ref:"stores",
    }

},{timestamps:true})
const GalleryModel = mongoose.model("gallery", GallerySchema);
module.exports = GalleryModel;