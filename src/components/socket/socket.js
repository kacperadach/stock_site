'use es6';

import React, { useState, useEffect } from 'react';
import socket from '../../api/socket';


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