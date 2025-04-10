import React, { useEffect, useState } from "react";
import { Modal, Box, IconButton, TextField, Button } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  borderRadius: "12px",
  boxShadow: 24,
  p: 4,
};

const ListModal = ({ open, onClose, onSave, name }) => {
  const [listName, setListName] = useState("");
  useEffect(() => {
    if (name) {
      setListName(name);
    }
  }, [name]);

  const handleSave = () => {
    onSave(listName);
    setListName("");
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={style}>
        <IconButton
          onClick={onClose}
          sx={{ position: "absolute", top: 1, right: 8 }}
        >
          <CloseIcon />
        </IconButton>

        <TextField
          fullWidth
          placeholder="Enter list name..."
          variant="standard"
          value={listName}
          onChange={(e) => setListName(e.target.value)}
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

        <Button
          onClick={handleSave}
          disabled={!listName.trim()}
          fullWidth
          sx={{
            backgroundColor: "#4CAF50",
            color: "#fff",
            padding: "10px 16px",
            borderRadius: "8px",
            textTransform: "none",
            fontWeight: 500,
            fontSize: "16px",
            boxShadow: "none",
            "&:hover": {
              backgroundColor: "#45a049",
              boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
            },
            "&:disabled": {
              backgroundColor: "#e0e0e0",
              color: "#9e9e9e",
              cursor: "not-allowed",
            },
          }}
        >
          Save
        </Button>
      </Box>
    </Modal>
  );
};

export default ListModal;
