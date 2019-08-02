import React, {useEffect, useState} from 'react';
import socket from '../../api/socket';
import CandleStickChart from '../chart/candleStickChart';
import { timeParse } from "d3-time-format";
import styled from 'styled-components';

function MainChart({ match }) {

    const id = match.params.id;

    const [data, setData] = useState({'data': [], 'meta_data': {'time_interval': '1d'}});
    const [meta, setMeta] = useState({});

    useEffect(() => {
        socket.on('metadata', data => {
            console.log('fetched meta');
            console.log(data);
            setMeta(data);
        });
    }, []);

    useEffect(() => {
        socket.emit('metadata', {'uid': id })
        setInterval(() => socket.emit('metadata', {'uid': id }), 5000);
    }, []);

    useEffect(() => {
        socket.emit('chart', {'uid': id});
        socket.on('chart', d => {
            let json_data = JSON.parse(d);
            json_data['data'] = formatData(json_data['data']);

            setData(prevData => {
                if (prevData.data.length === 0) {
                    return json_data;
                } else {
                    return combineInterval(json_data, prevData);
                }
            });
        });
    }, []);

    return (
        <div className="mx-auto flex">
            <CandleStickChart uid={id} interval={data} />
            {meta && <ChartDescription meta={meta} />}
        </div>
    );
}

export function ChartDescription({ meta }) {

    let name = "";
    console.log(meta);
    if (meta.long_name !== undefined) {
        name = meta.long_name;
    } else if (meta.meta_data !== undefined && meta.meta_data.common_name !== undefined) {
        name = meta.meta_data.common_name;
    } else if (meta.common_name !== undefined) {
        name = meta.common_name;
    }

    return (
        <div className="bg-gray-300 p-3 rounded h-full inline-block">
            <div className="bg-white p-8 h-full text-xl flex flex-col">
                <span className="text-3xl">{name}</span>
                {meta.sector && <span className="text-sm">{meta.sector}</span>}
                {meta.exchange && <span className="text-xs">{meta.exchange}</span>}
                {meta.country && <span className="text-xs">{meta.country}</span>}
                <div className="flex flex-row align-bottom py-2">
                    {meta.close && <span className="text-2xl pr-1 my-auto">{meta.close}</span>}
                    {meta.point_diff && <Change  className="text-xs px-1 my-auto text-xl" value={meta.point_diff}>{meta.point_diff}</Change>}
                    {meta.percentage_diff && <Change className="text-xs px-1 my-auto text-xl" value={meta.percentage_diff}>{meta.percentage_diff}%</Change>}
                </div>
            </div>
        </div>
    );  
}

const Change = styled.div.attrs(props => {
    let colorValue;
    if (props.value === 0) {
        colorValue = 'grey';
    } else if (props.value > 0) {
        colorValue = 'green';
    } else {
        colorValue = 'red';
    }

    return {
        color: colorValue
    }
})`color: ${props => props.color}`;


function combineInterval(newDataObj, oldDataObj) {
    const meta_data = newDataObj.meta_data;
    const newData = newDataObj.data;
    const oldData = oldDataObj.data;

    if (newData.length === 0) {
        return oldDataObj;
    }

    // const first = newData[0].date;
    const last = newData[newData.length - 1].date;

    if (oldData[0].date > last) {
        const combinedData = newData.concat(oldData);
        return {'data': combinedData, 'meta_data': meta_data};
    } else if (oldData[0].date == last) {
        const additionalData = newData.slice(0, newData.length - 2);
        return {'data': additionalData.concat(oldData), 'meta_data': meta_data}
    } else {
        // go backwards for efficiency
        for (let i = -2; i > -1 * newData.length; i--) {
            const d = newData[newData.length + i];
            if (oldData[0].date > d.date) {
                const additionalData = newData.slice(0, newData.length + i);
                return {'data': additionalData.concat(oldData), 'meta_data': meta_data}
            }
        }
    }

    return {'data': oldData, 'meta_data': meta_data}
}

function formatData(data) {

    const parseDate = timeParse("%Y-%m-%d %H:%M:%S");
    const formattedData = data.map((d, i) => {
        if (d.date instanceof Date) {
            return d;
        }
        let date = new Date(parseDate(d.date).getTime());
        d['date'] = date;
        return d;
    })
    return formattedData;
}

export default MainChart;
