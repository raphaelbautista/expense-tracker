// components/SpendingChart.tsx
"use client";

import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

// We need to register the components we're using from Chart.js
ChartJS.register(ArcElement, Tooltip, Legend);

interface SpendingChartProps {
  chartData: {
    labels: string[];
    datasets: {
      data: number[];
      backgroundColor: string[];
      borderColor: string[];
      borderWidth: number;
    }[];
  };
}

export default function SpendingChart({ chartData }: SpendingChartProps) {
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right' as const, // Position the legend to the right
      },
    },
    cutout: '60%', // This makes it a "doughnut" chart
  };

  return <Doughnut data={chartData} options={options} />;
}