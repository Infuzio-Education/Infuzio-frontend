import React, { useState, useEffect } from 'react';
import { TextField, Button } from '@mui/material';
import { CreateSubjectProps, Subject } from '../../types/Types';



const CreateSubject: React.FC<CreateSubjectProps> = ({ initialData, onSave, onCancel }) => {
    const [subject, setSubject] = useState<Subject>({
        id: 0,
        name: '',
        code: '',
        minMarks: 0,
        maxMarks: 100
    });

    useEffect(() => {
        if (initialData) {
            setSubject(initialData);
        }
    }, [initialData]);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setSubject(prev => ({
            ...prev,
            [name]: name === 'minMarks' || name === 'maxMarks' ? Number(value) || '' : value
        }));
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        onSave({
            ...subject,
            minMarks: subject.minMarks || 0,
            maxMarks: subject.maxMarks || 100
        });
    };

    return (
        <div className="p-4">
            <h2 className="text-xl font-bold mb-4">{initialData ? 'Edit Subject' : 'Create Subject'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <TextField
                    label="Subject Name"
                    variant="outlined"
                    fullWidth
                    name="name"
                    value={subject.name}
                    onChange={handleChange}
                    required
                />
                <TextField
                    label="Subject Code"
                    variant="outlined"
                    fullWidth
                    name="code"
                    value={subject.code}
                    onChange={handleChange}
                    required
                />
                <TextField
                    label="Minimum Marks"
                    variant="outlined"
                    fullWidth
                    name="minMarks"
                    type="number"
                    value={subject.minMarks === 0 ? '' : subject.minMarks}
                    onChange={handleChange}
                    required
                    inputProps={{ min: 0 }}
                />
                <TextField
                    label="Maximum Marks"
                    variant="outlined"
                    fullWidth
                    name="maxMarks"
                    type="number"
                    value={subject.maxMarks === 0 ? '' : subject.maxMarks}
                    onChange={handleChange}
                    required
                    inputProps={{ min: 0 }}
                />
                <div className="flex justify-end space-x-2">
                    <Button onClick={onCancel} variant="outlined" color="success">
                        Cancel
                    </Button>
                    <Button type="submit" variant="contained" color="success">
                        {initialData ? 'Save Changes' : 'Create Subject'}
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default CreateSubject;