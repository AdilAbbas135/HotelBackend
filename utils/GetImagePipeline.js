module.exports=()=>{
return [
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
    }, {
        $project: {
            MainImage: 0,
            "Image.Store":0,
            "Image.createdAt":0,
            "Image.updatedAt":0,
            "Image.__v":0,
            "Image._id":0
        }
    }
]
}