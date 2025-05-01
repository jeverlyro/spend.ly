"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import moment from "moment";
import "moment/locale/id";
import styles from "../page.module.css";
import Dock from "@/components/dock/Dock";
import BlurText from "@/components/shinyText/BlurText";
import TransactionChart from "@/components/charts/TransactionChart";
import {
  FiPlus,
  FiBriefcase,
  FiShoppingBag,
  FiCoffee,
  FiTruck,
  FiHome as FiHouse,
  FiX,
  FiCheck,
  FiDollarSign,
  FiCalendar,
  FiChevronLeft,
  FiChevronRight,
  FiEdit2,
  FiTrash2,
  FiTag,
  FiInfo,
} from "react-icons/fi";
import { IoIosWallet } from "react-icons/io";
import { FaUser } from "react-icons/fa";
import { FaHouse } from "react-icons/fa6";

export default function Dashboard() {
  // Set moment locale to Indonesian
  moment.locale("id");

  // Get current month in YYYY-MM format and display format
  const currentMoment = moment();
  const initialMonth = currentMoment.format("YYYY-MM");
  const initialDisplayMonth = currentMoment.format("MMMM YYYY");
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showCalendarModal, setShowCalendarModal] = useState(false);
  const [filter, setFilter] = useState("all");
  const [month, setMonth] = useState(initialMonth);
  const [displayMonth, setDisplayMonth] = useState(initialDisplayMonth);
  const [isLoading, setIsLoading] = useState(true);
  const [userName, setUserName] = useState("");
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("userToken");
    const name = localStorage.getItem("userName");

    // Set username from localStorage
    if (name) {
      setUserName(name);
    }

    async function verifyAuth() {
      try {
        // Check if we have a token first
        if (!token) {
          router.push("/login");
          return;
        }

        // First check if we're already authenticated locally to prevent unnecessary API calls
        const isLoggedIn = localStorage.getItem("isLoggedIn");
        if (isLoggedIn === "true") {
          setIsLoading(false);
          return;
        }

        // Only verify with backend if needed
        try {
          const response = await fetch(
            "http://localhost:5000/api/auth/verify",
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (response.ok) {
            // If verification successful, set logged in flag
            localStorage.setItem("isLoggedIn", "true");
            setIsLoading(false);
          } else {
            // Clear auth data on failed verification
            localStorage.removeItem("userToken");
            localStorage.removeItem("userName");
            localStorage.removeItem("userEmail");
            localStorage.removeItem("userPhoto");
            localStorage.removeItem("isLoggedIn");
            router.push("/login");
          }
        } catch (error) {
          console.error("Backend verification error:", error);
          // On network errors, assume token is valid to prevent logout loops
          // This allows offline usage until proven otherwise
          localStorage.setItem("isLoggedIn", "true");
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Authentication error:", error);
      }
    }

    verifyAuth();
  }, [router]);

  const items = [
    {
      icon: <FaHouse size={18} />,
      label: "Beranda",
      onClick: () => {},
    },
    {
      icon: <IoIosWallet size={18} />,
      label: "Dompet",
      onClick: () => router.push("/wallet"),
    },
    {
      icon: <FaUser size={18} />,
      label: "Profil",
      onClick: () => router.push("/profile"),
    },
  ];

  const income = transactions
    .filter((t) => t.amount > 0)
    .reduce((sum, t) => sum + t.amount, 0);

  const expenses = transactions
    .filter((t) => t.amount < 0)
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);

  const balance = income - expenses;

  const filteredTransactions = transactions.filter((t) => {
    if (filter === "all") return true;
    return t.category.toLowerCase() === filter;
  });

  const addTransaction = (transaction) => {
    const newTransaction = {
      id: transactions.length + 1,
      ...transaction,
      date: moment().format("D MMM YYYY"), // Format date using moment
    };

    setTransactions([newTransaction, ...transactions]);
    setShowModal(false);
  };

  const handleMonthSelect = (newMonth, monthName) => {
    setMonth(newMonth);
    setDisplayMonth(monthName);
    setShowCalendarModal(false);
  };

  const handleEditTransaction = (transaction) => {
    setShowModal(true);
  };

  const handleDeleteTransaction = (id) => {
    setTransactions(transactions.filter((t) => t.id !== id));
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
            text={`Halo, ${userName} !`}
            delay={150}
            animateBy="words"
            direction="top"
            className={styles.blurText}
          />
        </div>

        <div className={styles.summary}>
          <div className={styles.summaryItem}>
            <h3>Saldo</h3>
            <p className={styles.balance}>${balance.toFixed(2)}</p>
          </div>
          <div className={styles.summaryItem}>
            <h3>Pemasukan</h3>
            <p className={styles.income}>${income.toFixed(2)}</p>
          </div>
          <div className={styles.summaryItem}>
            <h3>Pengeluaran</h3>
            <p className={styles.expense}>${expenses.toFixed(2)}</p>
          </div>
        </div>

        {/* Chart Section */}
        <div className={styles.transactions} style={{ marginBottom: "1.5rem" }}>
          <h2>Ringkasan Finansial</h2>
          {transactions.length > 0 ? (
            <TransactionChart transactions={transactions} month={month} />
          ) : (
            <p className={styles.emptyState}>
              Belum ada transaksi untuk ditampilkan dalam grafik
            </p>
          )}
        </div>

        <div className={styles.actions}>
          <button
            className={styles.addButton}
            onClick={() => setShowModal(true)}
          >
            <FiPlus size={18} />
            <span className={styles.addText}>Tambah Transaksi</span>
          </button>
          {transactions.length > 0 && (
            <>
              <div className={styles.filterSelectWrapper}>
                <select
                  className={styles.filterSelect}
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  title={filter === "all" ? "Semua Kategori" : filter}
                >
                  <option value="all">Semua Kategori</option>
                  <option value="makanan">Makanan</option>
                  <option value="pendapatan">Pendapatan</option>
                  <option value="travel">Perjalanan</option>
                  <option value="tagihan">Tagihan</option>
                  <option value="hiburan">Hiburan</option>
                  <option value="belanja">Belanja</option>
                </select>
              </div>
              <button
                className={styles.datePickerButton}
                onClick={() => setShowCalendarModal(true)}
              >
                <span>{displayMonth}</span>
                <FiCalendar size={18} />
              </button>
            </>
          )}
        </div>

        <div className={styles.transactions}>
          <h2>Transaksi Terbaru</h2>

          {filteredTransactions.length > 0 ? (
            filteredTransactions.map((transaction) => (
              <div
                key={transaction.id}
                className={styles.transaction}
                onClick={() => setSelectedTransaction(transaction)}
              >
                <div className={styles.transactionIcon}>{transaction.icon}</div>
                <div className={styles.transactionDetails}>
                  <h4>{transaction.title}</h4>
                  <p>
                    {transaction.category} • {transaction.date}
                  </p>
                </div>
                <p
                  className={`${styles.transactionAmount} ${
                    transaction.amount > 0 ? styles.income : ""
                  }`}
                >
                  {transaction.amount > 0 ? "+" : "-"}$
                  {Math.abs(transaction.amount).toFixed(2)}
                </p>
              </div>
            ))
          ) : (
            <div className={styles.emptyStateContainer}>
              <p className={styles.emptyState}>
                Anda belum memiliki transaksi terbaru
              </p>
              <p className={styles.emptyStateSubtext}>
                Tambahkan transaksi pertama Anda dengan menekan tombol "Tambah
                Transaksi"
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
        <TransactionModal
          onClose={() => setShowModal(false)}
          onAdd={addTransaction}
        />
      )}

      {showCalendarModal && (
        <CalendarModal
          onClose={() => setShowCalendarModal(false)}
          onSelect={handleMonthSelect}
          currentMonth={month}
        />
      )}

      {selectedTransaction && (
        <TransactionDetailsModal
          transaction={selectedTransaction}
          onClose={() => setSelectedTransaction(null)}
          onEdit={handleEditTransaction}
          onDelete={handleDeleteTransaction}
        />
      )}

      <footer className={styles.footer}>
        <p>&copy; 2023 Spend.ly - Lacak pengeluaran Anda</p>
      </footer>
    </div>
  );
}

