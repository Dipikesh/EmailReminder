const createError = require('http-errors')
const { mailerService } = require('./services')
const scheduler = require('node-schedule');



exeCheck = async () => {
    try {
        var date = new Date('2021-09-23T13:52:29');
        scheduler.scheduleJob(date, async() => {
            console.log("mailer schedule");
        await mailerService.sendEmail("dipikesh.singh.915@gmail.com","okay this is sbody")
        
    })
    
    return;
}
catch (err) {
    console.log("got an error", err);
    return;
}
    
}

exeCheck();


