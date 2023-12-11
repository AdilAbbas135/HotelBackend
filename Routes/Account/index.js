const express = require("express");
const router = express.Router();
const AllUsersModel = require("../../Models/Account/index")
const StoreModel = require("../../Models/Store/index")
const TokenModel = require("../../Models/GoogleToken")
const assigntoken = require("../../utils/AssignToken")
const {mongo, default: mongoose} = require("mongoose");
const bcrypt = require("bcrypt")
const CreateToken = require("../../utils/jwt")
const VerifyToken = require("../../Middlewear/VerifyToken")
const PlansModel=require("../../Models/Plans")

router.post("/", VerifyToken, async (req, res) => {
    try {
        // console.log("Request Recieved Account Route")
        // console.log(req.user)
        const Profile = await AllUsersModel.findById(req.user.userId)
        if (Profile) {
            const Store = await StoreModel.findOne({Owner: Profile._id})
            return res.status(200).json({Profile, Store})
        } else {
            return res.status(400).json({error: "Profile Not Found"})
        }

    } catch (error) {
        console.log(error)
        return res.status(500).json({error: "Internal Server Error"})
    }
})
router.post("/sign-up", async (req, res) => {
    try {
        const DummyPassword = "123456789"
        // console.log("body is", req.body)
        const FindUser = await AllUsersModel.findOne({Email: req.body.Email})
        let CreateUser = FindUser
        if (!FindUser) {
            const salt = await bcrypt.genSalt(10);
            const Password = await bcrypt.hash(DummyPassword, salt);
            console.log("User not found")
            CreateUser = await AllUsersModel.create({
                FirstName: req.body.FirstName,
                LastName: req.body.LastName,
                Email: req.body.Email,
                Password: Password,
                CompanyName: req.body.CompanyName,
                PhoneNumber: req.body.PhoneNumber,
                EstablishmentType: req.body.EstablishmentType,
                TotalLocations: req.body.TotalLocations,
                StripeDetails:req.body.StripeResponse,
                SelectedPackage:req.body.SelectedPlan._id
            })
        }
        if (FindUser?.isEmailVerified == true) {
            return res.status(400).json({error: "This Email is Already Registered"})
        } else {
            const token = assigntoken(CreateUser).then((response) => {
                console.log("Email send Response")
                console.log(response)
                if (response == true) {
                    return res.status(200).json({msg: "Account has been Created Successfully"})
                } else {
                    return res.status(404).json({error: "Something Went Wrong! Try Again"})
                }
            })
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({error: "Internal Server Error"})
    }
})

// EMAIL LINK VERIFICATION
router.post("/verify-email", async (req, res) => {
    try {
        // console.log(req.query)
        const token = await TokenModel.findOne({
            userId: new mongoose.Types.ObjectId(req.query.user),
            token: req.query.token,
        });
        console.log(token)
        if (token) {
            const user = await AllUsersModel.findByIdAndUpdate(req.query.user, {
                $set: {
                    isEmailVerified: true
                }
            });
            return res.status(200).json({
                success: true,
                msg: "Email Verification Has been Completed",
            });
        } else {
            return res.status(400).json({success: false, msg: "Invalid Link"});
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({error: "Internal Server Error"})
    }
})

// SIGN IN
router.post("/sign-in", async (req, res) => {
    try {
        const User = await AllUsersModel.findOne({Email: req.body.Email});
        if (User && User?.Password) {
            const Password = await bcrypt.compare(req.body.Password, User?.Password);
            if (Password) {
                const authtoken = CreateToken(User)
                return res.status(200).json({token: authtoken})
            } else {
                return res.status(400).json({error: "Wrong Credentials! Try Again"})
            }
        } else {
            return res.status(400).json({error: "Wrong Credentials! Try Again"})
        }
    } catch (error) {
        console.log(error)
        return res.status(500).json({error: "Internal Server Error"})
    }
})

router.post("/check-email", async (req, res) => {
    try {
        const FindEmail = await AllUsersModel.findOne({
            Email: req.body.Email
        })
        if (FindEmail?._id) {
            return res.status(400).json({error: "This Email is Already Registered", isEmailRegistered: true})
        }
        return res.status(200).json({msg: "Email Available"})
    } catch (error) {
        console.log(error)
        return res.status(500).json({error: "Internal Server Error"})
    }
})
module.exports = router;