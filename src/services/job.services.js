const schedule = require("node-schedule");
const logger = require("../config/logger");
const createError = require("http-errors");
const {sendEmail} = require("./mailer.services")
const Job = require("../utils/genId");
exports.schedulingJob = async (user) => {
  const date = new Date(user.date);
  const jobId = await Job.genId(8);
    schedule.scheduleJob(jobId, date, async() => {
      logger.debug("scheduler is running at "+user.date);
      await sendEmail(user.email, user.description);
      });
      return jobId;
};

exports.reschedulingJob = async (jobId, userData) => {
   var date = new Date(userData.date);

  // schedule.reschedule(jobId, date);
  return true;
}
