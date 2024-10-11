// src/pages/Mediums/CreateMedium.tsx
import React, { useState, useEffect } from "react";
import { TextField, Button } from "@mui/material";
import { createMediums } from "../../api/superAdmin";
import SnackbarComponent from "../../components/SnackbarComponent";

interface CreateMediumProps {
  initialData: { ID: number; Name: string } | null;
  onSave: (name: string) => void;
  onCancel: () => void;
}

const CreateMedium: React.FC<CreateMediumProps> = ({
  initialData,
  onSave,
  onCancel,
}) => {
  const [name, setName] = useState("");
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
    position: { vertical: "top", horizontal: "right" },
  });

  useEffect(() => {
    if (initialData) {
      setName(initialData.Name);
    }
  }, [initialData]);

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const response = await createMediums(name);
    //   console.log("Mediums add Response:", response);
      if (response.status === true) {
        setSnackbar({
          open: true,
          message: "Medium created successfully!",
          severity: "success",
          position: { vertical: "top", horizontal: "right" },
        });
        onSave(name);
      } else {
        throw new Error(response.data);
      }
    } catch (error: any) {
      setSnackbar({
        open: true,
        message: error.response.data.error,
        severity: "error",
        position: { vertical: "top", horizontal: "right" },
      });
    }
  };

  return (
    <>
      <div>
        <h2 className="text-xl font-bold mb-4">
          {initialData ? "Edit Medium" : "Create Medium"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <TextField
            label="Medium Name"
            variant="outlined"
            fullWidth
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <div className="flex justify-end space-x-2">
            <Button onClick={onCancel} variant="outlined" color="success">
              Cancel
            </Button>
            <Button type="submit" variant="contained" color="success">
              {initialData ? "Save Changes" : "Create Medium"}
            </Button>
          </div>
        </form>
      </div>
      <SnackbarComponent
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        position={{
          vertical: snackbar.position.vertical as "top" | "bottom",
          horizontal: snackbar.position.horizontal as
            | "right"
            | "left"
            | "center",
        }}
        onClose={handleCloseSnackbar}
      />
    </>
  );
};

export default CreateMedium;
