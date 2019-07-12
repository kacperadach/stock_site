import React, { Component } from 'react';
import './App.css';
import ChartComponent from './components/chart/chartComponent';
import Search from './components/symbols/search';
import Quote from './components/quote/quote';
import MainChart from './components/quote/mainChart';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

// class App extends Component {
//   render() {
//     return (
//     	<Router>
//     		<Search />
//     	</Router>
        
//     );
//   }
// }

function App() {
	return (
    	<Router>
			<div className="font-sans font-semibold bg-white">
    			<Search />
				<Route path="/chart/:id" component={MainChart} />
			</div>
    	</Router>
    );
}

export default App;

