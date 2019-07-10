import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import ChartComponent from './components/chart/chartComponent';
import SymbolSearch from './components/symbols/symbolSearch';
import Quote from './components/quote/quote';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

class App extends Component {
  render() {
    return (
    	<Router>
    		<link
			  rel="stylesheet"
			  href="https://maxcdn.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css"
			  integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T"
			  crossOrigin="anonymous"
			/>
    		<SymbolSearch />
    		<Route path="/chart" component={Quote} />
    	</Router>
        
    );
  }
}

export default App;

