const { authService, mailerService } = require('../services')
const genOtp = require('../utils/generator');
const logger = require('../config/logger')

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
    
    res.status(200).send("working");
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