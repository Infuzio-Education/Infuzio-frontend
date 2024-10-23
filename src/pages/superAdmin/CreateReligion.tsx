import React, { useState, useEffect } from "react";
import { TextField, Button } from "@mui/material";
import { CreateReligionProps } from "../../types/Types";

const CreateReligion: React.FC<CreateReligionProps> = ({ initialData, onSave, onCancel }) => {
    const [name, setName] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        if (initialData) {
            setName(initialData.name);
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
            console.error('Error creating religion:', error);
        }
    };

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setName(value);
        if (value === "" || /^(?=.*[a-zA-Z])[a-zA-Z0-9\s]+$/.test(value)) {
            setError("");
        } else {
            setError("Name must contain at least one letter");
        }
    };

    return (
        <>
            <div>
                <h2 className="text-xl font-bold mb-4">
                    {initialData ? "Edit Religion" : "Create Religion"}
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <TextField
                        label="Religion Name"
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
                            {initialData ? "Save Changes" : "Create Religion"}
                        </Button>
                    </div>
                </form>
            </div>
        </>
    );
};

export default CreateReligion;