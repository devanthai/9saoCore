const Joi = require('@hapi/joi')

const registerValidation = data =>{
    
    const schema =Joi.object({
        username:Joi.string().min(6).max(16).required(),
        password:Joi.string().min(6).max(16).required(),
        captcha:Joi.string().min(2).max(16).required(),
        server:Joi.number().required()

    })
    return schema.validate(data)
}
const loginValidation = data =>{
    const schema =Joi.object({
        username:Joi.string().min(6).max(16).required(),
        password:Joi.string().min(6).max(16).required()
        
    })
    return schema.validate(data)
    
}
module.exports.registerValidation = registerValidation
module.exports.loginValidation = loginValidation