const { jobService, userService } = require('../services');
const createError = require('http-errors')

exports.create = async(req, res, next) => {
    
    try {
        const user = await userService.createUser(req.body);
        console.log("user",user);
        if (user) {
            const scheduler = await jobService.scheduleJob(user);
            res.status(200).json({ success: true, message: "Email is Scheduled" });
        }
        
        }
    catch (err) {
        console.log("Error", err);
        next(createError(500,"Internal Server Error"));
        
    }
  
}


exports.update = async(req, res, next) => {
    res.status(200).send("working");

}


exports.remove = async(req, res, next) => {
    res.status(200).send("working");
    
}