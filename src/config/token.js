const jwt = require(`jsonwebtoken`);
const createError = require(`http-errors`);
const fs = require("fs");
const path = require("path");
const logger = require("../config/logger");
//This is temporary until we use Aws KMS to store the private key
const pathToPrivKey = path.join(__dirname, "key/id_rsa_priv.pem");
const pathToPrivKey2 = path.join(__dirname, "key/id_rsa_priv2.pem");

const PRIV_KEY = fs.readFileSync(pathToPrivKey, "utf8");
const PRIV_KEY2 = fs.readFileSync(pathToPrivKey2, "utf8"); //TODO Never use *Sync functions like the one here
//TODO Never use *Sync functions like the one here

exports.signAccessToken = async (userId) => {
  return new Promise((resolve, reject) => {
    
    const _id = userId;
    const issuer = `emailReminder.com`;
    
    const payload = {
      sub: _id,
      iat: Date.now(),
      iss: issuer,
      type: `at`,
    };

    const options = {
      expiresIn: `2d`,
      algorithm: `RS256`,
    };

    const token = jwt.sign(payload, PRIV_KEY, options, (err, token) => {
      
      if (err) {
        logger.error(err.message);
        return reject(createError(500, "Internal server error"));
        
      }
      logger.debug("Access token successfully signed   " + token)
      return resolve(token);
    });
  });
}
//TODO Never use *Sync functions like the one here

exports.signRefreshToken = (userId) => {

  return new Promise((resolve, reject) => {
    const _id = userId;
    const issuer = `emailReminder.com`;
    
    const payload = {
      sub: _id,
      iat: Date.now(),
      iss: issuer,
      type: `at`,
    };

    const options = {
      expiresIn: `20d`,
      algorithm: `RS256`,
    };

    jwt.sign(payload, PRIV_KEY2, options, (err, token) => {
      if (err) {
        logger.error(err.message);
        reject(createError(500, "Internal server error"))
        
      }
      logger.debug("Refresh token successfully   " + token)
      return resolve(token);
    });
  }
  )
}




