import React, { Component } from 'react';
import './App.css';
import Home from './components/home/home';
import Search from './components/symbols/search';
import MainChart from './components/quote/mainChart';
import LiveFutures from './components/live/liveFutures';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

function App() {
	return (
    	<Router>
			<div className="font-sans font-semibold bg-white">
				<HomeAndSearch />
				<LiveFutures />
				<Route path="/chart/:id" component={MainChart} />
			</div>
    	</Router>
    );
}

export function HomeAndSearch() {
	return (
		<div className="inline-flex w-full mx-48">
			<Home />
			<Search />
		</div>
	);
}


export default App;

