import React, {useEffect, useState} from 'react';
import socket from '../../api/socket';
import CandleStickChart from '../chart/candleStickChart';
import { timeParse } from "d3-time-format";

function MainChart({ match }) {

    const id = match.params.id;

    const [data, setData] = useState({'data': [], 'meta_data': {'time_interval': '1d'}});

    useEffect(() => {
        socket.emit('chart', {'uid': id});
        socket.on('chart', d => {
            let json_data = JSON.parse(d);
            json_data['data'] = formatData(json_data['data']);

            setData(prevData => {
                if (prevData.data.length === 0 || prevData.meta_data.time_interval != json_data.meta_data.time_interval) {
                    return json_data;
                } else {
                    return combineInterval(json_data, prevData);
                }
            });
        });
    }, []);

    return (
        <div className="mx-auto">
            {data.data.length !== 0 && <CandleStickChart uid={id} interval={data} />} 
        </div>
    );
}

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

    console.log('nothing returned');
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
