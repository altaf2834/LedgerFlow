const express=require("express")
const authMiddleware=require("../middleware/auth.middleware")
const accountController=require("../controllers/account.controllers")

const router=express.Router()


router.post("/",authMiddleware.authMiddleware,accountController.createAccountController)

/**
 * GET /api/accounts
 * Get all account of logged in user
 */

router.get("/",authMiddleware.authMiddleware,accountController.getUSerAccountController)
/**
 * GET /api/accounts/balance/:accountId 
 * Get the balance of logged in user
 */
router.get("/balance/:accountId",authMiddleware.authMiddleware,accountController.getAccountBalanceController)

module.exports=router