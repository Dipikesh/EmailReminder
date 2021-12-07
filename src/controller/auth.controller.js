const { authService, mailerService } = require('../services')
const genOtp = require('../utils/generator');
const logger = require('../config/logger')
const token = require('../config/token')
const createError = require('http-errors');

exports.register = async (req, res, next) => {
    try {
        const otp = await genOtp.value(6);
        const registerUser = await authService.register(req.body,otp);
        const sendOtp = await mailerService.sendEmail(req.body.email,otp,"Email Verification");
        res.status(201).json({ success: true, message: `Otp has been sent to ${req.body.email}`});
    }
    catch (err) {
        logger.error("Error During Authentication" + err);
        next(err);
    }
}

exports.login = async (req, res, next) => {
    try {
        const user = await authService.login(req.body);
        const { accessToken, payload } = await token.signAccessToken(user._id);
        const saveExpTime = authService.saveTokenExp(payload);

        res.cookie('Authorization', accessToken, {
            maxAge: 1000 * 60 * 60 * 24 * 7, //Currently valid for 7 dayS // TODO: Change this!
        httpOnly: true,
        })
        res.status(200).json({success: true,message:"User logged in successfully",token:accessToken});
    }
    catch (err) {
        logger.debug("Login Controller "+ err)
        next(err);
    }
}

exports.cnfrmRegister = async (req, res, next) => {
    try {
        const eTime = await authService.verifyOtp(req.body);
         const cnfrmUserReg = await authService.confirmReg(req.body);

        res.status(201).json({ success: true, message: "User Registered" });
    }
    catch (err) {
        logger.error("Error in OTP controller  "+err);

        next(err);
    }

}