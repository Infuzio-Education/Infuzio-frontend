import React, { useState, useEffect } from 'react';
import { TextField, Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { CreateSubjectProps, Subject, Teacher } from '../../types/Types';
import CustomTabs from '../../components/CustomTabs';
import { PlusCircle } from 'lucide-react';
import DynamicTable from '../../components/DynamicLists';
import DynamicLists from '../../components/DynamicLists';

const CreateSubject: React.FC<CreateSubjectProps> = ({ initialData, onSave, onCancel }) => {
    const [subject, setSubject] = useState<Subject>({
        id: 0,
        name: '',
        code: '',
        minMarks: 35,
        maxMarks: 100,
    });

    const [teachers, setTeachers] = useState<Teacher[]>([
        { id: 1, name: 'John Doe', email: 'john@example.com' },
        { id: 2, name: 'Jane Smith', email: 'jane@example.com' },
    ]);

    const [selectedTeachers, setSelectedTeachers] = useState<Teacher[]>([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [tempSelectedTeachers, setTempSelectedTeachers] = useState<Teacher[]>([]);

    useEffect(() => {
        if (initialData) {
            setSubject(initialData);
        }
    }, [initialData]);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setSubject(prev => ({
            ...prev,
            [name]: name === 'minMarks' || name === 'maxMarks' ? Number(value) || '' : value,
        }));
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        onSave({
            ...subject,
            minMarks: subject.minMarks || 0,
            maxMarks: subject.maxMarks || 100,
        });
    };

    const handleAddTeacher = () => {
        setOpenDialog(true);
        setTempSelectedTeachers([...selectedTeachers]);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
    };

    const handleSelectTeacher = (teacher: Teacher) => {
        setTempSelectedTeachers(prev =>
            prev.some(t => t.id === teacher.id)
                ? prev.filter(t => t.id !== teacher.id)
                : [...prev, teacher]
        );
    };

    const handleConfirmSelection = () => {
        setSelectedTeachers(tempSelectedTeachers);
        setOpenDialog(false);
    };

    const handleRemoveTeacher = (teacherToRemove: Teacher) => {
        setSelectedTeachers(prev => prev.filter(teacher => teacher.id !== teacherToRemove.id));
    };

    const teacherColumns = [
        { id: 'name', label: 'Name', minWidth: 100 },
        { id: 'email', label: 'Email', minWidth: 150 },
    ];

    return (
        <div className="flex flex-col h-full">
            <div className="flex-grow overflow-auto p-4">
                <h2 className="text-xl font-bold mb-4">{initialData ? 'Edit Subject' : 'Create Subject'}</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <TextField
                            label="Subject Name"
                            variant="outlined"
                            fullWidth
                            name="name"
                            value={subject.name}
                            onChange={handleChange}
                            required
                        />
                        <TextField
                            label="Subject Code"
                            variant="outlined"
                            fullWidth
                            name="code"
                            value={subject.code}
                            onChange={handleChange}
                            required
                            placeholder="e.g: DFG"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <TextField
                            label="Minimum Marks"
                            variant="outlined"
                            fullWidth
                            name="minMarks"
                            type="number"
                            value={subject.minMarks === 0 ? '' : subject.minMarks}
                            onChange={handleChange}
                            required
                            inputProps={{ min: 0 }}
                        />
                        <TextField
                            label="Maximum Marks"
                            variant="outlined"
                            fullWidth
                            name="maxMarks"
                            type="number"
                            value={subject.maxMarks === 0 ? '' : subject.maxMarks}
                            onChange={handleChange}
                            required
                            inputProps={{ min: 0 }}
                        />
                    </div>

                    <CustomTabs labels={['Teachers']}>
                        <div>
                            <DynamicLists
                                columns={teacherColumns}
                                rows={selectedTeachers}
                                showCloseIcon={true}
                                onRowRemove={handleRemoveTeacher}
                            />
                            <Button
                                startIcon={<PlusCircle size={16} />}
                                onClick={handleAddTeacher}
                                color='success'
                                fullWidth
                                sx={{
                                    textTransform: 'none',
                                    textAlign: 'start',
                                    justifyContent: 'flex-start',
                                    marginTop: '8px'
                                }}
                            >
                                Add New Teacher
                            </Button>
                        </div>
                    </CustomTabs>
                </form>
            </div>

            <div className="mt-auto">
                <div className="flex justify-end space-x-2  ">
                    <Button onClick={onCancel} variant="outlined" color="success">
                        Cancel
                    </Button>
                    <Button type="submit" variant="contained" color="success">
                        {initialData ? 'Save Changes' : 'Create Subject'}
                    </Button>
                </div>
            </div>

            <Dialog
                open={openDialog}
                onClose={handleCloseDialog}
                maxWidth="md"
                fullWidth
                PaperProps={{
                    style: {
                        display: 'flex',
                        flexDirection: 'column',
                        height: '100%',
                        maxHeight: '80vh',
                    }
                }}
            >
                <DialogTitle>Select Teachers</DialogTitle>
                <DialogContent style={{ flexGrow: 1, overflow: 'auto', minHeight: 0 }}>
                    <DynamicTable
                        columns={teacherColumns}
                        rows={teachers}
                        selectable={true}
                        selectedRows={tempSelectedTeachers}
                        onRowSelect={handleSelectTeacher}
                    />
                </DialogContent>
                <DialogActions style={{
                    padding: '16px',
                    borderTop: '1px solid rgba(0, 0, 0, 0.12)',
                    marginTop: 'auto'
                }}>
                    <Button onClick={handleCloseDialog} color="error">
                        Cancel
                    </Button>
                    <Button onClick={handleConfirmSelection} color="success">
                        Select
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default CreateSubject;