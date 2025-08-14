// src/components/AddTransactionModal.tsx
"use client";

import { useState, useEffect, FormEvent } from "react";
import { Transaction } from "@/types";
import styles from "./AddTransactionModal.module.css";
import { motion, AnimatePresence } from "framer-motion";

interface AddTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddTransaction: (data: Omit<Transaction, "id" | "date">) => Promise<void> | void;
  transactionType: "income" | "expense";
}

const expenseCategories = ["Housing", "Groceries", "Dining Out", "Entertainment", "Transport", "Utilities"];
const incomeCategories = ["Salary"];

export default function AddTransactionModal({
  isOpen,
  onClose,
  onAddTransaction,
  transactionType,
}: AddTransactionModalProps) {
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState<"income" | "expense">(transactionType);
  const [category, setCategory] = useState("");

  // reset form when opening or when the intended type changes
  useEffect(() => {
    if (isOpen) {
      setDescription("");
      setAmount("");
      setType(transactionType);
      setCategory(
        transactionType === "expense" ? expenseCategories[0] : incomeCategories[0]
      );
    }
  }, [isOpen, transactionType]);

  const categories = type === "expense" ? expenseCategories : incomeCategories;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const parsed = parseFloat(amount);
    if (!description || !amount || isNaN(parsed) || parsed <= 0) {
      alert("Please fill in all fields with valid values.");
      return;
    }

    const payload: Omit<Transaction, "id" | "date"> = {
      description,
      amount: parsed,
      category: category as Transaction["category"],
      type,
    };

    await onAddTransaction(payload);
    onClose();
  };

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
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className={styles.modal}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.header}>
              <h2>Add Transaction</h2>
              <button onClick={onClose} className={styles.closeButton} aria-label="Close">
                &times;
              </button>
            </div>

            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.formGroup}>
                <label htmlFor="add-description">Description</label>
                <input
                  id="add-description"
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="e.g., Coffee with friends"
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="add-amount">Amount</label>
                <input
                  id="add-amount"
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  step="0.01"
                  min="0.01"
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="add-type">Type</label>
                <select
                  id="add-type"
                  value={type}
                  onChange={(e) => {
                    const newType = e.target.value as "income" | "expense";
                    setType(newType);
                    setCategory(newType === "expense" ? expenseCategories[0] : incomeCategories[0]);
                  }}
                >
                  <option value="expense">Expense</option>
                  <option value="income">Income</option>
                </select>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="add-category">Category</label>
                <select
                  id="add-category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
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
