// src/app/page.tsx
"use client";

import { useState, useMemo, useEffect } from 'react';
import { Transaction } from '@/types';
import styles from './page.module.css';
import { motion } from 'framer-motion';

import Header from '@/components/Header';
import CashBalanceCard from '@/components/CashBalanceCard';
import RecentTransactionsCard from '@/components/RecentTransactionsCard';
import AddTransactionModal from '@/components/AddTransactionModal';
import EditTransactionModal from '@/components/EditTransactionModal';
import SpendingChartCard from '@/components/SpendingChartCard';

const containerVariants = { 
  hidden: { opacity: 0 }, 
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } } 
};

const itemVariants = { 
  hidden: { y: 20, opacity: 0 }, 
  visible: { y: 0, opacity: 1 } 
};

export default function HomePage() {
  // State management
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'income' | 'expense'>('expense');
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
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

  // Calculate totals
  const { totalIncome, totalExpense, cashBalance } = useMemo(() => {
    const income = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
    const expense = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
    return { totalIncome: income, totalExpense: expense, cashBalance: income - expense };
  }, [transactions]);

  // Add new transaction
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

  // Update existing transaction
  const handleUpdateTransaction = async (updatedTransaction: Transaction) => {
    try {
      console.log('✏️ Updating transaction:', updatedTransaction.id);
      const response = await fetch(`/api/transactions/${updatedTransaction.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedTransaction),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const updated = await response.json();
      console.log('✅ Transaction updated:', updated.id);
      
      setTransactions(prev => 
        prev.map(t => t.id === updated.id ? updated : t)
      );
      setError(null);
    } catch (error) {
      console.error('❌ Failed to update transaction:', error);
      alert('Failed to update transaction. Please check your database connection.');
    }
  };

  // Delete transaction
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

  // Modal handlers for adding transactions
  const handleOpenAddModal = (type: 'income' | 'expense') => {
    setModalType(type);
    setIsAddModalOpen(true);
  };

  const handleCloseAddModal = () => {
    setIsAddModalOpen(false);
  };

  // Modal handlers for editing transactions
  const handleOpenEditModal = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setEditingTransaction(null);
  };

  // Loading state
  if (isLoading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontSize: '1.2rem',
        background: 'var(--background-color)',
        color: 'var(--text-primary)'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔄</div>
          <div>Loading your financial data...</div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div style={{ 
        padding: '2rem',
        textAlign: 'center',
        background: 'var(--background-color)',
        color: 'var(--text-primary)',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ 
            background: 'var(--card-background)', 
            padding: '2rem', 
            borderRadius: '12px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
            maxWidth: '400px',
            width: '100%'
          }}
        >
          <div style={{ 
            background: '#FEE2E2', 
            color: '#DC2626', 
            padding: '1rem', 
            borderRadius: '8px',
            marginBottom: '1.5rem',
            fontSize: '1.1rem'
          }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>❌</div>
            {error}
          </div>
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => window.location.reload()} 
            style={{
              padding: '0.75rem 1.5rem',
              background: 'var(--primary-color)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '1rem',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              margin: '0 auto'
            }}
          >
            <i className="fa-solid fa-arrow-rotate-right"></i>
            Retry Connection
          </motion.button>
        </motion.div>
      </div>
    );
  }

  // Main render
  return (
    <main className={styles.container}>
      {/* Header with action buttons */}
      <Header 
        onOpenAddIncome={() => handleOpenAddModal('income')} 
        onOpenAddExpense={() => handleOpenAddModal('expense')} 
      />

      {/* Dashboard grid */}
      <motion.div
        className={styles.dashboardGrid}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Cash Balance Card */}
        <motion.div variants={itemVariants} whileHover={{ y: -5, scale: 1.02 }}>
          <CashBalanceCard 
            balance={cashBalance} 
            income={totalIncome} 
            expense={totalExpense} 
          />
        </motion.div>

        {/* Spending Chart Card */}
        <motion.div variants={itemVariants} whileHover={{ y: -5, scale: 1.02 }}>
          <SpendingChartCard transactions={transactions} />
        </motion.div>

        {/* Recent Transactions Card */}
        <motion.div 
          variants={itemVariants} 
          className={styles.fullWidthCard} 
          whileHover={{ y: -5, scale: 1.01 }}
        >
          <RecentTransactionsCard 
            transactions={transactions} 
            onDelete={handleDeleteTransaction}
            onEdit={handleOpenEditModal}
          />
        </motion.div>
      </motion.div>

      {/* Add Transaction Modal */}
      <AddTransactionModal
        isOpen={isAddModalOpen}
        onClose={handleCloseAddModal}
        onAddTransaction={handleAddTransaction}
        transactionType={modalType}
      />

      {/* Edit Transaction Modal */}
      <EditTransactionModal
        isOpen={isEditModalOpen}
        onClose={handleCloseEditModal}
        onUpdateTransaction={handleUpdateTransaction}
        transaction={editingTransaction}
      />

      {/* Background shapes for visual appeal */}
      <div className="background-shapes">
        <div className="shape1"></div>
        <div className="shape2"></div>
      </div>
    </main>
  );
}