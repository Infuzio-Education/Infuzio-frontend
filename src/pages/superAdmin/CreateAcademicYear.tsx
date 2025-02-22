import React, { useState, useEffect } from "react";
import { TextField, Button, FormControlLabel, Switch } from "@mui/material";

interface CreateAcademicYearProps {
    initialData?: {
        id: number;
        name: string;
        is_current: boolean;
    };
    onSave: (name: string, is_current: boolean) => void;
    onCancel: () => void;
}

const CreateAcademicYear: React.FC<CreateAcademicYearProps> = ({ initialData, onSave, onCancel }) => {
    const [formData, setFormData] = useState({
        name: "",
        is_current: false
    });
    const [error, setError] = useState("");

    useEffect(() => {
        if (initialData) {
            setFormData({
                name: initialData.name || "",
                is_current: initialData.is_current || false
            });
        } else {
            setFormData({
                name: "",
                is_current: false
            });
        }
    }, [initialData]);

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        // Validate academic year format (YYYY-YY)
        const yearPattern = /^\d{4}-\d{2}$/;
        if (!yearPattern.test(formData.name)) {
            setError("Academic year must be in format YYYY-YY (e.g., 2024-25)");
            return;
        }

        // Additional validation for year logic
        const [startYear, endYear] = formData.name.split('-').map(Number);
        const expectedEndYear = Number(startYear.toString().slice(2)) + 1;

        if (endYear !== expectedEndYear) {
            setError("Invalid year range. End year should be start year + 1");
            return;
        }

        try {
            onSave(formData.name, formData.is_current);
        } catch (error: any) {
            console.error('Error creating academic year:', error);
        }
    };

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setFormData(prev => ({
            ...prev,
            name: value
        }));
        setError(""); // Clear error when input changes
    };

    const handleCurrentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({
            ...prev,
            is_current: e.target.checked
        }));
    };

    return (
        <>
            <div>
                <h2 className="text-xl font-bold mb-4">
                    {initialData ? "Edit Academic Year" : "Create Academic Year"}
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <TextField
                        label="Academic Year"
                        variant="outlined"
                        fullWidth
                        value={formData.name}
                        onChange={handleNameChange}
                        error={!!error}
                        helperText={error || "Format: YYYY-YY (e.g., 2024-25)"}
                        required
                    />
                    {!initialData && (
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={formData.is_current}
                                    onChange={handleCurrentChange}
                                    color="primary"
                                />
                            }
                            label="Set as Current Academic Year"
                        />
                    )}
                    <div className="flex justify-end space-x-2">
                        <Button onClick={onCancel} variant="outlined" color="success">
                            Cancel
                        </Button>
                        <Button type="submit" variant="contained" color="success">
                            {initialData ? "Save Changes" : "Create Academic Year"}
                        </Button>
                    </div>
                </form>
            </div>
        </>
    );
};

export default CreateAcademicYear; 