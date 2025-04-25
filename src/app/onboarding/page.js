"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import styles from "./onboarding.module.css";
import { FiArrowRight, FiChevronRight, FiChevronLeft } from "react-icons/fi";

const slides = [
  {
    title: "Track Your Expenses",
    description: "Easily log and categorize all your spending in one place",
    image: "/expense-tracking.svg",
  },
  {
    title: "Visualize Your Finances",
    description: "See where your money goes with helpful charts and summaries",
    image: "/finance-chart.svg",
  },
  {
    title: "Set Financial Goals",
    description: "Create budgets and save for what matters most to you",
    image: "/goals.svg",
  },
];

export default function Onboarding() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [animatingOut, setAnimatingOut] = useState(false);
  const router = useRouter();

  // If user has already seen onboarding, redirect to login
  useEffect(() => {
    const hasSeenOnboarding = localStorage.getItem("hasSeenOnboarding");
    const isLoggedIn = localStorage.getItem("isLoggedIn");

    if (hasSeenOnboarding === "true" && isLoggedIn === "true") {
      router.push("/dashboard");
    } else if (hasSeenOnboarding === "true") {
      router.push("/login");
    }
  }, [router]);

  const nextSlide = () => {
    if (currentSlide < slides.length - 1) {
      setAnimatingOut(true);
      setTimeout(() => {
        setCurrentSlide(currentSlide + 1);
        setAnimatingOut(false);
      }, 300);
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      setAnimatingOut(true);
      setTimeout(() => {
        setCurrentSlide(currentSlide - 1);
        setAnimatingOut(false);
      }, 300);
    }
  };

  const completeOnboarding = () => {
    // Mark onboarding as completed in localStorage
    localStorage.setItem("hasSeenOnboarding", "true");
  };

  // Auto-advance slides every 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      if (currentSlide < slides.length - 1) {
        nextSlide();
      }
    }, 5000);

    return () => clearTimeout(timer);
  }, [currentSlide]);

  return (
    <div className={styles.container}>
      <div className={styles.onboardingCard}>
        <div className={styles.logoContainer}>
          <Image src="/logo.svg" alt="Spend.ly Logo" width={40} height={40} />
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
              Get Started <FiArrowRight size={18} />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
