import React, { useState, useEffect, useRef } from 'react';
import { TextField, Button, FormControl, InputLabel, Select, MenuItem, Grid, FormHelperText } from '@mui/material';
import { CreateClassProps, Group, Standard } from '../../types/Types';
import { Formik, Form, FormikProps } from 'formik';
import CustomTabs from '../../components/CustomTabs';
import { PlusCircle } from 'lucide-react';
import { 
    getMediums, 
    getStandards, 
    getSyllabus, 
    getGroups, 
    listStaff 
} from '../../api/superAdmin';
import { useSchoolContext } from '../../contexts/SchoolContext';
import * as Yup from 'yup';

const CreateClass: React.FC<CreateClassProps> = ({ initialData, onSave, onCancel }) => {
    const { schoolInfo } = useSchoolContext();
    const [mediums, setMediums] = useState([]);
    const [standards, setStandards] = useState([]);
    const [syllabuses, setSyllabuses] = useState([]);
    const [groups, setGroups] = useState([]);
    const [staffs, setStaffs] = useState([]);
    const [_loading, setLoading] = useState(true);
    const [selectedStandard, setSelectedStandard] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [
                    mediumsRes,
                    standardsRes,
                    syllabusRes,
                    groupsRes,
                    staffsRes
                ] = await Promise.all([
                    getMediums(),
                    getStandards(),
                    getSyllabus(),
                    getGroups(),
                    listStaff(schoolInfo.schoolPrefix || '')
                ]);

                setMediums(mediumsRes.data || []);
                setStandards(standardsRes.data || []);
                setSyllabuses(syllabusRes.data || []);
                setGroups(groupsRes.data || []);
                setStaffs(staffsRes.data || []);
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [schoolInfo.schoolPrefix]);

    useEffect(() => {
        if (initialData) {
            // Check if the standard has groups
            const selectedStd = standards.find((std: Standard) => 
                std.ID === initialData.StandardId
            ) as Standard | undefined;
            
            setSelectedStandard(selectedStd?.HasGroup ? String(initialData.StandardId) : null);
            
            // Set initial form values
            const initialValues = {
                name: initialData.Name || '',
                mediumId: initialData.MediumId || '',
                standardId: initialData.StandardId || '',
                classStaffId: initialData.ClassStaffId || '',
                group_id: initialData.GroupID || '',
                syllabusId: initialData.SyllabusId || '',
            };
            
            // Update Formik form with initial values
            if (formikRef.current) {
                formikRef.current.setValues(initialValues);
            }
        }
    }, [initialData, standards]);

    const formikRef = useRef<FormikProps<any>>(null);

    const validationSchema = Yup.object().shape({
        name: Yup.string().required('Class Name is required'),
        mediumId: Yup.string().required('Medium is required'),
        standardId: Yup.string().required('Standard is required'),
        syllabusId: Yup.string().required('Syllabus is required'),
        classStaffId: Yup.string(),
        group_id: Yup.string(),
    });

    return (
        <div className="flex flex-col h-full">
            <div className="flex-grow overflow-auto p-4">
                <h2 className="text-xl font-bold mb-4">{initialData ? 'Edit Class' : 'Create Class'}</h2>
                <Formik
                    innerRef={formikRef}
                    initialValues={initialData ? {
                        name: initialData.Name || '',
                        mediumId: initialData.MediumId || '',
                        standardId: initialData.StandardId || '',
                        classStaffId: initialData.ClassStaffId || '',
                        group_id: initialData.GroupID || '',
                        syllabusId: initialData.SyllabusId || '',
                    } : {
                        name: '',
                        mediumId: '',
                        standardId: '',
                        classStaffId: '',
                        group_id: '',
                        syllabusId: '',
                    }}
                    validationSchema={validationSchema}
                    onSubmit={(values: any) => {
                        const submitData = initialData ? {
                            id: initialData.ID,
                            ...values
                        } : values;
                        onSave(submitData);
                    }}
                >
                    {({ values, handleChange, errors, touched }) => (
                        <Form className="space-y-4">
                            <Grid container spacing={2}>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        name="name"
                                        label="Class Name"
                                        variant="outlined"
                                        fullWidth
                                        value={values.name}
                                        onChange={handleChange}
                                        error={touched.name && Boolean(errors.name)}
                                        helperText={touched.name && typeof errors.name === 'string' ? errors.name : ''}
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <FormControl fullWidth error={touched.mediumId && Boolean(errors.mediumId)}>
                                        <InputLabel>Medium</InputLabel>
                                        <Select
                                            name="mediumId"
                                            value={values.mediumId}
                                            onChange={handleChange}
                                            label="Medium"
                                        >
                                            {mediums.length > 0 ? (
                                                mediums.map((medium: any) => (
                                                    <MenuItem key={medium.ID} value={medium.ID}>
                                                        {medium.Name}
                                                    </MenuItem>
                                                ))
                                            ) : (
                                                <MenuItem disabled>No data found</MenuItem>
                                            )}
                                        </Select>
                                        <FormHelperText>{touched.mediumId && typeof errors.mediumId === 'string' ? errors.mediumId : ''}</FormHelperText>
                                    </FormControl>
                                </Grid>
                            </Grid>

                            <Grid container spacing={2}>
                                
                                <Grid item xs={12} md={6}>
                                    <FormControl fullWidth error={touched.standardId && Boolean(errors.standardId)}>
                                        <InputLabel>Standard</InputLabel>
                                        <Select
                                            name="standardId"
                                            value={values.standardId}
                                            onChange={(e) => {
                                                handleChange(e);
                                                const selected = standards.find((std: Standard) => std.ID === Number(e.target.value)) as Standard | undefined;
                                                setSelectedStandard(selected?.HasGroup ? String(e.target.value) : null);
                                            }}
                                            label="Standard"
                                        >
                                            {standards.length > 0 ? (
                                                standards.map((standard: any) => (
                                                    <MenuItem key={standard.ID} value={standard.ID}>
                                                        {standard.Name}
                                                    </MenuItem>
                                                ))
                                            ) : (
                                                <MenuItem disabled>No data found</MenuItem>
                                            )}
                                        </Select>
                                        <FormHelperText>{touched.standardId && typeof errors.standardId === 'string' ? errors.standardId : ''}</FormHelperText>
                                    </FormControl>
                                </Grid>
                                
                                <Grid item xs={12} md={6}>
                                    <FormControl fullWidth error={touched.syllabusId && Boolean(errors.syllabusId)}>
                                        <InputLabel>Syllabus</InputLabel>
                                        <Select
                                            name="syllabusId"
                                            value={values.syllabusId}
                                            onChange={handleChange}
                                            label="Syllabus"
                                        >
                                            {syllabuses.length > 0 ? (
                                                syllabuses.map((syllabus: any) => (
                                                    <MenuItem key={syllabus.ID} value={syllabus.ID}>
                                                        {syllabus.Name}
                                                    </MenuItem>
                                                ))
                                            ) : (
                                                <MenuItem disabled>No data found</MenuItem>
                                            )}
                                        </Select>
                                        <FormHelperText>{touched.syllabusId && typeof errors.syllabusId === 'string' ? errors.syllabusId : ''}</FormHelperText>
                                    </FormControl>
                                </Grid>

                                {selectedStandard && (
                                    <Grid item xs={12} md={6}>
                                        <FormControl fullWidth>
                                            <InputLabel>Group</InputLabel>
                                            <Select
                                                name="group_id"
                                                value={values.group_id}
                                                onChange={handleChange}
                                                label="Group"
                                            >
                                                {groups.length > 0 ? (
                                                    groups.map((group: Group) => (
                                                        <MenuItem key={group.ID} value={group.ID}>
                                                            {group.Name}
                                                        </MenuItem>
                                                    ))
                                                ) : (
                                                    <MenuItem disabled>No data found</MenuItem>
                                                )}
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                )}

                                <Grid item xs={12}>
                                    <FormControl fullWidth>
                                        <InputLabel>Class Staff</InputLabel>
                                        <Select
                                            name="classStaffId"
                                            value={values.classStaffId}
                                            onChange={handleChange}
                                            label="Class Staff"
                                        >
                                            {staffs.filter((staff: any) => staff.is_teaching_staff).length > 0 ? (
                                                staffs.filter((staff: any) => staff.is_teaching_staff).map((staff: any) => (
                                                    <MenuItem key={staff.ID} value={staff.ID}>
                                                        {staff.name}
                                                    </MenuItem>
                                                ))
                                            ) : (
                                                <MenuItem disabled>No data found</MenuItem>
                                            )}
                                        </Select>
                                    </FormControl>
                                </Grid>
                            </Grid>

                            
                            <CustomTabs labels={['Students', 'Subjects']}>
                                <>
                                    <div className="flex justify-end mb-4">
                                        <Button
                                            startIcon={<PlusCircle size={20} />}
                                            variant="contained"
                                            color="primary"
                                        >
                                            Add Student
                                        </Button>
                                    </div>
                                    {/* Student list will go here */}
                                </>
                                <>
                                    <div className="flex justify-end mb-4">
                                        <Button
                                            startIcon={<PlusCircle size={20} />}
                                            variant="contained"
                                            color="primary"
                                        >
                                            Add Subject
                                        </Button>
                                    </div>
                                    {/* Subject list will go here */}
                                </>
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
