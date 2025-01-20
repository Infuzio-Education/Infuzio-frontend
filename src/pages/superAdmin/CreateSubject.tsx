import React, { useState } from 'react';
import { TextField, Button } from '@mui/material';
import { CreateSubjectProps, Subject } from '../../types/Types';

const CreateSubject: React.FC<CreateSubjectProps> = ({ initialData, onSave, onCancel }) => {
    const [subject, setSubject] = useState<Subject>({
        id: initialData?.id || 0,
        name: initialData?.name || '',
        code: initialData?.code || '',
        defaultMaxMarks: initialData?.defaultMaxMarks || 0,
        hasTermExam: initialData?.hasTermExam || false
    });

    const [errors, setErrors] = useState({
        name: '',
        code: ''
    });

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setSubject({
            ...subject,
            [name]: value
        });
        if (value.trim()) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const newErrors = {
            name: '',
            code: ''
        };

        if (!subject.name.trim()) {
            newErrors.name = 'Subject name is required';
        }
        if (!subject.code?.trim()) {
            newErrors.code = 'Subject code is required';
        }

        setErrors(newErrors);

        if (!newErrors.name && !newErrors.code) {
            onSave({
                ...subject,
                name: subject.name.trim(),
                code: subject.code?.trim() || ''
            });
        }
    };

    return (
        <div className="h-full flex flex-col">
            {/* Header */}
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-800">
                    {initialData ? 'Edit Subject' : 'Create Subject'}
                </h2>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="flex-1 flex flex-col">
                <div className="space-y-6 flex-1">
                    {/* Subject Name Field */}
                    <div className="mb-4">
                        <TextField
                            label="Subject Name"
                            variant="outlined"
                            fullWidth
                            name="name"
                            value={subject.name}
                            onChange={handleChange}
                            required
                            error={!!errors.name}
                            helperText={errors.name}
                            placeholder="e.g: English"
                            size="medium"
                            className="bg-white"
                        />
                    </div>

                    {/* Subject Code Field */}
                    <div className="mb-4">
                        <TextField
                            label="Subject Code"
                            variant="outlined"
                            fullWidth
                            name="code"
                            value={subject.code}
                            onChange={handleChange}
                            required
                            error={!!errors.code}
                            helperText={errors.code}
                            placeholder="e.g: ENG"
                            size="medium"
                            className="bg-white"
                        />
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="pt-6 border-t mt-auto">
                    <div className="flex justify-end gap-4">
                        <Button
                            onClick={onCancel}
                            variant="outlined"
                            color="inherit"
                            className="px-6"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            className="px-6"
                        >
                            {initialData ? 'Update' : 'Create'}
                        </Button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default CreateSubject;