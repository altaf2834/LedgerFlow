const userModel=require("../models/user.model")
const bcrypt=require("bcryptjs")
const jwt=require("jsonwebtoken")
const emailService=require("../services/email.service")
const tokenBlacklistModel=require("../models/blackList.model")
/**
 * -user register controller
 * -POST /api/auth/register
 */

async function userRegisterController(req,res){
    
    const {email,name,password}=req.body;

    const isExist= await userModel.findOne({
        email:email
    })

    if(isExist){
        return res.status(422).json({
            message:"user already exist with email",
            status:"failed"
        })
    }
    const user=await userModel.create({
        email:email,
        name:name,
        password:password
    })

    const token=jwt.sign({userId:user._id},process.env.JWT_SECRET,{
        expiresIn:"3d"
    })

    res.cookie("token",token)
    res.status(201).json({
        message:"user created successfully",
        user:{
            _id:user._id,
            email:user.email,
            name:user.name
        },
        token
    })

    await emailService.sendRegistrationEmail(user.email,user.name)
    
}

async function userLoginController(req,res){
    const {email,password}=req.body
    const user=await userModel.findOne({
        email:email
    }).select("+password")

    
    if(!user){
        return res.status(401).json({
            message:"invalid credential"
        })
    }
    const isMatch=await bcrypt.compare(password,user.password);
    console.log("Password match:", isMatch);
    if(!isMatch){
        return res.status(401).json({
            message:"invalid credential"
        })
    }

    const token=jwt.sign({userId:user._id},process.env.JWT_SECRET,{
        expiresIn:"3d"
    })

    res.cookie("token",token)
    res.status(200).json({
        message:"user logged in successfully",
        user:{
            email:user.email,
            name:user.name,
            _id:user._id
        },
        token
    })
}   


/**
 * user Logout controller
 */

async function userLogoutController(req,res){

    const token = req.cookies.token || req.headers.authorization?.split("")[1]

    if(!token){
        return res.status(200).json({
            message:"user logout successfully"
        })
    }

    res.clearCookie("token")
    await tokenBlacklistModel.create({
        token:token
    })

    res.status(200).json({
        message:"user logout sucessfully"
    })
}

module.exports={userRegisterController,userLoginController,userLogoutController}