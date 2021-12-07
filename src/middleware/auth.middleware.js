const { reg, cnfrmReg ,login } = require('../validations/auth.validations.js')
const logger = require('../config/logger');
const createError = require('http-errors');
const regSchema = require('../schemas/reg.schemas')
const genToken = require('../config/token')
const decodeToken = require('../utils/hash');
const { authService } = require('../services');


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
        const { error } = await login().validate(req.body);
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

exports.authenticate = async (req, res, next) => {
    try {
        console.log("Header is present ", req.headers);
        if (!req.headers['authorization'])
            throw createError(401, "Authorizaion Required");
        const token = req.headers['authorization'].split(" ")[1];
        const validateTokenExp = await genToken.validateAccessToken(token);
        if (!validateTokenExp) {
                const prevPayload = await decodeToken.parseJwt(token)
            let { accessToken, payload } = await genToken.signAccessToken(prevPayload.sub);
            logger.debug("PAYLOAD ....."+JSON.stringify(prevPayload)+"...."+JSON.stringify(payload))
                const updateExpiryIfExist = await authService.updateTokenExpiry(payload, prevPayload);
                logger.debug("jwt is ...save token expiry" + updateExpiryIfExist);

                res.cookie('Authorization', accessToken, {
                    maxAge: 24 * 60 * 60,
                    httpOnly: true
                });
            res.locals.authenticated = true;
            res.locals.payload = payload;
            
        }
        
        res.locals.authenticated = true;
        res.locals.payload = validateTokenExp;
                
    next();
        
    } catch (err) {
        logger.error("Authentication Error " + err);
        next(err)
    }
}