const {User, validateUserForRegister, validateUserForLogin}=require("../models/user");
const bcrypt=require("bcrypt");
const jwt=require("jsonwebtoken");

exports.post_register=async (req,res)=>{

    try {
        const validate=validateUserForRegister(req.body);
        if(validate.error){
            return res.status(400).send(validate.error.details[0].message);
        };
        const {name, surname, email, phone, password}=req.body;
        const hashedPassword=await bcrypt.hash(password, 10);
        const user= new User({
            name: name,
            surname: surname,
            email: email,
            phone: phone,
            password: hashedPassword
        });
        console.log(process.env.JWT_SECRET_KEY)
        console.log(user._id)
        const token=jwt.sign({userId: user._id}, process.env.JWT_SECRET_KEY);
        const tokenExpiration=Date.now() + 1000*60*30;
        user.token=token;
        user.tokenExpiration=tokenExpiration;
        const newUser=await user.save();
        return res.status(200).send(newUser);
    } catch (err) {
        return res.status(400).send(`An occured error during user registration: ${err}`);
    }
};
exports.activate_user=async (req,res)=>{
    try {
        const token=req.params.token;

        const user= await User.findOne({token: token}).select("token tokenExpiration isActive");
        console.log(user)
        if(!user){
            return res.status(400).send("User not found");
        };

        const tokenExpiration=user.tokenExpiration;

        if(tokenExpiration<Date.now()){
            return res.status(400).send("User cannot be activated because the token has expired");
        };

        user.token=null;
        user.tokenExpiration=null;
        user.isActive=true;
        await user.save();

        return res.status(200).send(`User is activated successfully ${user}`);

    } catch (err) {
        return res.status(400).send(`User could not be activated`)
    }
};
exports.post_login=async (req,res)=>{
    try {
        const validate=validateUserForLogin(req.body);
        
        if(validate.error){
            return res.status(400).send(validate.error.details[0].message);
        };
        const {email, password}=req.body;
        const user=await User.findOne({email: email});

        if(!user){
            return res.status(400).send("This email is not associated with any account");
        }else if(!user.isActive){
            return res.status(400).send("Account is not active. First, activate your account. Check to mail for activation link");
        };

        const match=await bcrypt.compare(password, user.password);

        if(!match){
            return res.status(400).send("Password or E-Mail is incorrect");
        }

        return res.status(200).send(`Account successfully logged in ${user}`);
    } catch (err) {
        return res.status(400).send(`Unable to log in, err ${err}`);
    }
};