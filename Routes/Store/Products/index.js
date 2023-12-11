const fs = require('fs');
const express = require("express");
const router = express.Router();
const VerifyToken = require("../../../Middlewear/VerifyToken")
const ProductModel = require("../../../Models/Store/Product")
const {default: mongoose} = require("mongoose");

// GET ALL PRODUCTS OF A SPECIFIC STORE
router.get("/", VerifyToken, async (req, res) => {
    try {
        const Products = await ProductModel.aggregate([{
            $match: {
                Store: new mongoose.Types.ObjectId(req.store._id)
            }
        }, {
            $lookup: {
                from: "galleries",
                localField: "MainImage",
                foreignField: "_id",
                as: "MainImage"

            }
        },{
            $unwind:"$MainImage"
        }

        ])
        return res.status(200).json({Products})
    } catch (error) {
        console.log(error)
        return res.status(500).json({error: "Internal Server Error"})
    }
})
// ADD A NEW PRODUCT TO A SPECIFIC STORE
router.post("/add", VerifyToken, async (req, res) => {
    try {
        // console.log("Request recieved at create product route")
        console.log("body is", req.body)
        console.log("file is", req.file)
        const {Name, Description, MainImage, isVariable, DietTypes, SpiceRatings, Allergens, SingleVariant} = req.body
        await ProductModel.create({
            Name: Name,
            Description: Description,
            MainImage: MainImage,
            isVariable: isVariable,
            SingleVariant: SingleVariant,
            DietTypes: DietTypes,
            SpiceRatings: SpiceRatings,
            Allergens: Allergens,
            Store: req.store._id
        })
        return res.status(200).json({msg: "Product Created Successfully"})
    } catch (error) {
        console.log(error);
        return res.status(500).json({error: "Internal Server Error"})
    }
})

module.exports = router