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
  FiTrash2,
  FiTag,
  FiInfo,
  FiTrendingUp,
  FiTrendingDown,
} from "react-icons/fi";
import { IoIosWallet } from "react-icons/io";
import { FaUser } from "react-icons/fa";
import { FaHouse } from "react-icons/fa6";

export default function Dashboard() {
  moment.locale("id");

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

    if (name) {
      setUserName(name);
    }

    async function verifyAuth() {
      try {
        if (!token) {
          router.push("/login");
          return;
        }

        const isLoggedIn = localStorage.getItem("isLoggedIn");
        if (isLoggedIn === "true") {
          await fetchTransactions(token);
          setIsLoading(false);
          return;
        }

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
            localStorage.setItem("isLoggedIn", "true");
            await fetchTransactions(token);
            setIsLoading(false);
          } else {
            localStorage.removeItem("userToken");
            localStorage.removeItem("userName");
            localStorage.removeItem("userEmail");
            localStorage.removeItem("userPhoto");
            localStorage.removeItem("isLoggedIn");
            router.push("/login");
          }
        } catch (error) {
          console.error("Backend verification error:", error);
          localStorage.setItem("isLoggedIn", "true");
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Authentication error:", error);
      }
    }

    async function fetchTransactions(token) {
      try {
        const response = await fetch("http://localhost:5000/api/transactions", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            errorData.message ||
              `Failed to fetch transactions: ${response.status}`
          );
        }

        const data = await response.json();
        const fetchedTransactions = data.transactions || [];

        const processedTransactions = fetchedTransactions.map((transaction) => {
          let icon;

          switch (transaction.category) {
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
            case "Hiburan":
              icon = <FiDollarSign size={20} />;
              break;
            default:
              icon = <FiDollarSign size={20} />;
          }

          const formattedDate = transaction.date
            ? moment(transaction.date).format("D MMM YYYY")
            : moment().format("D MMM YYYY");

          return {
            id: transaction._id,
            title: transaction.title,
            amount: transaction.amount,
            category: transaction.category,
            date: formattedDate,
            icon,
          };
        });

        setTransactions(processedTransactions);
      } catch (error) {
        console.error("Error fetching transactions:", error);
        setTransactions([]);
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

  const addTransaction = async (transaction) => {
    try {
      const token = localStorage.getItem("userToken");

      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await fetch("http://localhost:5000/api/transactions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: transaction.title,
          amount: transaction.amount,
          category: transaction.category,
          date: moment().toISOString(),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Error: ${response.status}`);
      }

      const data = await response.json();
      const savedTransaction = data.transaction;

      const newTransaction = {
        id: savedTransaction._id,
        title: savedTransaction.title,
        amount: savedTransaction.amount,
        category: savedTransaction.category,
        date: moment(savedTransaction.date).format("D MMM YYYY"),
        icon: transaction.icon,
      };

      setTransactions([newTransaction, ...transactions]);
      setShowModal(false);
    } catch (error) {
      console.error("Error adding transaction:", error);
      alert(`Gagal menambahkan transaksi: ${error.message}`);
    }
  };

  const handleMonthSelect = (newMonth, monthName) => {
    setMonth(newMonth);
    setDisplayMonth(monthName);
    setShowCalendarModal(false);
  };

  const handleEditTransaction = (transaction) => {
    setShowModal(true);
  };

  const handleDeleteTransaction = async (id) => {
    try {
      const token = localStorage.getItem("userToken");

      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await fetch(
        `http://localhost:5000/api/transactions/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Error: ${response.status}`);
      }

      setTransactions(transactions.filter((t) => t.id !== id));
    } catch (error) {
      console.error("Error deleting transaction:", error);
      alert(`Gagal menghapus transaksi: ${error.message}`);
    }
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

        {/* Enhance the summary cards with a better layout and 3D effect */}
        <div className={`${styles.summary} ${styles.enhancedSummary}`}>
          <div className={`${styles.summaryCard} ${styles.glassEffect}`}>
            <div className={styles.summaryContent}>
              <div className={styles.summaryHeader}>
                <div className={styles.summaryTitle}>
                  <h3>Saldo Anda</h3>
                  <span className={styles.summarySubtitle}>Total Keuangan</span>
                </div>
                <div className={`${styles.summaryIcon} ${styles.primaryIcon}`}>
                  <FiDollarSign size={24} color="#fff" />
                </div>
              </div>

              <div className={styles.balanceSection}>
                <div className={styles.balanceWrapper}>
                  <p
                    className={`${styles.balanceAmount} ${styles.animatedValue}`}
                  >
                    <span className={styles.currencySymbol}>Rp. </span>
                    {Math.abs(balance).toLocaleString("id-ID")}
                  </p>
                </div>

                <div className={styles.balanceInfo}>
                  <div className={styles.statItem}>
                    <FiTrendingUp size={16} />
                    <span>Pemasukan: Rp.{income.toLocaleString("id-ID")}</span>
                  </div>
                  <div className={styles.statItem} style={{ marginTop: "8px" }}>
                    <FiTrendingDown size={16} />
                    <span>
                      Pengeluaran: Rp.{expenses.toLocaleString("id-ID")}
                    </span>
                  </div>
                </div>
              </div>

              <div className={styles.glowEffect} />
            </div>
          </div>
        </div>

        {/* Enhanced charts container */}
        <div className={`${styles.chartContainer} ${styles.enhancedChart}`}>
          <h2 className={styles.sectionTitle}>
            <span className={styles.sectionIcon}>
              <FiTrendingUp size={18} />
            </span>
            Ringkasan Finansial
          </h2>

          {transactions.length > 0 ? (
            <TransactionChart transactions={transactions} month={month} />
          ) : (
            <div className={styles.emptyStateContainer}>
              <div className={styles.emptyStateIcon}>
                <FiTrendingUp size={32} color="#e2e8f0" />
              </div>
              <p className={styles.emptyState}>
                Belum ada transaksi untuk ditampilkan dalam grafik
              </p>
              <p className={styles.emptyStateSubtext}>
                Tambahkan transaksi pertama Anda untuk melihat visualisasi
                keuangan
              </p>
            </div>
          )}
        </div>

        {/* Enhanced action buttons */}
        <div className={`${styles.actions} ${styles.enhancedActions}`}>
          <button
            className={`${styles.addButton} ${styles.primaryButton}`}
            onClick={() => setShowModal(true)}
          >
            <FiPlus size={18} />
            <span className={styles.addText}>Tambah</span>
          </button>

          {transactions.length > 0 && (
            <>
              <div className={styles.filterSelectWrapper}>
                <select
                  className={`${styles.filterSelect} ${styles.enhancedSelect}`}
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  title={filter === "all" ? "Semua Kategori" : filter}
                >
                  <option value="all">Semua</option>
                  <option value="makanan">Makanan</option>
                  <option value="pendapatan">Pendapatan</option>
                  <option value="perjalanan">Perjalanan</option>
                  <option value="tagihan">Tagihan</option>
                  <option value="hiburan">Hiburan</option>
                  <option value="belanja">Belanja</option>
                </select>
              </div>

              <button
                className={`${styles.datePickerButton} ${styles.enhancedDatePicker}`}
                onClick={() => setShowCalendarModal(true)}
              >
                <span>{displayMonth}</span>
                <FiCalendar size={18} />
              </button>
            </>
          )}
        </div>

        {/* Enhanced transaction list */}
        <div
          className={`${styles.transactions} ${styles.enhancedTransactions}`}
        >
          <h2 className={styles.sectionTitle}>
            <span className={styles.sectionIcon}>
              <FiDollarSign size={18} />
            </span>
            Transaksi Terbaru
          </h2>

          {filteredTransactions.length > 0 ? (
            <div className={styles.transactionList}>
              {filteredTransactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className={`${styles.transaction} ${styles.transactionCard}`}
                  onClick={() => setSelectedTransaction(transaction)}
                >
                  <div
                    className={`${styles.transactionIcon} ${
                      transaction.amount > 0
                        ? styles.incomeIconBg
                        : styles.expenseIconBg
                    }`}
                  >
                    {transaction.icon}
                  </div>

                  <div className={styles.transactionDetails}>
                    <h4>{transaction.title}</h4>
                    <p className={styles.transactionMeta}>
                      <span className={styles.categoryBadge}>
                        {transaction.category}
                      </span>
                      <span className={styles.dateBadge}>
                        {transaction.date}
                      </span>
                    </p>
                  </div>

                  <p
                    className={`${styles.transactionAmount} ${
                      transaction.amount > 0 ? styles.income : styles.expense
                    }`}
                  >
                    {transaction.amount > 0 ? "+" : "-"}Rp
                    {Math.abs(transaction.amount).toLocaleString("id-ID")}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className={styles.emptyStateContainer}>
              <div className={styles.emptyStateIcon}>
                <FiDollarSign size={32} color="#e2e8f0" />
              </div>
              <p className={styles.emptyState}>
                Anda belum memiliki transaksi terbaru
              </p>
              <p className={styles.emptyStateSubtext}>
                Tambahkan transaksi pertama Anda dengan menekan tombol
                &quot;Tambah Transaksi&quot;
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
        <p>&copy; 2025 Spend.ly - Lacak pengeluaran Anda</p>
      </footer>
    </div>
  );
}

function TransactionModal({ onClose, onAdd }) {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Makanan");
  const [isExpense, setIsExpense] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (!title.trim()) {
        throw new Error("Judul transaksi tidak boleh kosong");
      }

      const numericAmount = parseFloat(amount) || 0;
      if (numericAmount <= 0) {
        throw new Error("Jumlah harus lebih dari 0");
      }

      const finalAmount = isExpense
        ? -Math.abs(numericAmount)
        : Math.abs(numericAmount);

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

      await onAdd({
        title,
        amount: finalAmount,
        category,
        icon,
      });
    } catch (error) {
      console.error("Error saving transaction:", error);
      alert(`Gagal menyimpan transaksi: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={`${styles.modal} ${styles.enhancedModal}`}>
        <button className={styles.closeButton} onClick={onClose}>
          <FiX size={24} />
        </button>

        <h2>Tambah Transaksi</h2>

        <form onSubmit={handleSubmit}>
          <div className={styles.modalGroup}>
            <label>Tipe</label>
            <div className={`${styles.typeToggle} ${styles.enhancedToggle}`}>
              <button
                type="button"
                className={`${styles.typeButton} ${
                  isExpense ? styles.active : ""
                }`}
                onClick={() => setIsExpense(true)}
              >
                <FiTrendingDown size={16} style={{ marginRight: "4px" }} />
                Pengeluaran
              </button>
              <button
                type="button"
                className={`${styles.typeButton} ${
                  !isExpense ? styles.active : ""
                }`}
                onClick={() => setIsExpense(false)}
              >
                <FiTrendingUp size={16} style={{ marginRight: "4px" }} />
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
              className={`${styles.modalInput} ${styles.enhancedInput}`}
            />
          </div>

          <div className={styles.modalGroup}>
            <label htmlFor="amount">Jumlah</label>
            <div
              className={`${styles.amountInput} ${styles.enhancedAmountInput}`}
            >
              <span className={styles.currencySymbol}>Rp</span>
              <input
                id="amount"
                type="number"
                step="0.01"
                min="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0"
                required
                className={`${styles.modalInput} ${styles.amountInputField}`}
                style={{ paddingLeft: "2.75rem" }}
              />
            </div>
          </div>

          <div className={styles.modalGroup}>
            <label htmlFor="category">Kategori</label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className={`${styles.modalSelect} ${styles.enhancedSelect}`}
            >
              <option value="Makanan">Makanan</option>
              <option value="Perjalanan">Perjalanan</option>
              <option value="Tagihan">Tagihan</option>
              <option value="Hiburan">Hiburan</option>
              <option value="Belanja">Belanja</option>
              <option value="Pendapatan">Pendapatan</option>
            </select>
          </div>

          <button
            type="submit"
            className={`${styles.submitButton} ${styles.enhancedSubmitButton}`}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <div className={styles.spinnerSmall}></div>
                <span>Menyimpan...</span>
              </>
            ) : (
              <>
                <FiCheck size={21} />
                <span>Tambah Transaksi</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

function CalendarModal({ onClose, onSelect, currentMonth }) {
  const [year, month] = currentMonth.split("-").map(Number);
  const [currentYear, setCurrentYear] = useState(year);

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
      <div
        className={`${styles.calendarModal} ${styles.enhancedCalendarModal}`}
      >
        <button className={styles.closeButton} onClick={onClose}>
          <FiX size={24} />
        </button>

        <h2>Pilih Bulan</h2>

        <div className={styles.calendarHeader}>
          <div className={styles.calendarTitle}>{currentYear}</div>
          <div className={styles.calendarNav}>
            <button
              className={`${styles.calendarNavButton} ${styles.enhancedNavButton}`}
              onClick={handlePrevYear}
            >
              <FiChevronLeft size={20} />
            </button>
            <button
              className={`${styles.calendarNavButton} ${styles.enhancedNavButton}`}
              onClick={handleNextYear}
            >
              <FiChevronRight size={20} />
            </button>
          </div>
        </div>

        <div className={`${styles.monthGrid} ${styles.enhancedMonthGrid}`}>
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
                ${isCurrentDate ? styles.monthItemCurrent : ""}
                ${styles.enhancedMonthItem}`}
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

function TransactionDetailsModal({ transaction, onClose, onDelete }) {
  return (
    <div className={styles.modalOverlay}>
      <div className={`${styles.modal} ${styles.enhancedDetailsModal}`}>
        <button className={styles.closeButton} onClick={onClose}>
          <FiX size={24} />
        </button>

        <div
          className={`${styles.transactionDetailsHeader} ${styles.enhancedDetailsHeader}`}
        >
          <div
            className={`${styles.transactionIconLarge} ${
              transaction.amount > 0
                ? styles.incomeIconLarge
                : styles.expenseIconLarge
            }`}
          >
            {transaction.icon}
          </div>
          <h2>{transaction.title}</h2>
        </div>

        <div
          className={`${styles.transactionDetailsContent} ${styles.enhancedDetailsContent}`}
        >
          <div
            className={`${styles.transactionDetail} ${styles.enhancedDetail}`}
          >
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
                {transaction.amount > 0 ? "+" : "-"}Rp
                {Math.abs(transaction.amount).toLocaleString("id-ID")}
              </p>
            </div>
          </div>

          <div
            className={`${styles.transactionDetail} ${styles.enhancedDetail}`}
          >
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

          <div
            className={`${styles.transactionDetail} ${styles.enhancedDetail}`}
          >
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

          <div
            className={`${styles.transactionDetail} ${styles.enhancedDetail}`}
          >
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

        <div
          className={`${styles.transactionActions} ${styles.enhancedActions}`}
        >
          <button
            className={`${styles.actionButton} ${styles.deleteButton} ${styles.enhancedActionButton}`}
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