function TransactionModal({ onClose, onAdd }) {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Makanan");
  const [isExpense, setIsExpense] = useState(true);

  const handleSubmit = (e) => {
    e.preventDefault();

    const finalAmount = isExpense
      ? -Math.abs(parseFloat(amount))
      : Math.abs(parseFloat(amount));

    let icon;
    switch (category) {
      case "Makanan":
        icon = <FiCoffee size={20} />;
        break;
      case "Pendapatan":
        icon = <FiBriefcase size={20} />;
        break;
      case "Tagihan":
        icon = <FiHouse size={20} />;
        break;
      case "Belanja":
        icon = <FiShoppingBag size={20} />;
        break;
      case "Perjalanan":
        icon = <FiTruck size={20} />;
        break;
      default:
        icon = <FiDollarSign size={20} />;
    }

    onAdd({
      title,
      amount: finalAmount,
      category,
      icon,
    });
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <button className={styles.closeButton} onClick={onClose}>
          <FiX size={24} />
        </button>

        <h2>Tambah Transaksi</h2>

        <form onSubmit={handleSubmit}>
          <div className={styles.modalGroup}>
            <label>Tipe</label>
            <div className={styles.typeToggle}>
              <button
                type="button"
                className={`${styles.typeButton} ${
                  isExpense ? styles.active : ""
                }`}
                onClick={() => setIsExpense(true)}
              >
                Pengeluaran
              </button>
              <button
                type="button"
                className={`${styles.typeButton} ${
                  !isExpense ? styles.active : ""
                }`}
                onClick={() => setIsExpense(false)}
              >
                Pendapatan
              </button>
            </div>
          </div>

          <div className={styles.modalGroup}>
            <label htmlFor="title">Judul</label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Untuk apa transaksi ini?"
              required
              className={styles.modalInput}
            />
          </div>

          <div className={styles.modalGroup}>
            <label htmlFor="amount">Jumlah</label>
            <div className={styles.amountInput}>
              <span>$</span>
              <input
                id="amount"
                type="number"
                step="0.01"
                min="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                required
                className={styles.modalInput}
              />
            </div>
          </div>

          <div className={styles.modalGroup}>
            <label htmlFor="category">Kategori</label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className={styles.modalSelect}
            >
              <option value="Makanan">Makanan</option>
              <option value="Perjalanan">Perjalanan</option>
              <option value="Tagihan">Tagihan</option>
              <option value="Hiburan">Hiburan</option>
              <option value="Belanja">Belanja</option>
              <option value="Pendapatan">Pendapatan</option>
            </select>
          </div>

          <button type="submit" className={styles.submitButton}>
            <FiCheck size={21} />
            Tambah Transaksi
          </button>
        </form>
      </div>
    </div>
  );
}

