import React from "react";
import PropTypes from "prop-types";
import { connect } from 'react-redux'

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

import Button from 'react-bootstrap/Button';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';

import { getQuote } from '../../api/apiClient';

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

class CandleStickChartComponent extends React.Component {
	constructor(props) {
		super(props);
		this.state = {'changed': false, 'showMacd': false, 'timeInterval': '1d'}
		this.data = {'1d': this.formatData(this.props.interval.data), '1m': [], '1w': []};
		this.handleDownloadMore = this.handleDownloadMore.bind(this);
	}

	formatData(data) {
		console.log('here');
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

	handleDownloadMore(startDate, endDate) {
		const metaData = this.props.interval.meta_data;
		const end = endDate.getFullYear() + '-' + (endDate.getMonth() + 1) + '-' + endDate.getDate();
		const start = startDate.getFullYear() + '-' + (startDate.getMonth() + 1) + '-' + startDate.getDate();
		const instrumentType = this.props.selectedSymbol.instrument_type;
		const exchange = metaData.exchange;
		const symbol = metaData.symbol;
		const timeInterval = this.state.timeInterval;

		getQuote({instrumentType, exchange, symbol, start, end, timeInterval}).then(response => {
			const newData = this.formatData(response.data);
			this.combineInterval(newData, metaData.time_interval);
		});
	}

	combineInterval(newData, timeInterval) {
		console.log(this.data[timeInterval]);
		if (newData.length === 0) {
			return;
		} else if (this.data[timeInterval].length === 0) {
			console.log('changing');
			this.changeData(newData, timeInterval);
		}
		console.log(timeInterval);

		const first = newData[0].date;
		const last = newData[newData.length - 1].date;

		console.log('debug');
		if (this.data[timeInterval][0].date > last) {
			const additionalData = this.formatData(newData);
			this.changeData(additionalData.concat(this.data[timeInterval]), timeInterval);
		} else if (this.data[timeInterval][0].date == last) {
			const additionalData = this.formatData(newData.slice(0, newData.length - 2));
			this.changeData(additionalData.concat(this.data[timeInterval]), timeInterval)
		} else {
			// go backwards for efficiency
			for (let i = -2; i > -1 * newData.length; i--) {
				const d = newData[newData.length + i];
				if (this.data[timeInterval][0].date > d.date) {
					const additionalData = this.formatData(newData.slice(0, newData.length + i));
					this.changeData(additionalData.concat(this.data[timeInterval]), timeInterval)
					break;
				}
			}
		}
	}

	changeData(newDataInterval, timeInterval) {
		console.log(timeInterval);
		this.data[timeInterval] = newDataInterval;
		const oldVal = this.state.changed || false;
		this.setState({'changed': !oldVal});
		console.log('data changed');
	}

	handleButtonClick(option) {
		const key = option.toString();
		const newValue = !this.state[key];
		const newState = {};
		newState[key] = newValue;
		this.setState(newState);
	}

	renderTimeIntervalDropdown() {
		return (
			<DropdownButton id="dropdown-item-button" title="Time Interval">
			  <Dropdown.Item as="button" onClick={() => this.handleTimeIntervalChange('1w')}>1w</Dropdown.Item>
			  <Dropdown.Item as="button" onClick={() => this.handleTimeIntervalChange('1d')}>1d</Dropdown.Item>
			  <Dropdown.Item as="button" onClick={() => this.handleTimeIntervalChange('15m')}>15m</Dropdown.Item>
			</DropdownButton>
		);
	}

	handleTimeIntervalChange(option) {
		if (option === this.state.timeInterval) {
			return;
		}

		const instrumentType = this.props.selectedSymbol.instrument_type;
		const exchange = this.props.interval.meta_data.exchange;
		const symbol = this.props.interval.meta_data.symbol;
		const timeInterval = option;


		getQuote({instrumentType, exchange, symbol, timeInterval}).then(response => {
			const newData = this.formatData(response.data);
			this.combineInterval(newData, response.meta_data.time_interval);
			console.log(this.data[timeInterval]);
			this.setState({'timeInterval': option});
		});
	}
	

	render() {
		const { interval, selectedSymbol } = this.props;
		const data = this.data[this.state.timeInterval];
		if (data.length === 0) {
			return <div>No Data Available</div>
		}

		const metaData = interval.meta_data;
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

		let macdChart = null;
		if (this.state.showMacd) {
			macdChart = (<Chart id={2} height={150}
					yExtents={macdCalculator.accessor()}
					origin={(w, h) => [0, h - 400]} padding={{ top: 10, bottom: 10 }}>

					<XAxis axisAt="bottom" orient="bottom" ticks={0} />
					<YAxis axisAt="right" orient="right" ticks={2} />

					<MouseCoordinateX
						at="bottom"
						orient="bottom"
						displayFormat={timeFormat("%Y-%m-%d")}
						rectRadius={5}
						{...mouseEdgeAppearance}
					/>
					<MouseCoordinateY
						at="right"
						orient="right"
						displayFormat={format(".2f")}
						{...mouseEdgeAppearance}
					/>

					<MACDSeries yAccessor={d => d.macd}
						{...macdAppearance} />
					
				</Chart>);
		}
		

		return (
			<div>
			{this.renderTimeIntervalDropdown()}
			<Button variant="secondary" onClick={() => this.handleButtonClick('showMacd')}>MACD</Button>
			<ChartCanvas height={500}
					ratio={1}
					width={1114}
					clamp={false}
					margin={{ left: 70, right: 70, top: 20, bottom: 30 }}
					seriesName={selectedSymbol.symbol}
					data={data}
					type="hybrid"
					yExtents={yExtents}
					xAccessor={xAccessor}
					xScale={scaleTime()}
					xExtents={xExtents}
					xScaleProvider={discontinuousTimeScaleProvider}
					onLoadMore={this.handleDownloadMore}>

				<Chart 
					id={1} 
					yExtents={d => [d.high, d.low]} 
					height={400}>
					<XAxis axisAt="bottom" orient="bottom" ticks={10} {...xGrid} />
					<YAxis axisAt="left" orient="left" ticks={10} {...yGrid} />
					<CandlestickSeries width={timeIntervalBarWidth(utcDay)}/>
				</Chart>

				{macdChart}

				<CrossHairCursor />
			</ChartCanvas>
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		selectedSymbol: state.selectedSymbol
	}
}

const mapDispatchToProps = (dispatch) => {
	return {}
}
const CandleStickChart = connect(mapStateToProps, mapDispatchToProps)(CandleStickChartComponent);

export default CandleStickChart