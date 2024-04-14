const express=require("express");
const authController=require("../controllers/authController");

//middlewares
const AuthValidation=require("../middlewares/validations/authValidations");
const isAuth=require("../middlewares/isAuth");

const router=express.Router();

router.post("/register", AuthValidation.register, authController.post_register);
router.put("/activate-user/:token", authController.activate_user);
router.post("/login", AuthValidation.login, authController.post_login);
router.put("/forget-password", AuthValidation.forgetPassword, authController.forget_password);
router.put("/reset-password/:resetToken", AuthValidation.resetPassword, authController.reset_password);
router.get("/account", isAuth.verifyToken, authController.account);

module.exports=router;