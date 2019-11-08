import React, {useEffect, useState} from 'react';
import styled from 'styled-components';

export default function Fundamentals({ fundamentals }) {

    
    if (Object.entries(fundamentals).length === 0 && fundamentals.constructor === Object) {
        return null;
    }
    console.log(fundamentals);
    return (
        <div>
            <div>{fundamentals.symbol}</div>
            <div>{fundamentals.data.description}</div>
            <Stats stats={fundamentals.data.stats} />
            <Insider insider={fundamentals.data.insider} />
        </div>
    );
}

function Stats({ stats }) {

    for (const key in stats) {
        if (stats.hasOwnProperty(key)) {

        }
    }

    const entries = Object.entries(stats);
    return (
        <table>
            <tbody>
                <tr>
                    {entries.map(key => {
                        return <td>{key} {stats[key]}</td>
                    })}
                </tr>
            </tbody>
        </table>
    )
}

function Insider({ insider }) {
    return (
        <table>
            <tbody>
                {insider.map(i => {
                    console.log(i);
                    return (
                        <tr>
                            <td>{i.transaction}</td>
                            <td>{i.entity}</td>
                            <td>{i.relationship}</td>
                            <td>{i.shares_total}</td>
                            <td>{i.sec_form_filed_at}</td>
                            <td>{i.dollar_value}</td>
                        </tr>
                    )
                })}
            </tbody>
        </table>
    )
}
