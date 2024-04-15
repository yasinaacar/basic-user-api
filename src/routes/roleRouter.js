const express=require("express");
const validateRole=require("../middlewares/validations/roleValidations");
const roleController=require("../controllers/roleController");
const {isAuth,isAdmin}=require("../middlewares/isAccess");
const router=express.Router();

router.put("/:roleId", isAuth, isAdmin,validateRole, roleController.update_role);
router.delete("/:roleId", isAuth, isAdmin, roleController.delete_role);
router.get("/:roleId", isAuth, isAdmin, roleController.get_role);
router.post("/", isAuth, isAdmin, validateRole, roleController.post_role);
router.get("/", isAuth, isAdmin,roleController.get_roles);

module.exports=router;