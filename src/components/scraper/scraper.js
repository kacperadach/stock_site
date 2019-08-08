import React, {useEffect, useState} from 'react';
import socket from '../../api/socket';
import LineChart from '../chart/lineChart';
import { timeParse } from "d3-time-format";

export default function Scraper() {

    const [data, setData] = useState([]);

    useEffect(() => {
        socket.on('scraper_stats', d => {
            const data = JSON.parse(d);
            // check if any changed before setting
            console.log(data);
            setData(formatData(data));
        });
        socket.emit('scraper_stats', {})
    }, []);

    return data ? <LineChart data={data}>test</LineChart> : null;
}

function formatData(data) {

    const parseDate = timeParse("%Y-%m-%d %H:%M:%S");
    const formattedData = data.map((d, i) => {
        if (d.datetime_utc instanceof Date) {
            return d;
        }
        let date = new Date(parseDate(d.datetime_utc).getTime());
        d['datetime_utc'] = date;
        return d;
    })
    return formattedData;
}
