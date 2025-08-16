  // components/Header.tsx
  import styles from './Header.module.css';
  import ThemeToggle from './ThemeToggle';

  interface HeaderProps {
    onOpenAddExpense: () => void;
    onOpenAddIncome: () => void;
  }

  export default function Header({ onOpenAddExpense, onOpenAddIncome }: HeaderProps) {
    return (
      <header className={styles.header}>
        <div className={styles.logo}>
          <i className="fa-solid fa-wave-square"></i>
          <h1>Sharaph Money Tracker</h1>
        </div>
        <nav className={styles.nav}>
          <ThemeToggle />
          <button className={`${styles.btn} ${styles.btnSecondary}`} onClick={onOpenAddExpense}>
            <i className="fa-solid fa-circle-minus"></i> Add Expense
          </button>
          <button className={`${styles.btn} ${styles.btnPrimary}`} onClick={onOpenAddIncome}>
            <i className="fa-solid fa-circle-plus"></i> Add Income
          </button>
        </nav>
      </header>
    );
  }