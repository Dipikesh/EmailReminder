const createError = require('http-errors');
const regSchema = require('../schemas/reg.schemas')
const logger = require('../config/logger')
const hashing = require('../utils/hash')


exports.register = async (user, otp) => {

        const { email } = user
        const isUserExist = await regSchema.findOne({ email, isVerified: true },{email:1,_id:0})
        if (isUserExist)
            throw createError(404, "Email Id already exists");
            
        const doc = await regSchema.updateOne({ email }, { email, otp, isVerified: false,etime: Date.now() + 6000000}, { upsert: true });
        if (!doc) throw createError(400, "User can not register, try again");
        
        logger.debug("Register User Successfully " + JSON.stringify(doc));
        return true;
    
    
}

exports.login = async (user) => {
    const { email, password } = user;
    const doc = await regSchema.findOne({ email, isVerified: true},{password:1});
    if (!doc) throw createError(404, "Email is not registered");
    const {hash, salt} = doc.password;
    if (!hashing.validatePassword(password, hash, salt))
        throw createError(401, "Password is not correct");
    return doc;
}

exports.verifyOtp = async (body) => {
    const { email ,otp} = body
    const result = await regSchema.findOne({ email, otp}, { name: 1,_id:0 });
    if (result) {
        logger.debug("Users OTP matched  Success");
        return true;
    }
    logger.debug("User With Wrong Otp ...Failed");
    throw createError(404,"OTP does not match , try again");
}

exports.confirmReg = async (user) => {
    const { email, password, name } = user;
    const isUserExist = await regSchema.findOne({ email, isVerified: true })
    if (isUserExist)
        throw createError(400, "Email is already registered and verified");
    const { hash, salt } = await hashing.genPassword(password);

    const data = { email, password: { hash, salt }, isVerified: true,name };
    
    const result = await regSchema.updateOne({ email, isVerified:false}, {$set:data},{upsert:false});
    if (result.n && result.nModified) {
        logger.debug("Final Registration Success");
        return true;
    }
    else if (!result.n) {
        logger.debug("Email id Not found");
        throw createError(404, "Email Id is not Registered or already verified");
    }
        
    logger.debug("Email is not found");
    throw createError(404,"Email is not found");

}