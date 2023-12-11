const express=require('express')
const router =express.Router()
const StoreModel =require("../../Models/Store/index")
const VerifyToken =require("../../Middlewear/VerifyToken")
router.get("/", async (req,res)=>{
    try {}catch (error) {
        console.log(error)
        return res.status(500).json({error:"Internal Server Error"})
    }
})

// CREATE A STORE WITH DETAILS
router.post("/create",VerifyToken, async (req,res)=>{
    try {
        console.log("request recieved at create store",req.body)

        const Store =await StoreModel.create({
            Owner:req.user.userId,
            Name:req.body.StoreName,
            WebsiteUrl:req.body.StoreUrl,
            Locations:req.body.StoreLocation
       })
        return res.status(200).json({msg:"Store Created Successfully"})
    }catch (error) {
        console.log(error)
        return res.status(500).json({error:"Internal Server Error"})
    }
})

module.exports=router