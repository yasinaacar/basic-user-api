const {User}=require("../models/user");
const bcrypt=require("bcrypt");
const {APIError, Response}=require("../utils/index");
const crypto=require("crypto");
const sendMail=require("../helpers/mail-sender");
const moment = require("moment");
const { createToken } = require("../middlewares/isAuth");

exports.post_register=async (req,res)=>{
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
    const token=crypto.randomBytes(12).toString("hex");
    const tokenExpiration=Date.now() + 1000*60*30;
    user.token=token;
    user.tokenExpiration=tokenExpiration;
    await user.save()
        .then((data)=>{
            sendMail({
                from : process.env.EMAIL_ADRESS,
                to: user.email,
                subject: "Davinty'e Hoş geldin",
                html:`
                <h1>Hoş geldin, ${user.name}</h1>
                <p>Seni aramızda görmekten mutluluk duyuyoruz. Aşağıdaki linke 30 dakika içerisinde tıklayarak hesabını aktif edebilirsin ve sonrasında uygulmamıza giriş yapabilirsin</p><br>
                <a href="http://127.0.0.1:3000/api/v1/user/activate-user/${user.token}">Hesabı aktif etmek için tıkla</a>
                <p>Bu hesap sana ait değilse aşağıdaki  <a href="#">linke</a> tıklayarak bunu bize bildirebilirsin</p>
                <small>User API aracılığıyla gönderildi</small>
            `
            });
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
    const {email, password}=req.body;
    const user=await User.findOne({email: email});

    if(!user){
        throw new APIError("Password or E-Mail is incorrect", 401);
    }else if(!user.isActive){
        throw new APIError("Account is not active. First, activate your account. Check to mail for activation link", 400);
    };

    const match=await bcrypt.compare(password, user.password);

    if(!match){
        throw new APIError("Password or E-Mail is incorrect", 400);
    }

    return await createToken(user, res);
};
exports.forget_password=async (req,res)=>{
    const email=req.body.email;

    const user= await User.findOne({email}).select("email name token tokenExpiration");

    if(!user){
        throw new APIError("User not found", 404);
    }

    const resetToken=crypto.randomBytes(12).toString("hex");
    const tokenExpiration=moment(new Date()).add(30,"minute").format("YYYY-MM-DD HH:mm:ss");//take the now and add 30 minute

    user.token=resetToken;
    user.tokenExpiration=tokenExpiration;
    await user.save();

    await sendMail({
        from: process.env.EMAIL_ADRESS,
        to: user.email,
        subject: "Şifremi Unuttum",
        html:`
            <h5>Merhaba, ${user.name}</h5>
            <p>Şifreni sıfırlama talebini aldık, aşağıdaki linki kullanarak 30 dakika içinde yeni şifreni belirleyebilirsin</p><br>
            <a href="http://127.0.0.1:3000/api/v1/reset-password/${user.token}">Şifremi Yenile</a>
        `
    });

    return new Response(true, `An email was sent to ${user.email} for reset the password. You can check your email`).success(res);
};
exports.reset_password=async (req,res)=>{
    const resetToken=req.params.resetToken;
    console.log("Rset Password is running",resetToken)
    const user=await User.findOne({token: resetToken}).select("token tokenExpiration password");

    if(!user){
        throw new APIError("Invalid token, user not found",404);
    };

    const dateNow=moment(new Date());
    const tokenExpiration=moment(user.tokenExpiration);

    const timeDiff=tokenExpiration.diff(dateNow,"minutes");

    if(timeDiff<=0){
        throw new APIError("The token seems to have expired, go back to the forgot password page and try again", 401)
    }

    const password=req.body.password;
    const hashedPassword=await bcrypt.hash(password, 10);
    user.password=hashedPassword;
    user.token=null;
    user.tokenExpiration=null;
    await user.save()
        .then((response)=>{
            return new Response(true, "The password was changed successfully").success(res);
        })
        .catch((err)=>{
            throw new APIError("An error occurred while changing password, please try again later",500);
        });
};
exports.account=async (req,res)=>{
    return new Response(req.user, null).success(res);
};