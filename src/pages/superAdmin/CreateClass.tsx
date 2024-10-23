import React from 'react';
import { TextField, Button, FormControl, InputLabel, Select, MenuItem, Grid } from '@mui/material';
import { CreateClassProps, Class, Medium, Standard, Group, Syllabus, Staff } from '../../types/Types';
import { Formik, Form, Field } from 'formik';
import CustomTabs from '../../components/CustomTabs';

const CreateClass: React.FC<CreateClassProps> = ({ initialData, onSave, onCancel }) => {
    // Mock data for dropdowns
    const mediums: Medium[] = [
        { ID: 1, Name: 'English' },
        { ID: 2, Name: 'Hindi' },
        { ID: 3, Name: 'Tamil' },
    ];

    const standards: Standard[] = [
        { ID: 1, Name: 'Standard 1', HasGroup: false, sequence: 1 },
        { ID: 2, Name: 'Standard 2', HasGroup: false, sequence: 2 },
        { ID: 3, Name: 'Standard 3', HasGroup: false, sequence: 3 },
    ];

    const groups: Group[] = [
        { ID: 1, Name: 'Group A' },
        { ID: 2, Name: 'Group B' },
        { ID: 3, Name: 'Group C' },
    ];

    const syllabuses: Syllabus[] = [
        { ID: 1, Name: 'CBSE' },
        { ID: 2, Name: 'ICSE' },
        { ID: 3, Name: 'State Board' },
    ];

    const staffs: Staff[] = [
        { id: 1, name: 'John Doe', email: 'john@example.com', isTeachingStaff: true, responsibility: '', subjects: [], mobile: '', gender: '', dateOfBirth: '', address: { line1: '', city: '', state: '', pinCode: '', country: '' }, section: '', imageUrl: '' },
        { id: 2, name: 'Jane Smith', email: 'jane@example.com', isTeachingStaff: true, responsibility: '', subjects: [], mobile: '', gender: '', dateOfBirth: '', address: { line1: '', city: '', state: '', pinCode: '', country: '' }, section: '', imageUrl: '' },
    ];

    const sections = ['A', 'B', 'C', 'D'];

    return (
        <div className="flex flex-col h-full">
            <div className="flex-grow overflow-auto p-4">
                <h2 className="text-xl font-bold mb-4">{initialData ? 'Edit Class' : 'Create Class'}</h2>
                <Formik
                    initialValues={initialData || {
                        id: 0,
                        name: '',
                        section: '',
                        mediumId: 0,
                        standardId: 0,
                        classStaffId: 0,
                        group_id: 0,
                        syllabusId: 0,
                    }}
                    onSubmit={(values) => {
                        onSave(values as Class);
                    }}
                >
                    {({ }) => (
                        <Form className="space-y-4">
                            <Grid container spacing={2}>
                                <Grid item xs={12} md={6}>
                                    <Field
                                        as={TextField}
                                        name="name"
                                        label="Class Name"
                                        variant="outlined"
                                        fullWidth
                                        required
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <FormControl fullWidth variant="outlined">
                                        <InputLabel>Section</InputLabel>
                                        <Field
                                            as={Select}
                                            name="section"
                                            label="Section"
                                        >
                                            {sections.map((section) => (
                                                <MenuItem key={section} value={section}>{section}</MenuItem>
                                            ))}
                                        </Field>
                                    </FormControl>
                                </Grid>
                            </Grid>

                            <CustomTabs labels={['More Information']}>
                                <Grid container spacing={2}>
                                    <Grid item xs={12} md={6}>
                                        <FormControl fullWidth variant="outlined">
                                            <InputLabel>Medium</InputLabel>
                                            <Field
                                                as={Select}
                                                name="mediumId"
                                                label="Medium"
                                            >
                                                {mediums.map((medium) => (
                                                    <MenuItem key={medium.ID} value={medium.ID}>{medium.Name}</MenuItem>
                                                ))}
                                            </Field>
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <FormControl fullWidth variant="outlined">
                                            <InputLabel>Standard</InputLabel>
                                            <Field
                                                as={Select}
                                                name="standardId"
                                                label="Standard"
                                            >
                                                {standards.map((standard) => (
                                                    <MenuItem key={standard.ID} value={standard.ID}>{standard.Name}</MenuItem>
                                                ))}
                                            </Field>
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <FormControl fullWidth variant="outlined">
                                            <InputLabel>Group</InputLabel>
                                            <Field
                                                as={Select}
                                                name="group_id"
                                                label="Group"
                                            >
                                                {groups.map((group) => (
                                                    <MenuItem key={group.ID} value={group.ID}>{group.Name}</MenuItem>
                                                ))}
                                            </Field>
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <FormControl fullWidth variant="outlined">
                                            <InputLabel>Syllabus</InputLabel>
                                            <Field
                                                as={Select}
                                                name="syllabusId"
                                                label="Syllabus"
                                            >
                                                {syllabuses.map((syllabus) => (
                                                    <MenuItem key={syllabus.ID} value={syllabus.ID}>{syllabus.Name}</MenuItem>
                                                ))}
                                            </Field>
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <FormControl fullWidth variant="outlined">
                                            <InputLabel>Class Staff</InputLabel>
                                            <Field
                                                as={Select}
                                                name="classStaffId"
                                                label="Class Staff"
                                            >
                                                {staffs.map((staff) => (
                                                    <MenuItem key={staff.id} value={staff.id}>{staff.name}</MenuItem>
                                                ))}
                                            </Field>
                                        </FormControl>
                                    </Grid>
                                </Grid>
                            </CustomTabs>

                            <div className="flex justify-end space-x-2 mt-4">
                                <Button onClick={onCancel} variant="outlined" color="error">
                                    Cancel
                                </Button>
                                <Button type="submit" variant="contained" color="success">
                                    {initialData ? 'Update Class' : 'Create Class'}
                                </Button>
                            </div>
                        </Form>
                    )}
                </Formik>
            </div>
        </div>
    );
};

export default CreateClass;
