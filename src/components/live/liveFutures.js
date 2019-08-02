'use es6';
import React, {useEffect, useState} from 'react';
import socket from '../../api/socket';
import styled from 'styled-components';
import ChartDescription from '../../components/quote/chartDescription';

const PER_PAGE = 5;

function LiveFutures() {

    const [futures, setFutures] =  useState([]);
    const [offset, setOffset] = useState(0);

    useEffect(() => {
        socket.on('live_futures', d => {
            const data = JSON.parse(d);
            // check if any changed before setting
            setFutures(data);
        });
        socket.emit('live_futures', {})
        setInterval(() => socket.emit('live_futures', {}), 5000);
    }, [])

    let asc = () => setOffset(offset + 5);

    let desc = () => setOffset(offset - 5);
    if (offset === 0) {
        desc = () => null;
    }


    return (
        <div className="flex flex-row">
            <PaginationButton direction="desc" onClick={desc} />
            {futures.slice(offset, offset + PER_PAGE).map(d => {
                return (
                    <Future data={d} />
                );
            })}
            <PaginationButton direction="asc" onClick={asc} />
        </div>
    );
}

function PaginationButton({ onClick, direction }) {
    const name = direction === 'asc' ? 'NEXT' : 'PREV';
    return (
        <button onClick={onClick}>{name}</button>
    );
}

function Future({ data }) {
    const link = `https://www.bullzone.club/chart/${data.meta_data.uid}`;
    return (
            <form action={link}>
                <button type="submit" formaction={link}>
                    <ChartDescription meta={data} type="live" />
                </button>
            </form>
            
        
    );
}

export default LiveFutures;