import { useEffect, useState } from "react";
import ListModal from "../ListModal";
import styles from "./styles.module.css";
import ListCard from "../ListCard";

export default function Dashboard() {
  const [open, setOpen] = useState(false);
  const [savedList, setSavedList] = useState([]);

  useEffect(() => {
    try {
      const storedData = localStorage.getItem("board");

      if (storedData) {
        const parsed = JSON.parse(storedData);
        if (Array.isArray(parsed.listArray)) {
          setSavedList(parsed.listArray);
        }
      }
    } catch (err) {
      console.error("Error reading localStorage:", err);
    }
  }, []);

  useEffect(() => {
    if (savedList?.length > 0) {
      const existing = JSON.parse(localStorage.getItem("board")) || {};
      localStorage.setItem(
        "board",
        JSON.stringify({ ...existing, listArray: savedList })
      );
    }
  }, [savedList]);

  const handleSave = (name) => {
    if (name?.trim()) {
      setSavedList((prev) => [...prev, name]);
    }
  };

  const updateList = (index) => {
    const updatedArray = [...savedList];
    updatedArray.splice(index, 1);
    setSavedList(updatedArray);
  };

  const handleReset = () => {
    setSavedList([]);
    localStorage.removeItem("board");
  };

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.container}>
        <div className={styles.rowcontainer}>
          <h1>Hey John, Welcome To Trello Board</h1>
          <div>
            <button onClick={() => setOpen(true)} className={styles.newlistBtn}>
              Add New List
            </button>
            <button onClick={handleReset} className={styles.resetlistBtn}>
              Reset List
            </button>
          </div>
        </div>
      </div>

      <ListModal
        open={open}
        onClose={() => setOpen(false)}
        onSave={handleSave}
      />

      <div style={{ flex: "0.9" }}>
        {savedList.length > 0 ? (
          <ListCard list={savedList} updateList={updateList} />
        ) : (
          <div className={styles.centerWrapper}>
            <button
              onClick={() => setOpen(true)}
              className={styles.centerAddNew}
            >
              Let's Start by Adding New List
            </button>
          </div>
        )}
      </div>

      <div className={styles.footer}>
        <div className={styles.footerContent}>
          <p>
            &copy; {new Date().getFullYear()} TrelloBoard Inc. All rights
            reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
