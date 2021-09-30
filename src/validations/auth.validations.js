const joi = require('@hapi/joi');

exports.reg =  () => {
    const schema = joi.object({
        email: joi.string().email().min(5).max(40).required(),
    })

    return schema;
}

exports.cnfrmReg = () => {
    const schema = joi.object({
        email: joi.string().email().min(5).max(40).required(),
        password: joi.string().min(8).max(20).required(),
        cnfPassword: joi.ref('password'),
        name: joi.string().required(),
        otp: joi.string().required()
        
        
    }).options({ abortEarly: false })

    return schema; 
}

exports.login = () => {
    const schema = joi.object({
        email: joi.string().email().min(5).max(40).required(),
        password: joi.string().min(8).max(20).required()
    }).options({ abortEarly: false })
    return schema;
}