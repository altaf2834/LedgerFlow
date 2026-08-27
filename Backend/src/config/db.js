const mongoose=require("mongoose")


async function connectDB(){
    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log("server is connected to DB")
    } catch (error) {
        console.log("Error connnecting to DB")
        process.exit(1)
    }
}

module.exports=connectDB