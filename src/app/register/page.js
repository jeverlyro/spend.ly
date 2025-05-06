"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import styles from "./register.module.css";
import { FiMail, FiLock, FiUser, FiArrowLeft } from "react-icons/fi";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg("");

    // Validate password
    if (password.length < 8) {
      setErrorMsg("Kata sandi harus minimal 8 karakter");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("userToken", data.token);
        localStorage.setItem("userName", data.user.name);
        localStorage.setItem("userEmail", data.user.email);

        router.push("/login");
      } else {
        setErrorMsg(data.message || "Registrasi gagal. Silakan coba lagi.");
      }
    } catch (error) {
      console.error("Registration error:", error);
      setErrorMsg("Terjadi kesalahan. Silakan coba lagi nanti.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.formCard}>
        <Link href="/login" className={styles.backButton}>
          <FiArrowLeft size={20} />
        </Link>

        <h1 className={styles.title}>Buat akun Anda</h1>
        <p className={styles.subtitle}>Mulai lacak keuangan Anda hari ini</p>

        {errorMsg && <div className={styles.errorAlert}>{errorMsg}</div>}

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.inputGroup}>
            <label htmlFor="name" className={styles.label}>
              Nama lengkap
            </label>
            <div className={styles.inputWithIcon}>
              <FiUser className={styles.inputIcon} size={18} />
              <input
                id="name"
                type="text"
                placeholder="Masukkan nama Anda"
                className={styles.input}
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="email" className={styles.label}>
              Alamat email
            </label>
            <div className={styles.inputWithIcon}>
              <FiMail className={styles.inputIcon} size={18} />
              <input
                id="email"
                type="email"
                placeholder="nama@contoh.com"
                className={styles.input}
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="password" className={styles.label}>
              Kata Sandi
            </label>
            <div className={styles.inputWithIcon}>
              <FiLock className={styles.inputIcon} size={18} />
              <input
                id="password"
                type="password"
                placeholder="Buat kata sandi"
                className={styles.input}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <p className={styles.passwordHint}>Harus minimal 8 karakter</p>
          </div>

          <button
            type="submit"
            className={styles.submitButton}
            disabled={isLoading}
          >
            {isLoading ? "Membuat akun..." : "Buat akun"}
          </button>
        </form>

        <div className={styles.divider}>
          <span>atau</span>
        </div>

        <button className={styles.googleButton}>
          <Image src="/google.svg" alt="Ikon Google" width={18} height={18} />
          Daftar dengan Google
        </button>

        <p className={styles.loginText}>
          Sudah memiliki akun?{" "}
          <Link href="/login" className={styles.loginLink}>
            Masuk
          </Link>
        </p>
      </div>
    </div>
  );
}
