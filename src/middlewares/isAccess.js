const { User } = require("../models/user");
const { APIError} = require("../utils/index");
const jwt=require("jsonwebtoken");


async function isAuth(req,res,next){
    const authorizationToken=req.headers.authorization && req.headers.authorization.startsWith("Bearer ");
    if(!authorizationToken){
        throw new APIError("Please sign in",401);
    }
    const token=req.headers.authorization.split(" ")[1]
    await jwt.verify(token,process.env.JWT_SECRET_KEY,async (err, decoded)=>{
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

async function isAdmin(req,res,next){
    const user=req.user;
    if(!user){
        throw new APIError("Please sign in, user not found in request",401);
    }
    const haveAdmin=user.roles.some(role=> role.roleName=="admin");

    if(!haveAdmin){
        throw new APIError("You are not authorized for this operation. Please log in with a valid account",401);
    }
    next();
};

module.exports={isAuth,isAdmin}