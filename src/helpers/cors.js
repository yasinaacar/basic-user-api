const cors=require("cors");
const { APIError } = require("../utils");

let whiteList=["http://127.0.0.1:5000","http://127.0.0.1:54438"];

const corsOptions=(req, callback)=>{
    let corsOptions;
    if (whiteList.indexOf(req.header("Origin") !== -1)){
        corsOptions = {origin: true};
    }else{
        corsOptions = {origin: false};
        throw new APIError("You don't have rights to access user-api ")
    };

    callback(null, corsOptions)
};

module.exports=function(app){
    app.use(cors(corsOptions));
};