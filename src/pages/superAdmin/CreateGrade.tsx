import React, { useState } from "react";
import { TextField, Button } from "@mui/material";
import { CreateGradeProps, BoundaryFormData } from "../../types/Types";

const CreateGrade: React.FC<CreateGradeProps> = ({ initialData, onSave, onSaveBoundary, onCancel }) => {
    const [gradeName, setGradeName] = useState(initialData?.name || "");
    const [error, setError] = useState<string>("");
    const [boundaryData, setBoundaryData] = useState<BoundaryFormData>({
        base_percentage: "",
        grade_label: ""
    });
    const [isBoundaryForm,
        // setIsBoundaryForm
    ] = useState(false);

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (isBoundaryForm) {
            if (!boundaryData.base_percentage || !boundaryData.grade_label) {
                setError("All fields are required");
                return;
            }

            const percentage = Number(boundaryData.base_percentage);
            if (isNaN(percentage) || percentage < 0 || percentage > 100) {
                setError("Percentage must be between 0 and 100");
                return;
            }

            if (onSaveBoundary) {
                onSaveBoundary({
                    category_id: initialData?.id || 0,
                    base_percentage: percentage,
                    grade_label: boundaryData.grade_label
                });
            }
        } else {
            if (!/^(?=.*[a-zA-Z])[a-zA-Z0-9\s]+$/.test(gradeName)) {
                setError("Name must contain at least one letter");
                return;
            }
            try {
                onSave(gradeName);
            } catch (error: any) {
                console.error('Error creating grade:', error);
            }
        }
    };

    return (
        <div>
            <h2 className="text-xl font-bold mb-4">
                {isBoundaryForm ? "Add Grade Boundary" : (initialData ? "Edit Grade" : "Create Grade")}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                {isBoundaryForm ? (
                    <>
                        <TextField
                            label="Base Percentage"
                            type="number"
                            variant="outlined"
                            fullWidth
                            value={boundaryData.base_percentage}
                            onChange={(e) => setBoundaryData({ ...boundaryData, base_percentage: e.target.value })}
                            inputProps={{ min: 0, max: 100 }}
                            required
                        />
                        <TextField
                            label="Grade Label"
                            variant="outlined"
                            fullWidth
                            value={boundaryData.grade_label}
                            onChange={(e) => setBoundaryData({ ...boundaryData, grade_label: e.target.value })}
                            required
                        />
                    </>
                ) : (
                    <TextField
                        label="Grade Name"
                        variant="outlined"
                        fullWidth
                        value={gradeName}
                        onChange={(e) => {
                            setGradeName(e.target.value);
                            setError("");
                        }}
                        error={!!error}
                        helperText={error}
                        required
                    />
                )}
                {error && <p className="text-red-500 text-sm">{error}</p>}
                <div className="flex justify-end space-x-2">
                    <Button onClick={onCancel} variant="outlined" color="error">
                        Cancel
                    </Button>
                    <Button type="submit" variant="contained" color="success">
                        {isBoundaryForm ? "Add Boundary" : (initialData ? "Save Changes" : "Create Grade")}
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default CreateGrade; 