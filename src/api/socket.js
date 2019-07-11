'use es6';
import openSocket from 'socket.io-client';

const socket = openSocket('http://127.0.0.1:5000');

function connectToSocket(callback) {
    socket.on('connect', () => console.log('connected'));
    socket.on('event', data => callback(data));
    socket.emit('test', 1000);
}

export { connectToSocket };