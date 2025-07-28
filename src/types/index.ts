// types/index.ts
export interface Transaction {
  id: number;
  description: string;
  amount: number;
  category: 'Salary' | 'Housing' | 'Groceries' | 'Dining Out' | 'Entertainment' | 'Transport' | 'Utilities';
  type: 'income' | 'expense';
  date: string;
}