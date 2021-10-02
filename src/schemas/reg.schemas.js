const mongoose = require('mongoose');
const createError = require('http-errors')

const registrationSchema = new mongoose.Schema({
    email: {
        type: mongoose.Schema.Types.String,
        index:true,
        unique: true,
        required: true,
        lowercase: true,
        trime: true,
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
        expires:'10s'
    },
    isVerified: {
        type: mongoose.Schema.Types.Boolean,
        default: false
  },
  etime: {
    type: mongoose.Schema.Types.Date,
    default:Date.now()
  },
  exp: [{
    t: mongoose.Schema.Types.String,
  }]
  
},
{timestamp:true});



registrationSchema.post('updateOne', (err, doc, next) => {
  if (err) {
    next(createError(500,err));
  }
})

const regSchema = mongoose.model('auth', registrationSchema);

module.exports = regSchema;

