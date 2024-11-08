import React, { useState } from 'react';
import { TextField, Button } from '@mui/material';
import { createParent } from '../../api/superAdmin';
import { useSchoolContext } from '../../contexts/SchoolContext';
import SnackbarComponent from '../../components/SnackbarComponent';

const CreateParent: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const { schoolInfo } = useSchoolContext();
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: ''
    });
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success' as 'success' | 'error',
        position: { vertical: 'top' as const, horizontal: 'center' as const }
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (!schoolInfo.schoolPrefix) {
                throw new Error("School prefix not found");
            }
            await createParent(formData, schoolInfo.schoolPrefix);
            setSnackbar({
                open: true,
                message: "Parent created successfully!",
                severity: "success",
                position: { vertical: "top", horizontal: "center" },
            });
            onClose();
        } catch (error: any) {
            setSnackbar({
                open: true,
                message: error.message || "Failed to create parent",
                severity: "error",
                position: { vertical: "top", horizontal: "center" },
            });
        }
    };

    return (
        <div className="p-4">
            <h2 className="text-xl font-bold mb-4">Create Parent</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <TextField
                    label="Name"
                    fullWidth
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
                <TextField
                    label="Phone"
                    fullWidth
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
                <TextField
                    label="Email"
                    type="email"
                    fullWidth
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
                <div className="flex justify-end space-x-2">
                    <Button onClick={onClose} variant="outlined" color="error">
                        Cancel
                    </Button>
                    <Button type="submit" variant="contained" color="success">
                        Create Parent
                    </Button>
                </div>
            </form>
            <SnackbarComponent
                open={snackbar.open}
                message={snackbar.message}
                severity={snackbar.severity}
                position={snackbar.position}
                onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
            />
        </div>
    );
};

export default CreateParent;
