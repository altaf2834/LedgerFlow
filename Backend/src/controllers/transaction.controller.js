const transactionModel=require("../models/transaction.model")
const ledgerModel=require("../models/ledger.model")
const accountModel= require("../models/account.model")
const mongoose= require ("mongoose")
const emailService= require("../services/email.service")
/**
 * - Create a new transaction
 * THE 10-STEP TRANSFER FLOW:
     * 1. Validate request
     * 2. Validate idempotency key
     * 3. Check account status
     * 4. Derive sender balance from ledger
     * 5. Create transaction (PENDING)
     * 6. Create DEBIT ledger entry
     * 7. Create CREDIT ledger entry
     * 8. Mark transaction COMPLETED
     * 9. Commit MongoDB session
     * 10. Send email notification
 */



async function createTransaction(req,res){
    
    const {fromAccount,toAccount,amount,idempotencyKey}=req.body

    if(!fromAccount || !toAccount || !amount || !idempotencyKey){
        return res.status(400).json({
            message:"fromAccount,toAccount,amount and idompotencyKey are required"
        })
    }

    const fromUserAccount= await accountModel.findOne({
        _id:fromAccount
    })

    const toUSerAccount=await accountModel.findOne({
        _id:toAccount
    })

    if(!fromUserAccount || !toUSerAccount){
        return res.status(400).json({
            message:"Invalid fromAccount ot toAccount"
        })
    }

    /**
     * 2. validating idemopotency key
     */

    const isTransactionAlreadyExists= await transactionModel.findOne({
        idempotencyKey:idempotencyKey
    })

    if(isTransactionAlreadyExists){
        if(isTransactionAlreadyExists.status==="COMPLETED"){
            return res.status(200).json({
                message:"transactionAlready processed",
                transaction: isTransactionAlreadyExists
            })
        }
        else if(isTransactionAlreadyExists.status==="PENDING"){
            return res.status(200).json({
                message:"transaction is still in processing",
            })
        }
        else if (isTransactionAlreadyExists.status==="FAILED"){
            return res.status(500).json({
                message:"transaction processing failed ,please try retry"
            })
        }
        else if(isTransactionAlreadyExists.status=="REVERSED"){
            return res.status(500).json({
                message:"Transaction was reversed ,please retry"
            })
        }
    }
    /**
     * 3.Checking account status
     */

    if(fromUserAccount.status!=="ACTIVE" || toUSerAccount.status!=="ACTIVE"){
        return res.status(400).json({
            message:"Both fromAccount and toAccount must be ACTIVE to process transaction"
        })
    }
    /**
     * 4 Deriving sender balance from ledger
    */
   const balance=await fromUserAccount.getBalance()

    if(balance<amount){
        return res.status(400).json({
            message:`insufficient balance. current balance is ${balance}
            requested amount is ${amount}`
        })
    }

    const hasPendingOutgoing = await transactionModel.findOne({
        fromAccount,
        status: "PENDING",
    });

    if (hasPendingOutgoing) {
        return res.status(409).json({
            message: "You already have a transaction in progress from this account. Please wait for it to complete.",
        });
    }


    /**
     * 5. Create transaction (PENDING)
     * 6. Create DEBIT ledger entry
     * 7. Create CREDIT ledger entry
     * 8. Mark transaction COMPLETED
     * 9. Commit MongoDB session
     */

    try {
        const session = await mongoose.startSession();
        session.startTransaction();

        let transaction;
        try {
            transaction = (await transactionModel.create([{
                fromAccount,
                toAccount,
                amount,
                idempotencyKey,
                status: "PENDING",
            }], { session }))[0];
        } catch (err) {
            await session.abortTransaction();
            session.endSession();
            if (err.code === 11000) {
                // Duplicate key = another PENDING transaction already exists for this account
                return res.status(409).json({
                    message: "You already have a transaction in progress from this account. Please wait for it to complete.",
                });
            }
            throw err; // some other unexpected error — let outer catch handle it
        }

        // balance check now happens AFTER the lock is acquired — this ordering matters,
        // see note below
        const balance = await fromUserAccount.getBalance();
        if (balance < amount) {
            await transactionModel.findOneAndUpdate({ _id: transaction._id }, { status: "FAILED" }, { session });
            await session.commitTransaction();
            session.endSession();
            return res.status(400).json({ message: `Insufficient balance. Current balance is ${balance}` });
        }

        const debitLedgerEntry = await ledgerModel.create([{
            account: fromAccount, amount, transaction: transaction._id, type: "DEBIT",
        }], { session });

        const creditLedgerEntry = await ledgerModel.create([{
            account: toAccount, amount, transaction: transaction._id, type: "CREDIT",
        }], { session });

        await transactionModel.findOneAndUpdate({ _id: transaction._id }, { status: "COMPLETED" }, { session });
        await session.commitTransaction();
        session.endSession();

        await emailService.sendTransactionEmail(req.user.email, req.user.name, amount, toAccount);

        return res.status(201).json({ message: "transaction completed successfully", transaction });
    } catch (error) {
        return res.status(400).json({ message: "Transaction is Pending due to some issue please retry after sometime" });
    }
    
}

