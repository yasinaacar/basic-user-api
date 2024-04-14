const { User } = require("../models/user");
const { APIError, Response } = require("../utils/index");
const jwt=require("jsonwebtoken");

const jwt_secret_key=process.env.JWT_SECRET_KEY;
async function createToken(user,res){
    const payload={
        sub: user._id,
        name: user.name
    };

    const token=await jwt.sign(payload,jwt_secret_key,{
        algorithm: "HS512",
        expiresIn: process.env.JWT_EXPIRES_IN
    });

    return new Response({token: token}, null).success(res);
};

//if token is correct then give access
async function verifyToken(req,res,next){
    const authorizationToken=req.headers.authorization && req.headers.authorization.startsWith("Bearer ");
    if(!authorizationToken){
        throw new APIError("Please sign in",401);
    }
    const token=req.headers.authorization.split(" ")[1]
    console.log("Token",token)
    await jwt.verify(token,jwt_secret_key,async (err, decoded)=>{
        
        if(err){
            throw new APIError("Invalid token, may have expired",401);
        };

        const user=await User.findById(decoded.sub);

        if(!user){
            throw new APIError("Invalid token, may have expired",401);
        };
        req.user=user;
        next();
    });

};

module.exports={createToken, verifyToken};