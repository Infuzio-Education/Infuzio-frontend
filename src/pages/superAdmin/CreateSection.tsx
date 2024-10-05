import React, { useState, useEffect } from 'react';
import { TextField, FormControl, InputLabel, Select, MenuItem, Button, Chip, Box } from '@mui/material';
import { SelectChangeEvent } from '@mui/material/Select';
import { CreateSectionProps } from '../../types/Types';

const CreateSection: React.FC<CreateSectionProps> = ({ initialData, onSave, onCancel }) => {
    const [sectionName, setSectionName] = useState('');
    const [sectionCode, setSectionCode] = useState('');
    const [selectedClasses, setSelectedClasses] = useState<string[]>([]);

    useEffect(() => {
        if (initialData) {
            setSectionName(initialData.name);
            setSectionCode(initialData.code);
            setSelectedClasses(initialData.classes);
        }
    }, [initialData]);

    const handleSectionNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSectionName(event.target.value);
    };

    const handleSectionCodeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSectionCode(event.target.value);
    };

    const handleClassChange = (event: SelectChangeEvent<string[]>) => {
        const { value } = event.target;
        setSelectedClasses(typeof value === 'string' ? value.split(',') : value);
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        onSave({ id: initialData?.id || 0, name: sectionName, code: sectionCode, classes: selectedClasses });
    };

    const classes = ['1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th', '9th', '10th', '11th', '12th'];

    return (
        <div className="p-4">
            <h2 className="text-xl font-bold mb-4">{initialData ? 'Edit Section' : 'Create Section'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex space-x-4">
                    <TextField
                        label="Section Name"
                        variant="outlined"
                        fullWidth
                        value={sectionName}
                        onChange={handleSectionNameChange}
                        required
                    />
                    <TextField
                        label="Section Code"
                        variant="outlined"
                        fullWidth
                        value={sectionCode}
                        onChange={handleSectionCodeChange}
                        required
                    />
                </div>

                <FormControl fullWidth variant="outlined" required>
                    <InputLabel id="class-multi-select-label">Classes</InputLabel>
                    <Select
                        labelId="class-multi-select-label"
                        id="class-multi-select"
                        multiple
                        value={selectedClasses}
                        onChange={handleClassChange}
                        label="Classes"
                        renderValue={(selected) => (
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                {selected.map((value) => (
                                    <Chip key={value} label={value} />
                                ))}
                            </Box>
                        )}
                    >
                        {classes.map((className) => (
                            <MenuItem key={className} value={className}>
                                {className}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <div className="flex justify-end space-x-2">
                    <Button onClick={onCancel} variant="outlined" color="success">Cancel</Button>
                    <Button type="submit" variant="contained" color="success">
                        {initialData ? 'Save Changes' : 'Create Section'}
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default CreateSection;
