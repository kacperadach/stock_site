import React, {useEffect, useState} from 'react';
import { format } from "d3-format";
import { timeFormat } from "d3-time-format";
import { scaleTime } from "d3-scale";
import { ChartCanvas, Chart } from "react-stockcharts";
import {
	ScatterSeries,
	SquareMarker,
	TriangleMarker,
	CircleMarker,
	LineSeries,
} from "react-stockcharts/lib/series";
import { XAxis, YAxis } from "react-stockcharts/lib/axes";
import {
	CrossHairCursor,
	MouseCoordinateX,
	MouseCoordinateY,
} from "react-stockcharts/lib/coordinates";

import { discontinuousTimeScaleProvider } from "react-stockcharts/lib/scale";
import {
	OHLCTooltip,
} from "react-stockcharts/lib/tooltip";
import { fitWidth } from "react-stockcharts/lib/helper";
import { last } from "react-stockcharts/lib/utils";


export default function LineChart({ data }) {
    console.log(data);
    if (data.length === 0) {
        return null;
    }

    const xAccessor = d => d.datetime_utc;
	const xExtents = [
		xAccessor(last(data)),
		xAccessor(data[0])
	];

	const yAccessor = d => d.requests_per_second;

	const yExtents = [
		yAccessor(last(data)) + 10,
		yAccessor(data[0]) - 10
    ];
    
    console.log('here');

    console.log(data[0]);

    return (
        <ChartCanvas ratio={1} width={1000} height={1000} seriesName="Stats"
            mouseMoveEvent={true} 
            data={data}
            type="hybrid"
            yExtents={yExtents}
            xAccessor={xAccessor}
            xScale={scaleTime()}
            xExtents={xExtents}
            xScaleProvider={discontinuousTimeScaleProvider}>
            <Chart id={1} yExtents={yExtents} height={400}>
                <XAxis axisAt="bottom" orient="bottom" ticks={10}  />
                <YAxis axisAt="left" orient="left" ticks={10} />
					
                    <LineSeries
                        yAccessor={yAccessor}
                        xAccessor={xAccessor}
						stroke="#ff7f0e"/>
                <MouseCoordinateX
						at="bottom"
						orient="bottom"
						displayFormat={timeFormat("%Y-%m-%d")} />
					<MouseCoordinateY
						at="right"
						orient="right"
						displayFormat={format(".2f")} />
            </Chart>
           
        </ChartCanvas>
    )
}
