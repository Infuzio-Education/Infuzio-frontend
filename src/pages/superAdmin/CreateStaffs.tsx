import React, { useState, useEffect, useCallback } from 'react';
import {
    TextField, Button, Switch, FormControlLabel, Select, MenuItem,
    InputLabel, FormControl, Grid, CircularProgress,
    Alert
} from '@mui/material';
import { CreateStaffProps, Section, CreateStaffPayload, Staff, Subject, Religion } from '../../types/Types';
import CustomTabs from '../../components/CustomTabs';
import SnackbarComponent from '../../components/SnackbarComponent';
import { createStaff, getSchoolSections, updateStaff, getSchoolSubjects, fetchCastesByReligion, getSchoolReligions } from '../../api/superAdmin';
import { useNavigate } from 'react-router-dom';
import { PlusCircle } from 'lucide-react';


const INITIAL_STAFF_STATE: CreateStaffPayload = {
    regNumber: 0,
    idCardNumber: '',
    name: '',
    gender: 'male',
    dob: '',
    mobile: '',
    email: '',
    house: '',
    street1: '',
    street2: '',
    city: '',
    state: '',
    pincode: '',
    country: '',
    bloodGroup: '',
    category: '',
    remarks: '',
    religion: '',
    caste: '',
    pwd: false,
    isTeachingStaff: false,
    subjectIDs: [] as number[],
    sectionIDs: [] as number[]
};



const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
const CATEGORIES = ['OBC', 'SC', 'ST', 'General'];


