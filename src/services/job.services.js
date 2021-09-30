const schedule = require("node-schedule");
const logger = require("../config/logger");
const createError = require("http-errors");
const { sendEmail } = require("./mailer.services");
const { updateDbStatus } = require("./user.services")
const genId = require("../utils/generator");
exports.schedulingJob = async (user) => {
  const date = new Date(user.date);
  const jobId = await genId.value(8);

  logger.debug("JOB ID IS ...." + jobId);
  
  schedule.scheduleJob(jobId, date, async () => {
    logger.debug("scheduler is running at " + user.date);
    await sendEmail(user.email, user.description, "This is Email Reminder");
    await updateDbStatus(user.email, jobId);

    schedule.cancelJob(jobId);
  });

  return jobId;
};

exports.reschedulingJob = async (jobId, userData) => {
  var date = new Date(userData.date);
  logger.debug("RescheduleJob for JOB ID ..."+jobId);
  schedule.rescheduleJob(jobId, date);
  return true;
};
