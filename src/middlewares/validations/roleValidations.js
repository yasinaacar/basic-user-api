const Joi=require("joi");
const { APIError } = require("../../utils/index");

async function validateRole(req,res,next){
    const nameMinLength= 2;
    const nameMaxLength= 30;
    try {
        await Joi.object({
            roleName: Joi.string().trim().lowercase().min(nameMinLength).max(nameMaxLength).required().messages({
                "string.base" : "Role name must contain letters only",
                "string.empty" : "Role name can't be left blank",
                "string.lowercase" : "Role name must contain lowercase letters only",
                "string.min": `Role name must consist of at least ${nameMinLength} letters`,
                "string.max": `Role name must contain a maximum of ${nameMaxLength} letters`,
                "string.required" : "Role name can't be left blank",
            })
        }).validateAsync(req.body);
        
    } catch (err) {
        throw new APIError(err.details[0].message, 400)
    }
    next();
};


module.exports= validateRole;