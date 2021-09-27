const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    
    job: [{
        name: mongoose.Schema.Types.String,
        description: mongoose.Schema.Types.String,
        jobId: mongoose.Schema.Types.String,
        date: mongoose.Schema.Types.Date,
        status: {
            type: mongoose.Schema.Types.Boolean,
            default:0
        }
    }],
    email: mongoose.Schema.Types.String,
})

const userModel = mongoose.model('User', userSchema);

module.exports = userModel;