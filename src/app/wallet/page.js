"use client";

import { useState, useEffect } from "react";
import styles from "../page.module.css";
import Dock from "@/components/dock/Dock";
import BlurText from "@/components/shinyText/BlurText";
import AccountsChart from "@/components/charts/AccountsChart";
import {
  FiPlus,
  FiCreditCard,
  FiDollarSign,
  FiBarChart2,
  FiX,
  FiCheck,
  FiChevronRight,
} from "react-icons/fi";
import { IoIosWallet } from "react-icons/io";
import { FaUser } from "react-icons/fa";
import { FaHouse } from "react-icons/fa6";
import { useRouter } from "next/navigation";

const items = [
  {
    icon: <FaHouse size={18} />,
    label: "Beranda",
    onClick: () => (window.location.href = "/dashboard"),
  },
  {
    icon: <IoIosWallet size={18} />,
    label: "Dompet",
    onClick: () => {},
  },
  {
    icon: <FaUser size={18} />,
    label: "Profil",
    onClick: () => (window.location.href = "/profile"),
  },
];

export default function WalletPage() {
  const [accounts, setAccounts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Check authentication with backend
  useEffect(() => {
    const token = localStorage.getItem("userToken");

    async function verifyAuth() {
      try {
        const response = await fetch("http://localhost:5000/api/auth/verify", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          // Token invalid, clear localStorage and redirect
          localStorage.removeItem("userToken");
          localStorage.removeItem("userName");
          localStorage.removeItem("userEmail");
          localStorage.removeItem("userPhoto");

          router.push("/login");
          return;
        }

        // User is authenticated
        setIsLoading(false);
      } catch (error) {
        console.error("Authentication error:", error);
        router.push("/login");
      }
    }

    if (!token) {
      router.push("/login");
    } else {
      verifyAuth();
    }
  }, [router]);

  const totalBalance = accounts.reduce(
    (sum, account) => sum + account.balance,
    0
  );

  const addAccount = (account) => {
    const newAccount = {
      id: accounts.length + 1,
      ...account,
    };

    setAccounts([...accounts, newAccount]);
    setShowModal(false);
  };

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}></div>
        <p>Memuat...</p>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <div className={styles.header}>
          <BlurText
            text="Dompet Anda"
            delay={150}
            animateBy="words"
            direction="top"
            className={styles.blurText}
          />
        </div>

        <div className={styles.summary}>
          <div className={styles.summaryItem} style={{ gridColumn: "1 / -1" }}>
            <h3>Total Saldo</h3>
            <p className={totalBalance >= 0 ? styles.balance : styles.expense}>
              Rp{Math.abs(totalBalance).toLocaleString("id-ID")}
            </p>
          </div>
        </div>

        {/* Chart Section */}
        <div className={styles.chartContainer}>
          {accounts.length > 0 ? (
            <AccountsChart accounts={accounts} />
          ) : (
            <p className={styles.emptyState}>
              Belum ada rekening untuk ditampilkan dalam grafik
            </p>
          )}
        </div>

        <div className={styles.actions}>
          <button
            className={styles.addButton}
            onClick={() => setShowModal(true)}
            style={{ gridColumn: "1 / -1" }}
          >
            <FiPlus size={18} />
            <span className={styles.addText}>Tambah Rekening</span>
          </button>
        </div>

        <div className={styles.transactions}>
          <h2>Rekening Anda</h2>

          {accounts.length > 0 ? (
            accounts.map((account) => (
              <div key={account.id} className={styles.transaction}>
                <div
                  className={styles.transactionIcon}
                  style={{
                    color: account.color,
                    background: `${account.color}15`,
                  }}
                >
                  {account.icon}
                </div>
                <div className={styles.transactionDetails}>
                  <h4>{account.name}</h4>
                  <p>{account.type}</p>
                </div>
                <p
                  className={`${styles.transactionAmount} ${
                    account.balance >= 0 ? styles.income : ""
                  }`}
                >
                  {account.balance >= 0 ? "+" : "-"}Rp
                  {Math.abs(account.balance).toLocaleString("id-ID")}
                </p>
              </div>
            ))
          ) : (
            <div className={styles.emptyStateContainer}>
              <p className={styles.emptyState}>Anda belum memiliki rekening</p>
              <p className={styles.emptyStateSubtext}>
                Tambahkan rekening pertama Anda dengan menekan tombol "Tambah
                Rekening"
              </p>
            </div>
          )}
        </div>
      </main>

      <div className={styles.dockContainer}>
        <Dock
          items={items}
          panelHeight={68}
          baseItemSize={50}
          magnification={70}
        />
      </div>

      {showModal && (
        <AccountModal onClose={() => setShowModal(false)} onAdd={addAccount} />
      )}

      <footer className={styles.footer}>
        <p>&copy; 2025 Spend.ly - Lacak pengeluaran Anda</p>
      </footer>
    </div>
  );
}

function AccountModal({ onClose, onAdd }) {
  const [name, setName] = useState("");
  const [type, setType] = useState("Giro");
  const [balance, setBalance] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    let icon;
    let color = "#0070f3";

    switch (type) {
      case "Giro":
        icon = <FiDollarSign size={20} />;
        color = "#0070f3";
        break;
      case "Tabungan":
        icon = <FiBarChart2 size={20} />;
        color = "#10b981";
        break;
      case "Kredit":
        icon = <FiCreditCard size={20} />;
        color = "#ef4444";
        break;
      default:
        icon = <FiDollarSign size={20} />;
    }

    onAdd({
      name,
      type,
      balance: parseFloat(balance),
      icon,
      color,
    });
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <button className={styles.closeButton} onClick={onClose}>
          <FiX size={24} />
        </button>

        <h2>Tambah Rekening</h2>

        <form onSubmit={handleSubmit}>
          <div className={styles.modalGroup}>
            <label htmlFor="name">Nama Rekening</label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="contoh: Rekening Utama"
              required
              className={styles.modalInput}
            />
          </div>

          <div className={styles.modalGroup}>
            <label htmlFor="type">Jenis Rekening</label>
            <select
              id="type"
              value={type}
              onChange={(e) => setType(e.target.value)}
              className={styles.modalSelect}
            >
              <option value="Giro">Giro</option>
              <option value="Tabungan">Tabungan</option>
              <option value="Kredit">Kredit</option>
              <option value="Investasi">Investasi</option>
              <option value="Lainnya">Lainnya</option>
            </select>
          </div>

          <div className={styles.modalGroup}>
            <label htmlFor="balance">Saldo Saat Ini</label>
            <div className={styles.amountInput}>
              <span>Rp</span>
              <input
                id="balance"
                type="number"
                step="0.01"
                value={balance}
                onChange={(e) => setBalance(e.target.value)}
                placeholder="0"
                required
                className={styles.modalInput}
              />
            </div>
          </div>

          <button type="submit" className={styles.submitButton}>
            <FiCheck size={21} />
            Tambah Rekening
          </button>
        </form>
      </div>
    </div>
  );
}
