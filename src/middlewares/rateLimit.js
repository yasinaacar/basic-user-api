const rateLimit=require("express-rate-limit");

const limiter=rateLimit({
    windowMs: 1000*60*5,
    max:(req,res)=>{
        if(req.url=="/auth/login" || req.url=="/auth/register"){
            return 5
        }else{
            return 100
        }
    },
    message:{
        success: false,
        message: "Too many request, please wait 5 minute and try again"
    },
    standardHeaders: true,
    legacyHeaders: false
});

module.exports=limiter;
