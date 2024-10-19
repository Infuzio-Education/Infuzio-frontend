import React, { useState } from 'react';
import { TextField, Button, FormControl, InputLabel, Select, MenuItem, Grid, Avatar } from '@mui/material';
import { CreateStudentProps, Student, Class } from '../../types/Types';
import { Formik, Form, Field } from 'formik';
import { Upload } from 'lucide-react';
import CustomTabs from '../../components/CustomTabs';

const CreateStudents: React.FC<CreateStudentProps> = ({ initialData, onSave, onCancel }) => {
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    // Mock data for classes
    const classes: Class[] = [
        { id: 1, name: "Class 1A", section: "A", mediumId: 1, standardId: 1, classStaffId: 1, group_id: 1, syllabusId: 1 },
        { id: 2, name: "Class 2B", section: "B", mediumId: 2, standardId: 2, classStaffId: 2, group_id: 2, syllabusId: 2 },
    ];

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>, setFieldValue: (field: string, value: any) => void) => {
        if (event.target.files && event.target.files[0]) {
            const file = event.target.files[0];
            setFieldValue('image', file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="flex flex-col h-full">
            <div className="flex-grow overflow-auto">
                <h2 className="text-xl font-bold mb-4">{initialData ? 'Edit Student' : 'Create Student'}</h2>
                <Formik
                    initialValues={initialData || {
                        id: 0,
                        name: '',
                        rollNumber: '',
                        classId: 0,
                        dateOfBirth: '',
                        gender: '',
                        address: {
                            line1: '',
                            city: '',
                            state: '',
                            pinCode: '',
                            country: '',
                        },
                        guardianName: '',
                        guardianPhone: '',
                        guardianEmail: '',
                        image: null,
                    }}
                    onSubmit={(values) => {
                        onSave(values as Student);
                    }}
                >
                    {({ setFieldValue }) => (
                        <Form className="space-y-4">
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
                                    onChange={(event) => handleImageUpload(event, setFieldValue)}
                                />
                                <label htmlFor="raised-button-file">
                                    <Button variant="outlined" component="span" startIcon={<Upload />}>
                                        {imagePreview ? 'Change Image' : 'Upload Student Image'}
                                    </Button>
                                </label>
                            </div>

                            <Grid container spacing={2}>
                                <Grid item xs={12} md={6}>
                                    <Field
                                        as={TextField}
                                        name="name"
                                        label="Student Name"
                                        variant="outlined"
                                        fullWidth
                                        required
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <Field
                                        as={TextField}
                                        name="rollNumber"
                                        label="Roll Number"
                                        variant="outlined"
                                        fullWidth
                                        required
                                    />
                                </Grid>
                            </Grid>

                            <Grid container spacing={2}>
                                <Grid item xs={12} md={6}>
                                    <FormControl fullWidth variant="outlined">
                                        <InputLabel>Class</InputLabel>
                                        <Field
                                            as={Select}
                                            name="classId"
                                            label="Class"
                                        >
                                            {classes.map((cls) => (
                                                <MenuItem key={cls.id} value={cls.id}>{cls.name}</MenuItem>
                                            ))}
                                        </Field>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <Field
                                        as={TextField}
                                        name="dateOfBirth"
                                        label="Date of Birth"
                                        type="date"
                                        variant="outlined"
                                        fullWidth
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                    />
                                </Grid>
                            </Grid>

                            <FormControl fullWidth variant="outlined">
                                <InputLabel>Gender</InputLabel>
                                <Field
                                    as={Select}
                                    name="gender"
                                    label="Gender"
                                >
                                    <MenuItem value="Male">Male</MenuItem>
                                    <MenuItem value="Female">Female</MenuItem>
                                    <MenuItem value="Other">Other</MenuItem>
                                </Field>
                            </FormControl>

                            <CustomTabs labels={['Address', 'Guardian Information']}>
                                <>
                                    <Field
                                        as={TextField}
                                        name="address.line1"
                                        label="Address Line 1"
                                        variant="outlined"
                                        fullWidth
                                        margin="normal"
                                    />
                                    <Grid container spacing={2}>
                                        <Grid item xs={12} md={6}>
                                            <Field
                                                as={TextField}
                                                name="address.city"
                                                label="City"
                                                variant="outlined"
                                                fullWidth
                                                margin="normal"
                                            />
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <Field
                                                as={TextField}
                                                name="address.state"
                                                label="State"
                                                variant="outlined"
                                                fullWidth
                                                margin="normal"
                                            />
                                        </Grid>
                                    </Grid>
                                    <Grid container spacing={2}>
                                        <Grid item xs={12} md={6}>
                                            <Field
                                                as={TextField}
                                                name="address.pinCode"
                                                label="Pin Code"
                                                variant="outlined"
                                                fullWidth
                                                margin="normal"
                                            />
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <Field
                                                as={TextField}
                                                name="address.country"
                                                label="Country"
                                                variant="outlined"
                                                fullWidth
                                                margin="normal"
                                            />
                                        </Grid>
                                    </Grid>
                                </>
                                <>
                                    <Field
                                        as={TextField}
                                        name="guardianName"
                                        label="Guardian Name"
                                        variant="outlined"
                                        fullWidth
                                        margin="normal"
                                    />
                                    <Field
                                        as={TextField}
                                        name="guardianPhone"
                                        label="Guardian Phone"
                                        variant="outlined"
                                        fullWidth
                                        margin="normal"
                                    />
                                    <Field
                                        as={TextField}
                                        name="guardianEmail"
                                        label="Guardian Email"
                                        variant="outlined"
                                        fullWidth
                                        margin="normal"
                                    />
                                </>
                            </CustomTabs>

                            <div className="flex justify-end space-x-2 mt-4">
                                <Button onClick={onCancel} variant="outlined" color="error">
                                    Cancel
                                </Button>
                                <Button type="submit" variant="contained" color="success">
                                    {initialData ? 'Update Student' : 'Create Student'}
                                </Button>
                            </div>
                        </Form>
                    )}
                </Formik>
            </div>
        </div>
    );
};

export default CreateStudents;
