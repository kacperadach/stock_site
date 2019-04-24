
import React from 'react';
import { connect } from 'react-redux'
import { render } from 'react-dom';
import { getQuote, getSymbol } from '../../api/apiClient';
import { BrowserRouter as Router, Route, Link, Redirect  } from "react-router-dom";
import { withRouter } from 'react-router-dom';
import { setSelectedSymbol } from '../../actions/actions';
import CandleStickChart from '../../components/chart/candleStickChart';

class QuoteComponent extends React.Component {

	constructor(props) {
		super(props);
		this.state = {'data': []};
		this.setStateFromPath();
	}

	componentDidUpdate(prevProps) {
		if (prevProps.location.pathname !== this.props.location.pathname) {
			this.setStateFromPath();
		}
	}

	setStateFromPath() {
		const pathParts = this.props.location.pathname.split('/');
		const instrumentType = pathParts[2];
		const exchange = pathParts[3];
		const symbol = pathParts[4];
		this.setState({
			'instrumentType': instrumentType,
			'exchange': exchange,
			'symbol': symbol
		});
		getQuote({instrumentType, exchange, symbol}).then(response => {
			this.setState({'data': response});
		});

		if (this.isObjectEmpty(this.props.selectedSymbol)) {
			getSymbol(instrumentType, exchange, symbol).then(response => {
				console.log(response);
				this.props.setSelectedSymbol(response);
			});
		}
	}

	isObjectEmpty(obj) {
		return Object.entries(obj).length === 0 && obj.constructor === Object;
	}



	render() {
		let chart = null;
		if (this.state.data.length !== 0) {
			chart = <div><CandleStickChart interval={this.state.data} showMacd={this.state.showMacd} /></div>
		}
		return (
			<div>
				<div>
					{Object.keys(this.props.selectedSymbol).map((key, num) => {
						return <p key={num}>{key}: {this.props.selectedSymbol[key]}</p>
					})}
				</div>
				{chart}
			</div>
		);
	}
}


const mapStateToProps = (state) => {
	console.log(state);
	return {
		selectedSymbol: state.selectedSymbol
	}
}

const mapDispatchToProps = (dispatch) => {
	return {
		setSelectedSymbol: symbol => {
			console.log('selected symbol');
			dispatch(setSelectedSymbol(symbol))
		}
	}
}
const Quote = connect(mapStateToProps, mapDispatchToProps)(QuoteComponent);

export default withRouter(Quote);
