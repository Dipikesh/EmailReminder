const { userData } = require('../validations/user.validations.js')
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
            next(err);
    }

}
