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
        <div style={{width: 'fit-content'}} className="bg-gray-300 m-4 p-3">
            <table className="bg-white">
                <thead>Stats</thead>
                <tbody className="font-thin">
                        {groups.map(group => {
                            return <tr className="flex">{group.map(pair => {
                                return (
                                    <div>
                                        <td style={{width: '95px'}} className="bg-gray-100 border-black border-1 text-sm">{pair[0]}</td>
                                        <td style={{width: '95px'}} className="bg-gray-200 border-black border-1 text-sm">{pair[1]}</td>
                                    </div>
                                )
                            })}</tr>
                        })}
                </tbody>
            </table>
        </div>
    )
}

function splitIntoGroups(stats) {
    const length = stats.length;

    const split = [];
    for (let i = 0; i < Math.ceil(length / 8); i++) {
        split.push(stats.slice(i * 8, (i * 8) + 8));
    }
    
    return split;
}

function Insider({ insider }) {
    return (
        <div style={{width: 'fit-content'}} className="bg-gray-300 m-4 p-3">
            <table className="bg-white">
                <tbody className="font-thin">
                    <tr className="text-left">
                        <th className="p-2">Transaction</th>
                        <th className="p-2">Date</th>
                        <th className="p-2">Entity</th>
                        <th className="p-2">Relationship</th>
                        <th className="p-2">Shares</th>
                        <th className="p-2">Cost</th>
                        <th className="p-2">Value</th>
                        <th className="p-2">Total Shares</th>
                        <th className="p-2">SEC</th>
                    </tr>
                    {insider.map(i => {
                        return (
                            <tr className="w-12">
                                <td className="w-40">{i.transaction}</td>
                                <td className="w-24">{i.date_executed}</td>
                                <td className="w-64">{i.entity}</td>
                                <td className="w-64">{i.relationship}</td>
                                <td>{i.num_shares}</td>
                                <td className="w-24">${i.cost}</td>
                                <td className="w-24">${i.dollar_value}</td>
                                <td>{i.shares_total}</td>
                                <td><a className="text-blue-500" href={i.sec_form_link}>{i.sec_form_filed_at}</a></td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
        </div>
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
