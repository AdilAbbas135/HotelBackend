const fs = require('fs');
const express = require("express");
const router = express.Router();
const VerifyToken = require("../../../Middlewear/VerifyToken")
const ProductModel = require("../../../Models/Store/Product")
const {default: mongoose} = require("mongoose");
const ImagePipeLine = require("../../../utils/GetImagePipeline")
const AttributeValuesModel = require("../../../Models/Store/Attributes/AttributeValues")

// GET ALL PRODUCTS OF A SPECIFIC STORE
router.get("/", VerifyToken, async (req, res) => {
    try {
        const Products = await ProductModel.aggregate([{
            $match: {
                Store: new mongoose.Types.ObjectId(req.store._id)
            }
        },
            ...ImagePipeLine()
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
        // console.log("body is", req.body)
        // console.log("file is", req.file)
        const {
            Name,
            Description,
            MainImage,
            isVariable,
            DietTypes,
            SpiceRatings,
            Allergens,
            SingleVariant,
            AddedAttributes,
            Variants,
            Options
        } = req.body
        if (isVariable) {
            await ProductModel.create({
                Name: Name,
                Description: Description,
                MainImage: MainImage,
                isVariable: isVariable,
                DietTypes: DietTypes,
                SpiceRatings: SpiceRatings,
                Allergens: Allergens,
                AddedAttributes: AddedAttributes,
                Variations: Variants,
                Options:Options,
                Store: req.store._id
            })
        } else {
            await ProductModel.create({
                Name: Name,
                Description: Description,
                MainImage: MainImage,
                isVariable: isVariable,
                SingleVariant: SingleVariant,
                DietTypes: DietTypes,
                SpiceRatings: SpiceRatings,
                Allergens: Allergens,
                Options:Options,
                Store: req.store._id
            })
        }
        return res.status(200).json({msg: "Product Created Successfully"})
    } catch (error) {
        console.log(error);
        return res.status(500).json({error: "Internal Server Error"})
    }
})

// DELETE PRODUCT OF A SPECIFIC STORE
router.post("/delete", VerifyToken, async (req, res) => {
    try {
        const ProductId = req.query.ProductId
        console.log("ProductId is", ProductId)
        if (!ProductId) {
            return res.status(400).json({error: "Access Denied"})
        }
        await ProductModel.deleteOne({
            _id: ProductId,
            Store: req.store._id
        })
        return res.status(200).json({msg: "Product Deleted Successfully"})
    } catch (error) {
        console.log(error)
        return res.status(500).json({error: "Internal Server Error"})
    }
})


// FIND PRODUCT WITH DETAILS FOR PUBLIC VIEW
router.get("/find", async (req, res) => {
    try {
        const ProductId = req.query.Id
        console.log("Product Id: " + ProductId)
        const FindProduct = await ProductModel.findById(ProductId)
        if (!FindProduct) {
            return res.status(404).json({error: "Product Not Found"})
        }
        if (FindProduct.isVariable) {
            const FinalProduct = await ProductModel.aggregate([
                {
                    $match: {
                        _id: new mongoose.Types.ObjectId(ProductId)
                    }
                },
                {
                    $unwind: "$Variations"
                },
                {
                    $unwind: "$Variations.SelectedVariants"
                },
                {
                    $lookup: {
                        from: "attribute-values",
                        localField: "Variations.SelectedVariants",
                        foreignField: "_id",
                        as: "SelectedVariantsAttributes"
                    }
                },
                {
                    $project: {
                        AddedAttributes: 0,
                    }
                },
                ...ImagePipeLine()
            ])
            // console.log("Final Product is ", FinalProduct[0])
            return res.status(200).json({Product: FinalProduct})
        } else {
            const FinalProduct = await ProductModel.aggregate([
                {
                    $match: {
                        _id: new mongoose.Types.ObjectId(ProductId)
                    }
                },

                ...ImagePipeLine()
            ])
            return res.status(200).json({Product: FinalProduct})
        }
    } catch (error) {
        console.log(error)
        return res.status(500).json({error: "Internal Server Error "})
    }
})
module.exports = router