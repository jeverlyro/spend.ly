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
  const processTransactionData = () => {
    const days = [
      ...new Set(transactions.map((t) => t.date.split(" ")[0])),
    ].sort((a, b) => parseInt(a) - parseInt(b));

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
    interaction: {
      mode: "index",
      intersect: false,
    },
    plugins: {
      legend: {
        position: "top",
        align: "end",
        labels: {
          usePointStyle: true,
          pointStyle: "rectRounded",
          boxWidth: 10,
          boxHeight: 10,
          padding: 15,
          font: {
            family: "var(--font-geist-sans)",
            size: 12,
            weight: "500",
          },
        },
      },
      tooltip: {
        backgroundColor: "rgba(255, 255, 255, 0.95)",
        titleColor: "#334155",
        bodyColor: "#334155",
        titleFont: {
          family: "var(--font-geist-sans)",
          size: 14,
          weight: "600",
        },
        bodyFont: {
          family: "var(--font-geist-sans)",
          size: 13,
        },
        padding: 14,
        boxPadding: 8,
        cornerRadius: 10,
        borderWidth: 1,
        borderColor: "rgba(226, 232, 240, 0.8)",
        boxWidth: 10,
        boxHeight: 10,
        usePointStyle: true,
        callbacks: {
          labelPointStyle: (context) => {
            const dataset = context.dataset;
            return {
              pointStyle: "rectRounded",
              rotation: 0,
            };
          },
          title: (tooltipItems) => {
            return `Tanggal ${tooltipItems[0].label}`;
          },
          label: (context) => {
            const label = context.dataset.label || "";
            const formattedValue = new Intl.NumberFormat("id-ID", {
              style: "currency",
              currency: "IDR",
              minimumFractionDigits: 0,
              maximumFractionDigits: 0,
            }).format(context.raw);
            return `${label}: ${formattedValue}`;
          },
          labelTextColor: (context) => {
            return context.dataset.borderColor;
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
        border: {
          display: false,
        },
        ticks: {
          font: {
            family: "var(--font-geist-sans)",
            size: 11,
            weight: "500",
          },
          padding: 8,
          color: "#64748b",
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          color: "rgba(241, 245, 249, 0.8)",
          drawBorder: false,
        },
        border: {
          display: false,
          dash: [4, 4],
        },
        ticks: {
          font: {
            family: "var(--font-geist-sans)",
            size: 11,
          },
          padding: 10,
          color: "#64748b",
          callback: (value) => {
            return new Intl.NumberFormat("id-ID", {
              style: "currency",
              currency: "IDR",
              minimumFractionDigits: 0,
              maximumFractionDigits: 0,
            }).format(value);
          },
          maxTicksLimit: 5,
        },
      },
    },
    animations: {
      y: {
        duration: 2000,
        delay: (context) => context.dataIndex * 100,
      },
    },
    layout: {
      padding: {
        top: 10,
        bottom: 10,
      },
    },
  };

  const data = {
    labels: days,
    datasets: [
      {
        label: "Pendapatan",
        data: incomeData,
        backgroundColor: "rgba(16, 185, 129, 0.7)",
        borderColor: "rgba(16, 185, 129, 1)",
        borderWidth: 2,
        borderRadius: 6,
        barThickness: 12,
        hoverBackgroundColor: "rgba(16, 185, 129, 0.9)",
        maxBarThickness: 18,
      },
      {
        label: "Pengeluaran",
        data: expenseData,
        backgroundColor: "rgba(239, 68, 68, 0.7)",
        borderColor: "rgba(239, 68, 68, 1)",
        borderWidth: 2,
        borderRadius: 6,
        barThickness: 12,
        hoverBackgroundColor: "rgba(239, 68, 68, 0.9)",
        maxBarThickness: 18,
      },
    ],
  };

  return (
    <div
      style={{
        width: "100%",
        height: "320px",
        marginBottom: "2rem",
        padding: "10px",
        borderRadius: "10px",
        background:
          "linear-gradient(180deg, rgba(248, 250, 252, 0.5) 0%, rgba(255, 255, 255, 0) 100%)",
      }}
    >
      <Bar options={options} data={data} />
    </div>
  );
}
