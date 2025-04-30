"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import styles from "./onboarding.module.css";
import { FiArrowRight, FiChevronRight, FiChevronLeft } from "react-icons/fi";

const slides = [
  {
    title: "Lacak Pengeluaran Anda",
    description:
      "Dengan mudah catat dan kategorikan semua pengeluaran Anda dalam satu tempat",
    image: "/expense-tracking.svg",
  },
  {
    title: "Visualisasikan Keuangan Anda",
    description:
      "Lihat kemana uang Anda mengalir dengan grafik dan ringkasan yang membantu",
    image: "/finance-chart.svg",
  },
  {
    title: "Tetapkan Tujuan Keuangan",
    description:
      "Buat anggaran dan tabung untuk hal yang paling penting bagi Anda",
    image: "/goals.svg",
  },
];

export default function Onboarding() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [animatingOut, setAnimatingOut] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    const showOnboarding = localStorage.getItem("showOnboarding");

    if (isLoggedIn === "true") {
      router.push("/dashboard");
    } else if (
      showOnboarding !== "true" &&
      localStorage.getItem("hasSeenOnboarding") === "true"
    ) {
      router.push("/login");
    }
  }, [router]);

  const nextSlide = useCallback(() => {
    if (currentSlide < slides.length - 1) {
      setAnimatingOut(true);
      setTimeout(() => {
        setCurrentSlide(currentSlide + 1);
        setAnimatingOut(false);
      }, 300);
    }
  }, [currentSlide]);

  const prevSlide = useCallback(() => {
    if (currentSlide > 0) {
      setAnimatingOut(true);
      setTimeout(() => {
        setCurrentSlide(currentSlide - 1);
        setAnimatingOut(false);
      }, 300);
    }
  }, [currentSlide]);

  // Update the completeOnboarding function to mark that user has seen onboarding
  const completeOnboarding = () => {
    localStorage.setItem("hasSeenOnboarding", "true");
    localStorage.removeItem("showOnboarding");
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (currentSlide < slides.length - 1) {
        nextSlide();
      }
    }, 5000);

    return () => clearTimeout(timer);
  }, [currentSlide, nextSlide]);

  return (
    <div className={styles.container}>
      <div className={styles.onboardingCard}>
        <div className={styles.logoContainer}>
          <Image src="/logo.svg" alt="Logo Spend.ly" width={40} height={40} />
          <h1 className={styles.logoText}>spend.ly</h1>
        </div>

        <div
          className={`${styles.slideContent} ${
            animatingOut ? styles.fadeOut : styles.fadeIn
          }`}
        >
          <div className={styles.imageContainer}>
            <Image
              src={slides[currentSlide].image}
              alt={slides[currentSlide].title}
              width={240}
              height={240}
              priority={true}
            />
          </div>

          <h2 className={styles.slideTitle}>{slides[currentSlide].title}</h2>
          <p className={styles.slideDescription}>
            {slides[currentSlide].description}
          </p>
        </div>

        <div className={styles.pagination}>
          {slides.map((_, index) => (
            <div
              key={index}
              className={`${styles.dot} ${
                currentSlide === index ? styles.activeDot : ""
              }`}
              onClick={() => setCurrentSlide(index)}
            />
          ))}
        </div>

        <div className={styles.navigation}>
          {currentSlide > 0 && (
            <button className={styles.navButton} onClick={prevSlide}>
              <FiChevronLeft size={24} />
            </button>
          )}

          <div className={styles.spacer} />

          {currentSlide < slides.length - 1 ? (
            <button className={styles.navButton} onClick={nextSlide}>
              <FiChevronRight size={24} />
            </button>
          ) : (
            <Link
              href="/login"
              className={styles.getStartedButton}
              onClick={completeOnboarding}
            >
              Mulai Sekarang <FiArrowRight size={18} />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
