const authRouter=require("../routes/authRouter");
const roleRouter=require("../routes/roleRouter");
const userRouter=require("../routes/userRouter");

module.exports=function (app){
    app.use("/api/v1/role", roleRouter);
    app.use("/api/v1/user", userRouter)
    app.use("/api/v1/auth",authRouter);
};