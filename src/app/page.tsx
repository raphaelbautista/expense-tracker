// app/page.tsx
"use client";

import { useState, useMemo, useEffect } from 'react';
import { Transaction } from '@/types';
import styles from './page.module.css';
import { motion } from 'framer-motion';

import Header from '@/components/Header';
import CashBalanceCard from '@/components/CashBalanceCard';
import RecentTransactionsCard from '@/components/RecentTransactionsCard';
import AddTransactionModal from '@/components/AddTransactionModal';
import SpendingChartCard from '@/components/SpendingChartCard';

// ... (Your animation variants)
const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } };
const itemVariants = { hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } };

export default function HomePage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true); // To show a loading state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'income' | 'expense'>('expense');

  // --- Fetch initial data from our API ---
  useEffect(() => {
    const fetchTransactions = async () => {
      const res = await fetch('/api/transactions');
      const data = await res.json();
      setTransactions(data);
      setIsLoading(false);
    };
    fetchTransactions();
  }, []);

  const { totalIncome, totalExpense, cashBalance } = useMemo(() => {
      const income = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
      const expense = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
      return { totalIncome: income, totalExpense: expense, cashBalance: income - expense };
  }, [transactions]);

  const handleAddTransaction = async (data: Omit<Transaction, 'id' | 'date'>) => {
const newTransaction = {
  ...data,
  id: Date.now(),
  date: new Date().toISOString().split('T')[0], // YYYY-MM-DD format
};

    // --- POST to our API ---
    const response = await fetch('/api/transactions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newTransaction),
    });

    if (response.ok) {
      const createdTransaction = await response.json();
      setTransactions(prev => [createdTransaction, ...prev]);
    }
  };

  const handleDeleteTransaction = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      // --- DELETE request to our API ---
      const response = await fetch(`/api/transactions/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setTransactions(prev => prev.filter(t => t.id !== id));
      }
    }
  };

  const handleOpenModal = (type: 'income' | 'expense') => {
    setModalType(type);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  // You can add a proper loading spinner here later
  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <main className={styles.container}>
      <Header onOpenAddIncome={() => handleOpenModal('income')} onOpenAddExpense={() => handleOpenModal('expense')} />

      <motion.div
        className={styles.dashboardGrid}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants} whileHover={{ y: -5, scale: 1.02 }}>
          <CashBalanceCard balance={cashBalance} income={totalIncome} expense={totalExpense} />
        </motion.div>
        <motion.div variants={itemVariants} whileHover={{ y: -5, scale: 1.02 }}>
          <SpendingChartCard transactions={transactions} />
        </motion.div>
        <motion.div variants={itemVariants} className={styles.fullWidthCard} whileHover={{ y: -5, scale: 1.01 }}>
          <RecentTransactionsCard transactions={transactions} onDelete={handleDeleteTransaction} />
        </motion.div>
      </motion.div>

      <AddTransactionModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onAddTransaction={handleAddTransaction}
        transactionType={modalType}
      />
    </main>
  );
}