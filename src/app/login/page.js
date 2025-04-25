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
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    if (isLoggedIn === "true") {
      router.push("/dashboard");
    }
  }, [router]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg("");

    // Simulate login process
    setTimeout(() => {
      // In a real app you would validate credentials with your backend
      if (email && password) {
        // Store auth state in localStorage (in a real app, use secure auth tokens)
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("userEmail", email);

        // Redirect to dashboard
        router.push("/dashboard");
      } else {
        setErrorMsg("Please enter both email and password");
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

        <h1 className={styles.title}>Welcome back</h1>
        <p className={styles.subtitle}>Sign in to your account</p>

        {errorMsg && <div className={styles.errorAlert}>{errorMsg}</div>}

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.inputGroup}>
            <label htmlFor="email" className={styles.label}>
              Email address
            </label>
            <div className={styles.inputWithIcon}>
              <FiMail className={styles.inputIcon} size={18} />
              <input
                id="email"
                type="email"
                placeholder="name@example.com"
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
                Password
              </label>
              <Link href="/forgot-password" className={styles.forgotLink}>
                Forgot password?
              </Link>
            </div>
            <div className={styles.inputWithIcon}>
              <FiLock className={styles.inputIcon} size={18} />
              <input
                id="password"
                type="password"
                placeholder="Enter your password"
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
            {isLoading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <div className={styles.divider}>
          <span>or</span>
        </div>

        <button className={styles.googleButton}>
          <Image src="/google.svg" alt="Google icon" width={18} height={18} />
          Sign in with Google
        </button>

        {process.env.NODE_ENV === "development" && (
          <button onClick={skipLogin} className={styles.demoButton}>
            Continue as demo user
          </button>
        )}

        <p className={styles.signupText}>
          Don&apos;t have an account?{" "}
          <Link href="/register" className={styles.signupLink}>
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
