const  SendMail =require("../utils/SendMail")
const TokenModel =require("../Models/GoogleToken")
const crypto=require("crypto")
module.exports=async function assigntoken(user) {
    const token = await TokenModel.create({
        userId: user._id,
        token: crypto.randomBytes(32).toString("hex"),
    });
    const url = `${process.env.FRONTEND_URL}/sign-up/verify-email?user=${user._id}&token=${token.token}`;
    const sendmail = await SendMail(user.Email, "Verify Your Email Address", url);
    if (sendmail) {
        return true;
    } else {
        return false;
    }
}