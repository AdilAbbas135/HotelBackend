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
        }, {
                $addFields:{
                    Image: { $arrayElemAt: ["$MainImage", 0]}
                }
            },{
                $project:{
                    MainImage:0,
                }
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

// DELETE PRODUCT OF A SPECIFIC STORE
router.post("/delete",VerifyToken,async(req,res)=>{
    try{
        const ProductId = req.query.ProductId
        console.log("ProductId is", ProductId)
        if (!ProductId) {
            return res.status(400).json({error: "Access Denied"})
        }
        await ProductModel.deleteOne({
            _id:ProductId,
            Store:req.store._id
        })
        return res.status(200).json({msg:"Product Deleted Successfully"})
    }catch (error) {
        console.log(error)
        return res.status(500).json({error:"Internal Server Error"})
    }
})

module.exports = router