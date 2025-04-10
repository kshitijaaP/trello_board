import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";
import { useState, useEffect } from "react";
import styles from "./styles.module.css";
export default function CardModal({
  open,
  onClose,
  cardTitle,
  onSave,
  onDelete,
}) {
  const [title, setTitle] = useState(cardTitle || "");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");

  useEffect(() => {
    setTitle(cardTitle);
  }, [cardTitle]);

  const handleSave = () => {
    const updatedData = {
      title,
      description,
      dueDate,
    };
    onSave(updatedData);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Edit Card</DialogTitle>
      <DialogContent
        sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}
      >
        <TextField
          placeholder="Card Title..."
          variant="standard"
          fullWidth
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          InputProps={{
            disableUnderline: true,
            sx: {
              marginTop: "20px",
              border: "1px solid #ccc",
              borderRadius: "8px",
              padding: "10px 12px",
              fontSize: "16px",
              backgroundColor: "#f9f9f9",
              "&:hover": {
                borderColor: "#999",
              },
              "&:focus-within": {
                borderColor: "#1976d2",
                boxShadow: "0 0 0 2px rgba(25, 118, 210, 0.2)",
              },
            },
          }}
          sx={{ mb: 3 }}
        />

        <TextField
          placeholder="Description"
          variant="standard"
          InputProps={{
            disableUnderline: true,
            sx: {
              border: "1px solid #ccc",
              borderRadius: "8px",
              padding: "10px 12px",
              fontSize: "16px",
              backgroundColor: "#f9f9f9",
              "&:hover": {
                borderColor: "#999",
              },
              "&:focus-within": {
                borderColor: "#1976d2",
                boxShadow: "0 0 0 2px rgba(25, 118, 210, 0.2)",
              },
            },
          }}
          fullWidth
          multiline
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <TextField
          label="Due Date"
          type="date"
          InputLabelProps={{ shrink: true }}
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />
      </DialogContent>

      <DialogActions>
        <button className={styles.deleteBtn} onClick={onDelete}>
          Delete
        </button>

        <button className={styles.cancelBtn} onClick={onClose}>
          Cancel
        </button>
        <button
          className={styles.saveBtn}
          onClick={handleSave}
          variant="contained"
          color="primary"
        >
          Save
        </button>
      </DialogActions>
    </Dialog>
  );
}
