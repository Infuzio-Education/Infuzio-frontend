import React, { useState, useEffect } from 'react';
import { TextField, Button, Checkbox, FormControlLabel, Select, MenuItem, InputLabel, FormControl } from '@mui/material';
import { CreateStandardProps, Section } from '../../types/Types';

const CreateStandard: React.FC<CreateStandardProps> = ({ 
  initialData, 
  onSave, 
  onCancel,
  sections 
}) => {
    const [name, setName] = useState('');
    const [hasGroup, setHasGroup] = useState(false);
    const [sectionId, setSectionId] = useState<number>(0);
    const [sequenceNumber, setSequenceNumber] = useState<number|undefined>();

    useEffect(() => {
        if (initialData) {
            setName(initialData.Name);
            setHasGroup(initialData.HasGroup);
            setSectionId(initialData.SectionId || 0);
            setSequenceNumber(initialData.SequenceNumber || 0);
        } else {
            setName('');
            setHasGroup(false);
            setSectionId(0);
            setSequenceNumber(0);
        }
    }, [initialData]);

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        onSave(name, hasGroup, sectionId, sequenceNumber||0);
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
                <FormControl fullWidth>
                    <InputLabel>Section</InputLabel>
                    <Select
                        value={sectionId}
                        label="Section"
                        onChange={(e) => setSectionId(Number(e.target.value))}
                        required
                    >
                        {sections.map((section: Section) => (
                            <MenuItem key={section.ID} value={section.ID}>
                                {section.Name}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <TextField
                    label="Sequence Number"
                    variant="outlined"
                    fullWidth
                    type="number"
                    value={sequenceNumber}
                    onChange={(e) => setSequenceNumber(Number(e.target.value))}
                    required
                />
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={hasGroup}
                            onChange={(e) => setHasGroup(e.target.checked)}
                            color="primary"
                        />
                    }
                    label="Has Group"
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
