import React, { useState, useEffect, useRef } from 'react';
import { TextField, Button, FormControl, InputLabel, Select, MenuItem, Grid, FormHelperText } from '@mui/material';
import { CreateClassProps, Group, Standard } from '../../types/Types';
import { Formik, Form, FormikProps, FormikValues } from 'formik';
import {
    getSchoolMediums,
    getSchoolStandards,
    getSchoolSyllabus,
    getSchoolGroups,
    getTeachingStaff,
    getAcademicYears,
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
    const [academicYears, setAcademicYears] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (!schoolInfo.schoolPrefix) {
                    throw new Error("School prefix not found");
                }

                const [
                    mediumsRes,
                    standardsRes,
                    syllabusRes,
                    groupsRes,
                    staffsRes,
                    academicYearsRes,
                ] = await Promise.all([
                    getSchoolMediums(schoolInfo.schoolPrefix),
                    getSchoolStandards(schoolInfo.schoolPrefix),
                    getSchoolSyllabus(schoolInfo.schoolPrefix),
                    getSchoolGroups(schoolInfo.schoolPrefix),
                    getTeachingStaff(schoolInfo.schoolPrefix),
                    getAcademicYears(schoolInfo.schoolPrefix),
                ]);

                setMediums(mediumsRes.data || []);
                setStandards(standardsRes.data || []);
                setSyllabuses(syllabusRes.data || []);
                setGroups(groupsRes.data || []);
                setStaffs(staffsRes.data || []);
                setAcademicYears(academicYearsRes.data || []);
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
            const selectedStd = standards.find((std: Standard) =>
                std.ID === initialData.standardId
            ) as Standard | undefined;

            setSelectedStandard(selectedStd?.HasGroup ? String(initialData.standardId) : null);

            const initialValues = {
                name: initialData?.name || '',
                mediumId: initialData?.mediumId || '',
                standardId: initialData?.standardId || '',
                classStaffId: initialData?.classStaffId || '',
                group_id: initialData?.groupId || '',
                syllabusId: initialData?.syllabusId || '',
                academicYearId: initialData?.academicYearID || '',
            };

            if (formikRef.current) {
                formikRef.current.setValues(initialValues);
            }
        }
    }, [initialData, standards]);

    useEffect(() => {
        if (academicYears.length > 0 && !initialData) {
            const currentYear = academicYears.find((year: any) => year.isCurrent);
            if (currentYear) {
                if (formikRef.current) {
                    formikRef.current.setFieldValue('academicYearId', (currentYear as { id: string }).id);
                }
            }
        }
    }, [academicYears, initialData]);

    const formikRef = useRef<FormikProps<any>>(null);

    const validationSchema = Yup.object().shape({
        name: Yup.string()
            .required('Class Name is required')
            .matches(/[a-zA-Z]/, 'Class name must contain at least one letter'),
        mediumId: Yup.string().required('Medium is required'),
        standardId: Yup.string().required('Standard is required'),
        syllabusId: Yup.string().required('Syllabus is required'),
        academicYearId: Yup.string().required('Academic Year is required'),
        classStaffId: Yup.string(),
        group_id: Yup.string(),
    });

    const handleSubmit = (values: FormikValues) => {
        const submitData = {
            name: values.name,
            mediumId: values.mediumId,
            standardId: values.standardId,
            classStaffId: values.classStaffId,
            syllabusId: values.syllabusId,
            academicYearId: values.academicYearId
        };

        if (values.group_id !== '') {
            Object.assign(submitData, { group_id: values.group_id });
        }
        onSave(submitData);
    };

    return (
        <div className="flex flex-col h-full">
            <div className="flex-grow overflow-auto p-4">
                <h2 className="text-xl font-bold mb-4">{initialData ? 'Edit Class' : 'Create Class'}</h2>
                <Formik
                    innerRef={formikRef}
                    initialValues={initialData ? {
                        name: initialData.name || '',
                        mediumId: initialData.mediumId || '',
                        standardId: initialData.standardId || '',
                        classStaffId: initialData.classStaffId || '',
                        group_id: initialData.groupId || '',
                        syllabusId: initialData.syllabusId || '',
                        academicYearId: initialData.academicYearID || '',
                    } : {
                        name: '',
                        mediumId: '',
                        standardId: '',
                        classStaffId: '',
                        group_id: '',
                        syllabusId: '',
                        academicYearId: '',
                        religionId: '',
                    }}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
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
                            </Grid>

                            <Grid container spacing={2}>
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
                                                    <MenuItem key={syllabus.id} value={syllabus.id}>
                                                        {syllabus.name}
                                                    </MenuItem>
                                                ))
                                            ) : (
                                                <MenuItem disabled>No syllabus found</MenuItem>
                                            )}
                                        </Select>
                                        <FormHelperText>
                                            {touched.syllabusId && typeof errors.syllabusId === 'string' ? errors.syllabusId : ''}
                                        </FormHelperText>
                                    </FormControl>
                                </Grid>

                                <Grid item xs={12} md={6}>
                                    <FormControl fullWidth error={touched.academicYearId && Boolean(errors.academicYearId)}>
                                        <InputLabel>Academic Year</InputLabel>
                                        <Select
                                            name="academicYearId"
                                            value={values.academicYearId}
                                            onChange={handleChange}
                                            label="Academic Year"
                                        >
                                            {academicYears.length > 0 ? (
                                                academicYears.map((year: any) => (
                                                    <MenuItem key={year.id} value={year.id}>
                                                        {year.name} {year.isCurrent ? '(Current)' : ''}
                                                    </MenuItem>
                                                ))
                                            ) : (
                                                <MenuItem disabled>No academic years found</MenuItem>
                                            )}
                                        </Select>
                                    </FormControl>
                                </Grid>

                                <Grid item xs={12}>
                                    <FormControl fullWidth>
                                        <InputLabel>Class Staff</InputLabel>

                                        <Select
                                            name="classStaffId"
                                            value={values.classStaffId}
                                            onChange={handleChange}
                                            label="Class Staff"
                                        >
                                            {staffs.filter((staff: any) => staff).length > 0 ? (
                                                staffs
                                                    .filter((staff: any) => staff)
                                                    .map((staff: any) => (
                                                        <MenuItem key={staff.ID} value={staff.id}>
                                                            {`${staff.name} - ${staff.subjectIDs || 'No subject assigned'}`}
                                                        </MenuItem>
                                                    ))
                                            ) : (
                                                <MenuItem disabled>No teaching staff found</MenuItem>
                                            )}
                                        </Select>
                                    </FormControl>
                                </Grid>
                            </Grid>




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
