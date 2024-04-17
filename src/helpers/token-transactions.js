const jwt=require("jsonwebtoken");
const {Response}=require("../utils/index");
const moment=require("moment");
async function createToken(user,res){
    const payload={
        sub: user._id,
        name: user.name
    };
    const token=await jwt.sign(payload,process.env.JWT_SECRET_KEY,{
        algorithm: "HS512",
        expiresIn: process.env.JWT_EXPIRES_IN
    });

    return new Response({token: token}, null).success(res);
};


module.exports={createToken};