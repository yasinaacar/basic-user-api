const express=require("express");

const userController=require("../controllers/userController");
const {isAuth, isAdmin}=require("../middlewares/isAccess");
const {validateUserEdit}=require("../middlewares/validations/userValidation");
const router=express.Router();

router.put("/:userId", isAuth, isAdmin, validateUserEdit,userController.edit_user);
module.exports=router;