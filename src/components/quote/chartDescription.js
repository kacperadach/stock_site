import React, {useEffect, useState} from 'react';
import styled from 'styled-components';

export default function ChartDescription({ meta, type, description }) {

    let name = "";
    if (meta.long_name !== undefined) {
        name = meta.long_name;
    } else if (meta.meta_data !== undefined && meta.meta_data.common_name !== undefined) {
        name = meta.meta_data.common_name;
    } else if (meta.common_name !== undefined) {
        name = meta.common_name;
    }

    return (
        <div className="bg-gray-300 p-3 rounded h-full inline-block">
            <DescriptionInnerDiv type={type} className="bg-white p-2 max-w-xs h-full text-xl flex flex-col">
                <ChartName type={type}>{name}</ChartName>
                {meta.sector && <span className="text-sm">{meta.sector}</span>}
                {meta.exchange && <span className="text-xs">{meta.exchange}</span>}
                {meta.country && <span className="text-xs">{meta.country}</span>}
                <div className="flex flex-row align-bottom py-2">
                    {meta.close && <span className="text-2xl pr-1 my-auto">{meta.close}</span>}
                    {meta.point_diff && <Change className="text-xs px-1 my-auto text-xl" value={meta.point_diff}>{meta.point_diff}</Change>}
                    {meta.percentage_diff && <Change className="text-xs px-1 my-auto text-xl" value={meta.percentage_diff}>{meta.percentage_diff}%</Change>}
                </div>
                <div>
                    <FullDescription description={description} />
                </div>
            </DescriptionInnerDiv>
        </div>
    );  
}

function FullDescription({ description }) {
    let d = "";
    let showMore = false;
    if (description !== undefined) {
        if (description.length > 300) {
            showMore = true;
            d = description.slice(0, 300) + '...';
        }
    }

    return (
        <p className="text-sm">{d}{showMore ? <button>Show more</button> : null}</p>
    )
}

// function showMore()

const DescriptionInnerDiv = styled.div.attrs(props => {
    let padding = '0.5rem';
    if (props.type == 'live') {
        padding = '1rem';
    } else if (props.type == 'main') {
        padding = '2rem';
    }

    return {
        padding
    }
})`padding: ${props => props.padding}`;

const ChartName = styled.div.attrs(props => {
    let fontSize = '12px';
    if (props.type == 'live') {
        fontSize = '16px';
    } else if (props.type == 'main') {
        fontSize = '36px';
    }

    return {
        fontSize: fontSize
    }
})`font-size: ${props => props.fontSize}`;

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