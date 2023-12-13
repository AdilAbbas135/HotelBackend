const express = require("express")
const router = express.Router()
const fs = require("fs");
const multer = require("multer");
const GalleryModel = require("../../Models/Gallery")
const VerifyToken = require("../../Middlewear/VerifyToken")

// MULTER SETUP
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const directory = `./uploads/${req.store._id}`
        if (!fs.existsSync('./uploads/')) {
            fs.mkdirSync('./uploads/');
        }
        if (!fs.existsSync(directory)) {
            fs.mkdirSync(directory, {recursive: true});
        }
        cb(null, directory);
    },
    filename: (req, file, cb) => {
        const name =
            new Date().getTime() + "-" + req.store._id + "-" + file.originalname;
        cb(null, name);
    },
});
const upload = multer({storage: storage,});


// FIND ALL GALLERY IMAGES OF A SPECIFIC STORE
router.get("/", VerifyToken, async (req, res) => {
    try {
        const Total= await GalleryModel.countDocuments()
        // console.log("total documents: " + total)
        const Gallery = await GalleryModel.find({Store: req.store._id})
        return res.status(200).json({Gallery ,Total})

    } catch (error) {
        console.log(error)
        return res.status(500).json({error: "Internal Server Error"})
    }
})

// Add a New Gallery Imasge Of A SPECIFIC STORE
router.post("/add", VerifyToken, upload.array("files", 10), async (req, res) => {
    try {
        let Files=[]
        for (let i=0; i<req.files.length; i++){
                    Files.push({
                        Name: req.files[i].originalname,
                        AltText:req.files[i].originalname,
                        Path: req.files[i].path,
                        Store: req.store._id
                    })
        }
             await GalleryModel.insertMany(Files)
        return res.status(200).json({msg:"Files Uploaded Successfully"})

    } catch (error) {
        console.log(error)
        return res.status(500).json({error: "Internal Server Error"})
    }
})
module.exports = router