const { reg, cnfrmReg ,login } = require('../validations/auth.validations.js')
const logger = require('../config/logger');
const createError = require('http-errors');
const regSchema = require('../schemas/reg.schemas')
const jwt = require('jsonwebtoken');
const path = require('path');
const fs = require('fs');
const pathToPubKey = path.join(__dirname,'..', "config/key/id_rsa_pub.pem");
const PUB_KEY = fs.readFileSync(pathToPubKey, "utf8");


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
        if (!req.headers['authorization'])
            throw createError(401, "Authorizaion Required");
        const token = req.headers['authorization'].split(" ")[1];
        logger.debug("Authentication Token: " + token);
        jwt.verify(token, PUB_KEY, (err, payload) => {
            if (err)
                throw createError(400, "Authorizaion Required");
            res.locals.authenticated = true;
            res.locals.payload = payload;
            logger.debug("JWT Token is Verified Successfully")
        next();
        });
        
    } catch (err) {
        logger.error("Authentication Error " + err);
        next(err)
    }
}