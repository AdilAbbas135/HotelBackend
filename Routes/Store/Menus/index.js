const fs = require('fs');
const express = require("express");
const router = express.Router();
const VerifyToken = require("../../../Middlewear/VerifyToken")
const MenuModel = require("../../../Models/Store/Menu")
const {default: mongoose} = require("mongoose");
const ProductModel = require("../../../Models/Store/Product")


// GET ALL Menus OF A SPECIFIC STORE
router.get("/", VerifyToken, async (req, res) => {
    try {
        const Products = await MenuModel.aggregate([{
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
// ADD A NEW Menu Of A SPECIFIC STORE
router.post("/add", VerifyToken, async (req, res) => {
    try {
        // console.log("body is", req.body)
        // console.log("file is", req.file)
        const {Name, Description, SelectedProducts, MainImage} = req.body
        // const SelectedProducts = JSON.parse(req.body.SelectedProducts)
        const FindMenu = await MenuModel.find({Name: Name})
        if (FindMenu?.length > 0) {
            return res.status(400).json({error: "Menu With this Name already exists"})
        } else {
            await MenuModel.create({
                Name: Name,
                Description: Description,
                MainImage: MainImage,
                Products: SelectedProducts,
                Store: req.store._id
            })
            return res.status(200).json({msg: "Menu Created Successfully"})
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({error: "Internal Server Error"})
    }
})

// UPDATE A SPECIFIC MENU
router.post("/update", VerifyToken, async (req, res) => {
    try {
        const FindMenu = await MenuModel.findOne({_id: req.query.MenuId, Store: req.store._id})
        if (!FindMenu) {
            return res.status(404).json({error: "Access denied"})
        }
        await MenuModel.findByIdAndUpdate(req.query.MenuId, {
            $set: {
                Name: req.body.Name,
                Description: req.body.Description,
                MainImage: req.body.MainImage,
                Products: req.body.SelectedProducts
            }
        })
        return res.status(200).json({msg: "Menu updated Successfully"})
    } catch (error) {
        console.log(error);
        return res.status(500).json({error: "Internal Server Error"})
    }
})

// FIND A SPECIFIC MENU AND ITS DETAIL OF A SPECIFIC Store
router.get("/find", VerifyToken, async (req, res) => {
    try {
        const MenuId = req.query.MenuId
        if (!MenuId) {
            return res.status(400).json({error: "Access Denied"})
        } else {
            const Menu = await MenuModel.aggregate([
                {
                    $match: {
                        _id: new mongoose.Types.ObjectId(MenuId),
                        Store: new mongoose.Types.ObjectId(req.store._id)
                    },
                },
                {
                    $lookup: {
                        from: "galleries",
                        localField: "MainImage",
                        foreignField: "_id",
                        as: "MainImage"

                    }
                },
                {
                    $addFields:{
                        Image: { $arrayElemAt: ["$MainImage", 0]}
                    }
                },{
                    $project:{
                        MainImage:0,
                    }
                }
            ])
            // console.log("FIND MENU IS", Menu)
            if (Menu.length == 0) {
                return res.status(400).json({error: "Access Denied"})
            }
            const FindItems = await ProductModel.aggregate([{
                $match: {
                    _id: {
                        $in: Menu[0].Products
                    }
                }
            }, {
                $lookup: {
                    from: "galleries",
                    localField: "MainImage",
                    foreignField: "_id",
                    as: "MainImage"

                }
            }

            ])
            const FinalMenu = {...Menu[0], Products: FindItems}

            return res.status(200).json({Menu: FinalMenu})
        }
    } catch (error) {
        console.log(error)
        return res.status(500).json({error: "Internal Server Error"})
    }
})

module.exports = router