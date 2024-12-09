import React, { useState, useEffect } from 'react';
import { TextField, Button, FormControl, InputLabel, Select, MenuItem, Grid, Autocomplete, Modal, Box, FormControlLabel, Switch } from '@mui/material';
import { CreateStudentProps, StudentFormValues } from '../../types/Types';
import { Formik, Form, Field } from 'formik';
import CustomTabs from '../../components/CustomTabs';
import { useSchoolContext } from '../../contexts/SchoolContext';
import { createStudent, getClasses, listParents, updateStudent } from '../../api/superAdmin';
import SnackbarComponent from '../../components/SnackbarComponent';
import { PlusCircle } from 'lucide-react';
import CreateParent from './CreateParent';
import { studentValidationSchema } from '../../validations/studentFormValidationSchema';

interface ParentInfo {
    parentId: number;
    relationshipWithStudent: string;
}

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];
const CATEGORIES = ['General', 'OBC', 'SC', 'ST', 'Other'];

const formatDateForDisplay = (date: Date | string): string => {
    if (!date) return '';

    if (typeof date === 'string') {
        if (date.endsWith('Z')) {
            const dateObj = new Date(date);
            return dateObj.toISOString().split('T')[0];
        }

        if (date.match(/^\d{2}-\d{2}-\d{4}$/)) {
            const [day, month, year] = date.split('-');
            return `${year}-${month}-${day}`;
        }
    }

    const dateObj = typeof date === 'string' ? new Date(date) : date;
    if (isNaN(dateObj.getTime())) return '';

    return dateObj.toISOString().split('T')[0];
};

const formatDateForSubmit = (date: Date | string): string => {
    if (!date) return '';

    let day, month, year;

    if (typeof date === 'string') {
        if (date.match(/^\d{4}-\d{2}-\d{2}$/)) {
            [year, month, day] = date.split('-');
            return `${day}-${month}-${year}`;
        }

        if (date.match(/^\d{2}-\d{2}-\d{4}$/)) {
            return date;
        }
    }

    const dateObj = typeof date === 'string' ? new Date(date) : date;
    day = String(dateObj.getDate()).padStart(2, '0');
    month = String(dateObj.getMonth() + 1).padStart(2, '0');
    year = dateObj.getFullYear();

    return `${day}-${month}-${year}`;
};

