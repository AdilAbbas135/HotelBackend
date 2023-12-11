const express=require('express')
const router=express.Router()
const VerifyToken =require("../../Middlewear/VerifyToken")
const AttributesModel=require("../../Models/Store/Attributes")
const AttributeValuesModel=require("../../Models/Store/Attributes/AttributeValues")

// Returns All the Attributes and Variations of a specific store
router.get("/",VerifyToken,async (req,res)=>{
    try{

        const Attributes =await AttributesModel.find({Store:req.store._id})
        const Values =await AttributeValuesModel.find({Store:req.store._id})
        return res.status(200).json({Attributes,Values})
    }catch (error) {
        console.log(error)
        return res.status(500).json({error:"Internal Server Error"})
    }
})
// Add a new  Attributes to a specific store
router.post("/add",VerifyToken,async (req,res)=>{
    try{

        const FindAttribute =await AttributesModel.findOne({Store:req.store._id, Name:req.body?.Name?.toLowerCase()})
        if(FindAttribute){
            return res.status(400).json({error:"Attribute with this Name already exists"})
        }else{
            await AttributesModel.create({
                Name:req.body?.Name.toLowerCase(),
                Store:req.store._id
            })
            return res.status(200).json({msg:"Attribute Added successfully"})
        }
    }catch (error) {
        console.log(error)
        return res.status(500).json({error:"Internal Server Error"})
    }
})
// Delete Attribute of a specific store
router.post("/delete",VerifyToken,async (req,res)=>{
    try{
        // console.log(req.body)
        // console.log(req.store)
       const FindAttribute = await AttributesModel.find({_id:req.body.Id, Store:req.store._id})
        if(FindAttribute){
            await AttributesModel.findByIdAndDelete(req.body.Id)
            // FindAttribute.deleteOne({_id:req.body.Id})
            return res.status(200).json({msg:"Attribute Deleted Successfully"})
        }else{
            return res.status(404).json({msg:"Access Denied"})
        }
    }catch (error) {
        console.log(error)
        return res.status(500).json({error:"Internal Server Error"})
    }
})

// Fetch all The Values of a specific Attribute
router.post("/values",VerifyToken, async (req, res) => {
    try{
        const Values = await AttributeValuesModel.find({
            ParentAttribute:req.body.ParentAttribute,
            Store:req.store._id
        })
        return res.status(200).json({Values})
    }catch (error) {
        console.log(error)
        return res.status(500).json({error:"Internal Server Error"})
    }
})

// Add a new  Values to a specific Attribute
router.post("/values/add",VerifyToken, async (req, res) => {
    try{
        console.log(req.body)
        console.log(req.store)
        const FindValue = await AttributeValuesModel.find({
            Name:req.body.Name.toLowerCase(),
            ParentAttribute:req.body.ParentAttribute,
            Store:req.store._id
        })
        console.log(FindValue)
        if(FindValue.length>0){
            return res.status(400).json({error:"Attribute Value with this Name already exists"})
        }else{
            await AttributeValuesModel.create({
                Name:req.body.Name.toLowerCase(),
                ParentAttribute:req.body.ParentAttribute,
                Store:req.store._id
            })
            return res.status(200).json({msg:"Attribute Value Created"})
        }

    }catch (error) {
        console.log(error)
        return res.status(500).json({error:"Internal Server Error"})
    }
})

// Delete Attribute Value of a specific Attribute of a store
router.post("/values/delete",VerifyToken,async (req,res)=>{
    try{
        // console.log(req.body)
        // console.log(req.store)
        const FindAttribute = await AttributeValuesModel.find({_id:req.body.Id, Store:req.store._id})
        if(FindAttribute){
            await AttributeValuesModel.findByIdAndDelete(req.body.Id)
            await AttributeValuesModel.findByIdAndDelete(req.body.Id)
            // FindAttribute.deleteOne({_id:req.body.Id})
            return res.status(200).json({msg:"Attribute Value Deleted Successfully"})
        }else{
            return res.status(404).json({msg:"Access Denied"})
        }
    }catch (error) {
        console.log(error)
        return res.status(500).json({error:"Internal Server Error"})
    }
})

module.exports= router

