"use client";

import { useRef, useEffect } from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function AccountsChart({ accounts }) {
  const positiveAccounts = accounts.filter((account) => account.balance > 0);
  const totalBalance = positiveAccounts.reduce(
    (sum, account) => sum + account.balance,
    0
  );

  const chartRef = useRef(null);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        align: "center",
        labels: {
          usePointStyle: true,
          pointStyle: "rectRounded",
          boxWidth: 10,
          boxHeight: 10,
          padding: 15,
          font: {
            family: "var(--font-geist-sans)",
            size: 11,
            weight: "500",
          },
          color: "#334155",
        },
      },
      tooltip: {
        backgroundColor: "rgba(255, 255, 255, 0.95)",
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
        cornerRadius: 8,
        borderWidth: 1,
        borderColor: "rgba(226, 232, 240, 0.8)",
        usePointStyle: true,
        callbacks: {
          title: (tooltipItems) => {
            return tooltipItems[0].label;
          },
          label: (context) => {
            const value = context.raw || 0;
            const percentage = ((value / totalBalance) * 100).toFixed(1);
            return [`$${value.toFixed(2)}`, `${percentage}% dari total`];
          },
        },
      },
    },
    cutout: "65%",
    radius: "90%",
    animation: {
      animateScale: true,
      animateRotate: true,
      duration: 1000,
      easing: "easeOutQuart",
    },
    layout: {
      padding: {
        top: 5,
        bottom: 5,
        left: 5,
        right: 5,
      },
    },
    elements: {
      arc: {
        borderWidth: 2,
        borderColor: "#fff",
        hoverBorderWidth: 3,
      },
    },
  };

  const data = {
    labels: positiveAccounts.map((account) => account.name),
    datasets: [
      {
        data: positiveAccounts.map((account) => account.balance),
        backgroundColor: positiveAccounts.map((account) => {
          const color = account.color;
          return color.replace(")", ", 0.85)").replace("rgb", "rgba");
        }),
        borderColor: positiveAccounts.map((account) => account.color),
        borderWidth: 2,
        hoverOffset: 8,
        hoverBorderColor: "#ffffff",
      },
    ],
  };

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        maxWidth: "550px",
        height: "300px",
        margin: "0 auto 1.5rem auto",
        padding: "10px",
        borderRadius: "10px",
        background:
          "linear-gradient(180deg, rgba(248, 250, 252, 0.5) 0%, rgba(255, 255, 255, 0) 100%)",
      }}
    >
      <h3
        style={{
          textAlign: "center",
          marginBottom: "0.5rem",
          fontSize: "0.95rem",
          fontWeight: "600",
          color: "#334155",
        }}
      >
        Distribusi Aset
      </h3>

      <div style={{ position: "relative", height: "calc(100% - 25px)" }}>
        <Doughnut ref={chartRef} data={data} options={options} />

        {positiveAccounts.length > 0 && (
          <div
            style={{
              position: "absolute",
              top: "40%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              textAlign: "center",
            }}
          >
            <div
              style={{
                fontSize: "11px",
                fontWeight: "500",
                color: "#64748b",
                marginBottom: "2px",
              }}
            >
              TOTAL
            </div>
            <div
              style={{
                fontSize: "18px",
                fontWeight: "700",
                color: "#0f172a",
              }}
            >
              ${totalBalance.toFixed(2)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
