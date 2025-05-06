"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import styles from "../../login/login.module.css";

function LoadingState() {
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

function AuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isProcessing, setIsProcessing] = useState(true);

  useEffect(() => {
    if (!router || !searchParams) {
      return;
    }

    const handleAuth = async () => {
      try {
        const token = searchParams.get("token");
        const name = searchParams.get("name");
        const email = searchParams.get("email");
        const photo = searchParams.get("photo");
        const error = searchParams.get("error");

        if (error) {
          console.error(`Authentication error: ${error}`);
          router.push(`/login?error=${error}`);
          return;
        }

        if (token) {
          localStorage.setItem("userToken", token);
          localStorage.setItem("userName", name || "");
          localStorage.setItem("userEmail", email || "");
          localStorage.setItem("isLoggedIn", "true");

          if (photo) {
            localStorage.setItem("userPhoto", photo);
          }

          console.log(
            "Google authentication successful, redirecting to dashboard"
          );

          router.push("/dashboard");
        } else {
          console.error("No token received in callback");
          router.push("/login?error=authentication_failed");
        }
      } catch (error) {
        console.error("Error during auth callback:", error);
        router.push("/login?error=callback_error");
      } finally {
        setIsProcessing(false);
      }
    };

    handleAuth();
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

export default function AuthCallback() {
  return (
    <Suspense fallback={<LoadingState />}>
      <AuthCallbackContent />
    </Suspense>
  );
}
