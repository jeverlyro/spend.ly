"use client";

import { useEffect, useRef } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Bar } from "react-chartjs-2";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function TransactionChart({ transactions, month }) {
  // Process transactions for the chart
  const processTransactionData = () => {
    // Extract just the day from each date (assuming format "15 Sept, 2023")
    const days = [
      ...new Set(transactions.map((t) => t.date.split(" ")[0])),
    ].sort((a, b) => parseInt(a) - parseInt(b));

    // Group and sum transactions by day
    const incomeData = Array(days.length).fill(0);
    const expenseData = Array(days.length).fill(0);

    transactions.forEach((transaction) => {
      const day = transaction.date.split(" ")[0];
      const dayIndex = days.indexOf(day);

      if (dayIndex !== -1) {
        if (transaction.amount > 0) {
          incomeData[dayIndex] += transaction.amount;
        } else {
          expenseData[dayIndex] += Math.abs(transaction.amount);
        }
      }
    });

    return { days, incomeData, expenseData };
  };

  const { days, incomeData, expenseData } = processTransactionData();

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        labels: {
          usePointStyle: true,
          boxWidth: 8,
          font: {
            family: "var(--font-geist-sans)",
            size: 12,
          },
        },
      },
      tooltip: {
        backgroundColor: "white",
        titleColor: "#334155",
        bodyColor: "#334155",
        titleFont: {
          family: "var(--font-geist-sans)",
          size: 13,
          weight: "600",
        },
        bodyFont: {
          family: "var(--font-geist-sans)",
          size: 12,
        },
        padding: 12,
        boxPadding: 6,
        borderWidth: 1,
        borderColor: "#e2e8f0",
        boxWidth: 8,
        boxHeight: 8,
        usePointStyle: true,
        callbacks: {
          labelPointStyle: () => ({
            pointStyle: "circle",
            rotation: 0,
          }),
          label: (context) => {
            return `$${context.raw.toFixed(2)}`;
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
          drawBorder: false,
        },
        ticks: {
          font: {
            family: "var(--font-geist-sans)",
            size: 11,
          },
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          color: "#f1f5f9",
        },
        border: {
          dash: [4, 4],
        },
        ticks: {
          font: {
            family: "var(--font-geist-sans)",
            size: 11,
          },
          callback: (value) => {
            return "$" + value;
          },
        },
      },
    },
  };

  const data = {
    labels: days,
    datasets: [
      {
        label: "Pendapatan",
        data: incomeData,
        backgroundColor: "rgba(16, 185, 129, 0.6)",
        borderColor: "rgba(16, 185, 129, 1)",
        borderWidth: 2,
        borderRadius: 4,
        barThickness: 8,
      },
      {
        label: "Pengeluaran",
        data: expenseData,
        backgroundColor: "rgba(239, 68, 68, 0.6)",
        borderColor: "rgba(239, 68, 68, 1)",
        borderWidth: 2,
        borderRadius: 4,
        barThickness: 8,
      },
    ],
  };

  return (
    <div style={{ width: "100%", height: "300px", marginBottom: "2rem" }}>
      <Bar options={options} data={data} />
    </div>
  );
}
