import React, { Component } from 'react';
import './App.css';
import Home from './components/home/home';
import Search from './components/symbols/search';
import MainChart from './components/quote/mainChart';
import LiveFutures from './components/live/liveFutures';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import Scraper from './components/scraper/scraper';

function App() {
	return (
		<div className="px-5 inline-block w-full">
			<Router>
				<div className="font-sans font-semibold bg-white m-auto">
					<HomeAndSearch />
					<LiveFutures />
					<Route path="/chart/:id" component={MainChart} />
					<Route path="/scraper" component={Scraper} />
				</div>
			</Router>
		</div>
    	
    );
}

export function HomeAndSearch() {
	return (
		<div className="inline-flex mx-48 w-1/2	">
			<Home />
			<Search />
		</div>
	);
}


export default App;

