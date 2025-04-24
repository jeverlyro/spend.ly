import Link from "next/link";
import Image from "next/image";
import styles from "./login.module.css";
import { FiMail, FiLock, FiArrowLeft } from "react-icons/fi";

export default function Login() {
  return (
    <div className={styles.container}>
      <div className={styles.formCard}>
        <Link href="/" className={styles.backButton}>
          <FiArrowLeft size={20} />
        </Link>

        <h1 className={styles.title}>Welcome back</h1>
        <p className={styles.subtitle}>Sign in to your account</p>

        <form className={styles.form}>
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
              />
            </div>
          </div>

          <button type="submit" className={styles.submitButton}>
            Sign in
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
          Sign in with Google
        </button>

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
