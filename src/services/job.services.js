const schedule = require("node-schedule");
const logger = require("../config/logger");
const createError = require("http-errors");
const {sendEmail} = require("./mailer.services")


exports.schedulingJob = async(user) => {
  return new Promise((resolve, reject) => {
  try {
    
      
    schedule.scheduleJob("job1", user.date, async() => {
      logger.debug("scheduler is running at "+user.date);
      await sendEmail(user.email, user.description);
      });
      return resolve(true);
    } catch (err) {
      logger.error("scheduler error ", err);
      return reject(createError(500, "Internal Server Error"));
    }
  });
};
