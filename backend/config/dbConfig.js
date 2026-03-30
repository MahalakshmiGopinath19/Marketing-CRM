const mongoose = require("mongoose");
const connectDB = async()=>{
    try{
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("MongoDB Connected!");
    }
    catch(error){
        console.log(error.message);
        console.log("MongoDB Connection Failed!");
    }
}
module.exports = connectDB;