const {Router}= require("express")
const authMiddleware=require("../middleware/auth.middleware")
const transactionController= require("../controllers/transaction.controller")


const transactionRoutes=Router()



transactionRoutes.post("/",authMiddleware.authMiddleware,transactionController.createTransaction)
transactionRoutes.post("/system/initial-funds",authMiddleware.authSystemUserMiddleware,transactionController.createInitialFundTransaction)
transactionRoutes.get("/:accountId", authMiddleware.authMiddleware, transactionController.getAccountTransactions)

module.exports= transactionRoutes