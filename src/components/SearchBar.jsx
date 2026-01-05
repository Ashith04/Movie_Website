import React from 'react';
import { Search } from 'lucide-react';
import '../styles/SearchBar.css';

const SearchBar = ({ value, onChange, placeholder = "Search for movies..." }) => {
    return (
        <div className="search-bar-container">
            {/* search icon */}
            <Search className="search-icon" size={20} />
            {/* the input box */}
            <input
                type="text"
                className="search-input"
                value={value}
                // calling the function when typing
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                autoFocus
            />
        </div>
    );
};

export default SearchBar;
