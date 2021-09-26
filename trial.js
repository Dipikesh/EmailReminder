const createError = require('http-errors')
const { mailerService } = require('./src/services')
const scheduler = require('node-schedule');



exeCheck = async () => {
    try {
        var date = new Date('2021-09-25T20:24:29');
        scheduler.scheduleJob("heko",date, async() => {
            console.log("mailer schedule");
        // await mailerService.sendEmail("dipikesh.singh.915@gmail.com","okay this is sbody")
        
    })
    
    return;
}
catch (err) {
    console.log("got an error", err);
    return;
}
    
}

exeCheck();
        var date2 = new Date('2021-09-25T20:25:29');

scheduler.rescheduleJob("heko", date2);


