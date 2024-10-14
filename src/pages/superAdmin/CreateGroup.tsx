import React, { useState } from 'react';
import { TextField, Button } from '@mui/material';
import { CreateGroupProps } from '../../types/Types';

const CreateGroup: React.FC<CreateGroupProps> = ({ onSave, onCancel }) => {
    const [name, setName] = useState('');

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        onSave(name);
    };

    return (
        <div>
            <h2 className="text-xl font-bold mb-4">Create Group</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <TextField
                    label="Group Name"
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
                        Create Group
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default CreateGroup;