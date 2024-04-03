const express=require("express");

const authController=require("../controllers/authController");

const router=express.Router();

router.post("/register",authController.post_register);
router.put("/activate-user/:token", authController.activate_user);
router.post("/login", authController.post_login);

module.exports=router;