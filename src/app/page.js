"use client";

import { useState, useEffect } from "react";
import { redirect } from "next/navigation";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";

export default function Home() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    const hasSeenOnboarding = localStorage.getItem("hasSeenOnboarding");
    const showOnboarding = localStorage.getItem("showOnboarding");

    // Determine where to redirect
    if (isLoggedIn === "true") {
      router.push("/dashboard");
    } else if (showOnboarding === "true" || !hasSeenOnboarding) {
      // Show onboarding if explicitly set to or if user hasn't seen it before
      router.push("/onboarding");
    } else {
      // Otherwise go to login
      router.push("/login");
    }
  }, [router]);

  return (
    <div className={styles.loadingContainer}>
      <div className={styles.loadingSpinner}></div>
      <p>Memuat...</p>
    </div>
  );
}
