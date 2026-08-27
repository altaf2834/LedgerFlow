const accountModel=require("../models/account.model")
const { initialFundController } = require("./transaction.controller");
const WELCOME_AMOUNT = 10000;

async function createAccountController(req, res) {
    const user = req.user;
    const { name } = req.body;

    if (!name) {
        return res.status(400).json({ message: "Account name is required" });
    }

    const account = await accountModel.create({ user: user._id, name });

    const userAccountCount = await accountModel.countDocuments({ user: user._id });

    if (userAccountCount === 1) {
        try {
            const idempotencyKey = `welcome-fund-${account._id}`;
            await initialFundController(
                process.env.SYSTEM_ACCOUNT_ID,
                account._id,
                WELCOME_AMOUNT,
                idempotencyKey
            );
        } catch (err) {
            console.error("Auto-funding failed for account", account._id, err.message);
            // Account creation still succeeds even if funding fails — logged for follow-up
        }
    }

    res.status(201).json({ account });
}

async function getUSerAccountController(req,res){
    const user=req.user

    const accounts =await accountModel.find({user:user._id}).populate("user","email name")

    res.status(200).json({
        accounts:accounts
    })
}

async function getAccountBalanceController(req,res){
    const {accountId} = req.params
    const userAccount= await accountModel.findOne({
        user:req.user._id,
        _id:accountId
    })
    if(!userAccount){
        return res.status(400).json({
            message:"Account not found"
        })
    }
    const balance= await userAccount.getBalance()
    return res.status(200).json({
        message:"balance fetched successfully",
        balance:balance
    })
}

module.exports={createAccountController,getUSerAccountController,getAccountBalanceController}