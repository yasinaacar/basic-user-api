const Joi=require("joi");
const {APIerror, Response, APIError}=require("../../utils/index");
const nameMinChar= 2;
const nameMaxChar= 50;
const surnameMinChar= 2;
const surnameMaxChar= 50;
async function validateUserEdit(req,res,next){
    try {        
        await Joi.object({
            name: Joi.string().min(nameMinChar).max(nameMaxChar).trim().required().messages({
                "string.base": "Name can only contain letters",
                "string.empty": "Name can not be empty",
                "string.min" : `Name length must be at least minimum ${nameMinChar} character`,
                "string.max" : `Name length must be maximum of ${nameMaxChar} character`,
                "string.required": "Name can't be empty"
            }),
            surname: Joi.string().min(surnameMinChar).max(surnameMaxChar).trim().required().messages({
                "string.base": "Surname can only contain letters",
                "string.empty": "Surname can not be empty",
                "string.min" : `Surname length must be at least minimum ${surnameMinChar} character`,
                "string.max" : `Surname length must be maximum of ${surnameMaxChar} character`,
                "string.required": "Surname can't be empty"
            }),
            phone: Joi.number().required().messages({
                "number.base": "Phone number can only contain numbers",
                "string.empty": "Phone number can not be empty",
                "string.required": "Phone number can't be empty"
            }),
            roleIds: Joi.array().messages({
                "array.base" : "Roles must be array list"
            })
        }).validateAsync(req.body);
    } catch (err) {
        console.log(err)
        throw new APIError(err.details[0].message);
    }

    next()
};

module.exports={validateUserEdit};