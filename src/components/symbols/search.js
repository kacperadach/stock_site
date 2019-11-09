'use es6';

import React, { useState, useEffect } from 'react';
import socket from '../../api/socket';
import styled from 'styled-components';


function Search() {

    const [searchTerm, setSearchTerm] = useState('');
    const [symbols, setSymbols] = useState([]);

    useEffect(() => {
        if (searchTerm === '') {
            setSymbols([]);
            return;
        }

        socket.emit('symbols', searchTerm);
        socket.on('symbols', (data) =>{
            if (searchTerm === data['term']) {
                setSymbols(data['results']);
            }
        }); 
    }, [searchTerm]);

    return (
        <div className="container px-4">
            <input autoComplete="off" 
                    list="symbols" 
                    id="symbols-input" 
                    name="symbols-input" 
                    placeholder="Search..."
                    onChange={(event) => setSearchTerm(event.target.value)}
                    className="block bg-gray-200 ml-20 p-2 border-gray-300 border w-full" />
            {symbols.length !== 0 && <SearchResults symbols={symbols} />}
        </div>
    );
}

function SearchResults({ symbols }) {

    return (
        <div className="ml-20 px-2 border-gray-300 border rounded-b-lg fixed z-10 bg-gray-100" id="symbol-dropdown">
            <ul>
                {symbols.map((symbol, num) => 
                    {return <li key={num} className="border-b-2 p-2"><a href={`/chart/${symbol.uid}`}>{getSymbolString(symbol)}</a></li>}
                )}
            </ul>
        </div>
    );
}

// const StyledSearchResults = styled(SearchResults).attrs(props => {
//     let className = `${props.className}`;
//     console.log(props);
//     if (props.symbols.length === 0) {
//         className = `${className} hidden`;
//     }
//     return { className };
// })``;


function getSymbolString(symbol) {
    return symbol.symbol + ' - ' + symbol.long_name + ' - ' + symbol.exchange + ' - ' + symbol.country;
}

export default Search;