import React from 'react';
import styles from './SearchBar.module.css';
import { BiSearch } from 'react-icons/bi';

const SearchBar = ({ onSearch }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    const searchTerm = e.target.elements.search.value;
    onSearch(searchTerm);
  };

  return (
    <form className={styles.searchForm} onSubmit={handleSubmit}>
      <input
        type="text"
        name="search"
        placeholder="Search for food..."
        className={styles.searchInput}
      />
      <button type="submit" className={styles.searchButton}>
        <BiSearch size={20} />
      </button>
    </form>
  );
};

export default SearchBar;