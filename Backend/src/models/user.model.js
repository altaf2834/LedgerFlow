const mongoose=require("mongoose")
const bcrypt=require("bcryptjs")

const userSchema=new mongoose.Schema({
    email:{
        type:String,
        required:[true,"email is required for creating the user"],
        trim:true,
        lowercase:true,
        match:[/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
           "invalid Email address" 
        ],
        unique:[true,"Email already exists"]
    },
    name:{
        type:String,
        required:[true,"name is required for creating a account"],

    },
    password:{
        type:String,
        required:[true,"password is required creating a account"],
        minlenght:[6,"password should be of atleast 6 length"],
        select:false
    },
    systemUser:{
        type:Boolean,
        default:false,
        immutable:true,
        select:false
    }
},{
    timestamps:true
})

userSchema.pre("save",async function(next){
    if(!this.isModified("password")){
        return next()
    }
    const hash=await bcrypt.hash(this.password,10)
    this.password=hash
    return next
})

userSchema.methods.comparePassword= async function (password){
    return await bcrypt.compare(password,this.password)
}

const userModel=mongoose.model("user",userSchema)

module.exports=userModel