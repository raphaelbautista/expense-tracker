// components/SpendingChartCard.tsx
"use client";

import { useMemo } from 'react';
import { Transaction } from '@/types';
import SpendingChart from './SpendingChart';
import styles from './Card.module.css';

interface SpendingChartCardProps {
  transactions: Transaction[];
}

// Assign a consistent color to each category
const categoryColors: { [key: string]: string } = {
    'Housing': '#4A47E5',
    'Dining Out': '#E5478B',
    'Utilities': '#23A9E0',
    'Groceries': '#47E5A5',
    'Transport': '#E58B47',
    'Entertainment': '#9F47E5',
};

export default function SpendingChartCard({ transactions }: SpendingChartCardProps) {
  // useMemo ensures this calculation only runs when transactions change
  const chartData = useMemo(() => {
    const spendingByCategory: { [key: string]: number } = {};

    // Filter for expenses and sum amounts for each category
    transactions
      .filter(t => t.type === 'expense')
      .forEach(t => {
        spendingByCategory[t.category] = (spendingByCategory[t.category] || 0) + t.amount;
      });

    const labels = Object.keys(spendingByCategory);
    const data = Object.values(spendingByCategory);
    const backgroundColors = labels.map(label => categoryColors[label] || '#cccccc'); // Use gray for unknown categories

    return {
      labels,
      datasets: [
        {
          data,
          backgroundColor: backgroundColors,
          borderColor: ['#ffffff'],
          borderWidth: 2,
        },
      ],
    };
  }, [transactions]);

  const hasExpenses = chartData.datasets[0].data.length > 0;

  return (
    <section className={styles.card}>
      <h2>Spending by Category</h2>
      <p className={styles.balanceSubtext}>Your top spending categories this month.</p>
      <div className={styles.chartContainer}>
        {hasExpenses ? (
          <SpendingChart chartData={chartData} />
        ) : (
          <div className={styles.emptyChartState}>
              <span>Add an expense to see your spending breakdown.</span>
          </div>
        )}
      </div>
    </section>
  );
}