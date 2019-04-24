export const SELECTED_SYMBOL = "SELECTED_SYMBOL";

export function setSelectedSymbol(symbol) {
	return { type: SELECTED_SYMBOL, payload: symbol};
}
