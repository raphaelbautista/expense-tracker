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

const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } };
const itemVariants = { hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } };

export default function HomePage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'income' | 'expense'>('expense');
  const [error, setError] = useState<string | null>(null);

  // Fetch initial data from API
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        console.log('🔄 Fetching transactions...');
        const res = await fetch('/api/transactions');
        
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        
        const data = await res.json();
        console.log('✅ Transactions fetched:', data.length, 'items');
        setTransactions(data);
        setError(null);
      } catch (error) {
        console.error('❌ Failed to fetch transactions:', error);
        setError('Failed to load transactions. Please check your database connection.');
      } finally {
        setIsLoading(false);
      }
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

    try {
      console.log('💾 Adding transaction:', newTransaction);
      const response = await fetch('/api/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTransaction),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const createdTransaction = await response.json();
      console.log('✅ Transaction added:', createdTransaction.id);
      setTransactions(prev => [createdTransaction, ...prev]);
      setError(null);
    } catch (error) {
      console.error('❌ Failed to add transaction:', error);
      alert('Failed to add transaction. Please check your database connection.');
    }
  };

  const handleDeleteTransaction = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      try {
        console.log('🗑️ Deleting transaction:', id);
        const response = await fetch(`/api/transactions/${id}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        console.log('✅ Transaction deleted:', id);
        setTransactions(prev => prev.filter(t => t.id !== id));
        setError(null);
      } catch (error) {
        console.error('❌ Failed to delete transaction:', error);
        alert('Failed to delete transaction. Please check your database connection.');
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

  if (isLoading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontSize: '1.2rem'
      }}>
        🔄 Loading your financial data...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ 
        padding: '2rem',
        textAlign: 'center'
      }}>
        <div style={{ 
          background: '#FEE', 
          color: '#C33', 
          padding: '1rem', 
          borderRadius: '8px',
          marginBottom: '1rem'
        }}>
          ❌ {error}
        </div>
        <button 
          onClick={() => window.location.reload()} 
          style={{
            padding: '0.75rem 1.5rem',
            background: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer'
          }}
        >
          🔄 Retry
        </button>
      </div>
    );
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