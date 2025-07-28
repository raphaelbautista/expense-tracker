// components/CashBalanceCard.tsx
import styles from './Card.module.css'; // We'll use a generic card style

// Helper to format currency
const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
};

interface CashBalanceCardProps {
  balance: number;
  income: number;
  expense: number;
}

export default function CashBalanceCard({ balance, income, expense }: CashBalanceCardProps) {
  return (
    <section className={styles.card}>
      <h2>Cash Balance</h2>
      <p className={styles.balanceAmount}>{formatCurrency(balance)}</p>
      <p className={styles.balanceSubtext}>Your current available cash</p>
      <div className={styles.incomeExpenseSummary}>
        <div className={`${styles.summaryItem} ${styles.income}`}>
          <i className="fa-solid fa-circle-arrow-up"></i>
          <div>
            <span>Income</span>
            <strong>{formatCurrency(income)}</strong>
          </div>
        </div>
        <div className={`${styles.summaryItem} ${styles.expense}`}>
          <i className="fa-solid fa-circle-arrow-down"></i>
          <div>
            <span>Expenses</span>
            <strong>{formatCurrency(expense)}</strong>
          </div>
        </div>
      </div>
    </section>
  );
}