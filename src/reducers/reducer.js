import { SELECTED_SYMBOL } from '../actions/actions';

const initialState = {
  'selectedSymbol': {}
}

const mainReducer = (state = initialState, action) => {
	switch (action.type) {
		case SELECTED_SYMBOL:
			return Object.assign({}, state, {
		        selectedSymbol: action.payload
		    })
		default:
			return state;
	}
}

export default mainReducer;