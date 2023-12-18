const express = require('express')
const router = express.Router()
const OrdersModel = require("../../../Models/Store/Orders")
const VerifyToken = require("../../../Middlewear/VerifyToken")
const {default: mongoose} = require("mongoose");
const ProductModel = require("../../../Models/Store/Product")

// GET ALL ORDERS OF A SPECIFIC STORE s
router.get("/", VerifyToken, async (req, res) => {
    try {
        const Orders = await OrdersModel.find({Store: req.store._id})
        return res.status(200).json({Orders})
    } catch (error) {
        console.log(error)
        return res.status(500).json({error: "Internal Server Error"})
    }
})

// CREATE A NEW ORDER OF A SPECIFIC STORE
router.post("/create", async (req, res) => {
    try {
        console.log("Request Recieved")
        console.log(req.body)
        await OrdersModel.create({
            Email: req.body.Email,
            Name: req.body.Name,
            Mobile: req.body.Mobile,
            Items: req.body.Items,
            PaymentDetails: {},
            Note: req.body.Note,
            Store: req.body.Store
        })
        return res.status(200).json({msg: "Order Created Successfully"})
    } catch (error) {
        console.log(error);
        return res.status(500).json({error: "Internal Server Error"});
    }
})

// GET SINGLE ORDER DETAILS OF A SPECIFIC STORE
router.get("/find-order", VerifyToken, async (req, res) => {
    try {

        // const FindOrder=await OrdersModel.findById(req.query.OrderId)
        const FindOrder = await OrdersModel.aggregate([
            {
                $match: {
                    _id: new mongoose.Types.ObjectId(req.query.OrderId),
                    Store: new mongoose.Types.ObjectId(req.store._id)
                }
            },
        ])
        if (!FindOrder) {
            return res.status(404).json({error: "Order not found"})
        }
        if (FindOrder[0].Store.toString() !== req.store._id.toString()) {
            return res.status(401).json({error: "Access denied"})
        }
        let SelectedProductIds = []
        for (let i = 0; i < FindOrder[0].Items.length; i++) {
            SelectedProductIds.push(new mongoose.Types.ObjectId(FindOrder[0].Items[i]._id))
        }
        const GetSelectedItems = await ProductModel.aggregate([
            {
                $match: {
                    _id: {
                        $in: SelectedProductIds
                    }
                },
            },
            {
                $lookup: {
                    from: "galleries",
                    localField: "MainImage",
                    foreignField: "_id",
                    as: "MainImage"

                }
            }, {
                $addFields: {
                    Image: {$arrayElemAt: ["$MainImage", 0]}
                }
            },
            {
                $project: {
                    DietTypes: 0,
                    Allergens: 0,
                    SpiceRatings: 0,
                    MainImage: 0,
                }

            }
        ])
        let SelectedItems = []
        for (let i = 0; i < FindOrder[0].Items.length; i++) {
            SelectedItems.push({
                item: GetSelectedItems[i],
                quantity: FindOrder[0].Items[i].quantity
            })
        }
        let Order = {
            ...FindOrder[0], Items: SelectedItems
        }
        // console.log("Final Order Array is", Order)
        return res.status(200).json({Order: Order})
    } catch (error) {
        console.log(error);
        return res.status(500).json({error: "Internal Server Error "});
    }
})
module.exports = router