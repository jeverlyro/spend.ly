"use client";

import { useState } from "react";
import styles from "../page.module.css";
import Dock from "@/components/dock/Dock";
import BlurText from "@/components/shinyText/BlurText";
import {
  FiPlus,
  FiCreditCard,
  FiDollarSign,
  FiBarChart2,
  FiArrowUpRight,
  FiArrowDownLeft,
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
    label: "Home",
    onClick: () => (window.location.href = "/"),
  },
  {
    icon: <IoIosWallet size={18} />,
    label: "Wallet",
    onClick: () => {}, // current page
  },
  {
    icon: <FaUser size={18} />,
    label: "Profile",
    onClick: () => (window.location.href = "/profile"),
  },
];

const initialAccounts = [
  {
    id: 1,
    name: "Main Checking",
    type: "Checking",
    balance: 2350.75,
    icon: <FiDollarSign size={20} />,
    color: "#0070f3",
  },
  {
    id: 2,
    name: "Savings Account",
    type: "Savings",
    balance: 8750.42,
    icon: <FiBarChart2 size={20} />,
    color: "#10b981",
  },
  {
    id: 3,
    name: "Credit Card",
    type: "Credit",
    balance: -450.25,
    icon: <FiCreditCard size={20} />,
    color: "#ef4444",
  },
];

export default function WalletPage() {
  const [accounts, setAccounts] = useState(initialAccounts);
  const [showModal, setShowModal] = useState(false);

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

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <div className={styles.header}>
          <BlurText
            text="Your Wallet"
            delay={150}
            animateBy="words"
            direction="top"
            className={styles.blurText}
          />
        </div>

        <div className={styles.summary}>
          <div className={styles.summaryItem} style={{ gridColumn: "1 / -1" }}>
            <h3>Total Balance</h3>
            <p className={totalBalance >= 0 ? styles.balance : styles.expense}>
              ${Math.abs(totalBalance).toFixed(2)}
            </p>
          </div>
        </div>

        <div className={styles.actions}>
          <button
            className={styles.addButton}
            onClick={() => setShowModal(true)}
            style={{ gridColumn: "1 / -1" }}
          >
            <FiPlus size={18} />
            <span className={styles.addText}>Add Account</span>
          </button>
        </div>

        <div className={styles.transactions}>
          <h2>Your Accounts</h2>

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
                  {account.balance >= 0 ? "+" : "-"}$
                  {Math.abs(account.balance).toFixed(2)}
                </p>
              </div>
            ))
          ) : (
            <p className={styles.emptyState}>No accounts found</p>
          )}
        </div>

        <div className={styles.transactions} style={{ marginTop: "2rem" }}>
          <h2>Recent Transfers</h2>

          <div className={styles.transaction}>
            <div
              className={styles.transactionIcon}
              style={{ color: "#0070f3", background: "#0070f315" }}
            >
              <FiArrowUpRight size={20} />
            </div>
            <div className={styles.transactionDetails}>
              <h4>To Savings Account</h4>
              <p>Sep 12, 2023</p>
            </div>
            <p className={styles.transactionAmount}>-$500.00</p>
          </div>

          <div className={styles.transaction}>
            <div
              className={styles.transactionIcon}
              style={{ color: "#10b981", background: "#10b98115" }}
            >
              <FiArrowDownLeft size={20} />
            </div>
            <div className={styles.transactionDetails}>
              <h4>From Checking Account</h4>
              <p>Sep 10, 2023</p>
            </div>
            <p className={`${styles.transactionAmount} ${styles.income}`}>
              +$500.00
            </p>
          </div>
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
        <p>&copy; 2023 Spend.ly - Track your spending</p>
      </footer>
    </div>
  );
}

function AccountModal({ onClose, onAdd }) {
  const [name, setName] = useState("");
  const [type, setType] = useState("Checking");
  const [balance, setBalance] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    let icon;
    let color = "#0070f3";

    switch (type) {
      case "Checking":
        icon = <FiDollarSign size={20} />;
        color = "#0070f3";
        break;
      case "Savings":
        icon = <FiBarChart2 size={20} />;
        color = "#10b981";
        break;
      case "Credit":
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

        <h2>Add Account</h2>

        <form onSubmit={handleSubmit}>
          <div className={styles.modalGroup}>
            <label htmlFor="name">Account Name</label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Main Checking"
              required
              className={styles.modalInput}
            />
          </div>

          <div className={styles.modalGroup}>
            <label htmlFor="type">Account Type</label>
            <select
              id="type"
              value={type}
              onChange={(e) => setType(e.target.value)}
              className={styles.modalSelect}
            >
              <option value="Checking">Checking</option>
              <option value="Savings">Savings</option>
              <option value="Credit">Credit</option>
              <option value="Investment">Investment</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className={styles.modalGroup}>
            <label htmlFor="balance">Current Balance</label>
            <div className={styles.amountInput}>
              <span>$</span>
              <input
                id="balance"
                type="number"
                step="0.01"
                value={balance}
                onChange={(e) => setBalance(e.target.value)}
                placeholder="0.00"
                required
                className={styles.modalInput}
              />
            </div>
          </div>

          <button type="submit" className={styles.submitButton}>
            <FiCheck size={21} />
            Add Account
          </button>
        </form>
      </div>
    </div>
  );
}
