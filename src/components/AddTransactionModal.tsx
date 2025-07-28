// components/AddTransactionModal.tsx
"use client";

import { useState, FormEvent, useEffect } from 'react';
import { Transaction } from '@/types';
import styles from './AddTransactionModal.module.css';
import { motion, AnimatePresence } from 'framer-motion'; // <-- IMPORT

type TransactionData = Omit<Transaction, 'id' | 'date'>;

interface AddTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddTransaction: (transaction: TransactionData) => void;
  transactionType: 'income' | 'expense';
}

const expenseCategories = ['Housing', 'Groceries', 'Dining Out', 'Entertainment', 'Transport', 'Utilities'];
const incomeCategories = ['Salary'];


export default function AddTransactionModal({ isOpen, onClose, onAddTransaction, transactionType }: AddTransactionModalProps) {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState(transactionType === 'expense' ? expenseCategories[0] : incomeCategories[0]);

  useEffect(() => {
    if (isOpen) {
      setDescription('');
      setAmount('');
      setCategory(transactionType === 'expense' ? expenseCategories[0] : incomeCategories[0]);
    }
  }, [transactionType, isOpen]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (
      !description ||
      !amount ||
      isNaN(parseFloat(amount)) ||
      parseFloat(amount) <= 0
    ) {
      alert('Please fill in all fields with valid values.');
      return;
    }
    onAddTransaction({
      description,
      amount: parseFloat(amount),
      category: category as Transaction['category'],
      type: transactionType,
    });
    onClose();
  };
  const categories = transactionType === 'expense' ? expenseCategories : incomeCategories;

  return (
    // --- WRAP THE MODAL LOGIC IN AnimatePresence ---
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className={styles.overlay}
          onClick={onClose}
        >
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className={styles.modal}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.header}>
              <h2>Add New {transactionType === 'income' ? 'Income' : 'Expense'}</h2>
              <button onClick={onClose} className={styles.closeButton}>&times;</button>
            </div>
            <form onSubmit={handleSubmit} className={styles.form}>
              {/* Form content remains the same */}
              <div className={styles.formGroup}>
                <label htmlFor="description">Description</label>
                <input type="text" id="description" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="e.g., Coffee with friends" required />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="amount">Amount</label>
                <input type="number" id="amount" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0.00" step="0.01" min="0.01" required />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="category">Category</label>
                <select id="category" value={category} onChange={(e) => setCategory(e.target.value)}>
                  {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
              </div>
              <button type="submit" className={styles.submitButton}>
                Add Transaction
              </button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}