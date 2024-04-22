import React from "react";
import styles from "./Header.module.css";

export const Header = ({ title }) => {
  return (
    <div className={styles.header}>
      <h1>{title}</h1>
    </div>
  );
};
