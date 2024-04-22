import React, { useState } from "react";
import styles from "./AddForm.module.css";

export const AddForm = ({ handleAddPost }) => {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    handleAddPost({ title, body });
    setTitle('');
    setBody('');
  };

  return (
    <div className={styles.form}>
      <form onSubmit={handleSubmit}>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className={styles.input}
          placeholder="Title"
        />
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          className={styles.textarea}
          placeholder="Body"
        ></textarea>
        <button type="submit" className={styles.button}>
          Add Post
        </button>
      </form>
    </div>
  );
};
