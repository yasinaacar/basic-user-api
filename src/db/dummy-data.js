const {User}=require("../models/user");
const Role=require("../models/role");
const bcrypt=require("bcrypt");
const { APIError } = require("../utils/index");
const slugfield = require("../helpers/slugfield");
const { json } = require("express");


async function dummyData(){
    let privateUser=await User.findOne({email: "<your_email>"}).select("_id roles");
    //----------Create User------------
    if(!privateUser){
        const hashedPassword=await bcrypt.hash("<your_password>",10);
        privateUser=await User.create({
            name: "<your_name>",
            surname: "<your_surname>",
            email: "<your_email>",
            phone: "<your_phone_number>",
            password: hashedPassword,
            isActive: true
        });
        console.log("Private user added successfully");
    }

    const neededRoles=["admin", "customer"];
    //------Create Role------------
    for (const role of neededRoles) {
        const findRole=await Role.findOne({roleName: role}).select("_id users roleName");
        if(findRole){
            console.log(`${findRole._id} adlı rol veri tabanında var`)
            const haveRole=privateUser.roles.filter(rol=> rol._id == findRole._id);
            console.log(`${findRole.roleName} adlı rol kullanıcı için mevcut`, haveRole);
            if(haveRole.length==0){
                console.log("Bulunan rol kullanıcı da yok");
                findRole.users.push(privateUser);
                findRole.save();
                privateUser.roles.push(findRole)
                privateUser.roles.roleName=findRole.roleName;
                privateUser.save()
            }
        } 
        
        if(!findRole){
            const createdRole=await Role.create({
                roleName: role,
                url: slugfield(role)
            });
            createdRole.users.push(privateUser);
            createdRole.save();
            privateUser.roles.push(createdRole)
            privateUser.roles.roleName=createdRole.roleName;
            privateUser.save()
        }

    };

};


module.exports= dummyData;