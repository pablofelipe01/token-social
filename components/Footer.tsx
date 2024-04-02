import styles from "../styles/Home.module.css";

const Footer = () => {
    return (
      <footer className={styles.footerContainer}>
        <div className={styles.footerContent}>
          <p>© 2024 Sylicon Housing. All rights reserved.</p>
          <div className={styles.footerLinks}>
            <a href="/terms">Terms of Service</a>
            <a href="/privacy">Privacy Policy</a>
          </div>
        </div>
      </footer>
    );
  };
  
  export default Footer;