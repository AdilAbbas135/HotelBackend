var jwt = require("jsonwebtoken");
const AllUsersModel =require("../Models/Account/index")
const StoreModel =require("../Models/Store/index")

const VerifyToken = async (req, res, next) => {
    // GET USER FROM TOKEN AND GET ID OF THE USER AND SHOW HIS DATA
    const token = req.header("token")
    // console.log("token is", token);
    if (!token) {
       return res.status(401).json({ error: "Access Denied" });
    } else {
        try {
            const data = jwt.verify(token, process.env.JWT_SECRET_KEY);
            if (data) {
                const FindUser = await AllUsersModel.findById(data.userId)
                const Store =await StoreModel.findOne({Owner: data.userId})
                if(FindUser) {
                    req.user = data;
                    req.store=Store
                    next();
                }else {
                    return res.status(401).json({ error: "Access Denied" });
                }
            } else {
                return res.status(401).json({ error: "Access Denied" });
            }
        } catch (error) {
            return res.status(400).json({ error: "Session Expired Login Again" });
        }
    }
};
module.exports = VerifyToken;