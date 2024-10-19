import React, { useState, useEffect } from 'react';
import { TextField, Button, Switch, FormControlLabel, Select, MenuItem, InputLabel, FormControl, Grid, Avatar } from '@mui/material';
import { CreateStaffProps, Staff } from '../../types/Types';
import CustomTabs from '../../components/CustomTabs';
import { Upload } from 'lucide-react';

const CreateStaffs: React.FC<CreateStaffProps> = ({ initialData, onSave, onCancel }) => {
    const [staff, setStaff] = useState<Staff>({
        id: 0,
        name: '',
        isTeachingStaff: false,
        responsibility: '',
        subjects: [],
        email: '',
        mobile: '',
        gender: '',
        dateOfBirth: '',
        address: {
            line1: '',
            city: '',
            state: '',
            pinCode: '',
            country: '',
        },
        section: '',
        imageUrl: ''
    });

    const [_image, setImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    useEffect(() => {
        if (initialData) {
            setStaff(initialData);
        }
    }, [initialData]);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setStaff(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleAddressChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setStaff(prev => ({
            ...prev,
            address: {
                ...prev.address,
                [name]: value,
            },
        }));
    };

    const handleSubmit = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        onSave(staff);
    };

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            const file = event.target.files[0];
            setImage(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="flex flex-col h-full">
            <div className="flex-grow overflow-auto p-4">
                <h2 className="text-xl font-bold mb-4">{initialData ? 'Edit Staff' : 'Create Staff'}</h2>
                <form onSubmit={(e) => {
                    e.preventDefault();
                    handleSubmit(e as unknown as React.MouseEvent<HTMLButtonElement>);
                }} className="space-y-4">
                    <div className="mb-4 flex flex-col items-center">
                        <Avatar
                            src={imagePreview || initialData?.imageUrl}
                            sx={{ width: 100, height: 100, mb: 2 }}
                        />
                        <input
                            accept="image/*"
                            style={{ display: 'none' }}
                            id="raised-button-file"
                            type="file"
                            onChange={handleImageUpload}
                        />
                        <label htmlFor="raised-button-file">
                            <Button variant="outlined" component="span" startIcon={<Upload />}>
                                {imagePreview ? 'Change Image' : 'Upload Staff Image'}
                            </Button>
                        </label>
                    </div>

                    <TextField
                        label="Employee Name"
                        variant="outlined"
                        fullWidth
                        name="name"
                        value={staff.name}
                        onChange={handleChange}
                        required
                    />

                    <FormControlLabel
                        control={
                            <Switch
                                checked={staff.isTeachingStaff}
                                onChange={(e) => setStaff(prev => ({ ...prev, isTeachingStaff: e.target.checked }))}
                                name="isTeachingStaff"
                            />
                        }
                        label="Is Teaching Staff"
                    />

                    <TextField
                        label="Responsibility of Academic Class"
                        variant="outlined"
                        fullWidth
                        name="responsibility"
                        value={staff.responsibility}
                        onChange={handleChange}
                    />

                    <FormControl fullWidth variant="outlined">
                        <InputLabel>Select Subjects</InputLabel>
                        <Select
                            multiple
                            value={staff.subjects}
                            onChange={(e) => setStaff(prev => ({ ...prev, subjects: e.target.value as string[] }))}
                            label="Select Subjects"
                        >
                            <MenuItem value="Mathematics">Mathematics</MenuItem>
                            <MenuItem value="Science">Science</MenuItem>
                            <MenuItem value="English">English</MenuItem>
                            {/* Add more subjects as needed */}
                        </Select>
                    </FormControl>

                    <CustomTabs labels={['More Information']}>
                        <div className="space-y-4">
                            <FormControl fullWidth variant="outlined">
                                <InputLabel>Section</InputLabel>
                                <Select
                                    value={staff.section}
                                    onChange={(e) => setStaff(prev => ({ ...prev, section: e.target.value as string }))}
                                    label="Section"
                                >
                                    <MenuItem value="A">A</MenuItem>
                                    <MenuItem value="B">B</MenuItem>
                                    <MenuItem value="C">C</MenuItem>
                                    {/* Add more sections as needed */}
                                </Select>
                            </FormControl>

                            <Grid container spacing={2}>
                                <Grid item xs={6}>
                                    <TextField
                                        label="Mobile"
                                        variant="outlined"
                                        fullWidth
                                        name="mobile"
                                        value={staff.mobile}
                                        onChange={handleChange}
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        label="Email"
                                        variant="outlined"
                                        fullWidth
                                        name="email"
                                        value={staff.email}
                                        onChange={handleChange}
                                        type="email"
                                    />
                                </Grid>
                            </Grid>

                            <FormControl fullWidth variant="outlined">
                                <InputLabel>Gender</InputLabel>
                                <Select
                                    value={staff.gender}
                                    onChange={(e) => setStaff(prev => ({ ...prev, gender: e.target.value as string }))}
                                    label="Gender"
                                >
                                    <MenuItem value="Male">Male</MenuItem>
                                    <MenuItem value="Female">Female</MenuItem>
                                </Select>
                            </FormControl>

                            <TextField
                                label="Date of Birth"
                                variant="outlined"
                                fullWidth
                                name="dateOfBirth"
                                value={staff.dateOfBirth}
                                onChange={handleChange}
                                type="date"
                                InputLabelProps={{ shrink: true }}
                            />

                            <TextField
                                label="Address Line 1"
                                variant="outlined"
                                fullWidth
                                name="line1"
                                value={staff.address.line1}
                                onChange={handleAddressChange}
                            />

                            <Grid container spacing={2}>
                                <Grid item xs={6}>
                                    <TextField
                                        label="City"
                                        variant="outlined"
                                        fullWidth
                                        name="city"
                                        value={staff.address.city}
                                        onChange={handleAddressChange}
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        label="State"
                                        variant="outlined"
                                        fullWidth
                                        name="state"
                                        value={staff.address.state}
                                        onChange={handleAddressChange}
                                    />
                                </Grid>
                            </Grid>

                            <Grid container spacing={2}>
                                <Grid item xs={6}>
                                    <TextField
                                        label="Pin Code"
                                        variant="outlined"
                                        fullWidth
                                        name="pinCode"
                                        value={staff.address.pinCode}
                                        onChange={handleAddressChange}
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        label="Country"
                                        variant="outlined"
                                        fullWidth
                                        name="country"
                                        value={staff.address.country}
                                        onChange={handleAddressChange}
                                    />
                                </Grid>
                            </Grid>
                        </div>
                    </CustomTabs>
                </form>
            </div>

            <div className="mt-auto">
                <div className="flex justify-end space-x-2">
                    <Button onClick={onCancel} variant="outlined" color="error">
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit} variant="contained" color="success">
                        {initialData ? 'Save Changes' : 'Create Staff'}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default CreateStaffs;
