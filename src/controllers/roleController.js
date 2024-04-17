const Role=require("../models/role");
const {User}=require("../models/user");
const slugfield=require("../helpers/slugfield");
const { Response, APIError } = require("../utils/index");


exports.post_role=async (req,res)=>{
    let roleName=req.body.roleName;
    roleName=roleName.toLowerCase();
    const url=slugfield(roleName);
    await Role.create({roleName, url})
        .then((role)=>{
            return new Response(role, `The role named "${role.roleName}" has been created successfully`).created(res);
        }).catch((err)=>{
            console.log(err)
            if(err.code==11000 || err.errmsg.startsWith("E11000 ")){
                throw new APIError(`Role name has already been created for ${roleName}`, 400);
            }
            throw new APIError("An error occured while creating the role", 500);
        });
};
exports.update_role=async (req,res)=>{
    const roleId=req.params.roleId;
    const role=await Role.findById(roleId).select("_id roleName url users");
    if(!role){
        return new Response(null,"Role not found").error404(res);
    } 
    let roleName=role.roleName;
    console.log(roleName, roleName=="customer")
    if(roleName=="customer" || roleName=="admin"){
        return new Response(null,`The Role named ${role.roleName} can not edit`).error400(res);
    }
    roleName=req.body.roleName.toLowerCase();
    const url=slugfield(roleName);
    role.roleName=roleName;
    role.url=url;
   
    if(role.users.length>0){
        //take the users by roleId to change role name
        const users=await User.find({"roles._id": roleId}).select("_id roles");

        for (const user of users) {
            //filter by roleId from user roles
            const roleToUpdate=user.roles.filter(filteredRole => filteredRole._id==roleId); //the role to update for the user
            roleToUpdate[0].roleName=roleName;
            await user.save()
        }
    }
    await role.save()
    .then((data)=>{
            return new Response(data,`Role "${role._id}" has been updated successfully`).success(res);
        })
        .catch((err)=>{
            console.log(err)
            throw new APIError(`Failed to update role with ID "${role._id}"`,500)
        });
};
exports.delete_role=async (req,res)=>{
    const roleId=req.params.roleId;
    const role=await Role.findById(roleId).select("_id roleName url users");
    if(!role){
        return new Response(null,"Role not found").error404(res);
    };

    if(role.roleName==="admin" || role.roleName==="customer"){
        return new Response(null, `The Role named ${role.roleName} can not delete`).error400(res);
    }
    if(role.users.length>0){
        await User.updateMany({"roles._id":roleId},{$pull:{roles: {_id: roleId}}});
    }
    await Role.findByIdAndDelete(role._id)
        .then((role)=>{
            return new Response(null, `The role named ${role.roleName} deleted successfully`).deleted(res);
        })
        .catch((err)=>{
            console.log(err)
            throw new APIError("Role couldn't delete",500);
        });

};
exports.get_role=async (req,res)=>{
    const roleId=req.params.roleId;
    const role= await Role.findById(roleId);
    if(!role){
        return new Response(null, "Role not found").error404(res);
    };

    return new Response(role, null).success(res);
};
exports.get_roles=async (req,res)=>{
    const queries=req.query;
    let roles;
    if(queries.roleName){
        roles=await Role.find({roleName: queries.roleName});
    }else{
        roles= await Role.find().select("_id roleName url");
    }
    if(roles.length<=0){
        return new Response(null, "There are no roles registered in the system").error404(res);
    }

    return new Response(roles, null).success(res);
};