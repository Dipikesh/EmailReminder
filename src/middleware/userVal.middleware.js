const { userData, userPrevData } = require('../validations/user.validations.js')
const logger = require('../config/logger');
const createError = require('http-errors');


exports.userData = async (req, res, next) => {
    try {
        const { error } = await userData().validate(req.body);
        if (error)
            throw createError(422, error);
        logger.info("User Validation Success");
        next();
    }
    catch (err) {
            logger.error("User Validation Error " + err);
            next(createError(422, err));
    }

}

exports.userPrevData = async (req, res, next) => {
        try {
        const { error } = await userPrevData().validate(req.body);
        if (error)
            throw createError(422, error);
        logger.info("User Update Request Validation Success");
        next();
    }
    catch (err) {
            logger.error("User Update Request Validation Error " + err);
            next(createError(422, err));
    }

}

