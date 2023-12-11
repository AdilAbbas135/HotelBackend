const jwt=require("jsonwebtoken")
module.exports =(User)=>{
    // console.log("User in assigning token is", User)
    return jwt.sign(
        {
            userId: User?._id,
            profileId: User?.profileId ? User?.profileId : null,
            email: User?.Email,
            isEmailVerified: User?.isEmailVerified,
        },
        process.env.JWT_SECRET_KEY,
        { expiresIn: "1d" }
    )
}
