const jwt = require(`jsonwebtoken`);
const createError = require(`http-errors`);
const fs = require("fs");
const path = require("path");
const logger = require("../config/logger");
//This is temporary until we use Aws KMS to store the private key
const pathToPrivKey = path.join(__dirname, "key/id_rsa_priv.pem");

const PRIV_KEY = fs.readFileSync(pathToPrivKey, "utf8");
const pathToPubKey = path.join(__dirname,'..', "config/key/id_rsa_pub.pem");
const PUB_KEY = fs.readFileSync(pathToPubKey, "utf8");

const genToken = require('../config/token')
const decodeToken = require('../utils/hash');
const { authService } = require('../services');
//TODO Never use *Sync functions like the one here

exports.signAccessToken = async (userId) => {
  return new Promise((resolve, reject) => {
    
    const _id = userId;
    const issuer = `emailReminder.com`;
    
    const payload = {
      exp: Math.floor(Date.now() / 1000) + (60 * 60),
      sub: _id,
      iat: Date.now(),
      iss: issuer,
      type: `at`,
    };

    const options = {
  
      algorithm: `RS256`,
    };

    const token = jwt.sign(payload, PRIV_KEY,options, (err, token) => {
      
      if (err) {
        logger.error(err.message);
        return reject(createError(500, "Internal server error"));
        
      }
      if (token) {
      logger.debug("Access token successfully signed ");
    
       return resolve({ accessToken: token, payload });
      }
      return reject(createError(500, "Internal Server Error"));
    });
  });
}

exports.validateAccessToken = async (token) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, PUB_KEY, (err, payload) => {
      if (payload) {
        logger.debug("Token successfully validated")
        return resolve(payload);
      }
      else if (err.name === 'TokenExpiredError') {
        logger.debug("Token  Error " + err);

        return resolve(false);
               
               
      }

      else if (err) {
        logger.debug("Token  Error " + err);
        reject(createError(400, "Authorizaion Required"));
                
      }
                    
    });
  })
}
    
//TODO Never use *Sync functions like the one here



