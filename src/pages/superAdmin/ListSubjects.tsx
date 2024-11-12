import React, { useState, useEffect } from 'react';
import { Checkbox, Modal, Box, IconButton } from "@mui/material";
import { PlusCircle, Trash2 } from "lucide-react";
import ListControls from '../../components/ListControls';
import CreateSubject from './CreateSubject';
import { Subject } from '../../types/Types';
import SnackbarComponent from '../../components/SnackbarComponent';
import { createSubject, getSubjects, updateSubject, deleteSubject } from '../../api/superAdmin';

const ListSubjects: React.FC = () => {
    const [openModal, setOpenModal] = useState<boolean>(false);
    const [editingSubject, setEditingSubject] = useState<Subject | null>(null);
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [selectedSubjects, setSelectedSubjects] = useState<number[]>([]);
    const [selectAll, setSelectAll] = useState<boolean>(false);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success' as 'success' | 'error',
        position: { vertical: 'top' as const, horizontal: 'center' as const }
    });

    useEffect(() => {
        fetchSubjects();
    }, []);

    const fetchSubjects = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await getSubjects();
            if (response.status === true && response.resp_code === "SUCCESS") {
                console.log(response.data);
                const formattedSubjects = response.data.map((subject: any) => ({
                    id: subject.ID,
                    name: subject.Name,
                    code: subject.Code
                }));
                setSubjects(formattedSubjects);
            } else {
                throw new Error('Failed to fetch subjects');
            }
        } catch (error: any) {
            console.error('Error fetching subjects:', error);
            setError('Failed to load subjects. Please try again.');
            setSnackbar({
                open: true,
                message: error.response?.data?.error || 'Failed to load subjects',
                severity: 'error',
                position: { vertical: 'top', horizontal: 'center' }
            });
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (subject: Subject | null) => {
        setEditingSubject(subject);
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setEditingSubject(null);
        setOpenModal(false);
    };

    const handleSave = async (updatedSubject: Subject) => {
        try {
            if (editingSubject) {
                // Update existing subject
                const response = await updateSubject(editingSubject.id, updatedSubject.name);
                if (response.status === true) {
                    setSubjects(prevSubjects =>
                        prevSubjects.map(subject =>
                            subject.id === editingSubject.id
                                ? {
                                    ...subject,
                                    name: updatedSubject.name,
                                    code: updatedSubject.code
                                }
                                : subject
                        )
                    );
                    setSnackbar({
                        open: true,
                        message: 'Subject updated successfully!',
                        severity: 'success',
                        position: { vertical: 'top', horizontal: 'center' }
                    });
                } else {
                    throw new Error(response.message || 'Failed to update subject');
                }
            } else {
                // Create new subject
                const response = await createSubject(updatedSubject.name);
                if (response.status === true) {
                    await fetchSubjects(); // Refresh the list
                    setSnackbar({
                        open: true,
                        message: 'Subject created successfully!',
                        severity: 'success',
                        position: { vertical: 'top', horizontal: 'center' }
                    });
                } else {
                    throw new Error(response.message || 'Failed to create subject');
                }
            }
            handleCloseModal();
        } catch (error: any) {
            console.error('Error saving subject:', error);
            setSnackbar({
                open: true,
                message: error.response?.data?.error || 'Failed to save subject',
                severity: 'error',
                position: { vertical: 'top', horizontal: 'center' }
            });
        }
    };

    const handleDelete = async (id: number) => {
        try {
            const response = await deleteSubject(id);
            if (response.status === true) {
                setSubjects(subjects.filter(subject => subject.id !== id));
                setSelectedSubjects(selectedSubjects.filter(subjectId => subjectId !== id));
                setSnackbar({
                    open: true,
                    message: 'Subject deleted successfully!',
                    severity: 'success',
                    position: { vertical: 'top', horizontal: 'center' }
                });
            } else {
                throw new Error(response.message || 'Failed to delete subject');
            }
        } catch (error: any) {
            console.error('Error deleting subject:', error);

            if (error.response?.status === 409 && error.response?.data?.resp_code === 'RECORD_IN_USE') {
                setSnackbar({
                    open: true,
                    message: 'Cannot delete subject as it is being used by other records',
                    severity: 'error',
                    position: { vertical: 'top', horizontal: 'center' }
                });
            } else {
                setSnackbar({
                    open: true,
                    message: error.response?.data?.error || 'Failed to delete subject',
                    severity: 'error',
                    position: { vertical: 'top', horizontal: 'center' }
                });
            }
        }
    };

    const handleSelectAll = () => {
        setSelectedSubjects(selectAll ? [] : subjects.map(subject => subject.id));
        setSelectAll(!selectAll);
    };

    const handleSelectSubject = (id: number) => {
        setSelectedSubjects(prev =>
            prev.includes(id) ? prev.filter(selectedId => selectedId !== id) : [...prev, id]
        );
    };

    const handleCloseSnackbar = () => {
        setSnackbar(prev => ({ ...prev, open: false }));
    };

    const filteredSubjects = subjects.filter(subject => {
        if (!subject.name) return false;
        return subject.name.toLowerCase().includes(searchTerm.toLowerCase());
    });

    return (
        <div className="min-h-screen bg-gray-200 p-8 pt-5 relative">
            <ListControls
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                viewMode={viewMode}
                setViewMode={setViewMode}
                itemCount={subjects.length}
            />

            {loading ? (
                <div className="rounded-lg p-8 text-center">
                    <p className="text-xl font-semibold">Loading subjects...</p>
                </div>
            ) : error ? (
                <div className="rounded-lg p-8 text-center">
                    <p className="text-xl font-semibold text-red-500">{error}</p>
                </div>
            ) : subjects.length === 0 ? (
                <div className="rounded-lg p-8 text-center">
                    <p className="text-xl font-semibold mb-4">No subjects found.</p>
                    <p className="text-gray-600">Click the "+" button to create a new subject.</p>
                </div>
            ) : filteredSubjects.length === 0 ? (
                <div className="rounded-lg p-8 text-center">
                    <p className="text-lg font-semibold">No subjects match your search criteria.</p>
                </div>
            ) : (
                <div className="bg-white shadow-md rounded-lg overflow-hidden">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-gray-300">
                                <th className="text-center w-1/12">
                                    <Checkbox
                                        checked={selectAll}
                                        onChange={handleSelectAll}
                                    />
                                </th>
                                <th className="text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-1/12">Sl.No</th>
                                <th className="text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-5/12">Subject Name</th>
                                <th className="text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-3/12">Subject Code</th>
                                <th className="text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-2/12">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredSubjects.map((subject, index) => (
                                <tr key={subject.id} className="cursor-pointer">
                                    <td className="text-center">
                                        <Checkbox
                                            checked={selectedSubjects.includes(subject.id)}
                                            onChange={() => handleSelectSubject(subject.id)}
                                            onClick={(e) => e.stopPropagation()}
                                        />
                                    </td>
                                    <td className="text-center" onClick={() => handleOpenModal(subject)}>
                                        <div className="text-sm font-medium text-gray-900">{index + 1}</div>
                                    </td>
                                    <td className="text-center" onClick={() => handleOpenModal(subject)}>
                                        <div className="text-sm font-medium text-gray-900">{subject.name}</div>
                                    </td>
                                    <td className="text-center" onClick={() => handleOpenModal(subject)}>
                                        <div className="text-sm font-medium text-gray-900">{subject.code}</div>
                                    </td>
                                    <td className="text-center">
                                        <IconButton
                                            aria-label="delete"
                                            onClick={() => handleDelete(subject.id)}
                                        >
                                            <Trash2 size={20} className="text-red-500" />
                                        </IconButton>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            <div className="fixed bottom-10 right-16 flex items-center space-x-2">
                <button
                    className="bg-green-500 text-white p-2 rounded-full shadow-lg relative group hover:bg-green-600"
                    onClick={() => handleOpenModal(null)}
                >
                    <PlusCircle size={34} />
                    <span className="absolute left-[-140px] top-1/2 transform -translate-y-1/2 bg-white text-black text-sm py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow">
                        Create New Subject
                    </span>
                </button>
            </div>

            <Modal
                open={openModal}
                onClose={handleCloseModal}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 1000,
                    maxWidth: '90%',
                    height: 900,
                    maxHeight: '90%',
                    bgcolor: 'background.paper',
                    boxShadow: 24,
                    p: 4,
                    borderRadius: 2,
                }}>
                    <CreateSubject
                        initialData={editingSubject}
                        onSave={handleSave}
                        onCancel={handleCloseModal}
                    />
                </Box>
            </Modal>

            <SnackbarComponent
                open={snackbar.open}
                message={snackbar.message}
                severity={snackbar.severity}
                position={snackbar.position}
                onClose={handleCloseSnackbar}
            />
        </div>
    );
};

export default ListSubjects;
