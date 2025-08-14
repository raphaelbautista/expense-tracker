// src/components/EditTransactionModal.tsx
"use client";

import { useState, FormEvent, useEffect } from 'react';
import { Transaction } from '@/types';
import styles from './AddTransactionModal.module.css'; // Reuse the same styles
import { motion, AnimatePresence } from 'framer-motion';

interface EditTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdateTransaction: (transaction: Transaction) => void;
  transaction: Transaction | null;
}

const expenseCategories = ['Housing', 'Groceries', 'Dining Out', 'Entertainment', 'Transport', 'Utilities'];
const incomeCategories = ['Salary'];

export default function EditTransactionModal({ 
  isOpen, 
  onClose, 
  onUpdateTransaction, 
  transaction 
}: EditTransactionModalProps) {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [type, setType] = useState<'income' | 'expense'>('expense');

  useEffect(() => {
    if (transaction && isOpen) {
      setDescription(transaction.description);
      setAmount(transaction.amount.toString());
      setCategory(transaction.category);
      setType(transaction.type);
    }
  }, [transaction, isOpen]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    
    if (
      !description ||
      !amount ||
      isNaN(parseFloat(amount)) ||
      parseFloat(amount) <= 0 ||
      !transaction
    ) {
      alert('Please fill in all fields with valid values.');
      return;
    }

    const updatedTransaction: Transaction = {
      ...transaction,
      description,
      amount: parseFloat(amount),
      category: category as Transaction['category'],
      type,
    };

    onUpdateTransaction(updatedTransaction);
    onClose();
  };

  const categories = type === 'expense' ? expenseCategories : incomeCategories;

  if (!transaction) return null;

  return (
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
              <h2>Edit Transaction</h2>
              <button onClick={onClose} className={styles.closeButton}>&times;</button>
            </div>
            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.formGroup}>
                <label htmlFor="edit-description">Description</label>
                <input 
                  type="text" 
                  id="edit-description" 
                  value={description} 
                  onChange={(e) => setDescription(e.target.value)} 
                  placeholder="e.g., Coffee with friends" 
                  required 
                />
              </div>
              
              <div className={styles.formGroup}>
                <label htmlFor="edit-amount">Amount</label>
                <input 
                  type="number" 
                  id="edit-amount" 
                  value={amount} 
                  onChange={(e) => setAmount(e.target.value)} 
                  placeholder="0.00" 
                  step="0.01" 
                  min="0.01" 
                  required 
                />
              </div>
              
              <div className={styles.formGroup}>
                <label htmlFor="edit-type">Type</label>
                <select 
                  id="edit-type" 
                  value={type} 
                  onChange={(e) => {
                    const newType = e.target.value as 'income' | 'expense';
                    setType(newType);
                    // Reset category when type changes
                    setCategory(newType === 'expense' ? expenseCategories[0] : incomeCategories[0]);
                  }}
                >
                  <option value="expense">Expense</option>
                  <option value="income">Income</option>
                </select>
              </div>
              
              <div className={styles.formGroup}>
                <label htmlFor="edit-category">Category</label>
                <select 
                  id="edit-category" 
                  value={category} 
                  onChange={(e) => setCategory(e.target.value)}
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              
              <button type="submit" className={styles.submitButton}>
                Update Transaction
              </button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}