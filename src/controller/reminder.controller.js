const { jobService, userService, mailerService} = require('../services');
const createError = require('http-errors')
const logger = require('../config/logger');

exports.userInfo = async (req, res, next) => {
    try {
        const userDetail = await userService.fetchInfo(req.params);
    }
    catch (err) {
        
    }
}
exports.create = async(req, res, next) => {
    
    try {
        const jobId = await jobService.schedulingJob(req.body);
        logger.debug(`Email is scheduled for jobId  `+jobId);
        const user = await userService.createUser(req.body, jobId);
        if(user)
        res.status(200).json({ success: true, message: `Email is Scheduled at ${req.body.date}`,data:req.body.date });
        }
    catch (err) {
        logger.error("create Controller ", err);
        next(err);
        
    }
  
}


exports.update = async (req, res, next) => {
    const jobId = await userService.getJobId(req.body);
    const rescheduleJob = await jobService.reschedulingJob(jobId, req.body);
    const updateDate = await userService.updateDate(jobId,req.body);
    res.status(200).json({ success: true, message:`Date is updated to ${req.body.date}`,data:req.body.date });

}


exports.remove = async(req, res, next) => {
    res.status(200).send("working");
    
}

exports.profile = async (req, res, next) => {
    try {
        const reminders = await userService.fetchInfo(res.locals.payload);
        if (reminders) {
            res.status(200).json({ success: true, message: "User Data", data: reminders });
        }
    }
    catch (err) {
        logger.error("Error in Profile controller  " + err);
        next(err)
    }
}