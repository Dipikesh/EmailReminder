const mongoose = require('mongoose');
const crypto = require('crypto')

const registrationSchema = new mongoose.Schema({
    email: {
        type: mongoose.Schema.Types.String,
        index:true,
        unique: true,
        required: true,
        lowercase: true,
    },
    name: {
        type: mongoose.Schema.Types.String,
        required:true,
    },

  password: {
    salt: mongoose.Schema.Types.String,
    hash: mongoose.Schema.Types.String,
    // required: true
    },
    otp: {
        type: mongoose.Schema.Types.String,
      index: { expires: '15' },
    },
    isVerified: {
        type: mongoose.Schema.Types.Boolean,
        default: false
  },
  etime: {
    type: mongoose.Schema.Types.Date,
    }
});




const regSchema = mongoose.model('auth', registrationSchema);

module.exports = regSchema;

