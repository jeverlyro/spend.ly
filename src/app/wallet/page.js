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
  FiShield,
  FiGrid,
} from "react-icons/fi";
import { IoIosWallet, IoMdTrendingUp } from "react-icons/io";
import { FaUser, FaRegChartBar, FaBitcoin } from "react-icons/fa";
import { FaHouse, FaPiggyBank } from "react-icons/fa6";
import { BsCreditCard2Front, BsBank2 } from "react-icons/bs";
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

    async function fetchAccounts(token) {
      try {
        const response = await fetch("http://localhost:5000/api/accounts", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            errorData.message || `Failed to fetch accounts: ${response.status}`
          );
        }

        const data = await response.json();

        const accounts = data.accounts || [];
        return accounts.map((account, index) => {
          let icon;
          let color;

          switch (account.type) {
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
            case "Investasi":
              icon = <FiBarChart2 size={20} />;
              color = "#8b5cf6";
              break;
            case "Lainnya":
              icon = <FiDollarSign size={20} />;
              color = "#6b7280";
              break;
            default:
              icon = <FiDollarSign size={20} />;
              color = "#6b7280";
          }

          return {
            id: account._id || index + 1,
            name: account.name,
            type: account.type,
            balance: account.balance,
            icon,
            color,
          };
        });
      } catch (error) {
        console.error("Error fetching accounts:", error);
        throw error;
      }
    }

    if (!token) {
      router.push("/login");
    } else {
      verifyAuth();
    }
  }, [router]);

  const totalBalance = accounts.reduce(
    (sum, account) => sum + (parseFloat(account.balance) || 0),
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
          <div className={`${styles.summaryCard} ${styles.glassEffect}`}>
            <div className={styles.summaryContent}>
              <div className={styles.summaryHeader}>
                <div className={styles.summaryTitle}>
                  <h3>Total Saldo</h3>
                  <span className={styles.summarySubtitle}>Semua Rekening</span>
                </div>
                <div className={`${styles.summaryIcon} ${styles.primaryIcon}`}>
                  <IoIosWallet size={24} />
                </div>
              </div>

              <div className={styles.balanceSection}>
                <div className={styles.balanceWrapper}>
                  <p
                    className={`${styles.balanceAmount} ${styles.animatedValue}`}
                  >
                    <span className={styles.currencySymbol}></span>
                    {Math.abs(totalBalance).toLocaleString("id-ID")}
                  </p>
                </div>

                <div className={styles.balanceInfo}>
                  <div className={styles.statItem}>
                    <FaRegChartBar size={16} />
                    <span>{accounts.length} Rekening Aktif</span>
                  </div>
                </div>
              </div>

              <div className={styles.glowEffect} />
            </div>
          </div>
        </div>

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
              <div
                key={account.id}
                className={`${styles.transaction} ${styles.modernCard}`}
              >
                <div
                  className={styles.accountIcon}
                  style={{
                    background: `linear-gradient(135deg, ${account.color}, ${account.color}dd)`,
                  }}
                >
                  {account.icon}
                </div>
                <div className={styles.accountInfo}>
                  <h4>{account.name}</h4>
                  <div className={styles.accountMeta}>
                    <span className={styles.accountType}>{account.type}</span>
                    <FiChevronRight size={16} />
                  </div>
                </div>
                <div className={styles.accountBalance}>
                  <p
                    className={
                      account.balance >= 0
                        ? styles.positiveAmount
                        : styles.negativeAmount
                    }
                  >
                    {account.balance >= 0 ? "+" : "-"}Rp
                    {Math.abs(account.balance).toLocaleString("id-ID")}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className={styles.emptyStateContainer}>
              <p className={styles.emptyState}>Anda belum memiliki rekening</p>
              <p className={styles.emptyStateSubtext}>
                Tambahkan rekening pertama Anda dengan menekan tombol
                &quot;Tambah Rekening&quot;
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
        <AccountModal
          onClose={() => setShowModal(false)}
          onAdd={addAccount}
          accounts={accounts} // Tambahkan prop ini
        />
      )}

      <footer className={styles.footer}>
        <p>&copy; 2025 Spend.ly - Lacak pengeluaran Anda</p>
      </footer>
    </div>
  );
}

function AccountModal({ onClose, onAdd, accounts }) {
  const [name, setName] = useState("");
  const [type, setType] = useState("Giro");
  const [balance, setBalance] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const addAccountToBackend = async (accountData, token) => {
    try {
      const response = await fetch("http://localhost:5000/api/accounts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(accountData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error in addAccountToBackend:", error);
      throw error;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { icon, color } = getAccountTypeInfo(type);

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
              <span></span>
              <input
                id="balance"
                type="number"
                step="0.01"
                min="0"
                value={balance}
                onChange={(e) => {
                  const value = e.target.value;
                  // Hanya izinkan angka non-negatif
                  if (value === "" || parseFloat(value) >= 0) {
                    setBalance(value);
                  }
                }}
                placeholder="0"
                required
                className={styles.modalInput}
              />
            </div>
          </div>

          <button
            type="submit"
            className={styles.submitButton}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Menyimpan..." : "Tambah Rekening"}
          </button>
        </form>
      </div>
    </div>
  );
}

const getAccountTypeInfo = (type) => {
  switch (type) {
    case "Giro":
      return {
        icon: <BsBank2 size={20} />,
        color: "#6366f1", // Indigo
      };
    case "Tabungan":
      return {
        icon: <FaPiggyBank size={20} />,
        color: "#10b981", // Emerald
      };
    case "Kredit":
      return {
        icon: <BsCreditCard2Front size={20} />,
        color: "#f43f5e", // Rose
      };
    case "Investasi":
      return {
        icon: <IoMdTrendingUp size={20} />,
        color: "#8b5cf6", // Violet
      };
    default:
      return {
        icon: <FiGrid size={20} />,
        color: "#64748b", // Slate
      };
  }
};
