import React, { useState, useEffect } from "react";
import { TextField, Button } from "@mui/material";
import { CreateBoundaryProps } from '../../types/Types';

const CreateBoundary: React.FC<CreateBoundaryProps> = ({ gradeId, initialData, onSave, onCancel }) => {
    const [formData, setFormData] = useState({
        base_percentage: initialData?.base_percentage.toString() || '',
        grade_label: initialData?.grade_label || ''
    });

    const [errors, setErrors] = useState({
        base_percentage: '',
        grade_label: ''
    });

    useEffect(() => {
        if (initialData) {
            setFormData({
                base_percentage: initialData.base_percentage.toString(),
                grade_label: initialData.grade_label
            });
        }
    }, [initialData]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const newErrors = {
            base_percentage: '',
            grade_label: ''
        };

        if (!formData.base_percentage) {
            newErrors.base_percentage = 'Base percentage is required';
        } else {
            const percentage = Number(formData.base_percentage);
            if (isNaN(percentage) || percentage < 0 || percentage > 100) {
                newErrors.base_percentage = 'Percentage must be between 0 and 100';
            }
        }

        if (!formData.grade_label) {
            newErrors.grade_label = 'Grade label is required';
        }

        setErrors(newErrors);

        if (!newErrors.base_percentage && !newErrors.grade_label) {
            onSave({
                category_id: gradeId,
                base_percentage: Number(formData.base_percentage),
                grade_label: formData.grade_label,
                ...(initialData?.id && { id: initialData.id })
            });
        }
    };

    return (
        <div>
            <h2 className="text-xl font-bold mb-4">
                {initialData ? 'Edit Grade Boundary' : 'Create Grade Boundary'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <TextField
                    label="Base Percentage"
                    type="number"
                    fullWidth
                    value={formData.base_percentage}
                    onChange={(e) => setFormData({ ...formData, base_percentage: e.target.value })}
                    error={!!errors.base_percentage}
                    helperText={errors.base_percentage}
                    required
                    inputProps={{ min: 0, max: 100 }}
                />
                <TextField
                    label="Grade Label"
                    fullWidth
                    value={formData.grade_label}
                    onChange={(e) => setFormData({ ...formData, grade_label: e.target.value })}
                    error={!!errors.grade_label}
                    helperText={errors.grade_label}
                    required
                />
                <div className="flex justify-end space-x-2 pt-4">
                    <Button onClick={onCancel} variant="outlined" color="inherit">
                        Cancel
                    </Button>
                    <Button type="submit" variant="contained" color="primary">
                        {initialData ? 'Update' : 'Create'}
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default CreateBoundary; 