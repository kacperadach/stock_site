import React, {useEffect, useState} from "react";
import socket from '../../api/socket';

import { format } from "d3-format";
import { timeFormat } from "d3-time-format";

import { ChartCanvas, Chart } from "react-stockcharts";
import {
	BarSeries,
	AreaSeries,
	CandlestickSeries,
	LineSeries,
	MACDSeries,
} from "react-stockcharts/lib/series";
import { XAxis, YAxis } from "react-stockcharts/lib/axes";
import {
	CrossHairCursor,
	EdgeIndicator,
	CurrentCoordinate,
	MouseCoordinateX,
	MouseCoordinateY,
} from "react-stockcharts/lib/coordinates";

import {
	OHLCTooltip,
	MovingAverageTooltip,
	MACDTooltip,
} from "react-stockcharts/lib/tooltip";

import { discontinuousTimeScaleProvider } from 'react-stockcharts/lib/scale';

import { ema, macd, sma } from "react-stockcharts/lib/indicator";

import { scaleTime } from "d3-scale";
import { utcDay } from "d3-time";
import { timeParse } from "d3-time-format";

import { fitWidth } from "react-stockcharts/lib/helper";
import { last, timeIntervalBarWidth } from "react-stockcharts/lib/utils";


const macdAppearance = {
	stroke: {
		macd: "#FF0000",
		signal: "#00F300",
	},
	fill: {
		divergence: "#4682B4"
	},
};

const mouseEdgeAppearance = {
	textFill: "#542605",
	stroke: "#05233B",
	strokeOpacity: 1,
	strokeWidth: 3,
	arrowWidth: 5,
	fill: "#BCDEFA",
};

const height = 600;
const width = 1115;

var margin = {left: 70, right: 70, top:20, bottom: 30};
var gridHeight = height - margin.top - margin.bottom;
var gridWidth = width - margin.left - margin.right;

var showGrid = true;
var yGrid = showGrid ? { 
    innerTickSize: -1 * gridWidth,
    tickStrokeDasharray: 'Solid',
    tickStrokeOpacity: 0.2,
    tickStrokeWidth: 1
} : {};
var xGrid = showGrid ? { 
    innerTickSize: -1 * gridHeight,
    tickStrokeDasharray: 'Solid',
    tickStrokeOpacity: 0.2,
    tickStrokeWidth: 1
} : {};

function CandleStickChart(props) {

	const { interval } = props;
	
	const data = interval.data;
	const meta_data = interval.meta_data;
	const uid = meta_data.uid;

	if (data.length === 0) {
		return <div>No Data Available</div>
	}

	const xAccessor = d => d.date;
	const xExtents = [
		xAccessor(last(data)),
		xAccessor(data[0])
	];

	const yAccessor = d => d.high;

	const yExtents = [
		yAccessor(last(data)) + 1000,
		yAccessor(data[0])
	];

	const macdCalculator = macd()
		.options({
			fast: 12,
			slow: 26,
			signal: 9,
		})
		.merge((d, c) => {d.macd = c;})
		.accessor(d => d.macd);
	
	return (
		<div className="mx-auto w-1/2 ml-20">
			<ChartCanvas height={500}
					ratio={1}
					width={1114}
					clamp={false}
					margin={{ left: 70, right: 70, top: 20, bottom: 30 }}
					seriesName={meta_data.symbol}
					data={data}
					type="hybrid"
					yExtents={yExtents}
					xAccessor={xAccessor}
					xScale={scaleTime()}
					xExtents={xExtents}
					xScaleProvider={discontinuousTimeScaleProvider}
					onLoadMore={(startDate, endDate) => handleDownloadMore(uid, startDate, endDate)}>

				<Chart 
					id={1} 
					yExtents={d => [d.high, d.low]} 
					height={400}>
					<XAxis axisAt="bottom" orient="bottom" ticks={10} {...xGrid} />
					<YAxis axisAt="left" orient="left" ticks={10} {...yGrid} />
					<CandlestickSeries width={timeIntervalBarWidth(utcDay)}/>
				</Chart>
				<CrossHairCursor />
			</ChartCanvas>
		</div>
	);
}

function handleDownloadMore(uid, startDate, endDate) {
	console.log(uid);
	const end = endDate.getFullYear() + '-' + (endDate.getMonth() + 1) + '-' + endDate.getDate();
	const start = startDate.getFullYear() + '-' + (startDate.getMonth() + 1) + '-' + startDate.getDate();
	socket.emit('chart', {'uid': uid, 'start': start, 'end': end});
}

// let macdChart = null;
// if (this.state.showMacd) {
// 	macdChart = (<Chart id={2} height={150}
// 			yExtents={macdCalculator.accessor()}
// 			origin={(w, h) => [0, h - 400]} padding={{ top: 10, bottom: 10 }}>

// 			<XAxis axisAt="bottom" orient="bottom" ticks={0} />
// 			<YAxis axisAt="right" orient="right" ticks={2} />

// 			<MouseCoordinateX
// 				at="bottom"
// 				orient="bottom"
// 				displayFormat={timeFormat("%Y-%m-%d")}
// 				rectRadius={5}
// 				{...mouseEdgeAppearance}
// 			/>
// 			<MouseCoordinateY
// 				at="right"
// 				orient="right"
// 				displayFormat={format(".2f")}
// 				{...mouseEdgeAppearance}
// 			/>

// 			<MACDSeries yAccessor={d => d.macd}
// 				{...macdAppearance} />
			
// 		</Chart>);
// }

export default CandleStickChart;
