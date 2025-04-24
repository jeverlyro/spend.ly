import Link from "next/link";
import Image from "next/image";
import styles from "./register.module.css";
import { FiMail, FiLock, FiUser, FiArrowLeft } from "react-icons/fi";

export default function Register() {
  return (
    <div className={styles.container}>
      <div className={styles.formCard}>
        <Link href="/" className={styles.backButton}>
          <FiArrowLeft size={20} />
        </Link>

        <h1 className={styles.title}>Create your account</h1>
        <p className={styles.subtitle}>Start tracking your finances today</p>

        <form className={styles.form}>
          <div className={styles.inputGroup}>
            <label htmlFor="name" className={styles.label}>
              Full name
            </label>
            <div className={styles.inputWithIcon}>
              <FiUser className={styles.inputIcon} size={18} />
              <input
                id="name"
                type="text"
                placeholder="Enter your name"
                className={styles.input}
                required
              />
            </div>
          </div>

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
              />
            </div>
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="password" className={styles.label}>
              Password
            </label>
            <div className={styles.inputWithIcon}>
              <FiLock className={styles.inputIcon} size={18} />
              <input
                id="password"
                type="password"
                placeholder="Create a password"
                className={styles.input}
                required
              />
            </div>
            <p className={styles.passwordHint}>
              Must be at least 8 characters long
            </p>
          </div>

          <button type="submit" className={styles.submitButton}>
            Create account
          </button>
        </form>

        <div className={styles.divider}>
          <span>or</span>
        </div>

        <button className={styles.googleButton}>
          <Image
            src="/google-icon.svg"
            alt="Google icon"
            width={18}
            height={18}
          />
          Sign up with Google
        </button>

        <p className={styles.loginText}>
          Already have an account?{" "}
          <Link href="/login" className={styles.loginLink}>
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
