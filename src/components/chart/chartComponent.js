'use es6';

import React from 'react';
import { render } from 'react-dom';
import Chart from './chart';
import { getData } from "./utils"

import { TypeChooser } from "react-stockcharts/lib/helper";


class ChartComponent extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		if (this.props.data.length !== 0) {
			return (
				<TypeChooser>
					{type => <Chart type={type} data={this.props.data} />}
				</TypeChooser>
			)
		} else {
			return null;
		}
		
	}
}

export default ChartComponent;