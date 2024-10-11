// src/pages/Standards/CreateStandard.tsx
import React, { useState, useEffect } from 'react';
import { TextField, Button } from '@mui/material';

interface CreateStandardProps {
    initialData: { id: number; name: string; } | null;
    onSave: (name: string) => void;
    onCancel: () => void;
}

const CreateStandard: React.FC<CreateStandardProps> = ({ initialData, onSave, onCancel }) => {
    const [name, setName] = useState('');

    useEffect(() => {
        if (initialData) {
            setName(initialData.name);
        }
    }, [initialData]);

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        onSave(name);
    };

    return (
        <div>
            <h2 className="text-xl font-bold mb-4">{initialData ? 'Edit Standard' : 'Create Standard'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <TextField
                    label="Standard Name"
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
                        {initialData ? 'Save Changes' : 'Create Standard'}
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default CreateStandard;