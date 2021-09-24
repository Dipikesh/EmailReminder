const { jobService, userService, mailerService} = require('../services');
const createError = require('http-errors')
const logger = require('../config/logger');

exports.create = async(req, res, next) => {
    
    try {
        const user = await userService.createUser(req.body);
        logger.debug(`Sending user data to scheduling Job `);
        const scheduler = await jobService.schedulingJob(user);
        res.status(200).json({ success: true, message: "Email is Scheduled" });
        
        
        }
    catch (err) {
        logger.error("create Controller ", err);
        next(err);
        
    }
  
}


exports.update = async(req, res, next) => {
    res.status(200).send("working");

}


exports.remove = async(req, res, next) => {
    res.status(200).send("working");
    
}