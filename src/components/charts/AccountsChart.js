"use client";

import { useRef, useEffect } from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";

// Register ChartJS components
ChartJS.register(ArcElement, Tooltip, Legend);

export default function AccountsChart({ accounts }) {
  // Filter out accounts with negative balance for the pie chart
  const positiveAccounts = accounts.filter((account) => account.balance > 0);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "right",
        labels: {
          usePointStyle: true,
          boxWidth: 8,
          padding: 15,
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
        usePointStyle: true,
        callbacks: {
          label: (context) => {
            const label = context.label || "";
            const value = context.parsed || 0;
            return `${label}: $${value.toFixed(2)}`;
          },
        },
      },
    },
    cutout: "60%",
    animation: {
      animateScale: true,
    },
  };

  const data = {
    labels: positiveAccounts.map((account) => account.name),
    datasets: [
      {
        data: positiveAccounts.map((account) => account.balance),
        backgroundColor: positiveAccounts.map((account) => account.color),
        borderColor: positiveAccounts.map((account) => account.color),
        borderWidth: 1,
        hoverOffset: 8,
      },
    ],
  };

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "330px",
        marginBottom: "1.5rem",
      }}
    >
      <h3
        style={{
          textAlign: "center",
          marginBottom: "0.75rem",
          fontSize: "0.9rem",
          color: "#64748b",
        }}
      >
        Distribusi Aset
      </h3>
      <Pie data={data} options={options} />
    </div>
  );
}
