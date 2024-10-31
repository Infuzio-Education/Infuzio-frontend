import React, { useState, useEffect } from "react";
import { TextField, Button } from "@mui/material";
import { CreateMediumProps } from "../../types/Types";

const CreateMedium: React.FC<CreateMediumProps> = ({
  initialData,
  onSave,
  onCancel,
}) => {
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (initialData) {
      setName(initialData.Name);
    }
  }, [initialData]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!/^(?=.*[a-zA-Z])[a-zA-Z0-9\s]+$/.test(name)) {
      setError("Name must contain at least one letter");
      return;
    }
    try {
      onSave(name);
    } catch (error: any) {
      console.error('Error saving medium:', error);
    }
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setName(value);
    if (value === "" || /^(?=.*[a-zA-Z])[a-zA-Z0-9\s]+$/.test(value)) {
      setError("");
    } else {
      setError("Name must contain at least one letter and can include numbers and spaces.");
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
            onChange={handleNameChange}
            error={!!error}
            helperText={error}
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
    </>
  );
};

export default CreateMedium;