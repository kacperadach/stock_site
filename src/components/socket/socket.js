'use es6';

import React, { useState, useEffect } from 'react';
import socketIOClient  from 'socket.io-client';

const socket = socketIOClient('http://127.0.0.1:5000');
socket.on('connect', () => console.log('connected'));
socket.on('disconnect', () => console.log('disconnect'));

function Socket() {
    const [lastSent, setLastSent] = useState(0);
    const [lastReceived, setLastReceived] = useState(0);

    useEffect(() => {
        socket.send('test');
        socket.on('event', () => setLastReceived(Date.now()));
    }, []);

    return (
        <div>
            <p>{lastSent}</p>
            <p>{lastReceived}</p>
        </div>
    );
}


export default Socket;