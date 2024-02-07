const kue = require('kue');
const { expect } = require('chai');
const createPushNotificationsJobs = require('./8-job.js');

describe('createPushNotificationsJobs', () => {
    let queue;

    beforeEach(() => {
        queue = kue.createQueue();
        queue.testMode.enter();
    });

    afterEach(() => {
        queue.testMode.clear();
        queue.testMode.exit();
    });

    it('Error: jobs is not an array', () => {
        expect(() => createPushNotificationsJobs({}, queue)).to.throw('Jobs is not an array');
    });

    it('should create two new jobs in the queue', () => {
        const jobs = [
            {phoneNumber: '1700000000', message: 'This is the code 0000 to verify your account'},
            {phoneNumber: '2711111111', message: 'This is the code 1111 to verify your account'},
        ];


        createPushNotificationsJobs(jobs, queue);

        expect(queue.testMode.jobs.length).to.equal(2);

        //check if jobs are created with correct data
        const firstJob = queue.testMode.jobs[0];
        expect(firstJob.type).to.equal('push_notification_code_3');
        expect(firstJob.data).to.deep.equal(jobs[0]);

        const secondJob = queue.testMode.jobs[1];
        expect(secondJob.type).to.equal('push_notification_code_3');
        expect(secondJob.data).to.deep.equal(jobs[1]);
    });
});
