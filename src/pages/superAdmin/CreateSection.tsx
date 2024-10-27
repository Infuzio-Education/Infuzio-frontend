import React, { useState, useEffect } from 'react';
import { TextField, Button } from '@mui/material';
import { CreateSectionProps } from '../../types/Types';

const CreateSection: React.FC<CreateSectionProps> = ({ initialData, onSave, onCancel }) => {
    const [name, setName] = useState("");
    const [sectionCode, setSectionCode] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (initialData) {
            setName(initialData.Name);
            setSectionCode(initialData.SectionCode);
        }
    }, [initialData]);

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement>,
        setter: React.Dispatch<React.SetStateAction<string>>
    ) => {
        const value = e.target.value;
        setter(value);

        // Only validate name field
        if (setter === setName) {
            if (value === "" || /^(?=.*[a-zA-Z])[a-zA-Z0-9\s]+$/.test(value)) {
                setError("");
            } else {
                setError("Name must contain at least one letter");
            }
        }
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!/^(?=.*[a-zA-Z])[a-zA-Z0-9\s]+$/.test(name)) {
            setError("Name must contain at least one letter");
            return;
        }

        try {
            setLoading(true);
            onSave({
                sectionName: name,
                sectionCode: sectionCode
            });
        } catch (error: any) {
            console.error('Error creating section:', error);
            setError(error.message || 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-4">
            <h2 className="text-xl font-bold mb-4">
                {initialData ? 'Edit Section' : 'Create Section'}
            </h2>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex space-x-4">
                    <TextField
                        label="Section Name"
                        variant="outlined"
                        fullWidth
                        value={name}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange(e, setName)}
                        required
                    />
                    <TextField
                        label="Section Code"
                        variant="outlined"
                        fullWidth
                        value={sectionCode}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange(e, setSectionCode)}
                        required
                    />
                </div>

                <div className="flex justify-end space-x-2">
                    <Button
                        onClick={onCancel}
                        variant="outlined"
                        color="success"
                        disabled={loading}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        variant="contained"
                        color="success"
                        disabled={loading}
                    >
                        {loading ? 'Creating...' : (initialData ? 'Save Changes' : 'Create Section')}
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default CreateSection;