const CreateStudents: React.FC<CreateStudentProps> = ({ initialData, onSave, onCancel }) => {
    const { schoolInfo } = useSchoolContext();
    const [classes, setClasses] = useState<any[]>([]);
    const [parents, setParents] = useState<any[]>([]);
    const [_loading, setLoading] = useState(true);
    const [_error, setError] = useState<string | null>(null);
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success' as 'success' | 'error',
        position: { vertical: 'top' as const, horizontal: 'center' as const }
    });
    const [openParentModal, setOpenParentModal] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (!schoolInfo.schoolPrefix) {
                    throw new Error("School prefix not found");
                }
                const [classesResponse, parentsResponse] = await Promise.allSettled([
                    getClasses(schoolInfo.schoolPrefix),
                    listParents(schoolInfo.schoolPrefix)
                ]);
                console.log("classesResponse", classesResponse);


                if (classesResponse.status === "fulfilled" && classesResponse.value.status && classesResponse.value.resp_code === "SUCCESS") {
                    setClasses(classesResponse.value.data);
                }
                if (parentsResponse.status === "fulfilled" && parentsResponse.value.status && parentsResponse.value.resp_code === "SUCCESS") {
                    setParents(parentsResponse.value.data.parents);
                }
            } catch (err: any) {
                setError(err.message || 'Failed to fetch data');
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

    const fetchParentsList = async () => {
        if (!schoolInfo.schoolPrefix) {
            throw new Error("School prefix not found");
        }
        const response = await listParents(schoolInfo.schoolPrefix);
        if (response.status && response.resp_code === "SUCCESS") {
            setParents(response.data.parents);
        }
    };

    const handleSubmit = async (values: StudentFormValues, { setSubmitting, validateForm }: any) => {

        const errors = await validateForm(values);

        if (Object.keys(errors).length > 0) {
            setSubmitting(false);
            return;
        }

        try {
            if (!schoolInfo.schoolPrefix) {
                throw new Error("School prefix not found");
            }

            const formData = new FormData();

            Object.entries(values).forEach(([key, value]) => {
                if (key === 'parentsInfo' && Array.isArray(value)) {
                    formData.append('parentsInfo', JSON.stringify(value));
                } else if (value !== null && value !== undefined) {
                    formData.append(key, value.toString());
                }
            });

            const response = initialData && initialData.id !== undefined
                ? await updateStudent(initialData.id, formData, schoolInfo.schoolPrefix)
                : await createStudent(formData, schoolInfo.schoolPrefix);


            if (response.status && response.resp_code === "CREATED" || response.status && response.resp_code === "SUCCESS") {
                setSnackbar({
                    open: true,
                    message: initialData ? "Student updated successfully!" : "Student created successfully!",
                    severity: "success",
                    position: { vertical: "top", horizontal: "center" },
                });
                onSave(values);
            } else {
                throw new Error(response.message || 'Failed to save student');
            }
        } catch (error: any) {
            console.error('Error saving student:', error);
            setSnackbar({
                open: true,
                message: error.response?.data?.message || error.message || 'Failed to save student',
                severity: "error",
                position: { vertical: "top", horizontal: "center" },
            });
        } finally {
            setSubmitting(false);
        }
    };

    const handleParentSave = async () => {
        try {
            await fetchParentsList();
            setOpenParentModal(false);
            setSnackbar({
                open: true,
                message: "Parent created successfully!",
                severity: "success",
                position: { vertical: "top", horizontal: "center" },
            });
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || error.message || "Failed to create parent";
            setSnackbar({
                open: true,
                message: errorMessage,
                severity: "error",
                position: { vertical: "top", horizontal: "center" },
            });
        }
    };

    return (
        <div className="flex flex-col h-full">
            <div className="flex-grow p-4 overflow-auto">
                <h2 className="text-xl font-bold mb-4">
                    {initialData ? 'Edit Student' : 'Create Student'}
                </h2>
                <Formik
                    initialValues={initialData ? {
                        ...initialData,
                        dob: initialData.dob.endsWith('Z')
                            ? formatDateForSubmit(initialData.dob)  // Convert ISO date to DD-MM-YYYY
                            : initialData.dob,  // Keep existing DD-MM-YYYY format
                        dateOfAdmission: initialData.dateOfAdmission.endsWith('Z')
                            ? formatDateForSubmit(initialData.dateOfAdmission)
                            : initialData.dateOfAdmission
                    } : {
                        name: 'Mohammed',
                        dateOfAdmission: formatDateForSubmit(new Date()),
                        gender: 'male',
                        dob: '',
                        phone: '+91234234',
                        email: 'a@gmaill.com',
                        street1: 'Parakkal',
                        city: 'Malappuram',
                        state: 'kerala',
                        pincode: '678333',
                        country: 'India',
                        classID: 2,
                        idCardNumber: null,
                        admissionNumber: null,
                        house: '440A',
                        street2: 'vazhikkadavu',
                        bloodGroup: null,
                        remarks: '',
                        religion: '',
                        caste: '',
                        reservationCategory: '',
                        isPWD: false,
                        nationality: 'Indian',
                        parentsInfo: [],
                    } as StudentFormValues}
                    validationSchema={studentValidationSchema}
                    onSubmit={(values, actions) => {
                        console.log("Formik onSubmit triggered", values);
                        handleSubmit(values, actions);
                    }}
                    enableReinitialize={true}
                >
                    {({ values, errors, touched, isSubmitting, setFieldValue, handleSubmit: formikHandleSubmit }) => {
                        console.log('Form Values:', values);
                        console.log('Initial Data:', initialData);

                        return (
                            <Form
                                className="flex flex-col h-full"
                                noValidate
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    console.log("Form values:", values);
                                    console.log("Validation errors:", errors);
                                    formikHandleSubmit(e);
                                }}
                            >
                                <div className="flex-none bg-gray-50 p-4">
                                    <Grid container spacing={2}>
                                        <Grid item xs={12} md={6}>
                                            <TextField
                                                disabled
                                                value={schoolInfo.name || ''}
                                                label="School"
                                                fullWidth
                                            />
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <TextField
                                                label="Date of Admission"
                                                value={values.dateOfAdmission}
                                                fullWidth
                                                disabled
                                            />
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <Field
                                                as={TextField}
                                                name="name"
                                                label="Student Name"
                                                fullWidth
                                                required
                                                error={touched.name && errors.name}
                                                helperText={touched.name && errors.name}
                                            />
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <Field
                                                as={TextField}
                                                name="idCardNumber"
                                                label="ID Card Number"
                                                fullWidth
                                                error={touched.idCardNumber && errors.idCardNumber}
                                                helperText={touched.idCardNumber && errors.idCardNumber}
                                            />
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <Field
                                                as={TextField}
                                                name="admissionNumber"
                                                label="Admission Number"
                                                fullWidth
                                                error={touched.admissionNumber && errors.admissionNumber}
                                                helperText={touched.admissionNumber && errors.admissionNumber}
                                            />
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <FormControl fullWidth>
                                                <InputLabel>Class</InputLabel>
                                                <Field
                                                    as={Select}
                                                    name="classID"
                                                    label="Class"
                                                    required
                                                    error={touched.classID && errors.classID}
                                                    helperText={touched.classID && errors.classID}
                                                >
                                                    {(classes || []).map((cls: any) => (
                                                        <MenuItem key={cls.ID} value={cls.ID}>
                                                            {cls.Name}
                                                        </MenuItem>
                                                    ))}
                                                </Field>
                                            </FormControl>
                                        </Grid>
                                    </Grid>
                                </div>



                                <CustomTabs labels={['Basic Info', 'Parents', 'Additional Info']}>
                                    {/* Basic Info Tab */}
                                    <Grid container spacing={2}>
                                        <Grid item xs={12} md={6}>
                                            <FormControl fullWidth>
                                                <InputLabel>Gender</InputLabel>
                                                <Field
                                                    as={Select}
                                                    name="gender"
                                                    label="Gender"
                                                    required
                                                    error={touched.gender && errors.gender}
                                                    helperText={touched.gender && errors.gender}
                                                >
                                                    <MenuItem value="male">Male</MenuItem>
                                                    <MenuItem value="female">Female</MenuItem>
                                                    <MenuItem value="other">Other</MenuItem>
                                                </Field>
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <Field
                                                as={TextField}
                                                type="date"
                                                name="dob"
                                                label="Date of Birth"
                                                fullWidth
                                                InputLabelProps={{
                                                    shrink: true,
                                                }}
                                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                                    const selectedDate = e.target.value; // YYYY-MM-DD from date picker
                                                    const formattedDate = formatDateForSubmit(selectedDate); // Convert to DD-MM-YYYY
                                                    setFieldValue('dob', formattedDate);
                                                }}
                                                value={values.dob ? formatDateForDisplay(values.dob) : ''} // Convert DD-MM-YYYY to YYYY-MM-DD for display
                                                error={touched.dob && !!errors.dob}
                                                helperText={touched.dob && errors.dob}
                                            />
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <Field
                                                as={TextField}
                                                name="phone"
                                                label="Phone"
                                                fullWidth
                                                required
                                                error={touched.phone && errors.phone}
                                                helperText={touched.phone && errors.phone}
                                            />
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <Field
                                                as={TextField}
                                                name="email"
                                                label="Email"
                                                type="email"
                                                fullWidth
                                                required
                                                error={touched.email && errors.email}
                                                helperText={touched.email && errors.email}
                                            />
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <Field
                                                as={TextField}
                                                name="nationality"
                                                label="Nationality"
                                                fullWidth
                                                error={touched.nationality && errors.nationality}
                                                helperText={touched.nationality && errors.nationality}
                                            />
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <FormControl fullWidth>
                                                <InputLabel>Blood Group</InputLabel>
                                                <Field
                                                    as={Select}
                                                    name="bloodGroup"
                                                    label="Blood Group"
                                                    error={touched.bloodGroup && errors.bloodGroup}
                                                    helperText={touched.bloodGroup && errors.bloodGroup}
                                                >
                                                    {BLOOD_GROUPS.map(group => (
                                                        <MenuItem key={group} value={group}>
                                                            {group}
                                                        </MenuItem>
                                                    ))}
                                                </Field>
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
                                                onChange={(_, newValue) => {
                                                    const newParentsInfo = newValue.map(parent => ({
                                                        parentId: parent.id,
                                                        relationshipWithStudent: ''
                                                    }));
                                                    setFieldValue('parentsInfo', newParentsInfo);
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
                                                variant="contained"
                                                color="primary"
                                                onClick={() => setOpenParentModal(true)}
                                            >
                                                Add Parent
                                            </Button>
                                        </div>

                                        <div className="mt-4">
                                            {(values.parentsInfo || []).map((parentInfo: ParentInfo, index: number) => (
                                                <div key={index} className="flex gap-4 mt-2">
                                                    <div className="flex-grow">
                                                        <TextField
                                                            fullWidth
                                                            disabled
                                                            value={parents.find(p => p.id === parentInfo.parentId)?.name || ''}
                                                            label="Parent Name"
                                                        />
                                                    </div>
                                                    <div className="flex-grow">
                                                        <TextField
                                                            fullWidth
                                                            value={parentInfo.relationshipWithStudent}
                                                            onChange={(e) => {
                                                                const newParentsInfo = [...values.parentsInfo];
                                                                newParentsInfo[index].relationshipWithStudent = e.target.value;
                                                                setFieldValue('parentsInfo', newParentsInfo);
                                                            }}
                                                            label="Relationship with Student"
                                                            placeholder="e.g. Father, Mother, Guardian"
                                                        />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Additional Info Tab */}
                                    <Grid container spacing={2}>
                                        <Grid item xs={12}>
                                            <Field
                                                as={TextField}
                                                name="house"
                                                label="House Name"
                                                fullWidth
                                                error={touched.house && !!errors.house}
                                                helperText={touched.house && errors.house}
                                            />
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <Field
                                                as={TextField}
                                                name="street1"
                                                label="Address Line 1"
                                                fullWidth
                                                required
                                                error={touched.street1 && !!errors.street1}
                                                helperText={touched.street1 && errors.street1}
                                            />
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <Field
                                                as={TextField}
                                                name="street2"
                                                label="Address Line 2"
                                                fullWidth
                                                error={touched.street2 && !!errors.street2}
                                                helperText={touched.street2 && errors.street2}
                                            />
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <Field
                                                as={TextField}
                                                name="city"
                                                label="City"
                                                fullWidth
                                                required
                                                error={touched.city && !!errors.city}
                                                helperText={touched.city && errors.city}
                                            />
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <Field
                                                as={TextField}
                                                name="state"
                                                label="State"
                                                fullWidth
                                                required
                                                error={touched.state && !!errors.state}
                                                helperText={touched.state && errors.state}
                                            />
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <Field
                                                as={TextField}
                                                name="pincode"
                                                label="Pin Code"
                                                fullWidth
                                                required
                                                error={touched.pincode && !!errors.pincode}
                                                helperText={touched.pincode && errors.pincode}
                                            />
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <Field
                                                as={TextField}
                                                name="country"
                                                label="Country"
                                                fullWidth
                                                required
                                                error={touched.country && !!errors.country}
                                                helperText={touched.country && errors.country}
                                            />
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <Field
                                                as={TextField}
                                                name="religion"
                                                label="Religion"
                                                fullWidth
                                            />
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <Field
                                                as={TextField}
                                                name="caste"
                                                label="Caste"
                                                fullWidth
                                            />
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <FormControl fullWidth>
                                                <InputLabel>Reservation Category</InputLabel>
                                                <Field
                                                    as={Select}
                                                    name="reservationCategory"
                                                    label="Reservation Category"
                                                    error={touched.reservationCategory && errors.reservationCategory}
                                                    helperText={touched.reservationCategory && errors.reservationCategory}
                                                >
                                                    {CATEGORIES.map(category => (
                                                        <MenuItem key={category} value={category}>
                                                            {category}
                                                        </MenuItem>
                                                    ))}
                                                </Field>
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <FormControlLabel
                                                control={
                                                    <Field
                                                        as={Switch}
                                                        name="isPWD"
                                                        type="checkbox"
                                                    />
                                                }
                                                label="Person with Disability"
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Field
                                                as={TextField}
                                                name="remarks"
                                                label="Remarks"
                                                multiline
                                                rows={4}
                                                fullWidth
                                            />
                                        </Grid>
                                    </Grid>
                                </CustomTabs>
                                <div className="flex justify-end space-x-2 p-4 pb-0 border-t">
                                    <Button
                                        onClick={onCancel}
                                        variant="outlined"
                                        color="error"
                                        disabled={isSubmitting}
                                        type="button"
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        variant="contained"
                                        color="success"
                                        type="submit"
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? 'Saving...' : 'Create Student'}
                                    </Button>
                                </div>
                            </Form>
                        );
                    }}
                </Formik >
            </div >

            <Modal
                open={openParentModal}
                onClose={() => setOpenParentModal(false)}
                aria-labelledby="create-parent-modal"
            >
                <Box sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '600px',
                    bgcolor: 'background.paper',
                    boxShadow: 24,
                    borderRadius: 2,
                    p: 0
                }}>
                    <CreateParent
                        initialData={null}
                        onSave={handleParentSave}
                        onCancel={() => setOpenParentModal(false)}
                    />
                </Box>
            </Modal>

            <SnackbarComponent
                open={snackbar.open}
                message={snackbar.message}
                severity={snackbar.severity}
                position={snackbar.position}
                onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
            />
        </div >
    );
};

export default CreateStudents;
