import React, { useState, useEffect } from "react";
import { FaBookmark, FaRocket } from "react-icons/fa"; // Temporary favicon icon
import styles from "./Navbar.module.css";
import logo from "../neural.png";

const Navbar = () => {
  const [isFixed, setIsFixed] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > window.innerHeight * 0.1) {
        setIsFixed(true);
      } else {
        setIsFixed(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className={`${styles.navbar} ${isFixed ? styles.fixed : ""}`}>
      <div className={styles.logo}>
        {/* <FaRocket className={styles.icon} /> */}
        <img src={logo} alt="Logo" className={styles.logoImage} />
        <span className={styles.brandName}>TrialNet</span>
      </div>

      <ul className={styles.navLinks}>
        <li>
          <a href="#">Home</a>
        </li>
        <li>
          <a href="#">About</a>
        </li>
        <li>
          <a href="#">Team</a>
        </li>
      </ul>

      <div className={styles.authButtons}>
        <button className={styles.loginBtn}>
          <FaBookmark />
        </button>
        <button className={styles.tryBtn}>Demo ➔</button>
      </div>
    </nav>
  );
};

export default Navbar;
