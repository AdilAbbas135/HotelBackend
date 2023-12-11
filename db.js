const mongoose =require("mongoose")
const dotenv = require("dotenv");
let isConnected = false;

const connect_to_db = async () => {
    dotenv.config()
    mongoose.set("strictQuery", true);
    if (isConnected) {
        console.log("Already connected to database");
        return;
    }
    try {
        await mongoose.connect(process.env.database_url);
        isConnected = true;
        console.log("Connected to database Successfully");
    } catch (error) {
        console.log("error connecting to the database");
        console.log(error);
    }
};
module.exports=connect_to_db;