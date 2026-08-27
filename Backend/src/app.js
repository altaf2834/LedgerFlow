const express=require("express")
const cookieparser=require("cookie-parser")
const authRouter=require("./routes/auth.routes")
const accountRouter=require("./routes/account.routes")
const transactionRouter=require("./routes/transaction.routes")
const cors = require("cors")
const app=express()

app.use(
    cors({
        origin:process.env.CLIENT_URL,
        credentials:true
    })
)


app.use(express.json())
app.use(cookieparser())
app.use("/api/auth",authRouter)
app.use("/api/accounts",accountRouter)
app.use("/api/transactions",transactionRouter)

module.exports=app