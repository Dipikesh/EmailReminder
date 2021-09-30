const mongoose = require("mongoose");
const userSchema = require("../schemas/user.schemas");
const createError = require("http-errors");
require("../config/conn");
const logger = require("../config/logger");

exports.fetchInfo = async (user) => {
  logger.debug("profile id "+ JSON.stringify(user));
  const reminders = await userSchema.findOne({id:user.id });
  logger.debug("reminders " + JSON.stringify(reminders));
  return reminders;
  
  // var {email,jobId}
  return true;

}
exports.createUser = async (userData, jobId) => {
  var { name, email, date, description } = userData;
  var originalDate1 = new Date(date);
  var originalDate2 = new Date(date);
  originalDate1.setMinutes(originalDate1.getMinutes() - 5);
  originalDate2.setMinutes(originalDate2.getMinutes() + 5);
  date = new Date(date);

  const isDateSame = await userSchema.findOne(
    {
      email: "dipikesh.singh.915@gmail.com",
      "job.date": {
        $gte: originalDate1,
        $lte: originalDate2,
      },
    },
    { _id: 1 }
  );
  logger.debug("User with around same date exist " + `${isDateSame}`);
  if (isDateSame)
    throw createError(
      400,
      "Please Set Reminder atleast after or before 5 minutes of previous reminders+ "
    );

  const result = await userSchema.updateOne(
    { email },
    { $push: { job: { date, jobId, name, description } } },
    { upsert: true }
  );
  logger.debug("User data on update returns " + JSON.stringify(result));

  if (result.nMatched && result.nModified)
    logger.debug("User data inserted successfully " + result.nModified);

  return result;
};


exports.getJobId = async (body) => {
  var { date, prevDate, email } = body;
  date = new Date(date);
  prevDate = new Date(prevDate);

  const result = await userSchema.findOne({email, "job.date": prevDate }, { "job.jobId.$":1});

  if (!result) {
    throw createError(404, "Try again with correct date");
  }


  const jobId = result.job[0].jobId;
  console.log("job result "+result.job[0].jobId);
  logger.debug("JobId for Updating the Date "+JSON.stringify(jobId));
  return jobId.toString();

}

exports.updateDate = async (jobIdNum, userDate) => {
  const jobId = jobIdNum.toString();
  logger.debug("jobId  "+jobId)
  const dateUpdated =await userSchema.updateOne({ email: userDate.email, "job.jobId": jobId, "job.status":false }, { "$set": { "job.$.date": userDate.date } })
  if (dateUpdated.n && dateUpdated.nModified) {
    logger.debug("User date updated successfully")
    return true;
  }
  logger.debug("Date can not updated, Something went wrong"+JSON.stringify(dateUpdated));
  throw createError(500, "Something went wrong");


}

exports.updateDbStatus = async (email, jobId) => {
  try {
    const result = await userSchema.updateOne({ email, "job.jobId": jobId }, { "job.$.status": 1 });
    if (result.n && result.nModified) {
      logger.debug("User Email Sent Status changed to 1");
      return true;
    }
     logger.debug("User Email Sent Status can't  change to 1"+JSON.stringify(result));
      return true;

  }
  catch (err) {
    debug.error("Email Status changing to 1 error " + err);
    return false;
  }

}
