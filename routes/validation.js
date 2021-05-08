const Joi=require('@hapi/joi');

const schema=Joi.object({
    name:Joi.string().min(6).required(),
    email:Joi.string().min(6).required().email(),
    password:Joi.string().min(6).required()
});

const schemaLogin=Joi.object({
    email:Joi.string().min(6).required().email(),
    password:Joi.string().min(6).required()
});


const regValidation = (data) =>{
    const respondToValidate = schema.validate(data);  
    return respondToValidate;
}

const loginValidation = (data) =>{
    const respondToValidate = schemaLogin.validate(data);  
    return respondToValidate;
}

module.exports.loginValidation = loginValidation;
module.exports.regValidation = regValidation;