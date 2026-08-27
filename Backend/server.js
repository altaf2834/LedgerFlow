require("dotenv").config()
const app=require("./src/app")
const connectDB=require("./src/config/db")

connectDB()

const PORT = process.env.PORT || 3000
app.listen(PORT,"0.0.0.0",()=>{
    console.log(`server is running on ${PORT}`)
})