const CreateStaffs: React.FC<CreateStaffProps> = ({
    initialData,
    onSave,
    onCancel,
    schoolPrefix
}) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [sections, setSections] = useState<Section[]>([]);
    const [loadingSections, setLoadingSections] = useState(false);
    const [staff, setStaff] = useState<CreateStaffPayload>(INITIAL_STAFF_STATE);
    const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success' as 'success' | 'error',
        position: { vertical: 'top' as const, horizontal: 'center' as const }
    });
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [loadingSubjects, setLoadingSubjects] = useState<boolean>(false);
    const [castes, setCastes] = useState<string[]>([]);
    const [religions, setReligions] = useState<Religion[]>([]);
    const [selectedReligionId, setSelectedReligionId] = useState<number | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (initialData) {
            try {
                setStaff({
                    ...INITIAL_STAFF_STATE,
                    regNumber: initialData.regNumber || 0,
                    idCardNumber: initialData.idCardNumber || '',
                    name: initialData.name || '',
                    gender: initialData.gender?.toLowerCase() as 'male' | 'female' | 'other' || 'male',
                    dob: initialData.dob || '',
                    mobile: initialData.mobile || '',
                    email: initialData.email || '',
                    house: initialData.house || '',
                    street1: initialData.street1 || '',
                    street2: initialData.street2 || '',
                    city: initialData.city || '',
                    state: initialData.state || '',
                    pincode: initialData.pincode || '',
                    country: initialData.country || '',
                    bloodGroup: initialData.bloodGroup || '',
                    remarks: initialData.remarks || '',
                    religion: initialData.religion || '',
                    caste: initialData.caste || '',
                    pwd: initialData.pwd || false,
                    isTeachingStaff: initialData.isTeachingStaff || false,
                    // Handle both array structures for sections
                    sectionIDs: initialData.sections ?
                        initialData.sections.map((section: { id: number }) => section.id) :
                        initialData.sectionIDs || [],
                    // Handle both array structures for subjects
                    subjectIDs: initialData.subjects ?
                        initialData.subjects.map((subject: { id: number }) => subject.id) :
                        initialData.subjectIDs || []
                });

                // Set selected religion ID for the dropdown
                if (initialData.religion && religions.length > 0) {
                    const selectedReligion = religions.find(r => r.Name === initialData.religion);
                    if (selectedReligion) {
                        setSelectedReligionId(selectedReligion.ID);
                    }
                }

            } catch (err) {
                console.error('Error setting initial data:', err);
                setError('Error loading initial staff data');
            }
        }
    }, [initialData, religions]);

    const fetchSections = useCallback(async () => {
        if (!schoolPrefix) {
            setSnackbar({
                open: true,
                message: 'School prefix is required',
                severity: 'error',
                position: { vertical: 'top', horizontal: 'center' },
            });
            return;
        }

        setLoadingSections(true);
        try {
            const response = await getSchoolSections(schoolPrefix);

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
            setSections([]); // Reset to empty array on error
        } finally {
            setLoadingSections(false);
        }
    }, [schoolPrefix]);

    useEffect(() => {
        fetchSections();
    }, [fetchSections]);

    const fetchSubjects = useCallback(async () => {
        if (!schoolPrefix) {
            setSnackbar({
                open: true,
                message: 'School prefix is required',
                severity: 'error',
                position: { vertical: 'top', horizontal: 'center' },
            });
            return;
        }

        setLoadingSubjects(true);
        try {
            const response = await getSchoolSubjects(schoolPrefix);
            if (response.status && response.resp_code === "SUCCESS") {
                setSubjects(response.data || []);
            } else {
                throw new Error('Failed to fetch subjects');
            }
        } catch (err) {
            console.error("Failed to fetch subjects:", err);
            setSubjects([]);
        } finally {
            setLoadingSubjects(false);
        }
    }, [schoolPrefix]);

    useEffect(() => {
        fetchSubjects();
    }, [fetchSubjects]);

    useEffect(() => {
        const getCastes = async () => {
            try {
                if (selectedReligionId && schoolPrefix) {
                    const response = await fetchCastesByReligion(selectedReligionId, schoolPrefix);
                    if (response.status) {
                        setCastes(response.data || []);
                    }
                } else {
                    setCastes([]);
                }
            } catch (error) {
                console.error('Error fetching castes:', error);
                setCastes([]);
            }
        };

        getCastes();
    }, [selectedReligionId, schoolPrefix]);

    useEffect(() => {
        const fetchReligions = async () => {
            try {
                if (!schoolPrefix) {
                    throw new Error("School prefix not found");
                }
                const response = await getSchoolReligions(schoolPrefix);
                if (response.status) {
                    setReligions(response.data || []);
                }
            } catch (error) {
                console.error('Error fetching religions:', error);
                setReligions([]);
            }
        };

        fetchReligions();
    }, [schoolPrefix]);

    const validateForm = (): boolean => {
        const errors: Record<string, string> = {};

        // Required field validations based on schema
        if (!staff.name) errors.name = 'Name is required';
        if (!staff.regNumber) errors.regNumber = 'Registration Number is required';
        if (!staff.gender) errors.gender = 'Gender is required';
        if (!staff.dob) errors.dob = 'Date of Birth is required';
        if (!staff.email) errors.email = 'Email is required';
        if (!staff.mobile) {
            errors.mobile = 'Mobile number is required';
        } else if (!/^\+[1-9]\d{9,14}$/.test(staff.mobile)) {
            errors.mobile = 'Invalid mobile number. Must be in E.164 format with minimum 10 digits (e.g., +919876543210)';
        }
        if (!staff.street1) errors.street1 = 'Street 1 is required';
        if (!staff.city) errors.city = 'City is required';
        if (!staff.state) errors.state = 'State is required';
        if (!staff.country) errors.country = 'Country is required';
        if (!staff.pincode) {
            errors.pincode = 'Pincode is required';
        } else if (!/^\d{6}$/.test(staff.pincode)) {
            errors.pincode = 'Pincode must be exactly 6 digits';
        }

        // Teaching staff specific validations
        if (staff.isTeachingStaff) {
            if (!staff.subjectIDs || staff.subjectIDs.length === 0) {
                errors.subjectIDs = 'At least one subject is required for teaching staff';
            }
            if (!staff.sectionIDs || staff.sectionIDs.length === 0) {
                errors.sectionIDs = 'At least one section is required for teaching staff';
            }
        }

        // Format validations
        if (staff.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(staff.email)) {
            errors.email = 'Invalid email format';
        }
        if (staff.name && !/^[a-zA-Z\s.]+$/.test(staff.name)) {
            errors.name = 'Name can only contain alphabets, spaces, and dots';
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
        if (validationErrors[name]) {
            setValidationErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const handleSelectChange = (event: any) => {
        const { name, value } = event.target;

        if (name === 'religion') {
            const selectedReligion = religions.find(r => r.ID === value);
            if (selectedReligion) {
                setSelectedReligionId(selectedReligion.ID);
                setStaff(prev => ({
                    ...prev,
                    religion: selectedReligion.Name
                }));
            }
        } else if (name === 'sectionIDs') {
            // Directly use the selected section IDs
            setStaff(prev => ({
                ...prev,
                sectionIDs: Array.isArray(value) ? value : []
            }));
        } else if (name === 'subjectIDs') {
            // Directly use the selected subject IDs
            setStaff(prev => ({
                ...prev,
                subjectIDs: Array.isArray(value) ? value : []
            }));
        } else {
            setStaff(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleCloseSnackbar = () => {
        setSnackbar(prev => ({ ...prev, open: false }));
    };



    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!validateForm()) return;

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
            // Create base payload without sections and subjects
            const basePayload = {
                regNumber: staff.regNumber,
                idCardNumber: staff.idCardNumber,
                name: staff.name,
                gender: staff.gender,
                dob: staff.dob,
                mobile: staff.mobile,
                email: staff.email,
                house: staff.house,
                street1: staff.street1,
                street2: staff.street2,
                city: staff.city,
                state: staff.state,
                pincode: staff.pincode,
                country: staff.country,
                bloodGroup: staff.bloodGroup,
                remarks: staff.remarks,
                religion: staff.religion,
                category: staff.category,
                caste: staff.caste,
                pwd: staff.pwd,
                isTeachingStaff: staff.isTeachingStaff
            };

            // Create the final payload
            let payload;
            if (staff.isTeachingStaff) {
                payload = {
                    ...basePayload,
                    subjectIDs: staff.subjectIDs?.filter(id => typeof id === 'number') || [],
                    sectionIDs: staff.sectionIDs?.filter(id => typeof id === 'number') || []
                };
            } else {
                payload = basePayload;
            }
            console.log('payload', payload);

            let response;
            if (initialData?.id) {
                response = await updateStaff(initialData.id, payload, schoolPrefix);
            } else {
                response = await createStaff(payload, schoolPrefix);
            }

            // Only show success message if resp_code is CREATED or SUCCESS
            if (response.status && (response.resp_code === "CREATED" || response.resp_code === "SUCCESS")) {
                setSnackbar({
                    open: true,
                    message: initialData ? 'Staff updated successfully!' : 'Staff created successfully!',
                    severity: 'success',
                    position: { vertical: 'top', horizontal: 'center' },
                });
                onSave(payload as Staff);
            } else {
                throw new Error(response.message || 'Operation failed');
            }

        } catch (err: any) {
            console.error('Error saving staff:', err);

            switch (err.response?.data?.resp_code) {
                case 'ID_CARD_NUM_EXISTS':
                    setValidationErrors(prev => ({
                        ...prev,
                        id_card_number: 'ID card number has already been used for another staff'
                    }));
                    break;
                case 'NAME_EMAIL_EXIST':
                    setValidationErrors(prev => ({
                        ...prev,
                        name: 'Name and email combination has already been used',
                        email: 'Name and email combination has already been used'
                    }));
                    break;
                case 'WRONG_INPUT':
                    setValidationErrors(prev => ({
                        ...prev,
                        section_ids: 'Non-teaching staff cannot have sections'
                    }));
                    break;
                default:
                    setSnackbar({
                        open: true,
                        message: err.response?.data?.error || 'An error occurred while saving staff data',
                        severity: 'error',
                        position: { vertical: 'top', horizontal: 'center' },
                    });
            }
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
                                label="Register Number"
                                variant="outlined"
                                fullWidth
                                name="regNumber"
                                value={staff.regNumber}
                                onChange={handleChange}
                                required
                                error={!!validationErrors.regNumber}
                                helperText={validationErrors.regNumber}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                label="ID Card Number"
                                variant="outlined"
                                fullWidth
                                name="idCardNumber"
                                value={staff.idCardNumber}
                                onChange={handleChange}
                                error={!!validationErrors.idCardNumber}
                                helperText={validationErrors.idCardNumber}
                            />
                        </Grid>
                    </Grid>

                    <Grid container spacing={2}>
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
                    </Grid>

                    <Grid container spacing={2}>
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
                                        checked={staff.isTeachingStaff}
                                        onChange={(e) => {
                                            const isTeaching = e.target.checked;
                                            setStaff(prev => ({
                                                ...prev,
                                                isTeachingStaff: isTeaching,
                                                // Clear sections and subjects if teaching staff is turned off
                                                ...(isTeaching ? {} : {
                                                    sectionIDs: [],
                                                    subjectIDs: []
                                                })
                                            }));
                                            // Clear validation errors if any
                                            if (!isTeaching) {
                                                setValidationErrors(prev => ({
                                                    ...prev,
                                                    sectionIDs: '',
                                                    subjectIDs: ''
                                                }));
                                            }
                                        }}
                                        name="isTeachingStaff"
                                    />
                                }
                                label="Teaching Staff"
                            />
                        </Grid>
                    </Grid>

                    <Grid container spacing={2}>
                        <Grid item xs={12} md={5}>
                            {staff.isTeachingStaff && (
                                loadingSections ? (
                                    <div className="flex justify-center p-4">
                                        <CircularProgress size={24} />
                                    </div>
                                ) : (
                                    <FormControl fullWidth error={!!validationErrors.sectionIDs}>
                                        <InputLabel>Section</InputLabel>
                                        <Select
                                            multiple
                                            name="sectionIDs"
                                            value={staff.sectionIDs}
                                            onChange={handleSelectChange}
                                            label="Section"
                                        >
                                            {sections.map((section: Section) => (
                                                <MenuItem key={section.ID} value={section.ID}>
                                                    {section.Name}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                        {validationErrors.sectionIDs && (
                                            <span className="text-red-500 text-sm mt-1">
                                                {validationErrors.sectionIDs}
                                            </span>
                                        )}
                                    </FormControl>
                                )
                            )}
                        </Grid>
                        <Grid item xs={12} md={7}>
                            {staff.isTeachingStaff && (
                                loadingSubjects ? (
                                    <div className="flex justify-center p-4">
                                        <CircularProgress size={24} />
                                    </div>
                                ) : (
                                    <FormControl fullWidth error={!!validationErrors.subjectIDs}>
                                        <InputLabel>Subjects</InputLabel>
                                        <Select
                                            multiple
                                            name="subjectIDs"
                                            value={staff.subjectIDs}
                                            onChange={handleSelectChange}
                                            label="Subjects"
                                        >
                                            {subjects.map((subject) => (
                                                <MenuItem key={subject.id} value={subject.id}>
                                                    {subject.name}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                        {validationErrors.subjectIDs && (
                                            <span className="text-red-500 text-sm mt-1">
                                                {validationErrors.subjectIDs}
                                            </span>
                                        )}
                                    </FormControl>
                                )
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
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            // Allow only '+' at start and numbers, enforce minimum length
                                            if (
                                                value === '' ||
                                                (value === '+' && staff.mobile === '') ||
                                                (/^\+?[0-9]*$/.test(value) && value.length <= 15)
                                            ) {
                                                handleChange(e as React.ChangeEvent<HTMLInputElement>);
                                            }
                                        }}
                                        required
                                        error={!!validationErrors.mobile}
                                        helperText={validationErrors.mobile || 'Format: +919876543210'}
                                        inputProps={{
                                            minLength: 11, // +91 plus at least 9 digits
                                            maxLength: 15,
                                            placeholder: '+919876543210'
                                        }}
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
                            <Grid container spacing={2}>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        label="House"
                                        variant="outlined"
                                        fullWidth
                                        name="house"
                                        value={staff.house}
                                        onChange={handleChange}
                                        error={!!validationErrors.house}
                                        helperText={validationErrors.house}
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        label="Street 1"
                                        variant="outlined"
                                        fullWidth
                                        name="street1"
                                        value={staff.street1}
                                        onChange={handleChange}
                                        required
                                        error={!!validationErrors.street1}
                                        helperText={validationErrors.street1}
                                    />
                                </Grid>
                            </Grid>

                            <Grid container spacing={2}>
                                <Grid item xs={12} md={4}>
                                    <TextField
                                        label="Street 2"
                                        variant="outlined"
                                        fullWidth
                                        name="street2"
                                        value={staff.street2}
                                        onChange={handleChange}
                                    />
                                </Grid>
                                <Grid item xs={12} md={4}>
                                    <TextField
                                        label="City"
                                        variant="outlined"
                                        fullWidth
                                        name="city"
                                        value={staff.city}
                                        onChange={handleChange}
                                        required
                                        error={!!validationErrors.city}
                                        helperText={validationErrors.city}
                                    />
                                </Grid>
                                <Grid item xs={12} md={4}>
                                    <TextField
                                        label="State"
                                        variant="outlined"
                                        fullWidth
                                        name="state"
                                        value={staff.state}
                                        onChange={handleChange}
                                        required
                                        error={!!validationErrors.state}
                                        helperText={validationErrors.state}
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
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            // Allow only numbers and limit to 6 digits
                                            if (value === '' || (/^\d*$/.test(value) && value.length <= 6)) {
                                                handleChange(e as React.ChangeEvent<HTMLInputElement>);
                                            }
                                        }}
                                        required
                                        error={!!validationErrors.pincode}
                                        helperText={validationErrors.pincode}
                                        inputProps={{
                                            maxLength: 6,
                                            placeholder: '123456'
                                        }}
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
                                        required
                                        error={!!validationErrors.country}
                                        helperText={validationErrors.country}
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
                                            name="bloodGroup"
                                            value={staff.bloodGroup}
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
                                    <FormControl fullWidth>
                                        <InputLabel>Religion</InputLabel>
                                        <Select
                                            name="religion"
                                            value={selectedReligionId || ''}
                                            onChange={handleSelectChange}
                                            label="Religion"
                                        >
                                            {religions.map((religion) => (
                                                <MenuItem key={religion.ID} value={religion.ID}>
                                                    {religion.Name}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>
                            </Grid>

                            <Grid container spacing={2}>
                                <Grid item xs={12} md={4}>
                                    <FormControl fullWidth>
                                        <InputLabel>Caste</InputLabel>
                                        <Select
                                            name="caste"
                                            value={staff.caste}
                                            onChange={handleSelectChange}
                                            label="Caste"
                                            disabled={!staff.religion}
                                        >
                                            {!staff.religion ? (
                                                <MenuItem value="">
                                                    <span className="text-gray-500">Select a religion first</span>
                                                </MenuItem>
                                            ) : castes.length === 0 ? (
                                                <MenuItem value="">
                                                    <div className="flex items-center justify-between w-full">
                                                        <span className="text-gray-500">No castes found</span>
                                                        <button
                                                            onClick={(e) => {
                                                                e.preventDefault();
                                                                e.stopPropagation();
                                                                navigate('/superadmin/castes');
                                                            }}
                                                            className="text-blue-500 text-sm hover:text-blue-600 transition-colors inline-flex items-center gap-1.5"
                                                        >
                                                            <PlusCircle size={14} />
                                                            Add Caste
                                                        </button>
                                                    </div>
                                                </MenuItem>
                                            ) : (
                                                castes.map((caste: string) => (
                                                    <MenuItem key={caste} value={caste}>
                                                        {caste}
                                                    </MenuItem>
                                                ))
                                            )}
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12} md={4}>
                                    <FormControl fullWidth>
                                        <InputLabel>Category</InputLabel>
                                        <Select
                                            name="category"
                                            value={staff.category}
                                            onChange={handleSelectChange}
                                            label="Category"
                                        >
                                            {CATEGORIES.map((category) => (
                                                <MenuItem key={category} value={category}>
                                                    {category}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12} md={4}>
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
                                </Grid>

                            </Grid>

                            <div>

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
                    onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                        e.preventDefault();
                        handleSubmit(e as any);
                    }}
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