const APIError=require("../utils/errors");

const errorHandler=(err, req, res, next)=>{
    if (err instanceof APIError){
        return res.status(err.statusCode || 400).json({
                success: false,
                message: err.message
            });
    };

    console.log(err)
    return res.status(500).json({
        success: false,
        message: `An error was encountered, please check your API`
    });
};

module.exports=errorHandler;