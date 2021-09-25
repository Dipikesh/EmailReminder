const joi = require('@hapi/joi');
const logger = require('../config/logger')

exports.userData =  () => {
    
    const userSchema = joi.object({
        name: joi.string().min(3).max(20).required(),
        email: joi.string().email().min(3).max(40).required(),
        description: joi.string().min(3).max(80).required(),
        date: joi.date().iso().required().greater(Date.now())

    }).options({ abortEarly: false })
    return userSchema;
}


