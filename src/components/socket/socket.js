'use es6';

import React, { useState, useEffect } from 'react';
import {connectToSocket} from '../../api/socket';


function Socket() {
    
    const [connected, setConnected] = useState(false);
    const [attemptedConnect, setAttemptedConnect] = useState(false);
    const [socket, setSocket] = useState(null);

    if (!connected) {
        connectToSocket((data) => console.log(data));
        setConnected(true);
    }


    

    return <div>socket</div>;
}

function setUpSocket() {

}

export default Socket;