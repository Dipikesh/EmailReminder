const joi = require('@hapi/joi');
const logger = require('../config/logger')

exports.userData =  () => {
    
    const userSchema = joi.object({
        name: joi.string().min(3).max(20).required(),
        description: joi.string().min(3).max(80).required(),
        date: joi.date().iso().required().greater(Date.now())

    }).options({ abortEarly: false })
    return userSchema;
}
exports.userPrevData =  () => {
    
    const userSchema = joi.object({
        name: joi.string().min(3).max(20).required(),
        description: joi.string().min(3).max(80).required(),
        date: joi.date().iso().required().greater(Date.now()),
        id: joi.string().min(3).max(60)
    }).options({ abortEarly: false })
    return userSchema;
}




