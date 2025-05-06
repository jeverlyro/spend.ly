"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FiArrowLeft, FiCheck } from "react-icons/fi";
import styles from "./verify-email.module.css";

export default function VerifyEmail() {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [countdown, setCountdown] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const storedEmail = localStorage.getItem("pendingVerificationEmail");
    if (!storedEmail) {
      router.push("/register");
      return;
    }
    setEmail(storedEmail);
  }, [router]);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleInputChange = (index, value) => {
    if (value.length > 1) {
      value = value.slice(0, 1);
    }

    // Only allow numbers
    if (value && !/^\d+$/.test(value)) {
      return;
    }

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto focus next input
    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`).focus();
    }
  };

  const handleKeyDown = (index, e) => {
    // Handle backspace
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`).focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").trim();

    if (/^\d+$/.test(pastedData) && pastedData.length <= 6) {
      const digits = pastedData.split("").slice(0, 6);
      const newOtp = [...otp];

      digits.forEach((digit, index) => {
        if (index < 6) newOtp[index] = digit;
      });

      setOtp(newOtp);

      // Focus last filled input or the next empty one
      const lastIndex = Math.min(digits.length, 5);
      document.getElementById(`otp-${lastIndex}`).focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const otpValue = otp.join("");

    if (otpValue.length !== 6) {
      setError("Masukkan kode verifikasi 6 digit");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:5000/api/auth/verify-email",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, otp: otpValue }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        // Clear pending email
        localStorage.removeItem("pendingVerificationEmail");

        // Redirect to login with success message
        router.push("/login?verified=true");
      } else {
        setError(data.message || "Kode verifikasi tidak valid");
      }
    } catch (error) {
      console.error("Verification error:", error);
      setError("Terjadi kesalahan. Silakan coba lagi nanti.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (countdown > 0) return;

    setIsLoading(true);
    setError("");

    try {
      const response = await fetch(
        "http://localhost:5000/api/auth/resend-otp",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setCountdown(60);
      } else {
        setError(data.message || "Gagal mengirim ulang kode OTP");
      }
    } catch (error) {
      console.error("Resend OTP error:", error);
      setError("Terjadi kesalahan. Silakan coba lagi nanti.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.formCard}>
        <Link href="/register" className={styles.backButton}>
          <FiArrowLeft size={20} />
        </Link>

        <h1 className={styles.title}>Verifikasi Email</h1>
        <p className={styles.subtitle}>
          Kami telah mengirimkan kode verifikasi ke
          <br />
          <strong>{email}</strong>
        </p>

        {error && <div className={styles.errorAlert}>{error}</div>}

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.otpContainer}>
            {otp.map((digit, index) => (
              <input
                key={index}
                id={`otp-${index}`}
                type="text"
                maxLength="1"
                value={digit}
                onChange={(e) => handleInputChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={index === 0 ? handlePaste : undefined}
                className={styles.otpInput}
                autoFocus={index === 0}
              />
            ))}
          </div>

          <button
            type="submit"
            className={styles.submitButton}
            disabled={isLoading || otp.join("").length !== 6}
          >
            {isLoading ? (
              "Memverifikasi..."
            ) : (
              <>
                <FiCheck size={18} /> Verifikasi
              </>
            )}
          </button>
        </form>

        <div className={styles.resendContainer}>
          <p className={styles.resendText}>Tidak menerima kode?</p>
          <button
            onClick={handleResendOtp}
            disabled={countdown > 0 || isLoading}
            className={styles.resendButton}
          >
            {countdown > 0
              ? `Kirim ulang dalam ${countdown}s`
              : "Kirim ulang kode"}
          </button>
        </div>
      </div>
    </div>
  );
}
