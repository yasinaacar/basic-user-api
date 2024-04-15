const mongoose=require("mongoose");

//create schema
const userSchema=new mongoose.Schema({
    name:{
        type: String,
        required: true,
        trim: true
    },
    surname:{
        type: String,
        required: true,
        trim: true
    },
    email:{
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    phone:{
        type: Number,
        required: true,
        trim: true
    },
    password:{
        type: String,
        required: true,
    },
    token:{
        type: String
    },
    tokenExpiration:{
        type: Date
    },
    isActive:{
        type: Boolean,
        default: false
    },
    roles:[{
        roleRef:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Role" 
        },
        roleName:{
            type: String
        }
    }]
},{timestamps: true});

//create model
const User=mongoose.model("User",userSchema);


module.exports={User};