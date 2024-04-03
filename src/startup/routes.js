const authRouter=require("../routes/authRouter");

module.exports=function (app){
    app.use("/api/user",authRouter);
};