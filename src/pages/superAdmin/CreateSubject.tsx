import React, { useState } from 'react';
import { TextField, Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { CreateSubjectProps, Subject, Teacher } from '../../types/Types';
import CustomTabs from '../../components/CustomTabs';
import { PlusCircle } from 'lucide-react';
import DynamicTable from '../../components/DynamicLists';
import DynamicLists from '../../components/DynamicLists';

const CreateSubject: React.FC<CreateSubjectProps> = ({ initialData, onSave, onCancel }) => {
    const [subject, setSubject] = useState<Subject>({
        id: initialData?.id || 0,
        name: initialData?.name || '',
        code: initialData?.code || '',
        isSubjectTeacher: initialData?.isSubjectTeacher || false
    });

    const [teachers, _setTeachers] = useState<Teacher[]>([
        { id: 1, name: 'John Doe', email: 'john@example.com' },
        { id: 2, name: 'Jane Smith', email: 'jane@example.com' },
    ]);

    const [selectedTeachers, setSelectedTeachers] = useState<Teacher[]>([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [tempSelectedTeachers, setTempSelectedTeachers] = useState<Teacher[]>([]);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSubject({
            ...subject,
            [event.target.name]: event.target.value
        });
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        onSave({
            ...subject,
            name: subject.name.trim(),
            code: subject.code.trim()
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
        <div className="flex flex-col min-h-screen">
            <div className="flex-grow p-4">
                <h2 className="text-xl font-bold mb-4">{initialData ? 'Edit Subject' : 'Create Subject'}</h2>
                <form onSubmit={handleSubmit} className="flex flex-col h-full">
                    <div className="flex-grow">
                        <div className="grid grid-cols-2 gap-4">
                            <TextField
                                label="Subject Name"
                                variant="outlined"
                                fullWidth
                                name="name"
                                value={subject.name}
                                onChange={handleChange}
                                required
                                placeholder="e.g: English"
                            />
                            <TextField
                                label="Subject code"
                                variant="outlined"
                                fullWidth
                                name="code"
                                value={subject.code}
                                onChange={handleChange}
                                required
                                placeholder="e.g: ENG"
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
                    </div>
                </form>
            </div>

            <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t">
                <div className="max-w-7xl mx-auto flex justify-end space-x-2">
                    <Button onClick={onCancel} variant="outlined" color="success">
                        Cancel
                    </Button>
                    <Button onClick={(e) => handleSubmit(e as any)} variant="contained" color="success">
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
                        height: '80vh',
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