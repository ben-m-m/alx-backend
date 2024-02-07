import express from 'express';
import kue from 'kue';
import redis from 'redis';
import { promisify } from 'util';

const app = express();
const port = 1245;

// Create Redis client
const client = redis.createClient();

// Promisify Redis commands
const getAsync = promisify(client.get).bind(client);
const setAsync = promisify(client.set).bind(client);

// Function to reserve a seat
async function reserveSeat(number) {
    await setAsync('available_seats', number);
}

// Function to get current available seats
async function getCurrentAvailableSeats() {
    const availableSeats = await getAsync('available_seats');
    return parseInt(availableSeats) || 0;
}

// Initialize number of available seats to 50
reserveSeat(50);

// Initialize reservationEnabled flag
let reservationEnabled = true;

// Create Kue queue
const queue = kue.createQueue();

// Express route to get the number of available seats
app.get('/available_seats', async (req, res) => {
    const numberOfAvailableSeats = await getCurrentAvailableSeats();
    res.json({ numberOfAvailableSeats });
});

// Express route to reserve a seat
app.get('/reserve_seat', async (req, res) => {
    if (!reservationEnabled) {
        return res.json({ status: 'Reservation are blocked' });
    }
    
    const job = queue.create('reserve_seat').save((err) => {
        if (err) {
            return res.json({ status: 'Reservation failed' });
        }
        res.json({ status: 'Reservation in process' });
    });

    job.on('complete', () => {
        console.log(`Seat reservation job ${job.id} completed`);
    });

    job.on('failed', (err) => {
        console.error(`Seat reservation job ${job.id} failed: ${err}`);
    });
});

// Express route to process the queue and decrease available seats
app.get('/process', async (req, res) => {
    res.json({ status: 'Queue processing' });
    
    const availableSeats = await getCurrentAvailableSeats();
    if (availableSeats === 0) {
        reservationEnabled = false;
        return;
    }
    
    try {
        await reserveSeat(availableSeats - 1);
        if (availableSeats === 1) {
            reservationEnabled = false;
        }
    } catch (error) {
        throw new Error('Not enough seats available');
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});