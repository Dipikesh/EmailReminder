const schedule = require("node-schedule");
const logger = require("../config/logger");
const createError = require("http-errors");
const { sendEmail } = require("./mailer.services");
const { updateDbStatus } = require("./user.services")
const genId = require("../utils/generator");
const { debug } = require("../config/logger");
exports.schedulingJob = async (user,email) => {
  const date = new Date(user.date);
  const jobId = await genId.value(8);

  logger.debug("JOB ID IS ...." + jobId);
  
  schedule.scheduleJob(jobId, date, async () => {
    logger.debug("scheduler is running at " + user.date);
    await sendEmail(email, user.description, "This is Email Reminder");
    await updateDbStatus(email, jobId);

    schedule.cancelJob(jobId);
  });

  return jobId;
};

exports.reschedulingJob = async (jobId, userData) => {
  try {
    var date = new Date(userData.date);
    logger.debug("RescheduleJob for JOB ID ..." + jobId);
    await schedule.rescheduleJob(jobId, date);
    return true;
  } catch (err) {
    logger.error("Error during rescheduling ", err);
    throw createError(500,"Internal Server Error")
  }
 
};
exports.cancelScheduledJob = async (jobId) => {
  try {
    await schedule.cancelJob(jobId);
    logger.debug("cancelScheduledJob for JOB ID " + jobId);
    return true;
  } catch (err) {
    logger.error("Error during Scheduling ", err);
    throw createError(500,"Internal Server Error")
  }
}
