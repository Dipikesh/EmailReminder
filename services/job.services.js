const schedule = require("node-schedule");
const logger = require("../config/logger");
const createError = require("http-errors");
const {sendEmail} = require("../services/mailer.services")


exports.schedulingJob = async(user) => {
//   return new Promise((resolve, reject) => {
  try {
    var date = new Date('2021-09-23T14:59:19');
      
    schedule.scheduleJob("job1", date, async() => {
        logger.info("scheduler is running at ");
        // await mailerService.sendEmail(user.email, user.description);

        await sendEmail(user.date, "userdescription");
         logger.info("after sent")
      });
    //   return resolve(true);
        return true
    } catch (err) {
      logger.error("scheduler error ", err);
    //   return reject(createError(500, "Internal Server Error"));
   return (createError(500, "Internal Server Error"))
    }
//   });
};
