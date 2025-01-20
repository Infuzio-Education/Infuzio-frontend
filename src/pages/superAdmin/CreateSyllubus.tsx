import React, { useState, useEffect } from 'react';
import { TextField, Button } from '@mui/material';
import { CreateSyllabusProps, Syllabus } from '../../types/Types';

const CreateSyllabus: React.FC<CreateSyllabusProps> = ({ initialData, onSave, onCancel }) => {
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (initialData) {
            setName(initialData.name);
        } else {
            setName('');
        }
    }, [initialData]);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setLoading(true);

        try {
            const syllabus: Syllabus = {
                id: initialData?.id || 0,
                name: name,
                standards: []
            };
            await onSave(syllabus);
        } catch (error) {
            console.error('Error creating syllabus:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h2 className="text-xl font-bold mb-4">{initialData ? 'Edit Syllabus' : 'Create Syllabus'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <TextField
                    label="Syllabus Name"
                    variant="outlined"
                    fullWidth
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    disabled={loading}
                />
                <div className="flex justify-end space-x-2">
                    <Button onClick={onCancel} variant="outlined" color="success" disabled={loading}>
                        Cancel
                    </Button>
                    <Button type="submit" variant="contained" color="success" disabled={loading}>
                        {loading ? 'Submitting...' : (initialData ? 'Save Changes' : 'Create Syllabus')}
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default CreateSyllabus;
