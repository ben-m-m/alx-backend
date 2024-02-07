
import kue from 'kue';

const que = require('kue');

const queue = que.createQueue();

const jobData = {
    phoneNumber: '0987654321',
    message: 'Hello SWE'
};

const job = queue.create('push_notification_code', jobData);

job.on('complete', () => {
    console.log('Notification job completed');
});

job.on('failed', () => {
    console.log('Notification job failed');
});

job.save((err) => {
    if (!err) {
        console.log(`Notification job created: ${job.id}`);
    } else {
        console.error(`Error creating: ${err}`);
    }
});