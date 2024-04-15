const Role = require("../models/role");
const { User } = require("../models/user");
const {Response, APIError}=require("../utils/index");

exports.edit_user=async (req,res)=>{
    const userId=req.params.userId;
    const user=await User.findById(userId);
    if(!user){
        return new Response(null, "User not found").error404(res);
    }
    const {name, surname, phone, roleIds}=req.body;
    user.name=name;
    user.surname=surname;
    user.phone=phone;
    user.roles=[];
    for (const roleId of roleIds) {
        const role=await Role.findByIdAndUpdate(roleId,{$pull:{users: userId}}).select("id roleName users");
        console.log(role)
        if(role){
            user.roles.push(role);
            user.roles.rolename=role.roleName;
            role.users.push(user);
            await role.save();
        }else{
            continue;
        }
    };
    await user.save()
        .then((data)=>{
            return new Response(data,"User is edited successfully").success(res);
        })
        .catch((err)=>{
            console.log(err);
            throw new APIError(`An error occurred while user editing`, 500);
        })
};