import React, { useState, useEffect } from 'react';
import { TextField, Button, FormControl, InputLabel, Select, MenuItem, Grid, Autocomplete, Modal, Box } from '@mui/material';
import { CreateStudentProps } from '../../types/Types';
import { Formik, Form, Field } from 'formik';
import CustomTabs from '../../components/CustomTabs';
import { useSchoolContext } from '../../contexts/SchoolContext';
import { createStudent, getClasses, listParents } from '../../api/superAdmin';
import SnackbarComponent from '../../components/SnackbarComponent';
import { PlusCircle } from 'lucide-react';
import CreateParent from './CreateParent';
import * as Yup from 'yup';

interface ParentInfo {
    parentId: number;
    relationshipWithStudent: string;
}

const RELATIONS = ['Father', 'Mother', 'Guardian'];
const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];
const CATEGORIES = ['General', 'OBC', 'SC', 'ST', 'Other'];

const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
};

// Define the type for form values
interface StudentFormValues {
    name: string;
    idCardNumber: string;
    gender: string;
    dob: string;
    phone: string;
    email: string;
    parentsInfo: ParentInfo[]; // Ensure parentsInfo is included
    street1: string;
    street2: string;
    city: string;
    state: string;
    pincode: string;
    country: string;
    bloodGroup: string;
    remarks: string;
    religion: string;
    caste: string;
    reservationCategory: string;
    isPWD: boolean;
    nationality: string;
    classID: string;
}

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
                console.log("classesResponse",classesResponse);
                

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

    const handleSubmit = async (values: any, { setSubmitting }: any) => {
        try {
            if (!schoolInfo.schoolPrefix) {
                throw new Error("School prefix not found");
            }

            // Create a FormData object
            const formData = new FormData();
            formData.append('name', values.name);
            formData.append('idCardNumber', values.idCardNumber);
            formData.append('gender', values.gender);
            formData.append('dob', formatDate(values.dob));
            formData.append('phone', values.phone);
            formData.append('email', values.email);
            values.parentsInfo.forEach((parent: any) => {
                formData.append('parentsInfo[]', JSON.stringify({
                    parentId: parent.parentId,
                    relationshipWithStudent: parent.relationshipWithStudent
                }));
            });
            formData.append('street1', values.street1);
            formData.append('street2', values.street2);
            formData.append('city', values.city);
            formData.append('state', values.state);
            formData.append('pincode', values.pincode);
            formData.append('country', values.country);
            formData.append('bloodGroup', values.bloodGroup);
            formData.append('remarks', values.remarks);
            formData.append('religion', values.religion);
            formData.append('caste', values.caste);
            formData.append('reservationCategory', values.reservationCategory);
            formData.append('isPWD', values.isPWD);
            formData.append('nationality', values.nationality);
            formData.append('classID', values.classID);

            if (initialData) {
                // Handle update if needed
                // await updateStudent(initialData.id, formData, schoolInfo.schoolPrefix);
            } else {
                await createStudent(formData, schoolInfo.schoolPrefix);
            }

            setSnackbar({
                open: true,
                message: initialData ? "Student updated successfully!" : "Student created successfully!",
                severity: "success",
                position: { vertical: "top", horizontal: "center" },
            });

            onSave(values);
        } catch (error: any) {
            console.error('Error saving student:', error);
            setSnackbar({
                open: true,
                message: error.response?.data?.message || 'Failed to save student',
                severity: "error",
                position: { vertical: "top", horizontal: "center" },
            });
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="flex flex-col h-full">
            <div className="flex-grow overflow-auto p-4">
                <h2 className="text-xl font-bold mb-4">{initialData ? 'Edit Student' : 'Create Student'}</h2>
                <Formik
                    initialValues={initialData || {
                        name: '',
                        idCardNumber: '',
                        gender: '',
                        dob: '',
                        phone: '',
                        email: '',
                        parentsInfo: [], // Ensure this is initialized
                        street1: '',
                        street2: '',
                        city: '',
                        state: '',
                        pincode: '',
                        country: '',
                        bloodGroup: '',
                        remarks: '',
                        religion: '',
                        caste: '',
                        reservationCategory: '',
                        isPWD: false,
                        nationality: '',
                        classID: ''
                    } as StudentFormValues} // Cast to StudentFormValues
                    onSubmit={handleSubmit}
                    validationSchema={Yup.object().shape({
                        name: Yup.string().required('Name is required'),
                        idCardNumber: Yup.string().required('ID Card Number is required'),
                        gender: Yup.string().required('Gender is required'),
                        dob: Yup.string().required('Date of Birth is required'),
                        phone: Yup.string().required('Phone is required'),
                        email: Yup.string().email('Invalid email').required('Email is required'),
                        classID: Yup.string().required('Class is required'),
                        // Add other validations as needed
                    })}
                >
                    {({ values, isSubmitting, setFieldValue }:any) => (
                        <Form className="space-y-4">
                            <CustomTabs labels={['Basic Info', 'Parents', 'Additional Info']}>
                                {/* Basic Info Tab */}
                                <Grid container spacing={2}>
                                    <Grid item xs={12} md={6}>
                                        <Field
                                            as={TextField}
                                            name="name"
                                            label="Student Name"
                                            fullWidth
                                            required
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <Field
                                            as={TextField}
                                            name="idCardNumber"
                                            label="ID Card Number"
                                            fullWidth
                                            required
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <FormControl fullWidth>
                                            <InputLabel>Gender</InputLabel>
                                            <Field
                                                as={Select}
                                                name="gender"
                                                label="Gender"
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
                                            name="dob"
                                            label="Date of Birth"
                                            type="date"
                                            fullWidth
                                            InputLabelProps={{ shrink: true }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <Field
                                            as={TextField}
                                            name="phone"
                                            label="Phone"
                                            fullWidth
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <Field
                                            as={TextField}
                                            name="email"
                                            label="Email"
                                            type="email"
                                            fullWidth
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <FormControl fullWidth>
                                            <InputLabel>Class</InputLabel>
                                            <Field
                                                as={Select}
                                                name="classID"
                                                label="Class"
                                            >
                                                {classes.map((cls: any) => (
                                                    <MenuItem key={cls.ID} value={cls.ID}>
                                                        {cls.Name}
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
                                        {values.parentsInfo.map((parentInfo: ParentInfo, index: number) => (
                                            <div key={index} className="flex gap-4 mt-2">
                                                <div className="flex-grow">
                                                    <TextField
                                                        fullWidth
                                                        disabled
                                                        value={parents.find(p => p.id === parentInfo.parentId)?.name || ''}
                                                        label="Parent Name"
                                                    />
                                                </div>
                                                <FormControl fullWidth>
                                                    <InputLabel>Relationship</InputLabel>
                                                    <Select
                                                        value={parentInfo.relationshipWithStudent}
                                                        onChange={(e) => {
                                                            const newParentsInfo = [...values.parentsInfo];
                                                            newParentsInfo[index].relationshipWithStudent = e.target.value;
                                                            setFieldValue('parentsInfo', newParentsInfo);
                                                        }}
                                                        label="Relationship"
                                                    >
                                                        {RELATIONS.map(relation => (
                                                            <MenuItem key={relation} value={relation}>
                                                                {relation}
                                                            </MenuItem>
                                                        ))}
                                                    </Select>
                                                </FormControl>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Additional Info Tab */}
                                <Grid container spacing={2}>
                                    {/* Address Fields */}
                                    <Grid item xs={12}>
                                        <Field
                                            as={TextField}
                                            name="street1"
                                            label="Address Line 1"
                                            fullWidth
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Field
                                            as={TextField}
                                            name="street2"
                                            label="Address Line 2"
                                            fullWidth
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <Field
                                            as={TextField}
                                            name="city"
                                            label="City"
                                            fullWidth
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <Field
                                            as={TextField}
                                            name="state"
                                            label="State"
                                            fullWidth
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <Field
                                            as={TextField}
                                            name="pincode"
                                            label="Pin Code"
                                            fullWidth
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <Field
                                            as={TextField}
                                            name="country"
                                            label="Country"
                                            fullWidth
                                        />
                                    </Grid>

                                    {/* Other Fields */}
                                    <Grid item xs={12} md={6}>
                                        <FormControl fullWidth>
                                            <InputLabel>Blood Group</InputLabel>
                                            <Field
                                                as={Select}
                                                name="bloodGroup"
                                                label="Blood Group"
                                            >
                                                {BLOOD_GROUPS.map(group => (
                                                    <MenuItem key={group} value={group}>
                                                        {group}
                                                    </MenuItem>
                                                ))}
                                            </Field>
                                        </FormControl>
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
                                        <Field
                                            as={TextField}
                                            name="nationality"
                                            label="Nationality"
                                            fullWidth
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

                            <div className="flex justify-end space-x-2 mt-4">
                                <Button 
                                    onClick={onCancel} 
                                    variant="outlined" 
                                    color="error"
                                    disabled={isSubmitting}
                                >
                                    Cancel
                                </Button>
                                <Button 
                                    type="submit" 
                                    variant="contained" 
                                    color="success"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? 'Saving...' : (initialData ? 'Update Student' : 'Create Student')}
                                </Button>
                            </div>
                        </Form>
                    )}
                </Formik>
            </div>

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
                    width: 400,
                    bgcolor: 'background.paper',
                    boxShadow: 24,
                    p: 4,
                    borderRadius: 2,
                }}>
                    <CreateParent 
                        onClose={() => {
                            setOpenParentModal(false);
                            // Refresh parents list after creating a new parent
                            const fetchParents = async () => {
                                try {
                                    if (!schoolInfo.schoolPrefix) {
                                        throw new Error("School prefix not found");
                                    }
                                    const response = await listParents(schoolInfo.schoolPrefix);
                                    if (response.status && response.resp_code === "SUCCESS") {
                                        setParents(response.data);
                                    }
                                } catch (err: any) {
                                    setSnackbar({
                                        open: true,
                                        message: err.message || 'Failed to fetch parents',
                                        severity: 'error',
                                        position: { vertical: 'top', horizontal: 'center' },
                                    });
                                }
                            };
                            fetchParents();
                        } } initialData={undefined}                    />
                </Box>
            </Modal>

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
