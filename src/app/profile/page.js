"use client";

import { useState } from "react";
import styles from "../page.module.css";
import Dock from "@/components/dock/Dock";
import BlurText from "@/components/shinyText/BlurText";
import {
  FiUser,
  FiSettings,
  FiMoon,
  FiSun,
  FiBell,
  FiLock,
  FiHelpCircle,
  FiLogOut,
  FiChevronRight,
  FiCheck,
  FiX,
} from "react-icons/fi";
import { IoIosWallet } from "react-icons/io";
import { FaUser } from "react-icons/fa";
import { FaHouse } from "react-icons/fa6";

const items = [
  {
    icon: <FaHouse size={18} />,
    label: "Home",
    onClick: () => (window.location.href = "/"),
  },
  {
    icon: <IoIosWallet size={18} />,
    label: "Wallet",
    onClick: () => (window.location.href = "/wallet"),
  },
  {
    icon: <FaUser size={18} />,
    label: "Profile",
    onClick: () => {}, // current page
  },
];

export default function ProfilePage() {
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    // In a real app, you would apply the theme change
  };

  const toggleNotifications = () => {
    setNotifications(!notifications);
  };

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <div className={styles.header}>
          <BlurText
            text="Your Profile"
            delay={150}
            animateBy="words"
            direction="top"
            className={styles.blurText}
          />
        </div>

        <div className={styles.profileSection}>
          <div className={styles.profileHeader}>
            <div className={styles.profileAvatar}>
              <FiUser size={32} />
            </div>
            <div className={styles.profileInfo}>
              <h2>Alex Johnson</h2>
              <p>alex.johnson@example.com</p>
            </div>
          </div>

          <button
            className={styles.editProfileButton}
            onClick={() => setShowModal(true)}
          >
            Edit Profile
          </button>
        </div>

        <div className={styles.transactions} style={{ marginTop: "2rem" }}>
          <h2>Settings</h2>

          <div className={`${styles.transaction} ${styles.settingItem}`}>
            <div
              className={styles.transactionIcon}
              style={{ color: "#0070f3", background: "#0070f315" }}
            >
              {darkMode ? <FiMoon size={20} /> : <FiSun size={20} />}
            </div>
            <div className={styles.transactionDetails}>
              <h4>Dark Mode</h4>
              <p>Change app appearance</p>
            </div>
            <div
              className={`${styles.toggle} ${
                darkMode ? styles.toggleActive : ""
              }`}
              onClick={toggleDarkMode}
            >
              <div className={styles.toggleHandle}></div>
            </div>
          </div>

          <div className={`${styles.transaction} ${styles.settingItem}`}>
            <div
              className={styles.transactionIcon}
              style={{ color: "#ef4444", background: "#ef444415" }}
            >
              <FiBell size={20} />
            </div>
            <div className={styles.transactionDetails}>
              <h4>Notifications</h4>
              <p>Enable push notifications</p>
            </div>
            <div
              className={`${styles.toggle} ${
                notifications ? styles.toggleActive : ""
              }`}
              onClick={toggleNotifications}
            >
              <div className={styles.toggleHandle}></div>
            </div>
          </div>

          <div className={`${styles.transaction} ${styles.settingItem}`}>
            <div
              className={styles.transactionIcon}
              style={{ color: "#10b981", background: "#10b98115" }}
            >
              <FiLock size={20} />
            </div>
            <div className={styles.transactionDetails}>
              <h4>Security</h4>
              <p>Manage account security</p>
            </div>
            <FiChevronRight size={20} color="#64748b" />
          </div>

          <div className={`${styles.transaction} ${styles.settingItem}`}>
            <div
              className={styles.transactionIcon}
              style={{ color: "#8b5cf6", background: "#8b5cf615" }}
            >
              <FiHelpCircle size={20} />
            </div>
            <div className={styles.transactionDetails}>
              <h4>Help & Support</h4>
              <p>Get assistance</p>
            </div>
            <FiChevronRight size={20} color="#64748b" />
          </div>
        </div>

        <button className={styles.logoutButton}>
          <FiLogOut size={18} />
          <span>Logout</span>
        </button>
      </main>

      <div className={styles.dockContainer}>
        <Dock
          items={items}
          panelHeight={68}
          baseItemSize={50}
          magnification={70}
        />
      </div>

      {showModal && <ProfileEditModal onClose={() => setShowModal(false)} />}

      <footer className={styles.footer}>
        <p>&copy; 2023 Spend.ly - Track your spending</p>
      </footer>
    </div>
  );
}

function ProfileEditModal({ onClose }) {
  const [name, setName] = useState("Alex Johnson");
  const [email, setEmail] = useState("alex.johnson@example.com");

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real app, update the user profile
    onClose();
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <button className={styles.closeButton} onClick={onClose}>
          <FiX size={24} />
        </button>

        <h2>Edit Profile</h2>

        <form onSubmit={handleSubmit}>
          <div className={styles.modalGroup}>
            <label htmlFor="name">Full Name</label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className={styles.modalInput}
            />
          </div>

          <div className={styles.modalGroup}>
            <label htmlFor="email">Email Address</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className={styles.modalInput}
            />
          </div>

          <button type="submit" className={styles.submitButton}>
            <FiCheck size={21} />
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
}
