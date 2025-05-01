"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import styles from "./login.module.css";
import { FiArrowLeft, FiMail, FiLock } from "react-icons/fi";

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
      const response = await fetch("http://localhost:5000/api/auth/verify", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        router.push("/dashboard");
      } else {
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
      const response = await fetch("http://localhost:5000/api/auth/login", {
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
        localStorage.setItem("isLoggedIn", "true"); // Add this line
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

  const handleGoogleLogin = async () => {
    try {
      // Redirect to the backend Google authentication endpoint
      window.location.href = "http://localhost:5000/api/auth/google";
    } catch (error) {
      console.error("Google login error:", error);
      setErrorMsg("Terjadi kesalahan saat login dengan Google.");
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

        <button
          type="button"
          className={styles.googleButton}
          onClick={handleGoogleLogin}
        >
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

export function AuthCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const token = searchParams.get("token");
    const name = searchParams.get("name");
    const email = searchParams.get("email");
    const photo = searchParams.get("photo");

    if (token) {
      // Store user data in localStorage
      localStorage.setItem("userToken", token);
      localStorage.setItem("userName", name);
      localStorage.setItem("userEmail", email);
      localStorage.setItem("isLoggedIn", "true");

      if (photo) {
        localStorage.setItem("userPhoto", photo);
      }

      // Redirect to dashboard
      router.push("/dashboard");
    } else {
      // Handle error case
      router.push("/login?error=authentication_failed");
    }
  }, [router, searchParams]);

  return (
    <div className={styles.container}>
      <div className={styles.formCard}>
        <h1 className={styles.title}>Proses Autentikasi</h1>
        <p className={styles.subtitle}>Mohon tunggu sebentar...</p>
        <div className={styles.loadingSpinner}></div>
      </div>
    </div>
  );
}
