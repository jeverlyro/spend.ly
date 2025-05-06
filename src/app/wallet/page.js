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

        const accountsData = await fetchAccounts(token);
        setAccounts(accountsData);
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

        // Fungsi untuk menghasilkan warna berdasarkan nama wallet
        const generateColorFromName = (name) => {
          let hash = 0;
          for (let i = 0; i < name.length; i++) {
            hash = name.charCodeAt(i) + ((hash << 5) - hash);
          }

          let r = (hash & 0xff0000) >> 16;
          let g = (hash & 0x00ff00) >> 8;
          let b = hash & 0x0000ff;

          r = Math.min(Math.max(r, 50), 200);
          g = Math.min(Math.max(g, 50), 200);
          b = Math.min(Math.max(b, 50), 200);

          return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, "0")}`;
        };

        return accounts.map((account, index) => {
          let icon;
          // Gunakan warna berdasarkan nama
          const color = generateColorFromName(account.name);

          switch (account.type) {
            case "Giro":
              icon = <FiDollarSign size={20} />;
              break;
            case "Tabungan":
              icon = <FiBarChart2 size={20} />;
              break;
            case "Kredit":
              icon = <FiCreditCard size={20} />;
              break;
            case "Investasi":
              icon = <FiBarChart2 size={20} />;
              break;
            case "Lainnya":
              icon = <FiDollarSign size={20} />;
              break;
            default:
              icon = <FiDollarSign size={20} />;
          }

          return {
            id: account._id || index + 1,
            name: account.name,
            type: account.type,
            balance: account.balance,
            icon,
            color, // Gunakan warna berdasarkan nama
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
          <div className={styles.summaryItem} style={{ gridColumn: "1 / -1" }}>
            <h3>Total Saldo</h3>
            <p className={totalBalance >= 0 ? styles.balance : styles.expense}>
              Rp{Math.abs(totalBalance).toLocaleString("id-ID")}
            </p>
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

  // Fungsi untuk menghasilkan warna berdasarkan nama wallet
  const generateColorFromName = (name) => {
    // Menggunakan hash sederhana untuk menghasilkan warna berdasarkan nama wallet
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }

    // Konversi ke warna RGB
    let r = (hash & 0xff0000) >> 16;
    let g = (hash & 0x00ff00) >> 8;
    let b = hash & 0x0000ff;

    // Pastikan warna cukup cerah dan tidak terlalu terang
    r = Math.min(Math.max(r, 50), 200);
    g = Math.min(Math.max(g, 50), 200);
    b = Math.min(Math.max(b, 50), 200);

    return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, "0")}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Basic validation
      if (!name.trim()) {
        throw new Error("Nama rekening tidak boleh kosong");
      }

      const numericBalance = parseFloat(balance) || 0;
      const token = localStorage.getItem("userToken");

      if (!token) {
        throw new Error("No authentication token found");
      }

      // Check if a wallet with this name already exists - now accounts is accessible
      const nameExists =
        accounts &&
        accounts.some(
          (account) => account.name.toLowerCase() === name.toLowerCase()
        );

      if (nameExists) {
        throw new Error("Rekening dengan nama ini sudah ada");
      }

      const accountData = {
        name,
        type,
        balance: numericBalance,
      };

      console.log("Sending account data:", accountData);

      const savedAccount = await addAccountToBackend(accountData, token);

      // Generate warna berdasarkan nama wallet
      const walletColor = generateColorFromName(name);

      // Now create a processed account with icon and color
      const accountWithIcon = {
        ...savedAccount.account, // Adjust based on your API response structure
        icon: getAccountIcon(type),
        color: walletColor, // Gunakan warna yang dihasilkan dari nama
      };

      onAdd(accountWithIcon);
      onClose();
    } catch (error) {
      console.error("Error saving account:", error);
      alert(`Gagal menyimpan rekening: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper functions untuk icon
  const getAccountIcon = (type) => {
    switch (type) {
      case "Giro":
        return <FiDollarSign size={20} />;
      case "Tabungan":
        return <FiBarChart2 size={20} />;
      case "Kredit":
        return <FiCreditCard size={20} />;
      default:
        return <FiDollarSign size={20} />;
    }
  };

  // Menghapus fungsi getAccountColor karena sekarang kita menggunakan warna berdasarkan nama

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
