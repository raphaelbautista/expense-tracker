// src/components/SearchAndFilter.tsx
"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import styles from './SearchAndFilter.module.css';

interface SearchAndFilterProps {
  searchTerm: string;
  onSearchChange: (search: string) => void;
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  selectedType: string;
  onTypeChange: (type: string) => void;
  dateRange: { start: string; end: string };
  onDateRangeChange: (range: { start: string; end: string }) => void;
}

const categories = ['All', 'Salary', 'Housing', 'Groceries', 'Dining Out', 'Entertainment', 'Transport', 'Utilities'];

export default function SearchAndFilter({
  searchTerm,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  selectedType,
  onTypeChange,
  dateRange,
  onDateRangeChange
}: SearchAndFilterProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleQuickDateRange = (range: string) => {
    const today = new Date();
    let start = new Date();
    
    switch (range) {
      case 'today':
        start = new Date(today);
        break;
      case 'week':
        start.setDate(today.getDate() - 7);
        break;
      case 'month':
        start.setMonth(today.getMonth() - 1);
        break;
      case 'quarter':
        start.setMonth(today.getMonth() - 3);
        break;
      case 'year':
        start.setFullYear(today.getFullYear() - 1);
        break;
      default:
        start = new Date('1970-01-01');
    }

    onDateRangeChange({
      start: start.toISOString().split('T')[0],
      end: today.toISOString().split('T')[0]
    });
  };

  return (
    <div className={styles.container}>
      <div className={styles.searchRow}>
        <div className={styles.searchBox}>
          <i className="fa-solid fa-magnifying-glass"></i>
          <input
            type="text"
            placeholder="Search transactions..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
        
        <motion.button
          className={styles.filterToggle}
          onClick={() => setIsExpanded(!isExpanded)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <i className={`fa-solid fa-filter ${isExpanded ? 'fa-flip' : ''}`}></i>
          Filters
        </motion.button>
      </div>

      <motion.div
        className={styles.filtersPanel}
        initial={false}
        animate={{
          height: isExpanded ? 'auto' : 0,
          opacity: isExpanded ? 1 : 0
        }}
        transition={{ duration: 0.3 }}
      >
        <div className={styles.filtersContent}>
          <div className={styles.filterGroup}>
            <label>Transaction Type</label>
            <select value={selectedType} onChange={(e) => onTypeChange(e.target.value)}>
              <option value="all">All Types</option>
              <option value="income">Income Only</option>
              <option value="expense">Expenses Only</option>
            </select>
          </div>

          <div className={styles.filterGroup}>
            <label>Category</label>
            <select value={selectedCategory} onChange={(e) => onCategoryChange(e.target.value)}>
              {categories.map(cat => (
                <option key={cat} value={cat === 'All' ? 'all' : cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.filterGroup}>
            <label>Quick Date Ranges</label>
            <div className={styles.quickDateButtons}>
              {[
                { label: 'Today', value: 'today' },
                { label: 'Last 7 days', value: 'week' },
                { label: 'Last 30 days', value: 'month' },
                { label: 'Last 3 months', value: 'quarter' },
                { label: 'All time', value: 'all' }
              ].map(({ label, value }) => (
                <motion.button
                  key={value}
                  className={styles.quickDateBtn}
                  onClick={() => handleQuickDateRange(value)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {label}
                </motion.button>
              ))}
            </div>
          </div>

          <div className={styles.filterGroup}>
            <label>Custom Date Range</label>
            <div className={styles.dateInputs}>
              <input
                type="date"
                value={dateRange.start}
                onChange={(e) => onDateRangeChange({ ...dateRange, start: e.target.value })}
              />
              <span>to</span>
              <input
                type="date"
                value={dateRange.end}
                onChange={(e) => onDateRangeChange({ ...dateRange, end: e.target.value })}
              />
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}