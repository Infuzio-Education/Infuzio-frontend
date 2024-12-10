import React, { useState, useEffect, useCallback } from 'react';
import {
    TextField, Button, Switch, FormControlLabel, Select, MenuItem,
    InputLabel, FormControl, Grid, CircularProgress,
    Alert
} from '@mui/material';
import { CreateStaffProps, Section, CreateStaffPayload, Staff } from '../../types/Types';
import CustomTabs from '../../components/CustomTabs';
import SnackbarComponent from '../../components/SnackbarComponent';
import { createStaff, getSections, updateStaff } from '../../api/superAdmin';


const INITIAL_STAFF_STATE: CreateStaffPayload = {
    id_card_number: '',
    name: '',
    gender: 'male',
    dob: '',
    mobile: '',
    email: '',
    blood_group: '',
    religion: '',
    caste: '',
    category: '',
    pwd: false,
    is_teaching_staff: false,
    remarks: '',
    street1: '',
    street2: '',
    city: '',
    state: '',
    pincode: '',
    country: '',
    subjects: [],
    section: '',
};



const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
const SUBJECTS = ['Mathematics', 'Science', 'English', 'Social Studies', 'Physics', 'Chemistry', 'Biology', 'History', 'Geography'];

const CreateStaffs: React.FC<CreateStaffProps> = ({
    initialData,
    onSave,
    onCancel,
    schoolPrefix
}) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [sections, setSections] = useState<Section[]>([]);
    const [sectionError, setSectionError] = useState<string | null>(null);
    const [loadingSections, setLoadingSections] = useState(false);
    const [staff, setStaff] = useState<CreateStaffPayload>(INITIAL_STAFF_STATE);
    const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success' as 'success' | 'error',
        position: { vertical: 'top' as const, horizontal: 'center' as const }
    });

    useEffect(() => {
        if (initialData) {
            try {
                setStaff({
                    ...INITIAL_STAFF_STATE,
                    ...{
                        id_card_number: initialData.id_card_number || '',
                        name: initialData.name || '',
                        gender: initialData.gender || 'male',
                        dob: initialData.dob ? new Date(initialData.dob).toISOString().split('T')[0] : '',
                        mobile: initialData.mobile || '',
                        email: initialData.email || '',
                        blood_group: initialData.blood_group || '',
                        religion: initialData.religion || '',
                        caste: initialData.caste || '',
                        category: initialData.category || '',
                        pwd: initialData.pwd || false,
                        is_teaching_staff: initialData.is_teaching_staff || false,
                        remarks: initialData.remarks || '',
                        street1: initialData.street1 || '',
                        street2: initialData.street2 || '',
                        city: initialData.city || '',
                        state: initialData.state || '',
                        pincode: initialData.pincode || '',
                        country: initialData.country || '',
                        subjects: Array.isArray(initialData.subjects) ? initialData.subjects : [],
                        section: initialData.section || ''
                    }
                });
            } catch (err) {
                console.error('Error setting initial data:', err);
                setError('Error loading initial staff data');
            }
        }
    }, [initialData]);

    const fetchSections = useCallback(async () => {
        setLoadingSections(true);
        setSectionError(null);
        try {
            const response = await getSections();

            if (response.status && response.resp_code === "SUCCESS") {
                if (response.data && Array.isArray(response.data) && response.data.length > 0) {
                    setSections(response.data);
                } else {
                    throw new Error('No sections data available');
                }
            } else {
                throw new Error('Failed to fetch sections');
            }
        } catch (err) {
            console.error("Failed to fetch sections:", err);
            setSectionError('Error loading sections. Please try again later.');
            setSections([]); // Reset to empty array on error
        } finally {
            setLoadingSections(false);
        }
    }, []);

    useEffect(() => {
        fetchSections();
    }, [fetchSections]);

    const validateForm = (): boolean => {
        const errors: Record<string, string> = {};

        if (!staff.id_card_number) errors.id_card_number = 'ID Card Number is required';
        if (!staff.name) errors.name = 'Name is required';
        if (!staff.dob) errors.dob = 'Date of Birth is required';
        if (!staff.mobile) errors.mobile = 'Mobile number is required';
        if (!staff.email) errors.email = 'Email is required';
        if (staff.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(staff.email)) {
            errors.email = 'Invalid email format';
        }
        // if (staff.mobile && !/^\d{10}$/.test(staff.mobile)) {
        //     errors.mobile = 'Mobile number must be 10 digits';
        // }
        if (staff.pincode && !/^\d{6}$/.test(staff.pincode)) {
            errors.pincode = 'Pin code must be 6 digits';
        }

        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setStaff(prev => ({
            ...prev,
            [name]: value,
        }));
        // Clear validation error when field is changed
        if (validationErrors[name]) {
            setValidationErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const handleSelectChange = (event: any) => {
        const { name, value } = event.target;
        setStaff(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleCloseSnackbar = () => {
        setSnackbar(prev => ({ ...prev, open: false }));
    };



    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        if (!validateForm()) {
            setSnackbar({
                open: true,
                message: 'Please fix the validation errors before submitting',
                severity: 'error',
                position: { vertical: 'top', horizontal: 'center' },
            });
            return;
        }

        if (!schoolPrefix) {
            setSnackbar({
                open: true,
                message: 'School prefix is required',
                severity: 'error',
                position: { vertical: 'top', horizontal: 'center' },
            });
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const staffData: CreateStaffPayload = {
                ...staff,
            };

            if (initialData?.id) {
                await updateStaff(initialData.id, staffData, schoolPrefix);
                setSnackbar({
                    open: true,
                    message: 'Staff updated successfully!',
                    severity: 'success',
                    position: { vertical: 'top', horizontal: 'center' },
                });
            } else {
                console.log("staffData", staffData, schoolPrefix);

                await createStaff(staffData, schoolPrefix);
                setSnackbar({
                    open: true,
                    message: 'Staff created successfully!',
                    severity: 'success',
                    position: { vertical: 'top', horizontal: 'center' },
                });
            }

            onSave(staffData as Staff);
        } catch (err: any) {
            console.error('Error saving staff:', err);
            setSnackbar({
                open: true,
                message: err.response?.data?.message || 'An error occurred while saving staff data',
                severity: 'error',
                position: { vertical: 'top', horizontal: 'center' },
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-full">
            <div className="flex-grow overflow-auto p-4">
                <h2 className="text-xl font-bold mb-4">
                    {initialData ? 'Edit Staff' : 'Create Staff'}
                </h2>

                {error && (
                    <Alert severity="error" className="mb-4">
                        {error}
                    </Alert>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                            <TextField
                                label="ID Card Number"
                                variant="outlined"
                                fullWidth
                                name="id_card_number"
                                value={staff.id_card_number}
                                onChange={handleChange}
                                required
                                error={!!validationErrors.id_card_number}
                                helperText={validationErrors.id_card_number}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                label="Name"
                                variant="outlined"
                                fullWidth
                                name="name"
                                value={staff.name}
                                onChange={handleChange}
                                required
                                error={!!validationErrors.name}
                                helperText={validationErrors.name}
                            />
                        </Grid>
                    </Grid>

                    <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                            <FormControl fullWidth>
                                <InputLabel>Gender</InputLabel>
                                <Select
                                    name="gender"
                                    value={staff.gender}
                                    onChange={handleSelectChange}
                                    label="Gender"
                                    required
                                >
                                    <MenuItem value="male">Male</MenuItem>
                                    <MenuItem value="female">Female</MenuItem>
                                    <MenuItem value="other">Other</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                label="Date of Birth"
                                type="date"
                                variant="outlined"
                                fullWidth
                                name="dob"
                                value={staff.dob}
                                onChange={handleChange}
                                InputLabelProps={{ shrink: true }}
                                required
                                error={!!validationErrors.dob}
                                helperText={validationErrors.dob}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>

                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={staff.is_teaching_staff}
                                        onChange={(e) => setStaff(prev => ({
                                            ...prev,
                                            is_teaching_staff: e.target.checked
                                        }))}
                                        name="is_teaching_staff"
                                    />
                                }
                                label="Teaching Staff"
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            {loadingSections ? (
                                <div className="flex justify-center p-4">
                                    <CircularProgress size={24} />
                                </div>
                            ) : (
                                <FormControl fullWidth>
                                    <InputLabel>Section</InputLabel>
                                    <Select
                                        name="section"
                                        value={staff.section}
                                        onChange={handleSelectChange}
                                        label="Section"
                                        error={!!sectionError}
                                    >
                                        {sections.length > 0 ? (sections.map((section: Section) => (
                                            <MenuItem key={section.ID} value={section.ID}>
                                                {section.Name}
                                            </MenuItem>
                                        ))) : (<MenuItem>No sections found</MenuItem>)}
                                    </Select>
                                    {sectionError && (
                                        <span className="text-red-500 text-sm mt-1">
                                            {sectionError}
                                        </span>
                                    )}
                                </FormControl>
                            )}
                        </Grid>
                        <Grid item xs={12} md={12}>
                            {staff.is_teaching_staff && (
                                <FormControl fullWidth>
                                    <InputLabel>Subjects</InputLabel>
                                    <Select
                                        multiple
                                        name="subjects"
                                        value={Array.isArray(staff.subjects) ? staff.subjects : []}
                                        onChange={handleSelectChange}
                                        label="Subjects"
                                    >
                                        {SUBJECTS.map(subject => (
                                            <MenuItem key={subject} value={subject}>
                                                {subject}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            )}
                        </Grid>
                    </Grid>

                    <CustomTabs labels={['Contact', 'Additional Info']}>

                        {/* Contact Tab */}
                        <div className="space-y-4">
                            <Grid container spacing={2}>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        label="Mobile"
                                        variant="outlined"
                                        fullWidth
                                        name="mobile"
                                        value={staff.mobile}
                                        onChange={handleChange}
                                        required
                                        error={!!validationErrors.mobile}
                                        helperText={validationErrors.mobile}
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        label="Email"
                                        variant="outlined"
                                        fullWidth
                                        name="email"
                                        value={staff.email}
                                        onChange={handleChange}
                                        type="email"
                                        required
                                        error={!!validationErrors.email}
                                        helperText={validationErrors.email}
                                    />
                                </Grid>
                            </Grid>

                            <TextField
                                label="Street 1"
                                variant="outlined"
                                fullWidth
                                name="street1"
                                value={staff.street1}
                                onChange={handleChange}
                            />

                            <TextField
                                label="Street 2"
                                variant="outlined"
                                fullWidth
                                name="street2"
                                value={staff.street2}
                                onChange={handleChange}
                            />

                            <Grid container spacing={2}>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        label="City"
                                        variant="outlined"
                                        fullWidth
                                        name="city"
                                        value={staff.city}
                                        onChange={handleChange}
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        label="State"
                                        variant="outlined"
                                        fullWidth
                                        name="state"
                                        value={staff.state}
                                        onChange={handleChange}
                                    />
                                </Grid>
                            </Grid>

                            <Grid container spacing={2}>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        label="Pin Code"
                                        variant="outlined"
                                        fullWidth
                                        name="pincode"
                                        value={staff.pincode}
                                        onChange={handleChange}
                                        error={!!validationErrors.pin_code}
                                        helperText={validationErrors.pin_code}
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        label="Country"
                                        variant="outlined"
                                        fullWidth
                                        name="country"
                                        value={staff.country}
                                        onChange={handleChange}
                                    />
                                </Grid>
                            </Grid>
                        </div>

                        {/* Additional Info Tab */}
                        <div className="space-y-4">
                            <Grid container spacing={2}>
                                <Grid item xs={12} md={6}>
                                    <FormControl fullWidth>
                                        <InputLabel>Blood Group</InputLabel>
                                        <Select
                                            name="blood_group"
                                            value={staff.blood_group}
                                            onChange={handleSelectChange}
                                            label="Blood Group"
                                        >
                                            {BLOOD_GROUPS.map(group => (
                                                <MenuItem key={group} value={group}>{group}</MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        label="Religion"
                                        variant="outlined"
                                        fullWidth
                                        name="religion"
                                        value={staff.religion}
                                        onChange={handleChange}
                                    />
                                </Grid>
                            </Grid>

                            <Grid container spacing={2}>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        label="Caste"
                                        variant="outlined"
                                        fullWidth
                                        name="caste"
                                        value={staff.caste}
                                        onChange={handleChange}
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        label="Category"
                                        variant="outlined"
                                        fullWidth
                                        name="category"
                                        value={staff.category}
                                        onChange={handleChange}
                                    />
                                </Grid>
                            </Grid>

                            <div>
                                <FormControlLabel
                                    control={
                                        <Switch
                                            checked={staff.pwd}
                                            onChange={(e) => setStaff(prev => ({
                                                ...prev,
                                                pwd: e.target.checked
                                            }))}
                                            name="pwd"
                                        />
                                    }
                                    label="Person with Disability"
                                />
                            </div>

                            <TextField
                                label="Remarks"
                                variant="outlined"
                                fullWidth
                                multiline
                                rows={4}
                                name="remarks"
                                value={staff.remarks}
                                onChange={handleChange}
                            />
                        </div>
                    </CustomTabs>

                </form>
            </div>

            <div className="flex justify-end space-x-2 p-4 pb-0 border-t">
                <Button
                    onClick={onCancel}
                    variant="outlined"
                    color="error"
                    disabled={loading}
                >
                    Cancel
                </Button>
                <Button
                    onClick={handleSubmit}
                    variant="contained"
                    color="success"
                    disabled={loading}
                    startIcon={loading && <CircularProgress size={20} color="inherit" />}
                >
                    {loading ? 'Saving...' : (initialData ? 'Update Staff' : 'Create Staff')}
                </Button>
            </div>

            <SnackbarComponent
                open={snackbar.open}
                message={snackbar.message}
                severity={snackbar.severity}
                position={snackbar.position}
                onClose={handleCloseSnackbar}
            />
        </div>
    );
};

export default CreateStaffs;