import React, { useRef, useState, useEffect } from 'react';
import { Button, Box, TextField, Select, MenuItem, FormControl, InputLabel, OutlinedInput, Checkbox, ListItemText, SelectChangeEvent } from '@mui/material';
import { useFormik } from 'formik';
import { validationSchema } from '../../validations/schoolFormValidationSchema';
import { createSchool, getSyllabus } from '../../api/superAdmin';
import type { SchoolFormData, Syllabus } from '../../types/Types';
import { X } from 'lucide-react';
import SnackbarComponent from '../../components/SnackbarComponent';

const initialValues: SchoolFormData = {
    name: '',
    schoolCode: '',
    syllabusIDs: [],
    address: {
        street1: '',
        street2: '',
        city: '',
        state: '',
        pincode: '',
        country: '',
    },
    googleMapsLink: '',
    phone: '',
    email: '',
};

const CreateSchool: React.FC = () => {
    const [logoFile, setLogoFile] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [syllabusList, setSyllabusList] = useState<Syllabus[]>([]);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error', position: { vertical: 'top', horizontal: 'right' } });

    useEffect(() => {
        const fetchSyllabus = async () => {
            try {
                const response = await getSyllabus();
                if (response && response.status && response.resp_code === 'SUCCESS' && Array.isArray(response.data)) {
                    setSyllabusList(response.data);
                } else {
                    console.error('Invalid syllabus data:', response);
                    setSyllabusList([]);
                }
            } catch (error) {
                console.error('Failed to fetch syllabus:', error);
                setSyllabusList([]);
            }
        };

        fetchSyllabus();
    }, []);

    const formik = useFormik({
        initialValues,
        validationSchema,
        onSubmit: async (values) => {
            const data = new FormData();

            const formDataObject = {
                name: values.name,
                schoolCode: values.schoolCode,
                syllabusIDs: values.syllabusIDs,
                address: {
                    street1: values.address.street1,
                    street2: values.address.street2,
                    city: values.address.city,
                    state: values.address.state,
                    pincode: values.address.pincode,
                    country: values.address.country,
                },
                googleMapsLink: values.googleMapsLink,
                phone: values.phone,
                email: values.email,
                schoolLogo: logoFile,
            };

            Object.entries(formDataObject).forEach(([key, value]) => {
                if (key === 'address' && value) {
                    Object.entries(value).forEach(([addressKey, addressValue]) => {
                        data.append(`address[${addressKey}]`, addressValue as string);
                    });
                } else if (key === 'syllabusIDs') {
                    (value as number[]).forEach((id, index) => {
                        data.append(`syllabusIDs[${index}]`, id.toString());
                    });
                } else if (key === 'schoolLogo') {
                    if (value instanceof File || typeof value === 'string') {
                        data.append('schoolLogo', value);
                    }
                } else {
                    data.append(key, value as string);
                }
            });

            try {
                const response = await createSchool(data);
                console.log("Error", response);

                if (response.status === 200 || response.status === 201) {
                    setSnackbar({ open: true, message: 'School created successfully!', severity: 'success', position: { vertical: 'top', horizontal: 'right' } });
                } else {
                    setSnackbar({ open: true, message: response.data.error, severity: 'error', position: { vertical: 'top', horizontal: 'right' } });
                }
            } catch (error: any) {

                setSnackbar({ open: true, message: error.response.data.error, severity: 'error', position: { vertical: 'top', horizontal: 'right' } });
            }
        },
    });

    const handleSyllabusChange = (event: SelectChangeEvent<number[]>) => {
        formik.setFieldValue('syllabusIDs', event.target.value as number[]);
    };

    const handleLogoClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setLogoFile(file);
        }
    };

    const handleLogoRemove = (e: React.MouseEvent) => {
        e.stopPropagation();
        setLogoFile(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    const handleCancel = () => {
        formik.resetForm();
    };

    return (
        <>
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    formik.handleSubmit(e);
                }}
                className="flex flex-col gap-4 max-w-lg mx-auto p-5 bg-gray-200 rounded-lg"
            >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div
                        className="relative flex items-center justify-center bg-gray-200 border border-dashed border-gray-400 h-36 cursor-pointer"
                        onClick={handleLogoClick}
                    >
                        {logoFile ? (
                            <>
                                <img
                                    src={URL.createObjectURL(logoFile)}
                                    alt="Uploaded logo"
                                    className="w-full h-full object-contain"
                                />
                                <button
                                    onClick={handleLogoRemove}
                                    className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md hover:bg-gray-100"
                                >
                                    <X size={20} color="gray" />
                                </button>
                            </>
                        ) : (
                            <div className="text-center">
                                <img
                                    src="/path/to/logo-placeholder.png"
                                    alt="School logo"
                                    className="w-1/2 mx-auto mb-2"
                                />
                                <p className="text-sm text-gray-500">Click to upload school logo</p>
                            </div>
                        )}
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleLogoUpload}
                            className="hidden"
                        />
                    </div>

                    <div className="col-span-1 md:col-span-2 space-y-4">
                        <TextField
                            fullWidth
                            id="name"
                            name="name"
                            label="School name"
                            value={formik.values.name}
                            onChange={formik.handleChange}
                            error={formik.touched.name && Boolean(formik.errors.name)}
                            helperText={formik.touched.name && formik.errors.name}
                        />
                        <TextField
                            fullWidth
                            id="schoolCode"
                            name="schoolCode"
                            label="School Code"
                            value={formik.values.schoolCode}
                            onChange={formik.handleChange}
                            error={formik.touched.schoolCode && Boolean(formik.errors.schoolCode)}
                            helperText={formik.touched.schoolCode && formik.errors.schoolCode}
                        />
                    </div>
                </div>

                <FormControl fullWidth>
                    <InputLabel id="syllabus-label">Syllabus</InputLabel>
                    <Select
                        labelId="syllabus-label"
                        id="syllabusIDs"
                        multiple
                        value={formik.values.syllabusIDs}
                        onChange={handleSyllabusChange}
                        input={<OutlinedInput label="Syllabus" />}
                        renderValue={(selected) => (selected
                            .map(id => syllabusList.find(s => s.ID === id)?.Name)
                            .join(', '))}
                    >
                        {syllabusList.length === 0 ? (
                            <MenuItem disabled>No syllabuses available</MenuItem>
                        ) : (
                            syllabusList.map((syllabus) => (
                                <MenuItem key={syllabus.ID} value={syllabus.ID}>
                                    <Checkbox checked={formik.values.syllabusIDs.indexOf(syllabus.ID) > -1} />
                                    <ListItemText primary={syllabus.Name} />
                                </MenuItem>
                            ))
                        )}
                    </Select>
                </FormControl>

                <TextField
                    fullWidth
                    id="address.street1"
                    name="address.street1"
                    label="Address line 1"
                    value={formik.values.address.street1}
                    onChange={formik.handleChange}
                    error={formik.touched.address?.street1 && Boolean(formik.errors.address?.street1)}
                    helperText={formik.touched.address?.street1 && formik.errors.address?.street1}
                />
                <TextField
                    fullWidth
                    id="address.street2"
                    name="address.street2"
                    label="Address line 2"
                    value={formik.values.address.street2}
                    onChange={formik.handleChange}
                />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <TextField
                        fullWidth
                        id="address.city"
                        name="address.city"
                        label="City"
                        value={formik.values.address.city}
                        onChange={formik.handleChange}
                        error={formik.touched.address?.city && Boolean(formik.errors.address?.city)}
                        helperText={formik.touched.address?.city && formik.errors.address?.city}
                    />
                    <TextField
                        fullWidth
                        id="address.state"
                        name="address.state"
                        label="State"
                        value={formik.values.address.state}
                        onChange={formik.handleChange}
                        error={formik.touched.address?.state && Boolean(formik.errors.address?.state)}
                        helperText={formik.touched.address?.state && formik.errors.address?.state}
                    />
                    <TextField
                        fullWidth
                        id="address.country"
                        name="address.country"
                        label="Country"
                        value={formik.values.address.country}
                        onChange={formik.handleChange}
                        error={formik.touched.address?.country && Boolean(formik.errors.address?.country)}
                        helperText={formik.touched.address?.country && formik.errors.address?.country}
                    />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <TextField
                        fullWidth
                        id="address.pincode"
                        name="address.pincode"
                        label="Pin code"
                        value={formik.values.address.pincode}
                        onChange={formik.handleChange}
                        error={formik.touched.address?.pincode && Boolean(formik.errors.address?.pincode)}
                        helperText={formik.touched.address?.pincode && formik.errors.address?.pincode}
                    />
                    <TextField
                        fullWidth
                        id="googleMapsLink"
                        name="googleMapsLink"
                        label="Google Maps Link"
                        value={formik.values.googleMapsLink}
                        onChange={formik.handleChange}
                        error={formik.touched.googleMapsLink && Boolean(formik.errors.googleMapsLink)}
                        helperText={formik.touched.googleMapsLink && formik.errors.googleMapsLink}
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <TextField
                        fullWidth
                        id="phone"
                        name="phone"
                        label="Phone"
                        value={formik.values.phone}
                        onChange={formik.handleChange}
                        error={formik.touched.phone && Boolean(formik.errors.phone)}
                        helperText={formik.touched.phone && formik.errors.phone}
                    />
                    <TextField
                        fullWidth
                        id="email"
                        name="email"
                        label="Email"
                        value={formik.values.email}
                        onChange={formik.handleChange}
                        error={formik.touched.email && Boolean(formik.errors.email)}
                        helperText={formik.touched.email && formik.errors.email}
                    />
                </div>

                <Box display="flex" justifyContent="space-between" mt={4}>
                    <Button variant="text" color="error" onClick={handleCancel}>
                        Cancel
                    </Button>
                    <Button variant="contained" color="success" type="submit">
                        Save
                    </Button>
                </Box>
            </form>
            <SnackbarComponent
                open={snackbar.open}
                message={snackbar.message}
                severity={snackbar.severity}
                position={{
                    vertical: snackbar.position.vertical as "top" | "bottom",
                    horizontal: snackbar.position.horizontal as "right" | "left" | "center"
                }}
                onClose={handleCloseSnackbar}
            />
        </>
    );
};

export default CreateSchool;