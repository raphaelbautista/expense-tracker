// components/ThemeToggle.tsx
"use client";

import { useTheme } from "@/context/ThemeContext";
import styles from "./ThemeToggle.module.css";
import { motion } from "framer-motion";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button className={styles.toggleButton} onClick={toggleTheme} aria-label="Toggle theme">
      {theme === 'light' ? (
        <motion.i key="sun" className="fa-solid fa-sun" initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 20, opacity: 0 }} />
      ) : (
        <motion.i key="moon" className="fa-solid fa-moon" initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 20, opacity: 0 }} />
      )}
    </button>
  );
}