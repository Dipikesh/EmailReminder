const mongoose = require("mongoose");
const userSchema = require("../schemas/user.schemas");
const createError = require("http-errors");
require("../config/conn");
const logger = require("../config/logger");

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
  return jobId;

}
