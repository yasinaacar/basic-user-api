const mongoose=require("mongoose");
const Joi=require("joi");

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
    }
});

//create model
const User=mongoose.model("User",userSchema);

//validation with Joi
function validateUserForRegister(user){
    const schema=Joi.object({
        name: Joi.string().min(2).max(50).required(),
        surname: Joi.string().min(2).max(50).required(),
        email: Joi.string().email().required(),
        phone: Joi.number().required(),
        password: Joi.string().min(6).required()
    });

    return schema.validate(user);
};

function validateUserForLogin(user){
    const schema=Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().required()
    });

    return schema.validate(user);
};

module.exports={User, validateUserForRegister, validateUserForLogin};