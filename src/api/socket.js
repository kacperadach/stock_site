'use es6';
import socketIOClient  from 'socket.io-client';

const socket = socketIOClient('https://www.bullzone.club');

// const socket = socketIOClient('http://127.0.0.1:5000');
socket.on('connect', () => console.log('connected'));
socket.on('disconnect', () => console.log('disconnect'));

export default socket;