import React, { useState } from "react";
import "./App.css";
import { Header } from "./components/Header";
import { List } from "./components/List";
import { nanoid } from "nanoid";
import { AddForm } from "./components/AddForm";

export const App = () => {
  const [posts, setPosts] = useState([
    {
      id: nanoid(),
      title: "International evidence",
      body: "Interesting article",
    },
    { id: nanoid(), title: "Weather forecast", body: "When does spring come?" },
  ]);

  const handleDelete = (id) => {
    setPosts((prev) => prev.filter((item) => item.id !== id));
  };

  const handleAddPost = (data) => {
    setPosts((prev) => [...prev, { ...data, id: nanoid() }]);
  };

  return (
    <div className="container">
      <Header title="Whats New?" className="header" />
      <AddForm handleAddPost={handleAddPost} className="post-form" />
      <List items={posts} handleDelete={handleDelete} className="post-list" />
    </div>
  );
};
