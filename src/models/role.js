const  mongoose=require("mongoose");
const {Schema}=require("mongoose");

const roleSchema=new Schema({
    roleName:{
        type: String,
        unique: true,
        trim: true,
        required: true
    },
    url:{
        type: String,
        unique: true,
        trim: true,
        required: true
    },
    users:[{type: mongoose.Schema.Types.ObjectId, ref: "User"}]
});

const Role=mongoose.model("Role", roleSchema);

module.exports=Role;