const createError = require("http-errors");
const regSchema = require("../schemas/reg.schemas");
const logger = require("../config/logger");
const hashing = require("../utils/hash");

exports.register = async (user, otp) => {
  const { email } = user;
  const result = await regSchema.findOne({ email }, { etime: 1 });
  if (result && !result.isVerified) {
    const eTime = Math.floor(result.etime / 1000);
    const current_time = Math.floor(Date.now() / 1000);
    if (current_time - eTime < 20) {
      throw createError(400, "Email is being sent...Try again after 20 sec");
    }
    const doc = await regSchema.updateOne(
      { email },
      { email, otp, isVerified: false, etime: Date.now() },
      { upsert: true }
    );
    if (doc.n && (doc.nModified || doc.upserted)) {
      logger.debug("Register User Successfully " + JSON.stringify(doc));
      return doc;
    }
    throw createError(500, "User can not register, try again");
  } else if (!result) {
    const doc = await regSchema.updateOne(
      { email },
      { email, otp, isVerified: false, etime: Date.now() },
      { upsert: true }
    );
    if (doc.n && (doc.nModified || doc.upserted)) {
      logger.debug("Register User Successfully " + JSON.stringify(doc));
      return doc;
    }

    throw createError(500, "User can not register, try again");
  }

  throw createError(404, "Email Id already exists");
};

exports.login = async (user) => {
  const { email, password } = user;
  const doc = await regSchema.findOne(
    { email, isVerified: true },
    { password: 1 }
  );
  if (!doc) throw createError(404, "Email is not registered");
  const { hash, salt } = doc.password;
  if (!hashing.validatePassword(password, hash, salt))
    throw createError(401, "Password is not correct");
  return doc;
};

exports.verifyOtp = async (body) => {
  const { email, otp } = body;
  const result = await regSchema.findOne({ email, otp }, { etime: 1, _id: 0 });
  if (result) {
    const eTime = Math.floor(result.etime / 1000);
    const current_time = Math.floor(Date.now() / 1000);

    if (current_time - eTime >= 90) {
      throw createError(400, "OTP Expired ");
    }
    logger.debug(
      "Users OTP matched  Success  ...Etime " + eTime + "   " + current_time
    );
    return true;
  }
  logger.debug("User With Wrong Otp ...Failed");
  throw createError(404, "OTP does not match , try again");
};

exports.confirmReg = async (user) => {
  const { email, password, name } = user;
  const isUserExist = await regSchema.findOne({ email, isVerified: true });
  if (isUserExist)
    throw createError(400, "Email is already registered and verified");
  const { hash, salt } = await hashing.genPassword(password);

  const data = { email, password: { hash, salt }, isVerified: true, name };

  const result = await regSchema.updateOne(
    { email, isVerified: false },
    { $set: data },
    { upsert: false }
  );
  if (result.n && result.nModified) {
    logger.debug("Final Registration Success");
    return true;
  } else if (!result.n) {
    logger.debug("Email id Not found");
    throw createError(404, "Email Id is not Registered or already verified");
  }

  logger.debug("Email is not found");
  throw createError(404, "Email is not found");
};

exports.saveTokenExp = async (payload) => {
  try {
    const result = await regSchema.updateOne(
      { _id: payload.sub },
      { $push: { "exp.t": payload.exp } },
      { upsert: false }
    );
    if (result.n && result.nModified) {
      logger.debug("Token Expiry Time saved Successfully");
      return true;
    } else if (!result.n || !result.nModified) {
      logger.debug("Token Expiry can not be saved");
      throw createError(400, "Something went wrong");
    }
    logger.debug("In the saveTokenExp");
  } catch (err) {
    logger.error("Auth Service ...." + err);
    if (err.code === 11000) throw createError(400, "Can not Add");
    throw createError(500, "Internal Server Error");
  }
};

exports.updateTokenExpiry = async (newPayload, prevPayload) => {
  const result = await regSchema.updateOne(
    {
      _id: prevPayload.sub,

      "exp.t": [prevPayload.exp],
    },
    {
      $set: { "exp.t.$": newPayload.exp },
    },
    { upsert: false }
  );
  logger.debug("update token query ...." + JSON.stringify(result));
  if (result.n && result.nModified) {
    logger.debug("Token Expiry Time found and updated Successfully");
    return true;
  } else if (!result.n) {
    logger.debug("Token Expiry can not be updated");
    throw createError(401, "UnAuthorize");
  }
  logger.debug("User not found");
  throw createError(404, "user not found");
};

exports.fetchEmail = async (id) => {
  const result = await regSchema.findOne({_id:id}, { email: 1 });
  if (result) {
    logger.debug("email found " + result.email);
    return result.email;
  }

  throw createError(404, "Email not found");
}