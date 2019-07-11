// const BASE_URL = 'https://www.bullzone.club/';

const BASE_URL = '0.0.0.0:5000';


const SYMBOLS = 'symbols/'
const SYMBOLS_SEARCH = SYMBOLS + 'search/';
const QUOTE = 'quote/';


export function getQuote({instrumentType = null, exchange = null, symbol = null, start = null, end = null, timeInterval='1d'}) {
	let url = BASE_URL + QUOTE + instrumentType + '/' + exchange + '/' + symbol + '?time=' + timeInterval;
	if (end !== null) {
		url += '&end=' + end;
	}
	if (start !== null) {
		url += '&start=' + start;
	}
	return fetch(url).then(data => {return data.json()});
}

export function getSymbols(ticker) {
	const url = BASE_URL + SYMBOLS_SEARCH + ticker;
	return fetch(url).then(data => {return data.json()});
}

export function getSymbol(intrument_type, exchange, ticker) {
	const url = BASE_URL + SYMBOLS + intrument_type + '/' + exchange + '/' + ticker;
	return fetch(url).then(data => {return data.json()});
}
