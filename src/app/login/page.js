"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import styles from "./login.module.css";
import { FiMail, FiLock, FiArrowLeft } from "react-icons/fi";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const router = useRouter();

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    if (isLoggedIn === "true") {
      router.push("/dashboard");
    }
  }, [router]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg("");

    setTimeout(() => {
      if (email && password) {
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("userEmail", email);

        router.push("/dashboard");
      } else {
        setErrorMsg("Silakan masukkan email dan kata sandi");
      }
      setIsLoading(false);
    }, 1000);
  };

  // Allow users to skip login in development environment
  const skipLogin = () => {
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("userEmail", "demo@example.com");
    router.push("/dashboard");
  };

  return (
    <div className={styles.container}>
      <div className={styles.formCard}>
        <Link href="/onboarding" className={styles.backButton}>
          <FiArrowLeft size={20} />
        </Link>

        <h1 className={styles.title}>Selamat datang</h1>
        <p className={styles.subtitle}>Masuk ke akun Anda</p>

        {errorMsg && <div className={styles.errorAlert}>{errorMsg}</div>}

        <form className={styles.form} onSubmit={handleSubmit}>
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
            <div className={styles.labelRow}>
              <label htmlFor="password" className={styles.label}>
                Kata Sandi
              </label>
              <Link href="/forgot-password" className={styles.forgotLink}>
                Lupa kata sandi?
              </Link>
            </div>
            <div className={styles.inputWithIcon}>
              <FiLock className={styles.inputIcon} size={18} />
              <input
                id="password"
                type="password"
                placeholder="Masukkan kata sandi Anda"
                className={styles.input}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button
            type="submit"
            className={styles.submitButton}
            disabled={isLoading}
          >
            {isLoading ? "Sedang masuk..." : "Masuk"}
          </button>
        </form>

        <div className={styles.divider}>
          <span>atau</span>
        </div>

        <button className={styles.googleButton}>
          <Image src="/google.svg" alt="Ikon Google" width={18} height={18} />
          Masuk dengan Google
        </button>

        {process.env.NODE_ENV === "development" && (
          <button onClick={skipLogin} className={styles.demoButton}>
            Lanjutkan sebagai pengguna demo
          </button>
        )}

        <p className={styles.signupText}>
          Belum memiliki akun?{" "}
          <Link href="/register" className={styles.signupLink}>
            Daftar
          </Link>
        </p>
      </div>
    </div>
  );
}
