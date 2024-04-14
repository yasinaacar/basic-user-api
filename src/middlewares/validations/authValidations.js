const Joi=require("joi");
const APIError=require("../../utils/errors");

const nameMinChar= 2;
const nameMaxChar= 50;
const surnameMinChar= 2;
const surnameMaxChar= 50;
const passwordMinChar=6;
const passwordMaxChar=36;
class AuthValidation{
    constructor(){}

    //we are using static methods because if static is not use we must use "new" during the call
    static register=async (req,res,next)=>{
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
                email: Joi.string().email().trim().required().messages({
                    "string.base": "Email type error",
                    "string.empty": "Email can not be empty",
                    "string.email": "Enter a valid email address ",
                    "string.required": "Email can't be empty"
                }),
                phone: Joi.number().required().messages({
                    "number.base": "Phone number can only contain numbers",
                    "string.empty": "Phone number can not be empty",
                    "string.required": "Phone number can't be empty"
                }),
                password: Joi.string().min(passwordMinChar).max(passwordMaxChar).required().messages({
                    "string.base": "Password can only contain letters",
                    "string.empty": "Password can not be empty",
                    "string.min" : `Password length must be at least minimum ${passwordMinChar} character`,
                    "string.max" : `Password length must be maximum of ${passwordMaxChar} character`,
                    "string.required": "Password can't be empty"
                }),
            }).validateAsync(req.body)

        } catch (err) {
            throw new APIError(err.details[0].message, 400);
        }
        next();

    };

    static login=async (req,res, next)=>{
        try {
            await Joi.object({
                email: Joi.string().email().trim().required().messages({
                    "string.base": "Email type error",
                    "string.empty": "Email can not be empty",
                    "string.email": "Enter a valid email address ",
                    "string.required": "Email can't be empty"
                }),
                password: Joi.string().required().messages({
                    "string.base": "Password can only contain letters",
                    "string.empty": "Password can not be empty",
                    "string.required": "Password can't be empty"
                }),
            }).validateAsync(req.body)
        } catch (err) {
            throw new APIError(err.details[0].message, 401);
        }
        next();
    };
    
    static forgetPassword=async (req,res,next)=>{
        try {
            await Joi.object({
                email: Joi.string().email().trim().required().messages({
                    "string.base": "Email type error",
                    "string.empty": "Email can not be empty",
                    "string.email": "Enter a valid email address ",
                    "string.required": "Email can't be empty"
                }),
            }).validateAsync(req.body);
        } catch (err) {
            throw new APIError(err.details[0].message, 401);
        }
        next();
    };

    static resetPassword=async (req,res,next)=>{
        try {
            await Joi.object({
                password: Joi.string().min(passwordMinChar).max(passwordMaxChar).required().messages({
                    "string.base": "Password can only contain letters",
                    "string.empty": "Password can not be empty",
                    "string.min" : `Password length must be at least minimum ${passwordMinChar} character`,
                    "string.max" : `Password length must be maximum of ${passwordMaxChar} character`,
                    "string.required": "Password can't be empty"
                })
            }).validateAsync(req.body)
        } catch (err) {
            throw new APIError(err.details[0].message);
            
        };
        next();
    }
};

module.exports= AuthValidation