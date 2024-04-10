const {User, validateUserForRegister, validateUserForLogin}=require("../models/user");
const bcrypt=require("bcrypt");
const jwt=require("jsonwebtoken");
const APIError = require("../utils/errors");
const Response = require("../utils/response");

exports.post_register=async (req,res)=>{

    const validate=validateUserForRegister(req.body);
    if(validate.error){
        return res.status(400).send(validate.error.details[0].message);
    };
    const {name, surname, email, phone, password}=req.body;
    const haveAUser=await User.findOne({email: email}).select("email");
    if(haveAUser){
        throw new APIError("There is already an account registered to this email address", 401);
    }
    const hashedPassword=await bcrypt.hash(password, 10);
    const user= new User({
        name: name,
        surname: surname,
        email: email,
        phone: phone,
        password: hashedPassword
    });
    const token=jwt.sign({userId: user._id}, process.env.JWT_SECRET_KEY);
    const tokenExpiration=Date.now() + 1000*60*30;
    user.token=token;
    user.tokenExpiration=tokenExpiration;
    await user.save()
        .then((data)=>{
            return new Response(data, "Registration has been completed successfully. Please check your email for the activation link").created(res);
        })
        .catch((err)=>{
            console.log(err)
            throw new APIError(`Registration failed, please try again later`, 500);
        });
    
};
exports.activate_user=async (req,res)=>{
    const token=req.params.token;

    const user= await User.findOne({token: token}).select("token tokenExpiration isActive");
    if(!user){
        throw new APIError("User not found", 400);
    };

    const tokenExpiration=user.tokenExpiration;

    if(tokenExpiration<Date.now()){
        await user.destroy();
        return new Response("","User cannot be activated because the token has expired. Please sign up again").error400(res);
    };

    user.token=null;
    user.tokenExpiration=null;
    user.isActive=true;
    await user.save()
        .then((data)=>{
            return new Response(data, "Account is activated, you can login to account now").success(res);

        }).catch((err)=>{
            throw new APIError("User activation failed, please try again", 400);
        });


};
exports.post_login=async (req,res)=>{
    const validate=validateUserForLogin(req.body);
    
    if(validate.error){
        return res.status(400).send(validate.error.details[0].message);
    };
    const {email, password}=req.body;
    const user=await User.findOne({email: email});

    if(!user){
        throw new APIError("This email is not associated with any account", 401);
    }else if(!user.isActive){
        throw new APIError("Account is not active. First, activate your account. Check to mail for activation link", 400);
    };

    const match=await bcrypt.compare(password, user.password);

    if(!match){
        throw new APIError("Password or E-Mail is incorrect", 400);
    }

    return new Response(user, "Logged in successfully").success(res);
};