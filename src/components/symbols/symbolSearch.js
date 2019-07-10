'use es6';

import React, { memo } from 'react';
import { connect } from 'react-redux'
import { render } from 'react-dom';
import { getSymbols } from '../../api/apiClient';
import { BrowserRouter as Router, Route, Link, Redirect  } from "react-router-dom";
import { setSelectedSymbol } from '../../actions/actions';

class SymbolSearchComponent extends React.Component {

	constructor(props) {
		super(props);
		console.log(props);
		this.state = {'symbols': [], 'selectedSymbol': false}
		this.handleChange = this.handleChange.bind(this);
		this.handleClick = this.handleClick.bind(this);
		this.handleFocus = this.handleFocus.bind(this);
	}

	handleChange(event) {
		this.setState({'selectedSymbol': false});
		getSymbols(event.target.value).then(response => {
			this.setState({'symbols': response})
		});
	}

	getSymbolString(symbol) {
		return symbol.symbol + ' - ' + symbol.long_name + ' - ' + symbol.exchange + ' - ' + symbol.country;
	}
	// shouldComponentUpdate(nextProps, nextState) {
	// 	return nextState.selectedSymbol;
	// }


	getLink(symbol) {
		return '/chart/' + symbol.instrument_type + '/' + symbol.exchange + '/' + symbol.symbol;
	}

	handleClick(event, symbol) {
		this.setState({'selectedSymbol': true});
		this.props.setSelectedSymbol(symbol);
	}

	handleFocus() {
		console.log('handleFocus');
		this.setState({'selectedSymbol': false});
	}

	render() {
		console.log(this.state.selectedSymbol);
		if (this.state.selectedSymbol) {
			return (
				<div>
					<label htmlFor="symbols-input">Enter a symbol:</label>
					<input autoComplete="off" list="symbols" id="symbols-input" name="symbols-input" onChange={this.handleChange} onFocus={this.handleFocus} />
				</div>
			);
		}

		return (
			<div>
				<label htmlFor="symbols-input">Enter a symbol:</label>
				<input autoComplete="off" list="symbols" id="symbols-input" name="symbols-input" onChange={this.handleChange} onFocus={this.handleFocus} />
				<ul>
					{this.state.symbols.map((symbol, num) => {return <li key={num}><Link onClick={(event) => this.handleClick(event, symbol)} to={this.getLink(symbol)}>{this.getSymbolString(symbol)}</Link></li>})}
				</ul>
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

const SymbolSearch = connect(mapStateToProps, mapDispatchToProps)(SymbolSearchComponent);

export default SymbolSearch;