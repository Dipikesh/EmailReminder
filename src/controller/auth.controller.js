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
        const accessToken = await token.signAccessToken(user._id);
        // const refreshToken = await token.signRefreshToken(user._id)
        if (!accessToken)
            throw createError(500, "Internal Server Error");
        res.cookie('Authorization', accessToken, {
            maxAge: 1000 * 60 * 60 * 24 * 1, //Currently valid for one day // TODO: Change this!
        httpOnly: true,
        })
        res.status(200).json({status:"success",message:"User logged in successfully"});
    }
    catch (err) {
        next(err);
    }
}

exports.cnfrmRegister = async (req, res, next) => {
    try {
        const otp = await authService.verifyOtp(req.body);
        if (otp) {
            const cnfrmUserReg = await authService.confirmReg(req.body);
        }
        res.status(201).json({ success: true, message: "User Registered" });
    }
    catch (err) {
        logger.error("Error in OTP controller  "+err);

        next(err);
    }

}