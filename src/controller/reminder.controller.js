const { jobService, userService, mailerService, authService } = require('../services');
const createError = require('http-errors');
const logger = require('../config/logger');


exports.create = async(req, res, next) => {
    
    try {
        const email = await authService.fetchEmail(res.locals.payload.sub);
        const isScheduleExist = await userService.validateSchedulationDate(req.body, email);
        const jobId = await jobService.schedulingJob(req.body, email);
        logger.debug(`Email is scheduled for jobId  ` + jobId);
        const user = await userService.createUser(req.body, email, jobId);
        res.status(201).json({ success: true, message: `Email is Scheduled at ${req.body.date}`, data: req.body.date });
    }
    catch (err) {
        logger.error("create Controller ", err);
        next(err);
        
    }
  
}


exports.update = async (req, res, next) => {
    try {
        const email = await authService.fetchEmail(res.locals.payload.sub);
        const jobId = await userService.getJobId(req.body, email);
        const isScheduleExist = await userService.validateSchedulationDate(req.body, email);

        const updateSchedule = await userService.updateDate(jobId, email, req.body);
    
        const rescheduleJob = await jobService.reschedulingJob(jobId, req.body);
        res.status(200).json({ success: true, message: `Date is updated to ${req.body.date}`, data: req.body.date });
    }
    catch (err) {
        logger.error("REMINDER --- UPDATE CONTROLLER ERROR  " + err);
        next(err);
    }
}


exports.remove = async (req, res, next) => {
    try {
        const email = await authService.fetchEmail(res.locals.payload.sub);
  
        const incompleteScheduleJobId = await userService.scheduleStatus(req.body.id, email);
        if (incompleteScheduleJobId) {
            const cancelSchedule = await jobService.cancelScheduledJob(incompleteScheduleJobId);
        }
        const delSchedule = await userService.removeScheduledJob(req.body.id);
        
        res.status(200).json({ success: true, message: `Schedule is removed successfully` });
    }
    catch (err) {
        logger.error("REMINDER CTRL -- REMOVE ERROR " + err);
        next(err);
    }
}

exports.profile = async (req, res, next) => {
    try {
        const email = await authService.fetchEmail(res.locals.payload.sub)
        const reminders = await userService.fetchInfo(email);

        res.status(200).json({ success: true, message: "User Data", data: reminders });
    }
    catch (err) {
        logger.error("Error in Profile controller  " + err);
        next(err)
    }
}