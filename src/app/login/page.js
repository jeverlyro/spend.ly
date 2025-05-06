"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import styles from "./login.module.css";
import { FiMail, FiLock, FiArrowLeft, FiEye, FiEyeOff } from "react-icons/fi";
import { getApiEndpoint } from "@/utils/api";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  const verifyToken = useCallback(
    async (token) => {
      try {
        const response = await fetch(getApiEndpoint("/api/auth/verify"), {
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
    },
    [router]
  );

  useEffect(() => {
    if (searchParams.get("registered") === "true") {
      setSuccessMsg(
        "Registrasi berhasil! Silakan periksa email Anda untuk verifikasi."
      );
    }

    if (searchParams.get("verified") === "true") {
      setSuccessMsg(
        "Email berhasil diverifikasi! Silakan masuk dengan akun Anda."
      );
    }
    if (searchParams.get("reset") === "success") {
      setSuccessMsg(
        "Kata sandi berhasil direset! Silakan masuk dengan kata sandi baru Anda."
      );
    }

    const token = localStorage.getItem("userToken");

    if (token) {
      verifyToken(token);
    }
  }, [router, searchParams, verifyToken]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg("");

    try {
      const response = await fetch(getApiEndpoint("/api/auth/login"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("userToken", data.token);
        localStorage.setItem("userName", data.user.name);
        localStorage.setItem("userEmail", data.user.email);
        localStorage.setItem("isLoggedIn", "true");
        if (data.user.photo) {
          localStorage.setItem("userPhoto", data.user.photo);
        }

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
      window.location.href = getApiEndpoint("/api/auth/google");
    } catch (error) {
      console.error("Google login error:", error);
      setErrorMsg("Terjadi kesalahan saat login dengan Google.");
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
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
        {successMsg && <div className={styles.successAlert}>{successMsg}</div>}

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
                type={showPassword ? "text" : "password"}
                placeholder="Masukkan kata sandi Anda"
                className={styles.input}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                className={styles.passwordToggle}
                onClick={togglePasswordVisibility}
                aria-label={
                  showPassword
                    ? "Sembunyikan kata sandi"
                    : "Tampilkan kata sandi"
                }
              >
                {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
              </button>
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
    console.log("Auth callback component mounted");

    searchParams.forEach((value, key) => {
      console.log(`${key}: ${value}`);
    });

    const token = searchParams.get("token");
    const name = searchParams.get("name");
    const email = searchParams.get("email");
    const photo = searchParams.get("photo");

    console.log(`Token received: ${token ? "Yes" : "No"}`);

    if (token) {
      localStorage.setItem("userToken", token);
      localStorage.setItem("userName", name || "");
      localStorage.setItem("userEmail", email || "");
      localStorage.setItem("isLoggedIn", "true");

      if (photo) {
        localStorage.setItem("userPhoto", photo);
      }

      console.log("Redirecting to dashboard");
      router.push("/dashboard");
    } else {
      console.error("No token in callback, redirecting to login");
      router.push("/login?error=authentication_failed");
    }
  }, [router, searchParams]);
}
