"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import styles from "../page.module.css";
import Dock from "@/components/dock/Dock";
import BlurText from "@/components/shinyText/BlurText";
import { useToast } from "@/components/toast/toastProvider";
import SettingsModal from "@/components/settings/SettingsModal";
import { getApiEndpoint } from "@/utils/api";
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
  const [userName, setUserName] = useState("");
  const [userPhoto, setUserPhoto] = useState(null);
  const { addToast } = useToast();
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("userToken");
    if (token && !localStorage.getItem("isLoggedIn")) {
      localStorage.setItem("isLoggedIn", "true");
    }
  }, []);

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn");

    if (!isLoggedIn) {
      router.push("/login");
      return;
    }

    const email = localStorage.getItem("userEmail") || "user@example.com";
    const name = localStorage.getItem("userName") || email.split("@")[0];
    const photo = localStorage.getItem("userPhoto") || null;

    setUserEmail(email);
    setUserName(name);
    setUserPhoto(photo);

    setIsLoading(false);
  }, [router, showModal]);

  const items = [
    {
      icon: <FaHouse size={18} />,
      label: "Beranda",
      onClick: () => {
        window.location.href = "/dashboard";
      },
    },
    {
      icon: <IoIosWallet size={18} />,
      label: "Dompet",
      onClick: () => {
        window.location.href = "/wallet";
      },
    },
    {
      icon: <FaUser size={18} />,
      label: "Profil",
      onClick: () => {},
    },
  ];

  const openSettingsModal = (type) => {
    setSettingsType(type);
    setShowSettingsModal(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userToken");
    localStorage.removeItem("userName");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userPhoto");

    localStorage.setItem("showOnboarding", "true");

    addToast("Keluar...", "info", 2000);

    setTimeout(() => {
      window.location.href = "/login";
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
              {userPhoto ? (
                <Image
                  src={userPhoto}
                  alt="Avatar"
                  className={styles.avatarImage}
                  width={80}
                  height={80}
                  priority
                />
              ) : (
                <div className={styles.defaultAvatar}>
                  <FiUser size={32} />
                </div>
              )}
            </div>
            <div className={styles.profileInfo}>
              <h2>{userName}</h2>
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
        <p>&copy; 2025 Spend.ly - Lacak pengeluaran Anda</p>
      </footer>
    </div>
  );
}

function ProfileEditModal({ onClose }) {
  const [name, setName] = useState(
    () => localStorage.getItem("userName") || "Alex Johnson"
  );
  const [email, setEmail] = useState(
    () => localStorage.getItem("userEmail") || "alex.johnson@example.com"
  );
  const [photo, setPhoto] = useState(
    () => localStorage.getItem("userPhoto") || null
  );
  const { addToast } = useToast();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.match("image.*")) {
      addToast("Hanya file gambar yang diperbolehkan", "error", 3000);
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      addToast("Ukuran gambar maksimal 2MB", "error", 3000);
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setPhoto(event.target.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("userToken");

      const response = await fetch(getApiEndpoint("/api/auth/profile"), {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name,
          email,
          photo,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("userName", name);
        localStorage.setItem("userEmail", email);
        if (photo) {
          localStorage.setItem("userPhoto", photo);
        }

        addToast(
          `Profil berhasil diperbarui! Nama diubah menjadi ${name}`,
          "success",
          3000
        );
        onClose();
      } else {
        addToast(data.message || "Gagal memperbarui profil", "error", 3000);
      }
    } catch (error) {
      console.error("Profile update error:", error);
      addToast("Terjadi kesalahan. Silakan coba lagi.", "error", 3000);
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <button className={styles.closeButton} onClick={onClose}>
          <FiX size={24} />
        </button>

        <h2>Edit Profil</h2>

        <form onSubmit={handleSubmit}>
          <div className={styles.photoUploadContainer}>
            <div className={styles.avatarPreview}>
              {photo ? (
                <Image
                  src={photo}
                  alt="Avatar"
                  className={styles.avatarImage}
                  width={80}
                  height={80}
                />
              ) : (
                <div className={styles.defaultAvatar}>
                  <FiUser size={32} />
                </div>
              )}
            </div>
            <div className={styles.uploadControls}>
              <label htmlFor="photo-upload" className={styles.uploadButton}>
                Pilih Foto
              </label>
              <input
                id="photo-upload"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className={styles.fileInput}
              />
              {photo && (
                <button
                  type="button"
                  className={styles.removePhotoButton}
                  onClick={() => {
                    setPhoto(null);
                    localStorage.removeItem("userPhoto");
                  }}
                >
                  Hapus Foto
                </button>
              )}
            </div>
          </div>

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
