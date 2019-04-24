import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import mainReducer from './reducers/reducer';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

const store = createStore(mainReducer);

render(
	<Provider store={store}><App /></Provider>, 
	document.getElementById('root')
);
registerServiceWorker();
