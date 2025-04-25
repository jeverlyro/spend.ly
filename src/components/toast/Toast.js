"use client";

import { useState, useEffect } from "react";
import { FiX, FiAlertCircle, FiCheckCircle, FiInfo } from "react-icons/fi";
import styles from "./Toast.module.css";

export default function Toast({
  message,
  type = "info",
  duration = 3000,
  onClose,
}) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(() => {
        onClose();
      }, 300); // Allow exit animation to complete
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const getIcon = () => {
    switch (type) {
      case "success":
        return <FiCheckCircle size={20} />;
      case "error":
        return <FiAlertCircle size={20} />;
      case "info":
      default:
        return <FiInfo size={20} />;
    }
  };

  return (
    <div
      className={`${styles.toastContainer} ${
        visible ? styles.visible : styles.hidden
      }`}
    >
      <div className={`${styles.toast} ${styles[type]}`}>
        <div className={styles.iconContainer}>{getIcon()}</div>
        <div className={styles.message}>{message}</div>
        <button
          className={styles.closeButton}
          onClick={() => setVisible(false)}
        >
          <FiX size={18} />
        </button>
      </div>
    </div>
  );
}
