"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import styles from "../page.module.css";
import Dock from "@/components/dock/Dock";
import BlurText from "@/components/shinyText/BlurText";
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
} from "react-icons/fi";
import { IoIosWallet } from "react-icons/io";
import { FaUser } from "react-icons/fa";
import { FaHouse } from "react-icons/fa6";

const initialTransactions = [
  {
    id: 1,
    title: "Lunch at Restaurant",
    category: "Food",
    date: "Sept 15, 2023",
    amount: -24.5,
    icon: <FiCoffee size={20} />,
  },
  {
    id: 2,
    title: "Salary",
    category: "Income",
    date: "Sept 10, 2023",
    amount: 3250.0,
    icon: <FiBriefcase size={20} />,
  },
  {
    id: 3,
    title: "Rent Payment",
    category: "Bills",
    date: "Sept 5, 2023",
    amount: -650.0,
    icon: <FiHouse size={20} />,
  },
  {
    id: 4,
    title: "Groceries",
    category: "Food",
    date: "Sept 3, 2023",
    amount: -35.0,
    icon: <FiShoppingBag size={20} />,
  },
];

export default function Dashboard() {
  const [transactions, setTransactions] = useState(initialTransactions);
  const [showModal, setShowModal] = useState(false);
  const [showCalendarModal, setShowCalendarModal] = useState(false);
  const [filter, setFilter] = useState("all");
  const [month, setMonth] = useState("2023-09");
  const [displayMonth, setDisplayMonth] = useState("September 2023");
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Check authentication
  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn");

    if (!isLoggedIn) {
      router.push("/login");
      return;
    }

    setIsLoading(false);
  }, [router]);

  const items = [
    {
      icon: <FaHouse size={18} />,
      label: "Home",
      onClick: () => {}, // Already on home/dashboard
    },
    {
      icon: <IoIosWallet size={18} />,
      label: "Wallet",
      onClick: () => router.push("/wallet"),
    },
    {
      icon: <FaUser size={18} />,
      label: "Profile",
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
      date: new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
    };

    setTransactions([newTransaction, ...transactions]);
    setShowModal(false);
  };

  const handleMonthSelect = (newMonth, monthName) => {
    setMonth(newMonth);
    setDisplayMonth(monthName);
    setShowCalendarModal(false);
  };

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}></div>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <div className={styles.header}>
          <BlurText
            text="Hello !"
            delay={150}
            animateBy="words"
            direction="top"
            className={styles.blurText}
          />
        </div>

        <div className={styles.summary}>
          <div className={styles.summaryItem}>
            <h3>Balance</h3>
            <p className={styles.balance}>${balance.toFixed(2)}</p>
          </div>
          <div className={styles.summaryItem}>
            <h3>Income</h3>
            <p className={styles.income}>${income.toFixed(2)}</p>
          </div>
          <div className={styles.summaryItem}>
            <h3>Expenses</h3>
            <p className={styles.expense}>${expenses.toFixed(2)}</p>
          </div>
        </div>

        <div className={styles.actions}>
          <button
            className={styles.addButton}
            onClick={() => setShowModal(true)}
          >
            <FiPlus size={18} />
            <span className={styles.addText}>Add Transaction</span>
          </button>
          <div className={styles.filterSelectWrapper}>
            <select
              className={styles.filterSelect}
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              title={filter === "all" ? "All Categories" : filter}
            >
              <option value="all">All Categories</option>
              <option value="food">Food</option>
              <option value="income">Income</option>
              <option value="travel">Travel</option>
              <option value="bills">Bills</option>
              <option value="entertainment">Entertainment</option>
              <option value="shopping">Shopping</option>
            </select>
          </div>
          <button
            className={styles.datePickerButton}
            onClick={() => setShowCalendarModal(true)}
          >
            <span>{displayMonth}</span>
            <FiCalendar size={18} />
          </button>
        </div>

        <div className={styles.transactions}>
          <h2>Recent Transactions</h2>

          {filteredTransactions.length > 0 ? (
            filteredTransactions.map((transaction) => (
              <div key={transaction.id} className={styles.transaction}>
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
            <p className={styles.emptyState}>No transactions found</p>
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

      <footer className={styles.footer}>
        <p>&copy; 2023 Spend.ly - Track your spending</p>
      </footer>
    </div>
  );
}

function TransactionModal({ onClose, onAdd }) {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Food");
  const [isExpense, setIsExpense] = useState(true);

  const handleSubmit = (e) => {
    e.preventDefault();

    const finalAmount = isExpense
      ? -Math.abs(parseFloat(amount))
      : Math.abs(parseFloat(amount));

    let icon;
    switch (category) {
      case "Food":
        icon = <FiCoffee size={20} />;
        break;
      case "Income":
        icon = <FiBriefcase size={20} />;
        break;
      case "Bills":
        icon = <FiHouse size={20} />;
        break;
      case "Shopping":
        icon = <FiShoppingBag size={20} />;
        break;
      case "Travel":
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

        <h2>Add Transaction</h2>

        <form onSubmit={handleSubmit}>
          <div className={styles.modalGroup}>
            <label>Type</label>
            <div className={styles.typeToggle}>
              <button
                type="button"
                className={`${styles.typeButton} ${
                  isExpense ? styles.active : ""
                }`}
                onClick={() => setIsExpense(true)}
              >
                Expense
              </button>
              <button
                type="button"
                className={`${styles.typeButton} ${
                  !isExpense ? styles.active : ""
                }`}
                onClick={() => setIsExpense(false)}
              >
                Income
              </button>
            </div>
          </div>

          <div className={styles.modalGroup}>
            <label htmlFor="title">Title</label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What was it for?"
              required
              className={styles.modalInput}
            />
          </div>

          <div className={styles.modalGroup}>
            <label htmlFor="amount">Amount</label>
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
            <label htmlFor="category">Category</label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className={styles.modalSelect}
            >
              <option value="Food">Food</option>
              <option value="Travel">Travel</option>
              <option value="Bills">Bills</option>
              <option value="Entertainment">Entertainment</option>
              <option value="Shopping">Shopping</option>
              <option value="Income">Income</option>
            </select>
          </div>

          <button type="submit" className={styles.submitButton}>
            <FiCheck size={21} />
            Add Transaction
          </button>
        </form>
      </div>
    </div>
  );
}

function CalendarModal({ onClose, onSelect, currentMonth }) {
  const [year, month] = currentMonth.split("-").map(Number);
  const [currentYear, setCurrentYear] = useState(year);

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const handlePrevYear = () => {
    setCurrentYear((prev) => prev - 1);
  };

  const handleNextYear = () => {
    setCurrentYear((prev) => prev + 1);
  };

  const handleSelectMonth = (monthIndex) => {
    const formattedMonth = String(monthIndex + 1).padStart(2, "0");
    const monthValue = `${currentYear}-${formattedMonth}`;
    const monthDisplay = `${months[monthIndex]} ${currentYear}`;
    onSelect(monthValue, monthDisplay);
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.calendarModal}>
        <button className={styles.closeButton} onClick={onClose}>
          <FiX size={24} />
        </button>

        <h2>Select Month</h2>

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
            const monthValue = `${currentYear}-${String(index + 1).padStart(
              2,
              "0"
            )}`;
            const isSelected = monthValue === currentMonth;
            const isCurrentDate =
              new Date().getMonth() === index &&
              new Date().getFullYear() === currentYear;

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
