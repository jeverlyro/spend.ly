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
    // Check if user is already logged in
    const token = localStorage.getItem("userToken");

    if (token) {
      // Verify token validity with backend
      verifyToken(token);
    }
  }, [router]);

  // Function to verify token with backend
  const verifyToken = async (token) => {
    try {
      const response = await fetch("http://localhost:3000/api/auth/verify", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        // Token is valid, redirect to dashboard
        router.push("/dashboard");
      } else {
        // Token invalid, clear localStorage
        localStorage.removeItem("userToken");
        localStorage.removeItem("userName");
        localStorage.removeItem("userEmail");
        localStorage.removeItem("userPhoto");
      }
    } catch (error) {
      console.error("Token verification error:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg("");

    try {
      const response = await fetch("http://localhost:3000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Store user data in localStorage
        localStorage.setItem("userToken", data.token);
        localStorage.setItem("userName", data.user.name);
        localStorage.setItem("userEmail", data.user.email);
        if (data.user.photo) {
          localStorage.setItem("userPhoto", data.user.photo);
        }

        // Redirect to dashboard
        router.push("/dashboard");
      } else {
        setErrorMsg(
          data.message ||
            "Login gagal. Silakan periksa email dan kata sandi Anda."
        );
      }
    } catch (error) {
      console.error("Login error:", error);
      setErrorMsg("Terjadi kesalahan. Silakan coba lagi nanti.");
    } finally {
      setIsLoading(false);
    }
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
