import kue from 'kue';


const blacklistedNums = ['4153518780', '4153518781'];

function sendNotification(phoneNumber, message, job, done) {

    job.progress(0, 100);

    if (blacklistedNums.includes(phoneNumber)) {
        job.failed(new Error(`Phone number ${phoneNumber} is blacklisted`));
        if (typeof done === 'function') {
            done(new Error(`Phone number ${phoneNumber} is blacklisted`));
        }
        return;
    }

    //update progress to 50%
    job.progress(50, 100);

    console.log(`Sending notification to ${phoneNumber}, with message: ${message}`);

    //complete job
    if (typeof done === 'function') {
        done();
    }
}

const queue = kue.createQueue({ concurrent: 2});

queue.process(`push_notification_code_2`, 2, (job, done) => {
    const { phoneNumber, message } = job.data;

    sendNotification(phoneNumber, message, job, done);
});
