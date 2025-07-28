// components/RecentTransactionsCard.tsx
import { Transaction } from '@/types';
import styles from './Card.module.css';
import { motion, AnimatePresence } from 'framer-motion'; // <-- IMPORT


const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
};

const getCategoryClassName = (category: string) => {
  // ...
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
}

export default function RecentTransactionsCard({ transactions, onDelete }: RecentTransactionsCardProps) {
  return (
    <section className={`${styles.card} ${styles.fullWidthCard}`}>
      <h2>Recent Transactions</h2>
      
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
            {/* --- WRAP THE LIST WITH AnimatePresence --- */}
            <AnimatePresence>
              {transactions.map((transaction) => (
                // --- CONVERT THE DIV TO motion.div AND ADD ANIMATION PROPS ---
                <motion.div
                  key={transaction.id}
                  layout // This helps animate reordering smoothly
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
                    <button onClick={() => onDelete(transaction.id)} className={styles.deleteBtn}>
                      <i className="fa-solid fa-trash-can"></i>
                    </button>
                  </span>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </section>
  );
}