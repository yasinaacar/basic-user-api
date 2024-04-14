const authRouter=require("../routes/authRouter");

module.exports=function (app){
    app.use("/api/v1/user",authRouter);
};