function CalendarModal({ onClose, onSelect, currentMonth }) {
  const [year, month] = currentMonth.split("-").map(Number);
  const [currentYear, setCurrentYear] = useState(year);

  // Use moment's month names
  const months = moment.months();

  const handlePrevYear = () => {
    setCurrentYear((prev) => prev - 1);
  };

  const handleNextYear = () => {
    setCurrentYear((prev) => prev + 1);
  };

  const handleSelectMonth = (monthIndex) => {
    const momentDate = moment().year(currentYear).month(monthIndex);
    const formattedMonth = momentDate.format("YYYY-MM");
    const monthDisplay = momentDate.format("MMMM YYYY");
    onSelect(formattedMonth, monthDisplay);
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.calendarModal}>
        <button className={styles.closeButton} onClick={onClose}>
          <FiX size={24} />
        </button>

        <h2>Pilih Bulan</h2>

        <div className={styles.calendarHeader}>
          <div className={styles.calendarTitle}>{currentYear}</div>
          <div className={styles.calendarNav}>
            <button
              className={styles.calendarNavButton}
              onClick={handlePrevYear}
            >
              <FiChevronLeft size={20} />
            </button>
            <button
              className={styles.calendarNavButton}
              onClick={handleNextYear}
            >
              <FiChevronRight size={20} />
            </button>
          </div>
        </div>

        <div className={styles.monthGrid}>
          {months.map((monthName, index) => {
            const momentDate = moment().year(currentYear).month(index);
            const monthValue = momentDate.format("YYYY-MM");
            const isSelected = monthValue === currentMonth;
            const isCurrentDate =
              moment().month() === index && moment().year() === currentYear;

            return (
              <button
                key={monthName}
                className={`${styles.monthItem} ${
                  isSelected ? styles.monthItemSelected : ""
                } 
                ${isCurrentDate ? styles.monthItemCurrent : ""}`}
                onClick={() => handleSelectMonth(index)}
              >
                {monthName.substring(0, 3)}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function TransactionDetailsModal({ transaction, onClose, onEdit, onDelete }) {
  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <button className={styles.closeButton} onClick={onClose}>
          <FiX size={24} />
        </button>

        <div className={styles.transactionDetailsHeader}>
          <div
            className={styles.transactionIconLarge}
            style={{
              color: transaction.amount > 0 ? "#10b981" : "#ef4444",
              background: transaction.amount > 0 ? "#10b98115" : "#ef444415",
            }}
          >
            {transaction.icon}
          </div>
          <h2>{transaction.title}</h2>
        </div>

        <div className={styles.transactionDetailsContent}>
          <div className={styles.transactionDetail}>
            <div className={styles.transactionDetailIcon}>
              <FiDollarSign size={18} />
            </div>
            <div className={styles.transactionDetailText}>
              <p className={styles.transactionDetailLabel}>Jumlah</p>
              <p
                className={`${styles.transactionDetailValue} ${
                  transaction.amount > 0 ? styles.income : styles.expense
                }`}
              >
                {transaction.amount > 0 ? "+" : "-"}$
                {Math.abs(transaction.amount).toFixed(2)}
              </p>
            </div>
          </div>

          <div className={styles.transactionDetail}>
            <div className={styles.transactionDetailIcon}>
              <FiTag size={18} />
            </div>
            <div className={styles.transactionDetailText}>
              <p className={styles.transactionDetailLabel}>Kategori</p>
              <p className={styles.transactionDetailValue}>
                {transaction.category}
              </p>
            </div>
          </div>

          <div className={styles.transactionDetail}>
            <div className={styles.transactionDetailIcon}>
              <FiCalendar size={18} />
            </div>
            <div className={styles.transactionDetailText}>
              <p className={styles.transactionDetailLabel}>Tanggal</p>
              <p className={styles.transactionDetailValue}>
                {transaction.date}
              </p>
            </div>
          </div>

          <div className={styles.transactionDetail}>
            <div className={styles.transactionDetailIcon}>
              <FiInfo size={18} />
            </div>
            <div className={styles.transactionDetailText}>
              <p className={styles.transactionDetailLabel}>Tipe</p>
              <p className={styles.transactionDetailValue}>
                {transaction.amount > 0 ? "Pendapatan" : "Pengeluaran"}
              </p>
            </div>
          </div>
        </div>

        <div className={styles.transactionActions}>
          <button
            className={`${styles.actionButton} ${styles.editButton}`}
            onClick={() => {
              onClose();
              onEdit(transaction);
            }}
          >
            <FiEdit2 size={18} />
            <span>Edit</span>
          </button>
          <button
            className={`${styles.actionButton} ${styles.deleteButton}`}
            onClick={() => {
              onDelete(transaction.id);
              onClose();
            }}
          >
            <FiTrash2 size={18} />
            <span>Hapus</span>
          </button>
        </div>
      </div>
    </div>
  );
}
