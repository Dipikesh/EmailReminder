const { reg, cnfrmReg ,login } = require('../validations/auth.validations.js')
const logger = require('../config/logger');
const createError = require('http-errors');


exports.validateRegister = async (req, res, next) => {
    try {
        const { error } = await reg().validateAsync(req.body);
        if (error)
            throw createError(422, error);
        logger.info("Registration Validation Success");
        next();
    }
    catch (err) {
        logger.error("Registeration Validation Error " + err);
        
            next(createError(422, err));
    }

}

exports.validateCnfrmRegister = async (req, res, next) => {
        try {
        const { error } = await cnfrmReg().validateAsync(req.body);
        if (error)
            throw createError(422, error);
        logger.info("Confirm Registeration Validation Success");
        next();
    }
    catch (err) {
            logger.error("Confirm Registeration  Validation Error " + err);
                        next(createError(422, err));

    }

}

exports.validateLogin = async (req, res, next) => {
     try {
        const { error } = await login.validateAsync(req.body);
        if (error)
            throw createError(422, error);
        logger.info("Login Validation Success");
        next();
    }
    catch (err) {
            logger.error("Login  Validation Error " + err);
                        next(createError(422, err));

    }
}

