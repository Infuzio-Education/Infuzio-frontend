import { useState, useEffect } from 'react';
import { Button, TextField, MenuItem, Paper, Modal, Box, FormControl } from '@mui/material';
import { getSchoolWorkingDays, getSchoolSubjects, listStaff, createTimetable, updateTimetable } from '../../api/superAdmin';
import { getAllClassesInSchool } from '../../api/staffs';
import { DAYS_MAP } from '../../utils/dayConstant';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store/store';
import { message } from 'antd';
import { Autocomplete } from '@mui/material';
import { PlusCircle } from 'lucide-react';

interface CreateTimetableProps {
    initialData?: any;
    timetables: any[];
    onSave: (data: any) => void;
    onCancel: () => void;
}

interface CellModalProps {
    open: boolean;
    onClose: () => void;
    onSave: (subject: string, teacher: string) => void;
    initialSubject?: string;
    initialTeacher?: string;
    subjects: Array<{ id: number; name: string }>;
    staff: Array<{ id: number; regNumber: string; name: string }>;
}

const CellEditModal: React.FC<CellModalProps> = ({
    open,
    onClose,
    onSave,
    initialSubject,
    initialTeacher,
    subjects,
    staff
}) => {
    const [subject, setSubject] = useState(initialSubject || '');
    const [teacher, setTeacher] = useState(initialTeacher || '');
    const [errors, setErrors] = useState({ subject: '', teacher: '' });

    const validateAndSave = () => {
        const newErrors = {
            subject: '',
            teacher: ''
        };

        if (!subject) {
            newErrors.subject = 'Please select a subject';
        }
        if (!teacher) {
            newErrors.teacher = 'Please select a teacher';
        }

        setErrors(newErrors);

        if (!newErrors.subject && !newErrors.teacher) {
            onSave(subject, teacher);
        }
    };

    return (
        <Modal open={open} onClose={onClose}>
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
                <h3 className="text-lg font-semibold mb-4">Edit Period</h3>
                <div className="space-y-4">
                    <FormControl fullWidth error={!!errors.subject}>
                        <Autocomplete
                            options={subjects}
                            getOptionLabel={(option) => option.name}
                            value={subjects.find(s => s.name === subject) || null}
                            onChange={(_, newValue) => {
                                setSubject(newValue?.name || '');
                                setErrors(prev => ({ ...prev, subject: '' }));
                            }}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Subject"
                                    variant="outlined"
                                    error={!!errors.subject}
                                    helperText={errors.subject}
                                />
                            )}
                            filterOptions={(options, { inputValue }) =>
                                options.filter(option =>
                                    option.name.toLowerCase().includes(inputValue.toLowerCase())
                                )
                            }
                        />
                    </FormControl>

                    <FormControl fullWidth error={!!errors.teacher}>
                        <Autocomplete
                            options={staff}
                            getOptionLabel={(option) => `${option.name} (ID:${option.regNumber})`}
                            value={staff.find(t => t.name === teacher) || null}
                            onChange={(_, newValue) => {
                                setTeacher(newValue?.name || '');
                                setErrors(prev => ({ ...prev, teacher: '' }));
                            }}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Teacher"
                                    variant="outlined"
                                    error={!!errors.teacher}
                                    helperText={errors.teacher}
                                />
                            )}
                            filterOptions={(options, { inputValue }) =>
                                options.filter(option =>
                                    option.name.toLowerCase().includes(inputValue.toLowerCase()) ||
                                    option.regNumber.includes(inputValue)
                                )
                            }
                            renderOption={(props, option) => (
                                <li {...props}>
                                    <div className="flex justify-between w-full">
                                        <span>{option.name}</span>
                                        <span className="text-gray-500">ID:{option.regNumber.padStart(6, '0')}</span>
                                    </div>
                                </li>
                            )}
                        />
                    </FormControl>

                    <div className="flex justify-end gap-2 mt-4">
                        <Button variant="outlined" color="error" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button variant="contained" color="success" onClick={validateAndSave}>
                            Add
                        </Button>
                    </div>
                </div>
            </Box>
        </Modal>
    );
};

