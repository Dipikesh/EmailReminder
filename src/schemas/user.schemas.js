const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: mongoose.Schema.Types.String,
    description: mongoose.Schema.Types.String,
    date: mongoose.Schema.Types.Date,
    email: mongoose.Schema.Types.String,
    

        

})

const userModel = mongoose.model('User', userSchema);

module.exports = userModel;