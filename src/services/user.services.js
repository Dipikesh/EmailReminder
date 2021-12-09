const mongoose = require("mongoose");
const userSchema = require("../schemas/user.schemas");
const regSchema = require("../schemas/reg.schemas");
const createError = require("http-errors");
require("../config/conn");
const logger = require("../config/logger");


exports.createUser = async (userData,email, jobId) => {
  
  var { name, date, description } = userData;

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

exports.validateSchedulationDate = async (userData,email) => {
  var {date} = userData;
  var originalDate1 = new Date(date);
  var originalDate2 = new Date(date);
  originalDate1.setMinutes(originalDate1.getMinutes() - 5);
  originalDate2.setMinutes(originalDate2.getMinutes() + 5);
  date = new Date(date);

  const isDateSame = await userSchema.findOne(
    {
      email: email,
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
  return false;
}


exports.getJobId = async (body,email) => {
  var { date, id } = body;
  //convert Into Date Object
  date = new Date(date);
  
  const result = await userSchema.findOne({email, "job._id": id }, { "job.jobId.$":1});

  if (!result) {
    throw createError(404, "Try again with correct date");
  }


  const jobId = result.job[0].jobId;

  logger.debug("JobId for Updating the Date "+JSON.stringify(jobId));
  return jobId.toString();

}

exports.updateDate = async (jobIdNum, email, userDate) => {
  const date = new Date(userDate.date);
  const jobId = jobIdNum.toString();
  logger.debug("jobId  "+jobId)
  const dateUpdated =await userSchema.updateOne({ email, "job.jobId": jobId, "job.status":false }, { "$set": { "job.$.date": date } })
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

exports.fetchInfo = async (email) => {
  
  const isEmailExist = await regSchema.findOne({ email });
  if (!isEmailExist) 
    throw createError(404, "User not found");
    
  
  const reminders = await userSchema.findOne({ email }, { _id: 0, email: 0 });

  if (reminders) {
    logger.debug("reminders " +reminders);
    return reminders;
  }
  return;
}

//Checking Wether Schedule is completed or not before deleting 
//If it has not completed, then we need to cancel the schedule job first, then delete.

exports.removeScheduledJob = async (id,email) => {

  const result = await userSchema.updateOne(
    { },
    { $pull: { job: { _id:id}}},
    { multi: true }
  )

  logger.debug("Schedule Deleted : " + JSON.stringify(result));

  if (!result.n ) {
  throw createError(400,"Schedule Not Found");
  }
  else if (result.n && !result.nModified) {
    throw createError(400, "Schedule can not be deleted");
  }
  else {
    return true;
  }
  
}

exports.scheduleStatus = async (id,email) => {
  const result = await userSchema.findOne({ email, "job._id": id }, { "job.status.$": 1, "job.jobId":1});
  logger.debug("Schedule Status: " + JSON.stringify(result));
  if (!result)
    throw createError(404, "Schedule Not Found");
  else if (!result.job[0].status) {
    return result.job[0].jobId;
  }
  else {
    return true;
  }
  

}