import React, {useEffect, useState} from 'react';
import styled from 'styled-components';

export default function Fundamentals({ fundamentals }) {
    if (Object.entries(fundamentals).length === 0 && fundamentals.constructor === Object) {
        return null;
    }

    return (
        <div>
            <Stats stats={fundamentals.data.stats} />
            <Insider insider={fundamentals.data.insider} />
            <News news={fundamentals.data.news} />
        </div>
    );
}

function Stats({ stats }) {

    const groups = splitIntoGroups(Object.entries(stats));
    return (
        <table>
            <thead>Stats</thead>
            <tbody>
                    {groups.map(group => {
                        return <tr>{group.map(pair => {
                            return <td>{pair[0]}: {pair[1]}</td>
                        })}</tr>
                    })}
            </tbody>
        </table>
    )
}

function splitIntoGroups(stats) {
    const length = stats.length;

    const split = [];
    for (let i = 0; i < Math.ceil(length / 10); i++) {
        split.push(stats.slice(i * 10, (i * 10) + 10));
    }
    
    return split;
}

function Insider({ insider }) {
    return (
        <table>
            <tbody>
                <tr>
                    <th>Transaction</th>
                    <th>Date</th>
                    <th>Entity</th>
                    <th>Relationship</th>
                    <th>Shares</th>
                    <th>Cost</th>
                    <th>Value</th>
                    <th>Total Shares</th>
                    <th>SEC</th>
                </tr>
                {insider.map(i => {
                    return (
                        <tr>
                            <td>{i.transaction}</td>
                            <td>{i.date_executed}</td>
                            <td>{i.entity}</td>
                            <td>{i.relationship}</td>
                            <td>{i.num_shares}</td>
                            <td>${i.cost}</td>
                            <td>${i.dollar_value}</td>
                            <td>{i.shares_total}</td>
                            <td><a href={i.sec_form_link}>{i.sec_form_filed_at}</a></td>
                        </tr>
                    )
                })}
            </tbody>
        </table>
    )
}

function News({ news }) {
    return (
        <table>
            <tbody>
            {news.map(n => {
                return (
                    <tr>
                        <td>{n.datetime}</td>
                        <td><a href={n.link}>{n.link}</a></td>
                        <td>{n.source}</td>
                    </tr>
                )
            })}
            </tbody>
        </table>
    )
}
