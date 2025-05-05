"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import styles from "./profile.module.css";
import Dock from "@/components/dock/Dock";
import BlurText from "@/components/shinyText/BlurText";
import { useToast } from "@/components/toast/toastProvider";
import SettingsModal from "@/components/settings/SettingsModal";
import {
  FiUser,
  FiInfo,
  FiHelpCircle,
  FiLogOut,
  FiChevronRight,
  FiCheck,
  FiX,
} from "react-icons/fi";
import { IoIosWallet } from "react-icons/io";
import { FaUser } from "react-icons/fa";
import { FaHouse } from "react-icons/fa6";

export default function ProfilePage() {
  const [showModal, setShowModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [settingsType, setSettingsType] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userEmail, setUserEmail] = useState("");
  const { addToast } = useToast();
  const router = useRouter();

  // Check for authentication
  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn");

    if (!isLoggedIn) {
      router.push("/login");
      return;
    }

    // Get user email from localStorage
    const email = localStorage.getItem("userEmail") || "user@example.com";
    setUserEmail(email);

    setIsLoading(false);
  }, [router]);

  const items = [
    {
      icon: <FaHouse size={18} />,
      label: "Beranda",
      onClick: () => router.push("/dashboard"),
    },
    {
      icon: <IoIosWallet size={18} />,
      label: "Dompet",
      onClick: () => router.push("/wallet"),
    },
    {
      icon: <FaUser size={18} />,
      label: "Profil",
      onClick: () => {}, // current page
    },
  ];

  const openSettingsModal = (type) => {
    setSettingsType(type);
    setShowSettingsModal(true);
  };

  const handleLogout = () => {
    // Clear localStorage values
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userEmail");

    addToast("Keluar...", "info", 2000);

    // Redirect to login page
    setTimeout(() => {
      router.push("/login");
    }, 1000);
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
            text="Profil Anda"
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
              <h2>{userEmail.split("@")[0]}</h2>
              <p>{userEmail}</p>
            </div>
          </div>

          <button
            className={styles.editProfileButton}
            onClick={() => setShowModal(true)}
          >
            Edit Profil
          </button>
        </div>

        <div className={styles.transactions} style={{ marginTop: "2rem" }}>
          <h2>Pengaturan</h2>

          <div
            className={`${styles.transaction} ${styles.settingItem}`}
            onClick={() => openSettingsModal("help")}
          >
            <div
              className={styles.transactionIcon}
              style={{ color: "#8b5cf6", background: "#8b5cf615" }}
            >
              <FiHelpCircle size={20} />
            </div>
            <div className={styles.transactionDetails}>
              <h4>Bantuan & Dukungan</h4>
              <p>Dapatkan bantuan</p>
            </div>
            <FiChevronRight size={20} color="#64748b" />
          </div>

          <div
            className={`${styles.transaction} ${styles.settingItem}`}
            onClick={() => openSettingsModal("about")}
          >
            <div
              className={styles.transactionIcon}
              style={{ color: "#10b981", background: "#10b98115" }}
            >
              <FiInfo size={20} />
            </div>
            <div className={styles.transactionDetails}>
              <h4>Tentang Aplikasi</h4>
              <p>Versi 1.0.0</p>
            </div>
            <FiChevronRight size={20} color="#64748b" />
          </div>
        </div>

        <button className={styles.logoutButton} onClick={handleLogout}>
          <FiLogOut size={18} />
          <span>Keluar</span>
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

      {showSettingsModal && (
        <SettingsModal
          onClose={() => setShowSettingsModal(false)}
          setting={settingsType}
        />
      )}

      <footer className={styles.footer}>
        <p>&copy; 2023 Spend.ly - Lacak pengeluaran Anda</p>
      </footer>
    </div>
  );
}

function ProfileEditModal({ onClose }) {
  const [name, setName] = useState("Alex Johnson");
  const [email, setEmail] = useState("alex.johnson@example.com");
  const { addToast } = useToast();

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real app, update the user profile
    addToast(
      `Profil berhasil diperbarui! Nama diubah menjadi ${name}`,
      "success",
      3000
    );
    onClose();
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <button className={styles.closeButton} onClick={onClose}>
          <FiX size={24} />
        </button>

        <h2>Edit Profil</h2>

        <form onSubmit={handleSubmit}>
          <div className={styles.modalGroup}>
            <label htmlFor="name">Nama Lengkap</label>
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
            <label htmlFor="email">Alamat Email</label>
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
            Simpan Perubahan
          </button>
        </form>
      </div>
    </div>
  );
}
