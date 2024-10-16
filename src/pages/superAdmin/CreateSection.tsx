import React, { useState, useEffect } from 'react';
import { TextField, Button } from '@mui/material';
import { CreateSectionProps } from '../../types/Types';
import { createSections } from '../../api/superAdmin';

const CreateSection: React.FC<CreateSectionProps> = ({ initialData, onSave, onCancel }) => {
    const [sectionName, setSectionName] = useState('');
    const [sectionCode, setSectionCode] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (initialData) {
            setSectionName(initialData.name);
            setSectionCode(initialData.section_code);
        }
    }, [initialData]);

    const validateInput = (value: string) => {
        return /^(?=.*[a-zA-Z])[a-zA-Z0-9\s]+$/.test(value);
    };

    const handleInputChange = (
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
        setter: React.Dispatch<React.SetStateAction<string>>
    ) => {
        const value = event.target.value;
        setter(value);
        setError('');
    };


    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!validateInput(sectionName) || !validateInput(sectionCode)) {
            setError('Both section name and code must contain at least one letter.');
            return;
        }

        setLoading(true);

        try {
            const response = await createSections({
                sectionName: sectionName,
                sectionCode: sectionCode,
            });

            if (response.status && response.resp_code === 'SUCCESS') {
                onSave(true);
                setSectionName('');
                setSectionCode('');
            } else {
                throw new Error('Failed to create section');
            }
        } catch (err) {
            console.error('Error creating section:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-4">
            <h2 className="text-xl font-bold mb-4">{initialData ? 'Edit Section' : 'Create Section'}</h2>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex space-x-4">
                    <TextField
                        label="Section Name"
                        variant="outlined"
                        fullWidth
                        value={sectionName}
                        onChange={(e) => handleInputChange(e, setSectionName)}
                        required
                    />
                    <TextField
                        label="Section Code"
                        variant="outlined"
                        fullWidth
                        value={sectionCode}
                        onChange={(e) => handleInputChange(e, setSectionCode)}
                        required
                    />
                </div>

                <div className="flex justify-end space-x-2">
                    <Button onClick={onCancel} variant="outlined" color="success" disabled={loading}>
                        Cancel
                    </Button>
                    <Button type="submit" variant="contained" color="success" disabled={loading}>
                        {loading ? 'Creating...' : (initialData ? 'Save Changes' : 'Create Section')}
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default CreateSection;