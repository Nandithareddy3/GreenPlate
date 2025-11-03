import React from 'react';
import styles from './CategoryScroller.module.css';

const categories = [
  'All',
  'Bakery & Breads',
  'Fresh Produce',
  'Dairy & Eggs',
  'Cooked Meals',
  'Packaged Goods',
  'Desserts & Sweets',
  'Other'
];

const CategoryScroller = ({ selectedCategory, onSelectCategory }) => {
  return (
    <div className={styles.scrollerContainer}>
      {categories.map((category) => (
        <button
          key={category}
          className={`${styles.categoryChip} ${
            selectedCategory === category ? styles.active : ''
          }`}
          onClick={() => onSelectCategory(category)}
        >
          {category}
        </button>
      ))}
    </div>
  );
};

export default CategoryScroller;
