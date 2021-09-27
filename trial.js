const createError = require('http-errors')
const { mailerService } = require('./src/services')
const scheduler = require('node-schedule');

const joId = "123JHe";

exeCheck = async () => {
    try {
        var date = new Date('2021-09-26T11:52:00');
        scheduler.scheduleJob(joId ,date, async() => {
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
        var date2 = new Date('2021-09-26T11:53:00');

scheduler.rescheduleJob("hellosadfsdf", date2);