async function createInitialFundTransaction(req,res){
    const {toAccount,amount,idempotencyKey}=req.body

    if(!toAccount || !amount || !idempotencyKey){
        return res.status(400).json({
            message:"toAccont,amount and idempotencyKey are required"
        })
    }

    const touserAccount = await accountModel.findOne({
        _id:toAccount
    })

    if(!touserAccount){
        return res.status(400).json({
            message:"Invalid toAccount"
        })
    }

    const fromUserAccount = await accountModel.findOne({
        user: req.user._id
    })

    if(!fromUserAccount){
        return res.status(400).json({
            message:"System user account not found"
        })
    }


    const session = await mongoose.startSession()
    session.startTransaction()

            
    const transaction = (await  transactionModel.create([{
        fromAccount: fromUserAccount._id,
        toAccount,
        amount,
        idempotencyKey,
        status:"PENDING"
    }],{session}))[0]
    console.log("transaction id",transaction._id)
    const debitLedgerEntry = await ledgerModel.create([{
        account:fromUserAccount._id,
        amount:amount,
        transaction:transaction._id,
        type:"DEBIT"
    }],{session})

    const creditLedgerEntry = await ledgerModel.create([{
        account:toAccount,
        amount:amount,
        transaction:transaction._id,
        type:"CREDIT"
    }],{session})

    transaction.status="COMPLETED"
    await transaction.save({session})

    await session.commitTransaction()
    session.endSession()

    return res.status(201).json({
        message:"initial funds transaction completed successfully",
        transaction:transaction
    })

}

async function getAccountTransactions(req, res) {
    const { accountId } = req.params;
    const { page = 1, limit = 20 } = req.query; // pagination stays as query params — optional, has defaults

    const account = await accountModel.findOne({ _id: accountId, user: req.user._id });
    if (!account) {
        return res.status(403).json({ message: "You don't have access to this account" });
    }

    const skip = (Number(page) - 1) * Number(limit);
    const query = { $or: [{ fromAccount: accountId }, { toAccount: accountId }] };

    const transactions = await transactionModel
        .find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit))
        .populate("fromAccount", "name")
        .populate("toAccount", "name");

    const total = await transactionModel.countDocuments(query);

    res.status(200).json({
        transactions,
        pagination: { total, page: Number(page), limit: Number(limit), totalPages: Math.ceil(total / Number(limit)) },
    });
}


async function initialFundController(fromAccount, toAccount, amount, idempotencyKey) {
    if (!fromAccount || !toAccount || !amount || !idempotencyKey) {
        throw new Error("fromAccount, toAccount, amount and idempotencyKey are required");
    }

    const fromUserAccount = await accountModel.findOne({ _id: fromAccount });
    const toUserAccount = await accountModel.findOne({ _id: toAccount });

    if (!fromUserAccount) {
        throw new Error("System account not found");
    }
    if (!toUserAccount) {
        throw new Error("Invalid toAccount");
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const transaction = (await transactionModel.create([{
            fromAccount: fromUserAccount._id,
            toAccount,
            amount,
            idempotencyKey,
            status: "PENDING",
        }], { session }))[0];

        await ledgerModel.create([{
            account: fromUserAccount._id,
            amount,
            transaction: transaction._id,
            type: "DEBIT",
        }], { session });

        await ledgerModel.create([{
            account: toAccount,
            amount,
            transaction: transaction._id,
            type: "CREDIT",
        }], { session });

        transaction.status = "COMPLETED";
        await transaction.save({ session });

        await session.commitTransaction();
        session.endSession();

        return transaction;
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        throw error; // let the caller (createAccountController) decide how to handle it
    }
}


module.exports={
    createTransaction,
    createInitialFundTransaction,
    getAccountTransactions,
    initialFundController
}



