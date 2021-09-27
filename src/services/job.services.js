const schedule = require("node-schedule");
const logger = require("../config/logger");
const createError = require("http-errors");
const { sendEmail } = require("./mailer.services");
const { updateDbStatus } = require("./user.services")
const Job = require("../utils/genId");
exports.schedulingJob = async (user) => {
  const date = new Date(user.date);
  const jobId = await Job.genId(8);

  logger.debug("JOB ID IS ...." + jobId);
  
  schedule.scheduleJob(jobId, date, async () => {
    logger.debug("scheduler is running at " + user.date);
    await sendEmail(user.email, user.description);
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