const CreateTimetable: React.FC<CreateTimetableProps> = ({ initialData, timetables, onSave, onCancel }) => {
    const [workingDays, setWorkingDays] = useState<number>(initialData?.workingDays || 5);
    const [totalPeriods, setTotalPeriods] = useState<number>(initialData?.totalPeriods || '');
    const [generateTable, setGenerateTable] = useState(initialData ? true : false);
    const [timetableData, setTimetableData] = useState<{ [key: string]: string[] }>(
        initialData?.timetableData || {}
    );
    const [selectedCell, setSelectedCell] = useState<{
        day: string;
        periodIndex: number;
        subject?: string;
        teacher?: string;
    } | null>(null);
    const [workingDayGroups, setWorkingDayGroups] = useState<Array<{
        id: number;
        group_name: string;
        days: number[];
    }>>([]);
    const [classes, setClasses] = useState<Array<{ id: number; name: string }>>([]);
    const [selectedClassId, setSelectedClassId] = useState<number | ''>('');
    const [subjects, setSubjects] = useState<Array<{ id: number; name: string }>>([]);
    const [staff, setStaff] = useState<Array<{ id: number; regNumber: string; name: string }>>([]);
    const [formErrors, setFormErrors] = useState<{
        classId?: string;
        workingDays?: string;
        totalPeriods?: string;
    }>({});
    const [emptyCells, setEmptyCells] = useState<{ [key: string]: number[] }>({});

    const schoolPrefix = useSelector((state: RootState) => state.staffInfo.staffInfo?.schoolCode);

    useEffect(() => {
        const fetchWorkingDays = async () => {
            try {
                const response = await getSchoolWorkingDays();
                if (response?.data) {
                    setWorkingDayGroups(response.data);
                }
            } catch (error) {
                console.error('Error fetching working days:', error);
                message.error('Failed to load working days');
            }
        };

        fetchWorkingDays();
    }, []);

    useEffect(() => {
        if (initialData?.timetableData) {
            setTimetableData(initialData.timetableData);
            setGenerateTable(true);
        }
    }, [initialData]);

    useEffect(() => {
        const fetchClasses = async () => {
            try {
                const response = await getAllClassesInSchool(schoolPrefix as string);
                if (response?.data?.data) {
                    // Filter out classes with existing timetables when creating new
                    const allocatedClassIds = timetables.map((t: any) => t.classId);
                    const filteredClasses = initialData
                        ? response.data.data  // Show all when editing
                        : response.data.data.filter((cls: any) =>
                            !allocatedClassIds.includes(cls.id)
                        );

                    setClasses(filteredClasses);
                }
            } catch (error) {
                console.error('Error fetching classes:', error);
                message.error('Failed to load classes');
            }
        };

        if (schoolPrefix) {
            fetchClasses();
        }
    }, [schoolPrefix, timetables, initialData]);

    useEffect(() => {
        if (initialData?.classId) {
            setSelectedClassId(initialData.classId);
        }
    }, [initialData]);

    useEffect(() => {
        const fetchSubjectsAndStaff = async () => {
            try {
                const [subjectsRes, staffRes] = await Promise.all([
                    getSchoolSubjects(schoolPrefix as string),
                    listStaff(schoolPrefix as string)
                ]);

                if (subjectsRes?.data) {
                    setSubjects(Array.isArray(subjectsRes.data) ? subjectsRes.data : []);
                }

                if (staffRes?.data) {
                    setStaff(Array.isArray(staffRes.data) ? staffRes.data : []);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
                message.error('Failed to load subjects or staff');
            }
        };

        if (schoolPrefix) {
            fetchSubjectsAndStaff();
        }
    }, [schoolPrefix]);

    const validateForm = () => {
        const errors: {
            classId?: string;
            workingDays?: string;
            totalPeriods?: string;
        } = {};

        if (!selectedClassId) {
            errors.classId = 'Please select a class';
        }
        if (!workingDays) {
            errors.workingDays = 'Please select working days';
        }
        if (!totalPeriods || totalPeriods <= 0) {
            errors.totalPeriods = 'Please enter valid number of periods';
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleGenerate = () => {
        if (validateForm()) {
            const selectedGroup = workingDayGroups.find(g => g.days.length === workingDays);
            if (!selectedGroup) return;

            // Only create entries for the selected days
            const initialData: { [key: string]: string[] } = {};
            // Use only the days from the selected group
            selectedGroup.days.forEach(dayNumber => {
                const dayName = DAYS_MAP[dayNumber];
                initialData[dayName] = Array(totalPeriods).fill('');
            });

            console.log('Generated timetable data:', initialData); // Debug log
            setTimetableData(initialData);
            setGenerateTable(true);
        }
    };

    const handleCellChange = (day: string, periodIndex: number, value: string) => {
        setTimetableData(prev => ({
            ...prev,
            [day]: prev[day].map((item, index) =>
                index === periodIndex ? value : item
            )
        }));
    };

    const handleCellClick = (day: string, periodIndex: number) => {
        const cellData = timetableData[day][periodIndex] || '';
        const [subject, teacher] = cellData.split('/');
        setSelectedCell({ day, periodIndex, subject, teacher });
    };

    const handleCellSave = (subject: string, teacher: string) => {
        if (selectedCell) {
            const value = `${subject}/${teacher}`;
            handleCellChange(selectedCell.day, selectedCell.periodIndex, value);

            setEmptyCells(prev => {
                const newEmptyCells = { ...prev };
                if (newEmptyCells[selectedCell.day]) {
                    newEmptyCells[selectedCell.day] = newEmptyCells[selectedCell.day]
                        .filter(index => index !== selectedCell.periodIndex);
                    if (newEmptyCells[selectedCell.day].length === 0) {
                        delete newEmptyCells[selectedCell.day];
                    }
                }
                return newEmptyCells;
            });

            setSelectedCell(null);
        }
    };

    const validateTimetable = () => {
        const selectedGroup = workingDayGroups.find(g => g.days.length === workingDays);
        if (!selectedGroup) return false;

        const emptyPositions: { [key: string]: number[] } = {};
        let hasEmptyCells = false;

        // Only check the selected days
        selectedGroup.days.forEach(dayNumber => {
            const dayName = DAYS_MAP[dayNumber];
            const periods = timetableData[dayName] || [];

            const emptyIndices = periods.reduce((acc: number[], period, index) => {
                if (!period || period === '') {
                    acc.push(index);
                    hasEmptyCells = true;
                }
                return acc;
            }, []);

            if (emptyIndices.length > 0) {
                emptyPositions[dayName] = emptyIndices;
            }
        });

        setEmptyCells(emptyPositions);
        return !hasEmptyCells;
    };

    const handleSubmit = async () => {
        if (validateTimetable()) {
            try {
                const selectedGroup = workingDayGroups.find(g => g.days.length === workingDays);
                if (!selectedGroup) {
                    console.error('No working day group found');
                    return;
                }

                // Create a map of day names to their numbers
                const dayNameToNumber: { [key: string]: number } = {};
                selectedGroup.days.forEach(dayNumber => {
                    dayNameToNumber[DAYS_MAP[dayNumber]] = dayNumber;
                });

                // Only include days that were selected in the working days group
                const timetableDays = selectedGroup.days.map(dayNumber => {
                    const dayName = DAYS_MAP[dayNumber];
                    const periods = timetableData[dayName] || [];

                    return {
                        week_day: dayNumber,
                        periods: periods.map((period, index) => {
                            if (!period) return null;
                            const [subjectName, teacherName] = period.split('/');
                            const subject = subjects.find(s => s.name === subjectName);
                            const teacher = staff.find(t => t.name === teacherName);

                            return {
                                period_index: index + 1,
                                subject_id: subject?.id,
                                staff_id: teacher?.id
                            };
                        }).filter(Boolean) // Remove null values
                    };
                }).filter(day => day.periods.length > 0); // Remove days with no periods

                const requestData = {
                    id: initialData?.id, // Include timetable ID for edit mode
                    classId: selectedClassId,
                    activeFrom: new Date().toISOString().split('T')[0],
                    timetableDays: timetableDays
                };

                let response;
                if (initialData?.id) {
                    response = await updateTimetable(requestData);
                    if (response?.resp_code === 'SUCCESS') {
                        message.success('Timetable updated successfully!');
                    } else {
                        message.error('Failed to update timetable. Please try again.');
                    }
                } else {
                    response = await createTimetable(requestData);
                    if (response?.resp_code === 'SUCCESS') {
                        message.success('Timetable published successfully!');
                    } else {
                        message.error('Failed to publish timetable. Please try again.');
                    }
                }

                onSave(requestData);
            } catch (error) {
                console.error('Error saving timetable:', error);
                message.error(initialData?.id ?
                    'Failed to update timetable. Please try again.' :
                    'Failed to publish timetable. Please try again.'
                );
            }
        }
    };

    const getDayNames = (dayNumbers: number[]) => {
        return dayNumbers.map(day => DAYS_MAP[day]).join(', ');
    };

    return (
        <div className="relative" style={{ height: 'calc(100vh - 150px)' }}>
            <h2 className="text-xl font-bold mb-4">
                {initialData ? "Edit Timetable" : "Create Timetable"}
            </h2>

            <div className="overflow-auto h-[calc(100%-100px)]">
                <Paper className="p-6 mb-4">
                    <div className="flex gap-4 items-end mb-6">
                        <Autocomplete
                            options={classes}
                            getOptionLabel={(option) => option.name}
                            value={classes.find(c => c.id === selectedClassId) || null}
                            onChange={(_, newValue) => {
                                setSelectedClassId(newValue?.id || '');
                                setFormErrors(prev => ({ ...prev, classId: undefined }));
                            }}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Select Class"
                                    variant="outlined"
                                    sx={{ width: '150px' }}
                                    error={!!formErrors.classId}
                                    helperText={formErrors.classId}
                                />
                            )}
                            disabled={!!initialData || !schoolPrefix}
                        />

                        <TextField
                            select
                            label="Working Days"
                            value={workingDays}
                            onChange={(e) => {
                                setWorkingDays(Number(e.target.value));
                                setFormErrors(prev => ({ ...prev, workingDays: undefined }));
                            }}
                            sx={{ width: '450px' }}
                            variant="outlined"
                            disabled={!!initialData}
                            error={!!formErrors.workingDays}
                            helperText={formErrors.workingDays}
                        >
                            {workingDayGroups.length > 0 ? (
                                workingDayGroups.map(group => (
                                    <MenuItem key={group.id} value={group.days.length}>
                                        <div className="flex flex-col">
                                            <span className="font-medium">{group.group_name}</span>
                                            <span className="text-sm text-gray-500">
                                                {getDayNames(group.days)}
                                            </span>
                                        </div>
                                    </MenuItem>
                                ))
                            ) : (
                                <MenuItem value="">
                                    Loading working days...
                                </MenuItem>
                            )}
                        </TextField>

                        <TextField
                            type="number"
                            label="Total Periods/Sessions"
                            value={totalPeriods}
                            onChange={(e) => {
                                setTotalPeriods(Number(e.target.value));
                                setFormErrors(prev => ({ ...prev, totalPeriods: undefined }));
                            }}
                            variant="outlined"
                            inputProps={{ min: 1 }}
                            sx={{ width: '250px' }}
                            error={!!formErrors.totalPeriods}
                            helperText={formErrors.totalPeriods}
                        />

                        <Button
                            variant="contained"
                            onClick={handleGenerate}
                            color="success"
                            className="h-[56px] hover:bg-green-600 text-white font-medium"
                        >
                            Generate Table
                        </Button>
                    </div>

                    {generateTable && (
                        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full border-collapse">
                                    <thead>
                                        <tr>
                                            <th className="border p-3 bg-[#738982] text-white font-medium text-center w-[150px]">
                                                Days
                                            </th>
                                            {Array.from({ length: totalPeriods }).map((_, periodIndex) => (
                                                <th key={periodIndex} className="border align-center p-3 bg-gray-300 text-black font-medium">
                                                    Period {periodIndex + 1}
                                                </th>
                                            ))}
                                            <th className="border bg-gray-300">
                                                <Button
                                                    onClick={() => {
                                                        setTotalPeriods(prev => prev + 1);
                                                        // Add empty slot to each day for the new period
                                                        setTimetableData(prev => {
                                                            const newData = { ...prev };
                                                            Object.keys(newData).forEach(day => {
                                                                newData[day] = [...newData[day], ''];
                                                            });
                                                            return newData;
                                                        });
                                                    }}
                                                >
                                                    <PlusCircle
                                                        size={20}
                                                        className="text-[#7a998f] cursor-pointer hover:text-[#738982]"
                                                    />
                                                </Button>
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {workingDayGroups
                                            .find(g => g.days.length === workingDays)
                                            ?.days.map(dayNumber => DAYS_MAP[dayNumber])
                                            .map(day => (
                                                <tr key={day} className="hover:bg-gray-50 transition-colors">
                                                    <td className="border p-3 font-medium text-white bg-[#738982] text-center w-[150px]">
                                                        {day}
                                                    </td>
                                                    {Array.from({ length: totalPeriods }).map((_, periodIndex) => (
                                                        <td
                                                            key={periodIndex}
                                                            className={`border p-3 min-w-[150px] bg-white cursor-pointer hover:bg-gray-50 
                                                                ${emptyCells[day]?.includes(periodIndex) ? 'border-2 border-red-500' : ''}`}
                                                            onClick={() => handleCellClick(day, periodIndex)}
                                                        >
                                                            {(timetableData[day]?.[periodIndex]) ? (
                                                                <div className="text-center">
                                                                    <div className="font-medium">
                                                                        {timetableData[day][periodIndex].split('/')[0]}
                                                                    </div>
                                                                    <div className="text-sm text-gray-500">
                                                                        {timetableData[day][periodIndex].split('/')[1]}
                                                                    </div>
                                                                </div>
                                                            ) : (
                                                                <div className={`text-center ${emptyCells[day]?.includes(periodIndex) ? 'text-red-500' : 'text-gray-400'}`}>
                                                                    Click to add
                                                                </div>
                                                            )}
                                                        </td>
                                                    ))}
                                                </tr>
                                            ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </Paper>
            </div>

            {/* Fixed buttons at bottom */}
            {generateTable && (
                <div className="absolute bottom-0 left-0 right-0 bg-white border-t pt-4 pb-2 px-6 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
                    <div className="flex justify-end gap-4">
                        <Button
                            variant="outlined"
                            color="success"
                            onClick={onCancel}
                            className="h-12 w-32"
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="contained"
                            color="success"
                            onClick={handleSubmit}
                            className="h-12 w-48"
                        >
                            {initialData ? "Save Changes" : "Publish Timetable"}
                        </Button>
                    </div>
                </div>
            )}

            {selectedCell && (
                <CellEditModal
                    open={!!selectedCell}
                    onClose={() => setSelectedCell(null)}
                    onSave={handleCellSave}
                    initialSubject={selectedCell.subject}
                    initialTeacher={selectedCell.teacher}
                    subjects={subjects}
                    staff={staff}
                />
            )}
        </div>
    );
};

export default CreateTimetable;
