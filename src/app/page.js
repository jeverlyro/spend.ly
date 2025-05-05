"use client";

import { useState, useEffect } from "react";
import { redirect } from "next/navigation";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";

export default function Home() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if the user has seen onboarding
    const hasSeenOnboarding = localStorage.getItem("hasSeenOnboarding");

    // Check if user is logged in
    const isLoggedIn = localStorage.getItem("isLoggedIn");

    // Determine where to redirect
    if (!hasSeenOnboarding) {
      router.push("/onboarding");
    } else if (!isLoggedIn) {
      router.push("/login");
    } else {
      router.push("/dashboard");
    }
  }, [router]);

  return (
    <div className={styles.loadingContainer}>
      <div className={styles.loadingSpinner}></div>
      <p>Memuat...</p>
    </div>
  );
}
