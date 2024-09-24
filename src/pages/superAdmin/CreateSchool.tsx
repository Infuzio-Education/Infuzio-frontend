import React, { useRef, useState } from 'react';
import { Button, Box, TextField, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { useFormik } from 'formik';
import superAdminEndpoints from '../../endpoints/superAdmin';
import Api from '../../api/axiosConfig';
import { validationSchema } from '../../validations/schoolFormValidationSchema';
import type { FormData } from '../../types/Types';


const initialValues: FormData = {
    schoolName: '',
    syllabus: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    country: '',
    pinCode: '',
    mobile: '',
    email: '',
};

const CreateSchool: React.FC = () => {
    const [logoFile, setLogoFile] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const formik = useFormik({
        initialValues,
        validationSchema,
        onSubmit: async (values) => {
            const data = new FormData();
            Object.entries(values).forEach(([key, value]) => {
                data.append(key, value as string);
            });
            if (logoFile) {
                data.append('logo', logoFile);
            }

            try {
                const response = await Api.post(superAdminEndpoints.createSchool, data, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });
                console.log('School created successfully', response.data);

            } catch (error) {
                console.error('Error creating school:', error);

            }
        },
    });

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


    return (
        <form onSubmit={formik.handleSubmit} className="flex flex-col gap-4 max-w-lg mx-auto p-5 bg-gray-100 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div
                    className="relative flex items-center justify-center bg-gray-200 border border-dashed border-gray-400 h-36 cursor-pointer"
                    onClick={handleLogoClick}
                >
                    {logoFile ? (
                        <img
                            src={URL.createObjectURL(logoFile)}
                            alt="Uploaded logo"
                            className="w-full h-full object-contain"
                        />
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
                        id="schoolName"
                        name="schoolName"
                        label="School name"
                        value={formik.values.schoolName}
                        onChange={formik.handleChange}
                        error={formik.touched.schoolName && Boolean(formik.errors.schoolName)}
                        helperText={formik.touched.schoolName && formik.errors.schoolName}
                    />
                    <FormControl fullWidth>
                        <InputLabel id="syllabus-label">Syllabus</InputLabel>
                        <Select
                            labelId="syllabus-label"
                            id="syllabus"
                            name="syllabus"
                            value={formik.values.syllabus}
                            onChange={formik.handleChange}
                            error={formik.touched.syllabus && Boolean(formik.errors.syllabus)}
                        >
                            <MenuItem value="">Select syllabus</MenuItem>
                            <MenuItem value="CBSE">CBSE</MenuItem>
                            <MenuItem value="ICSE">ICSE</MenuItem>
                            <MenuItem value="State Board">State Board</MenuItem>
                        </Select>
                    </FormControl>
                </div>
            </div>


            <TextField
                fullWidth
                id="addressLine1"
                name="addressLine1"
                label="Address line 1"
                value={formik.values.addressLine1}
                onChange={formik.handleChange}
                error={formik.touched.addressLine1 && Boolean(formik.errors.addressLine1)}
                helperText={formik.touched.addressLine1 && formik.errors.addressLine1}
            />
            <TextField
                fullWidth
                id="addressLine2"
                name="addressLine2"
                label="Address line 2"
                value={formik.values.addressLine2}
                onChange={formik.handleChange}
            />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <TextField
                    fullWidth
                    id="city"
                    name="city"
                    label="City"
                    value={formik.values.city}
                    onChange={formik.handleChange}
                    error={formik.touched.city && Boolean(formik.errors.city)}
                    helperText={formik.touched.city && formik.errors.city}
                />
                <TextField
                    fullWidth
                    id="state"
                    name="state"
                    label="State"
                    value={formik.values.state}
                    onChange={formik.handleChange}
                    error={formik.touched.state && Boolean(formik.errors.state)}
                    helperText={formik.touched.state && formik.errors.state}
                />
                <TextField
                    fullWidth
                    id="country"
                    name="country"
                    label="Country"
                    value={formik.values.country}
                    onChange={formik.handleChange}
                    error={formik.touched.country && Boolean(formik.errors.country)}
                    helperText={formik.touched.country && formik.errors.country}
                />
            </div>
            <TextField
                fullWidth
                id="pinCode"
                name="pinCode"
                label="Pin code"
                value={formik.values.pinCode}
                onChange={formik.handleChange}
                error={formik.touched.pinCode && Boolean(formik.errors.pinCode)}
                helperText={formik.touched.pinCode && formik.errors.pinCode}
            />


            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <TextField
                    fullWidth
                    id="mobile"
                    name="mobile"
                    label="Mobile"
                    value={formik.values.mobile}
                    onChange={formik.handleChange}
                    error={formik.touched.mobile && Boolean(formik.errors.mobile)}
                    helperText={formik.touched.mobile && formik.errors.mobile}
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
                <Button variant="text" color="error" onClick={() => {/* TODO: Implement cancel action */ }}>
                    Cancel
                </Button>
                <Button variant="contained" color="primary" type="submit">
                    Save
                </Button>
            </Box>
        </form>
    );
};

export default CreateSchool;
