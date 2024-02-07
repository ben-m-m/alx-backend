
import { createClient } from "redis";

const client = createClient();

client.on('connect', () => {
    console.log('Redis client connected to the server')
});

client.on('error', (err) => {
    console.error('Redis client not connected to the server: ${err}')
});

//subscribe to the 'holberton school channel'
client.subscribe('holberton school channel');

//event listener for messages in the 'holberton school channel'
client.on('message', (channel, message) => {
    console.log(message);
    if (message === 'KILL_SERVER') {
        client.unsubscribe();
        client.quit();
    }
});