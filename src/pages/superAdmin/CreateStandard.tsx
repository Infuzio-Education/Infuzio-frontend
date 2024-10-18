import React, { useState, useEffect } from 'react';
import { TextField, Button, Checkbox, FormControlLabel } from '@mui/material';
import { CreateStandardProps } from '../../types/Types';

const CreateStandard: React.FC<CreateStandardProps> = ({ initialData, onSave, onCancel }) => {
    const [name, setName] = useState('');
    const [hasGroup, setHasGroup] = useState(false);
    const [sequence, setSequence] = useState(0);

    useEffect(() => {
        if (initialData) {
            setName(initialData.Name);
            setHasGroup(initialData.HasGroup);
            setSequence(initialData.sequence);
        } else {
            setName('');
            setHasGroup(false);
            setSequence(0);
        }
    }, [initialData]);

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        onSave(name, hasGroup, sequence);
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
                <TextField
                    label="Sequence"
                    variant="outlined"
                    fullWidth
                    type="number"
                    value={sequence}
                    onChange={(e) => setSequence(Number(e.target.value))}
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