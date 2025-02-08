import React, { useState, useEffect } from "react";
import { TextField, Button, FormControl, InputLabel, Select, MenuItem, SelectChangeEvent } from "@mui/material";
import { CreateCasteProps, Religion } from "../../types/Types";
import { getReligions } from "../../api/superAdmin";
import { useSelector } from "react-redux";

const CreateCaste: React.FC<CreateCasteProps> = ({ initialData, onSave, onCancel }) => {
    const [name, setName] = useState(initialData?.Name || '');
    const [religionId, setReligionId] = useState<number>(initialData?.ReligionID || 0);
    const [religions, setReligions] = useState<Religion[]>([]);
    const [error, setError] = useState("");
    const [religionError, setReligionError] = useState("");

    const { staffInfo } = useSelector((state: any) => state.staffInfo);
    const hasSchoolAdminPrivilege = staffInfo?.specialPrivileges?.some(
        (privilege: any) => privilege.privilege === "schoolAdmin"
    );

    useEffect(() => {
        const fetchReligions = async () => {
            try {
                const response = await getReligions(
                    hasSchoolAdminPrivilege ? staffInfo?.schoolCode : undefined
                );
                if (response.status === true) {
                    setReligions(response.data);
                }
            } catch (error) {
                console.error('Error fetching religions:', error);
            }
        };

        fetchReligions();
    }, [hasSchoolAdminPrivilege, staffInfo?.schoolCode]);

    useEffect(() => {
        if (initialData) {
            setName(initialData.Name || "");
            setReligionId(initialData.ReligionID || 0);
        } else {
            setName("");
            setReligionId(0);
        }
    }, [initialData]);

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!/^(?=.*[a-zA-Z])[a-zA-Z0-9\s]+$/.test(name)) {
            setError("Name must contain at least one letter");
            return;
        }

        if (!religionId) {
            setReligionError("Please select a religion");
            return;
        }

        try {
            onSave(name, religionId);
        } catch (error: any) {
            console.error('Error creating caste:', error);
        }
    };

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setName(value);
        if (value === "" || /^(?=.*[a-zA-Z])[a-zA-Z0-9\s]+$/.test(value)) {
            setError("");
        } else {
            setError("Name must contain at least one letter");
        }
    };

    const handleReligionChange = (event: SelectChangeEvent<number>) => {
        const value = event.target.value;
        setReligionId(Number(value));
        setReligionError("");
    };

    return (
        <>
            <div>
                <h2 className="text-xl font-bold mb-4">
                    {initialData ? "Edit Caste" : "Create Caste"}
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <TextField
                        label="Caste Name"
                        variant="outlined"
                        fullWidth
                        value={name}
                        onChange={handleNameChange}
                        error={!!error}
                        helperText={error}
                        required
                    />
                    <FormControl fullWidth required error={!!religionError}>
                        <InputLabel id="religion-select-label">Religion</InputLabel>
                        <Select
                            labelId="religion-select-label"
                            id="religion-select"
                            value={religionId}
                            label="Religion"
                            onChange={handleReligionChange}
                        >
                            {religions.map((religion) => (
                                <MenuItem key={religion.ID} value={religion.ID}>
                                    {religion.Name}
                                </MenuItem>
                            ))}
                        </Select>
                        {religionError && (
                            <p className="text-red-500 text-sm mt-1">{religionError}</p>
                        )}
                    </FormControl>
                    <div className="flex justify-end space-x-2">
                        <Button onClick={onCancel} variant="outlined" color="success">
                            Cancel
                        </Button>
                        <Button type="submit" variant="contained" color="success">
                            {initialData ? "Save Changes" : "Create Caste"}
                        </Button>
                    </div>
                </form>
            </div>
        </>
    );
};

export default CreateCaste;
