import React from 'react';
import { AiOutlineClose } from 'react-icons/ai';
import './SearchBar.css';

const SearchBar = ({ value, onChange, onClear }) => {
  return (
    <div className="search-bar-wrapper">
      <input
        type="text"
        placeholder="Search Notes..."
        className="search-bar"
        value={value}
        onChange={onChange}
      />
      {value && (
        <AiOutlineClose
          className="clear-search"
          onClick={onClear}
          aria-label="Clear search"
        />
      )}
    </div>
  );
};

export default SearchBar;
