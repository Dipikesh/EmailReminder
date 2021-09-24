const mongoose = require("mongoose");
const userSchema = require("../schemas/user.schemas");
const createUser = require("http-errors");
require('../config/conn');
const logger = require('../config/logger')

exports.createUser = async (userData) => {
  return new Promise(async(resolve, reject) => {
    try {
      var { name, email, date, description } = userData;
        date = new Date(date);
        const userObj = { name, email, date, description }
        const userModel = new userSchema(userObj);

        const user = await userModel.save();
        logger.debug(`User inserted in database`);
        return resolve(userObj);
      
    } catch (err) {
      logger.error("USER DATA SAVING ", err);
      return reject(createError(500, "Internal Server Error"));
    }
  });
};


