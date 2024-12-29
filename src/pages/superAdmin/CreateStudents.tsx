import React, { useState, useEffect } from 'react';
import { TextField, Button, FormControl, InputLabel, Select, MenuItem, Grid, Autocomplete, FormControlLabel, Switch, FormHelperText } from '@mui/material';
import { CreateStudentProps, StudentFormValues } from '../../types/Types';
import CustomTabs from '../../components/CustomTabs';
import { useSchoolContext } from '../../contexts/SchoolContext';
import { createStudent, getClasses, listParents, updateStudent, getSchoolReligions, fetchCastesByReligion } from '../../api/superAdmin';
import SnackbarComponent from '../../components/SnackbarComponent';
import { PlusCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { SelectChangeEvent } from '@mui/material/Select';

interface Religion {
    ID: number;
    Name: string;
}

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];
const CATEGORIES = ['General', 'OBC', 'SC', 'ST', 'Other'];

const CreateStudents: React.FC<CreateStudentProps> = ({ initialData, onSave, onCancel }) => {
    const { schoolInfo } = useSchoolContext();
    const [classes, setClasses] = useState<any[]>([]);
    const [parents, setParents] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [castes, setCastes] = useState<string[]>([]);
    const [religions, setReligions] = useState<Religion[]>([]);
    const [validationErrors, setValidationErrors] = useState<any>({});
    const navigate = useNavigate();

    const [student, setStudent] = useState<StudentFormValues>(initialData || {
        name: '',
        dateOfAdmission: '',
        rollNumber: 0,
        gender: '',
        dob: '',
        phone: '',
        email: '',
        street1: '',
        city: '',
        state: '',
        pincode: '',
        country: '',
        classID: NaN,
        idCardNumber: null,
        admissionNumber: null,
        house: '',
        street2: '',
        bloodGroup: null,
        remarks: '',
        religion: '',
        caste: '',
        reservationCategory: '',
        isPWD: false,
        nationality: '',
        parentsInfo: [],
    });

    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success' as 'success' | 'error',
        position: { vertical: 'top' as const, horizontal: 'center' as const }
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (!schoolInfo.schoolPrefix) {
                    throw new Error("School prefix not found");
                }
                const [classesResponse, parentsResponse, religionsResponse] = await Promise.allSettled([
                    getClasses(schoolInfo.schoolPrefix),
                    listParents(schoolInfo.schoolPrefix),
                    getSchoolReligions(schoolInfo.schoolPrefix)
                ]);

                if (classesResponse.status === "fulfilled" && classesResponse.value.status && classesResponse.value.resp_code === "SUCCESS") {
                    console.log('Classes data:', classesResponse.value.data);
                    setClasses(classesResponse.value.data);
                }
                if (parentsResponse.status === "fulfilled" && parentsResponse.value.status && parentsResponse.value.resp_code === "SUCCESS") {
                    setParents(parentsResponse.value.data.parents);
                }
                if (religionsResponse.status === "fulfilled" && religionsResponse.value.status) {
                    setReligions(religionsResponse.value.data || []);
                }
            } catch (err: any) {
                setSnackbar({
                    open: true,
                    message: err.message || 'Failed to fetch data',
                    severity: 'error',
                    position: { vertical: 'top', horizontal: 'center' },
                });
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [schoolInfo.schoolPrefix]);

    useEffect(() => {
        const getCastes = async () => {
            try {
                if (student.religion) {
                    const response = await fetchCastesByReligion(student.religion || '', schoolInfo.schoolPrefix || '');
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
    }, [student.religion]);

    const validateForm = () => {
        const errors: any = {};

        if (!student.name) errors.name = 'Name is required';
        if (!student.dateOfAdmission) errors.dateOfAdmission = 'Date of Admission is required';
        if (!student.dob) errors.dob = 'Date of Birth is required';
        if (!student.gender) {
            errors.gender = 'Gender is required';
        }
        if (!student.phone) {
            errors.phone = 'Phone number is required';
        } else if (!/^\+[1-9]\d{9,14}$/.test(student.phone)) {
            errors.phone = 'Invalid phone number. Must be in E.164 format with minimum 10 digits (e.g., +919876543210)';
        }
        if (!student.email) {
            errors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(student.email)) {
            errors.email = 'Invalid email format';
        }
        if (!student.classID) errors.classID = 'Class is required';

        if (student.parentsInfo.length > 0) {
            const parentErrors: string[] = [];
            student.parentsInfo.forEach((parent, index) => {
                if (!parent.relationshipWithStudent) {
                    parentErrors[index] = 'Relationship is required';
                }
            });
            if (parentErrors.length > 0) {
                errors.parentsInfo = parentErrors;
            }
        }

        if (!student.street1) errors.street1 = 'Street 1 is required';
        if (!student.city) errors.city = 'City is required';
        if (!student.state) errors.state = 'State is required';
        if (!student.country) errors.country = 'Country is required';
        if (!student.pincode) {
            errors.pincode = 'Pincode is required';
        } else if (!/^\d{6}$/.test(student.pincode)) {
            errors.pincode = 'Pincode must be exactly 6 digits';
        }

        if (!student.nationality) errors.nationality = 'Nationality is required';

        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
        const { name, value } = e.target;
        setStudent(prev => ({
            ...prev,
            [name as string]: value
        }));
    };

    const handleSelectChange = (event: SelectChangeEvent<string>) => {
        const { name, value } = event.target;
        setStudent(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) return;

        try {
            if (!schoolInfo.schoolPrefix) {
                throw new Error("School prefix not found");
            }

            const formData = new FormData();
            Object.entries(student).forEach(([key, value]) => {
                if (key !== 'parentsInfo' && value !== null && value !== undefined) {
                    formData.append(key, value.toString());
                }
            });

            student.parentsInfo.forEach((parent, index) => {
                formData.append(`parentsInfo[${index}].parentId`, parent.parentId.toString());
                formData.append(`parentsInfo[${index}].relationshipWithStudent`, parent.relationshipWithStudent);
            });

            const response = initialData?.id
                ? await updateStudent(initialData.id, formData, schoolInfo.schoolPrefix)
                : await createStudent(formData, schoolInfo.schoolPrefix);

            if (response.status) {
                onSave(student);
            }
        } catch (error: any) {
            setSnackbar({
                open: true,
                message: error.message || 'Failed to save student',
                severity: 'error',
                position: { vertical: 'top', horizontal: 'center' },
            });
        }
    };

    return (
        <div className="flex flex-col h-full">
            <div className="flex-grow overflow-auto p-4">
                <h2 className="text-xl font-bold mb-4">
                    {initialData ? 'Edit Student' : 'Create Student'}
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* School Info Section */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <Grid container spacing={3} className="mb-4">
                            <Grid item xs={12} md={4}>
                                <TextField
                                    disabled
                                    value={schoolInfo.name || ''}
                                    label="School"
                                    fullWidth
                                />
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <TextField
                                    type="date"
                                    name="dateOfAdmission"
                                    label="Date of Admission"
                                    fullWidth
                                    required
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    error={validationErrors.dateOfAdmission}
                                    helperText={validationErrors.dateOfAdmission}
                                    value={student.dateOfAdmission}
                                    onChange={handleChange}
                                />
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <TextField
                                    name="admissionNumber"
                                    label="Admission Number"
                                    fullWidth
                                    error={validationErrors.admissionNumber}
                                    helperText={validationErrors.admissionNumber}
                                    value={student.admissionNumber}
                                    onChange={handleChange}
                                />
                            </Grid>
                        </Grid>

                        <Grid container spacing={3} className="mb-4">
                            <Grid item xs={12} md={6}>
                                <TextField
                                    name="name"
                                    label="Student Name"
                                    fullWidth
                                    required
                                    error={validationErrors.name}
                                    helperText={validationErrors.name}
                                    value={student.name}
                                    onChange={handleChange}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    name="idCardNumber"
                                    label="ID Card Number"
                                    fullWidth
                                    error={validationErrors.idCardNumber}
                                    helperText={validationErrors.idCardNumber}
                                    value={student.idCardNumber}
                                    onChange={handleChange}
                                />
                            </Grid>
                        </Grid>

                        <Grid container spacing={3}>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    name="rollNumber"
                                    label="Roll Number"
                                    fullWidth
                                    type="number"
                                    error={validationErrors.rollNumber}
                                    helperText={validationErrors.rollNumber}
                                    value={student.rollNumber || ''}
                                    onChange={handleChange}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <FormControl fullWidth error={!!validationErrors.classID}>
                                    <InputLabel>Class</InputLabel>
                                    <Select
                                        name="classID"
                                        label="Class"
                                        required
                                        value={student.classID ? student.classID.toString() : ''}
                                        onChange={(e) => {
                                            setStudent(prev => ({
                                                ...prev,
                                                classID: parseInt(e.target.value) || 0
                                            }));
                                        }}
                                    >
                                        {(classes || []).length === 0 ? (
                                            <MenuItem value="">
                                                <div className="flex items-center justify-between w-full">
                                                    <span className="text-gray-500">No classes found</span>
                                                    <button
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            e.stopPropagation();
                                                            navigate(`/superadmin/schools/${schoolInfo.schoolPrefix}/classes`);
                                                        }}
                                                        className="text-blue-500 text-sm hover:text-blue-600 transition-colors inline-flex items-center gap-1.5"
                                                    >
                                                        <PlusCircle size={14} />
                                                        Add Class
                                                    </button>
                                                </div>
                                            </MenuItem>
                                        ) : (
                                            classes.map((cls: any) => (
                                                <MenuItem key={cls.ID || cls.id} value={(cls.ID || cls.id).toString()}>
                                                    {cls.Name || cls.name}
                                                </MenuItem>
                                            ))
                                        )}
                                    </Select>
                                    {validationErrors.classID && (
                                        <FormHelperText error>
                                            {validationErrors.classID}
                                        </FormHelperText>
                                    )}
                                </FormControl>
                            </Grid>
                        </Grid>
                    </div>

                    {/* Tabs Section */}
                    <CustomTabs labels={['Basic Info', 'Parents', 'Additional Info']}>
                        {/* Basic Info Tab */}
                        <Grid container spacing={2}>
                            <Grid item xs={12} md={6}>
                                <FormControl fullWidth required error={!!validationErrors.gender}>
                                    <InputLabel>Gender</InputLabel>
                                    <Select
                                        name="gender"
                                        label="Gender"
                                        required
                                        value={student.gender}
                                        onChange={handleSelectChange}
                                    >
                                        <MenuItem value="">
                                            <em>Select Gender</em>
                                        </MenuItem>
                                        <MenuItem value="male">Male</MenuItem>
                                        <MenuItem value="female">Female</MenuItem>
                                        <MenuItem value="other">Other</MenuItem>
                                    </Select>
                                    {validationErrors.gender && (
                                        <FormHelperText>{validationErrors.gender}</FormHelperText>
                                    )}
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    type="date"
                                    name="dob"
                                    label="Date of Birth"
                                    fullWidth
                                    required
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    error={validationErrors.dob}
                                    helperText={validationErrors.dob}
                                    value={student.dob}
                                    onChange={handleChange}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    name="phone"
                                    label="Phone"
                                    fullWidth
                                    required
                                    error={!!validationErrors.phone}
                                    helperText={validationErrors.phone || 'Format: +919876543210'}
                                    value={student.phone}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        // Allow only '+' at start and numbers, enforce minimum length
                                        if (
                                            value === '' ||
                                            (value === '+' && student.phone === '') ||
                                            (/^\+?[0-9]*$/.test(value) && value.length <= 15)
                                        ) {
                                            handleChange(e as React.ChangeEvent<HTMLInputElement>);
                                        }
                                    }}
                                    inputProps={{
                                        minLength: 11, // +91 plus at least 9 digits
                                        maxLength: 15,
                                        placeholder: '+919876543210'
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    name="email"
                                    label="Email"
                                    type="email"
                                    fullWidth
                                    required
                                    error={validationErrors.email}
                                    helperText={validationErrors.email}
                                    value={student.email}
                                    onChange={handleChange}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    name="nationality"
                                    label="Nationality"
                                    fullWidth
                                    required
                                    error={!!validationErrors.nationality}
                                    helperText={validationErrors.nationality}
                                    value={student.nationality}
                                    onChange={handleChange}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <FormControl fullWidth error={!!validationErrors.bloodGroup}>
                                    <InputLabel>Blood Group</InputLabel>
                                    <Select
                                        name="bloodGroup"
                                        label="Blood Group"
                                        value={student.bloodGroup || ''}
                                        onChange={handleSelectChange}
                                    >
                                        {BLOOD_GROUPS.map(group => (
                                            <MenuItem key={group} value={group}>
                                                {group}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                    {validationErrors.bloodGroup && (
                                        <FormHelperText error>
                                            {validationErrors.bloodGroup}
                                        </FormHelperText>
                                    )}
                                </FormControl>
                            </Grid>
                        </Grid>

                        {/* Parents Tab */}
                        <div>
                            <div className="flex justify-between items-center mb-4">
                                <Autocomplete
                                    className="flex-grow mr-4"
                                    multiple
                                    options={parents}
                                    getOptionLabel={(option) => `${option.name} (${option.phone})`}
                                    value={student.parentsInfo.map(info => parents.find(p => p.id === info.parentId)).filter(Boolean)}
                                    onChange={(_, newValue) => {
                                        const newParentsInfo = newValue.map(parent => {
                                            const existingParent = student.parentsInfo.find(p => p.parentId === parent.id);
                                            return {
                                                parentId: parent.id,
                                                relationshipWithStudent: existingParent ? existingParent.relationshipWithStudent : ''
                                            };
                                        });

                                        setStudent(prev => ({
                                            ...prev,
                                            parentsInfo: newParentsInfo
                                        }));
                                    }}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label="Search Parents"
                                            variant="outlined"
                                        />
                                    )}
                                />
                                <Button
                                    startIcon={<PlusCircle size={20} />}
                                    onClick={() => navigate(`/superadmin/schools/${schoolInfo.schoolPrefix}/parents`)}
                                >
                                    Add Parent
                                </Button>
                            </div>

                            <div className="mt-4">
                                {(student.parentsInfo || []).map((parentInfo, index) => {
                                    const parentDetails = parents.find(p => p.id === parentInfo.parentId);

                                    return (
                                        <div key={index} className="flex gap-4 mt-2">
                                            <div className="flex-grow">
                                                <TextField
                                                    fullWidth
                                                    disabled
                                                    value={parentDetails?.name || ''}
                                                    label="Parent Name"
                                                />
                                            </div>
                                            <div className="flex-grow">
                                                <FormControl
                                                    fullWidth
                                                    error={!!(validationErrors.parentsInfo && validationErrors.parentsInfo[index])}
                                                >
                                                    <InputLabel>Relationship</InputLabel>
                                                    <Select
                                                        value={parentInfo.relationshipWithStudent}
                                                        onChange={(e) => {
                                                            const newParentsInfo = [...student.parentsInfo];
                                                            newParentsInfo[index].relationshipWithStudent = e.target.value;
                                                            setStudent(prev => ({
                                                                ...prev,
                                                                parentsInfo: newParentsInfo
                                                            }));
                                                            if (validationErrors.parentsInfo) {
                                                                const newErrors = { ...validationErrors };
                                                                if (newErrors.parentsInfo) {
                                                                    newErrors.parentsInfo[index] = '';
                                                                }
                                                                setValidationErrors(newErrors);
                                                            }
                                                        }}
                                                        label="Relationship"
                                                        required
                                                    >
                                                        <MenuItem value="Father">Father</MenuItem>
                                                        <MenuItem value="Mother">Mother</MenuItem>
                                                        <MenuItem value="Guardian">Guardian</MenuItem>
                                                        <MenuItem value="Other">Other</MenuItem>
                                                    </Select>
                                                    {validationErrors.parentsInfo && validationErrors.parentsInfo[index] && (
                                                        <FormHelperText error>
                                                            {validationErrors.parentsInfo[index]}
                                                        </FormHelperText>
                                                    )}
                                                </FormControl>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Additional Info Tab */}
                        <Grid container spacing={2}>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    label="House"
                                    variant="outlined"
                                    fullWidth
                                    name="house"
                                    value={student.house}
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
                                    value={student.street1}
                                    onChange={handleChange}
                                    required
                                    error={!!validationErrors.street1}
                                    helperText={validationErrors.street1}
                                />
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <TextField
                                    label="Street 2"
                                    variant="outlined"
                                    fullWidth
                                    name="street2"
                                    value={student.street2}
                                    onChange={handleChange}
                                />
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <TextField
                                    label="City"
                                    variant="outlined"
                                    fullWidth
                                    name="city"
                                    value={student.city}
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
                                    value={student.state}
                                    onChange={handleChange}
                                    required
                                    error={!!validationErrors.state}
                                    helperText={validationErrors.state}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    label="Pin Code"
                                    variant="outlined"
                                    fullWidth
                                    name="pincode"
                                    value={student.pincode}
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
                                    value={student.country}
                                    onChange={handleChange}
                                    required
                                    error={!!validationErrors.country}
                                    helperText={validationErrors.country}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <FormControl fullWidth error={!!validationErrors.religion}>
                                    <InputLabel>Religion</InputLabel>
                                    <Select
                                        name="religion"
                                        label="Religion"
                                        value={student.religion}
                                        onChange={(e) => {
                                            setStudent(prev => ({
                                                ...prev,
                                                religion: e.target.value
                                            }));
                                        }}
                                    >
                                        {(religions || []).length === 0 ? (
                                            <MenuItem value="">
                                                <div className="flex items-center justify-between w-full">
                                                    <span className="text-gray-500">No religions found</span>
                                                    <button
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            e.stopPropagation();
                                                            navigate('/religions');
                                                        }}
                                                        className="text-blue-500 text-sm hover:text-blue-600 transition-colors inline-flex items-center gap-1.5"
                                                    >
                                                        <PlusCircle size={14} />
                                                        Add Religion
                                                    </button>
                                                </div>
                                            </MenuItem>
                                        ) : (
                                            religions.map((religion) => (
                                                <MenuItem key={religion.ID} value={religion.ID}>
                                                    {religion.Name}
                                                </MenuItem>
                                            ))
                                        )}
                                    </Select>
                                    {validationErrors.religion && (
                                        <FormHelperText error>
                                            {validationErrors.religion}
                                        </FormHelperText>
                                    )}
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <FormControl fullWidth>
                                    <InputLabel>Caste</InputLabel>
                                    <Select
                                        name="caste"
                                        label="Caste"
                                        disabled={!student.religion}
                                        value={student.caste}
                                        onChange={(e) => {
                                            setStudent(prev => ({
                                                ...prev,
                                                caste: e.target.value
                                            }));
                                        }}
                                    >
                                        {!student.religion ? (
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
                            <Grid item xs={12} md={6}>
                                <FormControl fullWidth>
                                    <InputLabel>Reservation Category</InputLabel>
                                    <Select
                                        name="reservationCategory"
                                        label="Reservation Category"
                                        value={student.reservationCategory}
                                        onChange={handleSelectChange}
                                    >
                                        {CATEGORIES.map(category => (
                                            <MenuItem key={category} value={category}>
                                                {category}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                    {validationErrors.reservationCategory && (
                                        <FormHelperText error>
                                            {validationErrors.reservationCategory}
                                        </FormHelperText>
                                    )}
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <FormControlLabel
                                    control={
                                        <Switch
                                            name="isPWD"
                                            type="checkbox"
                                            checked={student.isPWD}
                                            onChange={(e) => {
                                                setStudent(prev => ({
                                                    ...prev,
                                                    isPWD: e.target.checked
                                                }));
                                            }}
                                        />
                                    }
                                    label="Person with Disability"
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    name="remarks"
                                    label="Remarks"
                                    multiline
                                    rows={4}
                                    fullWidth
                                    error={validationErrors.remarks}
                                    helperText={validationErrors.remarks}
                                    value={student.remarks}
                                    onChange={handleChange}
                                />
                            </Grid>
                        </Grid>
                    </CustomTabs>
                </form>
            </div>

            {/* Fixed Bottom Buttons */}
            <div className="flex justify-end space-x-2 p-4 pb-0 border-t bg-white">
                <Button
                    onClick={onCancel}
                    variant="outlined"
                    color="error"
                    disabled={loading}
                    type="button"
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
                >
                    {loading ? 'Saving...' : (initialData ? 'Update Student' : 'Create Student')}
                </Button>
            </div>

            <SnackbarComponent
                open={snackbar.open}
                message={snackbar.message}
                severity={snackbar.severity}
                position={snackbar.position}
                onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
            />
        </div>
    );
};

export default CreateStudents;
