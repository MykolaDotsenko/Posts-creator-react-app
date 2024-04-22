import React from "react";
import styles from "./List.module.css";

export const List = ({ items, handleDelete }) => {
  return (
    <div className={styles.list}>
      <ul className={styles.itemList}>
        {items.map((item) => (
          <li key={item.id} className={styles.item}>
            <h2>{item.title}</h2>
            <p>{item.body}</p>
            <button onClick={() => handleDelete(item.id)} className={styles.deleteButton}>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};
