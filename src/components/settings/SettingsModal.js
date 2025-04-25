"use client";

import { FiX } from "react-icons/fi";
import styles from "@/app/page.module.css";
import { useToast } from "@/components/toast/toastProvider";
import Link from "next/link";
import Image from "next/image";

export default function SettingsModal({ onClose, setting }) {
  const { addToast } = useToast();

  const renderContent = () => {
    switch (setting) {
      case "help":
        return (
          <>
            <h2>Help & Support</h2>
            <div className={styles.settingsContent}>
              <h3>Contact Us</h3>
              <p>Email: support@spend.ly</p>
              <p>Phone: +1 (555) 123-4567</p>

              <h3>FAQs</h3>
              <div className={styles.faqItem}>
                <h4>How do I add a transaction?</h4>
                <p>
                  Go to Wallet and tap the + button to add a new transaction.
                </p>
              </div>

              <button
                className={styles.supportButton}
                onClick={() =>
                  addToast(
                    "Support ticket created! We'll get back to you soon.",
                    "success",
                    3000
                  )
                }
              >
                Create Support Ticket
              </button>
            </div>
          </>
        );

      case "about":
        return (
          <>
            <h2>About Spend.ly</h2>
            <div className={styles.settingsContent}>
              <div className={styles.appLogoContainer}>
                <div className={styles.appLogoWrapper}>
                  <Image
                    src="/logo.svg"
                    width={36}
                    height={36}
                    alt="Spend.ly Logo"
                    className={styles.appLogo}
                  />
                </div>
                <h3>Spend.ly</h3>
              </div>

              <p className={styles.appVersion}>Version 1.0.0</p>
              <p className={styles.appDescription}>
                Spend.ly helps you track your daily expenses and income with a
                simple, elegant interface. Set budgets, categorize transactions,
                and get insights into your spending habits to make better
                financial decisions.
              </p>

              <h3>Development Team</h3>
              <ul className={styles.teamList}>
                <li>I Kadek Tresna Jeverly - Lead Developer</li>
                <li>Arturito Imanuel Rawung - UI/UX Designer</li>
                <li>Revando Aruperes - Backend Engineer</li>
                <li>Ricky Mambu - Mobile Developer</li>
              </ul>

              <div className={styles.legalInfo}>
                <p>&copy; 2023 Spend.ly - All rights reserved</p>
                <div className={styles.legalLinks}>
                  <Link href="/terms" className={styles.legalLink}>
                    Terms of Service
                  </Link>
                  <Link href="/privacy" className={styles.legalLink}>
                    Privacy Policy
                  </Link>
                </div>
              </div>
            </div>
          </>
        );

      default:
        return <p>Select a setting to view details</p>;
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <button className={styles.closeButton} onClick={onClose}>
          <FiX size={24} />
        </button>

        {renderContent()}
      </div>
    </div>
  );
}
