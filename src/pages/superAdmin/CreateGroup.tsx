import React, { useState, useEffect } from 'react';
import { TextField, Button } from '@mui/material';
import { CreateGroupProps } from '../../types/Types';

const CreateGroup: React.FC<CreateGroupProps> = ({ initialData, onSave, onCancel }) => {
    const [name, setName] = useState('');

    useEffect(() => {
        if (initialData) {
            setName(initialData.Name);
        }
    }, [initialData]);

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        onSave(name);
    };

    return (
        <div>
            <h2 className="text-xl font-bold mb-4">{initialData ? "Edit Group" : "Create Group"}</h2>
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
                    <Button onClick={onCancel} variant="outlined" color="error">
                        Cancel
                    </Button>
                    <Button type="submit" variant="contained" color="success">
                        {initialData ? "Save Changes" : "Create Group"}
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default CreateGroup;
