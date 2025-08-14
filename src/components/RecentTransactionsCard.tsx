// src/components/RecentTransactionsCard.tsx
import { Transaction } from '@/types';
import styles from './Card.module.css';
import { motion, AnimatePresence } from 'framer-motion';
import Pagination from './Pagination';
import { useState } from 'react';
import React from 'react';

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
};

const getCategoryClassName = (category: string) => {
  switch(category) {
    case 'Housing':
    case 'Salary':
        return styles.categoryHousing;
    case 'Groceries':
        return styles.categoryGroceries;
    case 'Dining Out':
        return styles.categoryDining;
    case 'Entertainment':
        return styles.categoryEntertainment;
    default:
        return styles.categoryHousing;
  }
}

interface RecentTransactionsCardProps {
  transactions: Transaction[];
  onDelete: (id: number) => void;
  onEdit: (transaction: Transaction) => void;
}

const TRANSACTIONS_PER_PAGE = 10;

export default function RecentTransactionsCard({ transactions, onDelete, onEdit }: RecentTransactionsCardProps) {
  const [currentPage, setCurrentPage] = useState(1);

  // Calculate pagination
  const totalPages = Math.ceil(transactions.length / TRANSACTIONS_PER_PAGE);
  const startIndex = (currentPage - 1) * TRANSACTIONS_PER_PAGE;
  const endIndex = startIndex + TRANSACTIONS_PER_PAGE;
  const currentTransactions = transactions.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Reset to page 1 when transactions change significantly
React.useEffect(() => {
  if (currentPage > totalPages && totalPages > 0) {
    setCurrentPage(1);
  }
}, [transactions.length, currentPage, totalPages]);

  return (
    <section className={`${styles.card} ${styles.fullWidthCard}`}>
      <div className={styles.cardHeader}>
        <h2>Recent Transactions</h2>
        {transactions.length > 0 && (
          <span className={styles.transactionCount}>
            Showing {startIndex + 1}-{Math.min(endIndex, transactions.length)} of {transactions.length}
          </span>
        )}
      </div>
      
      <div>
        {transactions.length === 0 ? (
          <div className={styles.emptyState}>
            <p>No transactions yet.</p>
            <span>Add an income or expense to get started!</span>
          </div>
        ) : (
          <div>
            <div className={styles.transactionHeader}>
              <span>Description</span>
              <span>Amount</span>
              <span>Category</span>
              <span>Date</span>
              <span style={{textAlign: 'right'}}>Actions</span>
            </div>
            
            <AnimatePresence mode="popLayout">
              {currentTransactions.map((transaction) => (
                <motion.div
                  key={transaction.id}
                  layout
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -50, height: 0, marginBottom: 0, padding: 0, border: 0 }}
                  transition={{ duration: 0.3 }}
                  className={styles.transactionItem}
                >
                  <span>{transaction.description}</span>
                  <span className={`${styles.amount} ${transaction.type === 'income' ? styles.positive : ''}`}>
                    {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                  </span>
                  <span className={`${styles.category} ${getCategoryClassName(transaction.category)}`}>
                    {transaction.category}
                  </span>
                  <span>{transaction.date}</span>
                  <span style={{textAlign: 'right'}}>
                    <div className={styles.actionButtons}>
                      <motion.button 
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => onEdit(transaction)} 
                        className={styles.editBtn}
                        title="Edit transaction"
                      >
                        <i className="fa-solid fa-pen"></i>
                      </motion.button>
                      <motion.button 
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => onDelete(transaction.id)} 
                        className={styles.deleteBtn}
                        title="Delete transaction"
                      >
                        <i className="fa-solid fa-trash-can"></i>
                      </motion.button>
                    </div>
                  </span>
                </motion.div>
              ))}
            </AnimatePresence>

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        )}
      </div>
    </section>
  );
}