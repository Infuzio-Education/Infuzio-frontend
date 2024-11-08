import React, { useEffect, useState } from 'react';
import { Checkbox, Modal, Box, IconButton } from "@mui/material";
import { PlusCircle, Trash2 } from "lucide-react";
import ListControls from '../../components/ListControls';
import CreateClass from './CreateClass';
import { Class, ClassSubmitData } from '../../types/Types';
import { useSchoolContext } from '../../contexts/SchoolContext';
import { getClasses, createClass, updateClass, deleteClass } from '../../api/superAdmin';
import SnackbarComponent from '../../components/SnackbarComponent';

const ListClasses: React.FC = () => {
    const [openModal, setOpenModal] = useState<boolean>(false);
    const [editingClass, setEditingClass] = useState<Class | null>(null);
    const [classes, setClasses] = useState<Class[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedClasses, setSelectedClasses] = useState<number[]>([]);
    const [selectAll, setSelectAll] = useState<boolean>(false);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success' as 'success' | 'error',
        position: { vertical: 'top' as const, horizontal: 'center' as const }
    });

    const { schoolInfo } = useSchoolContext();

    const fetchClasses = async () => {
        setLoading(true);
        setError(null);
        try {
            if (!schoolInfo.schoolPrefix) {
                throw new Error("School prefix not found");
            }
            const response = await getClasses(schoolInfo.schoolPrefix);
            if (response.status && response.resp_code === "SUCCESS") {
                setClasses(response.data);
            } else {
                throw new Error("Failed to fetch classes");
            }
        } catch (err: any) {
            setError(err.response?.data?.message || 'An error occurred while fetching classes');
            setSnackbar({
                open: true,
                message: err.response?.data?.message || 'Failed to fetch classes',
                severity: 'error',
                position: { vertical: 'top', horizontal: 'center' },
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchClasses();
    }, [schoolInfo.schoolPrefix]);

    const handleCloseSnackbar = () => {
        setSnackbar(prev => ({ ...prev, open: false }));
    };

    const handleOpenModal = (classData: Class | null) => {
        setEditingClass(classData);
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setEditingClass(null);
        setOpenModal(false);
    };

    const handleSave = async (classData: ClassSubmitData) => {
        try {
            if (!schoolInfo.schoolPrefix) {
                throw new Error("School prefix not found");
            }

            classData = classData.group_id ? { ...classData } : { ...classData, group_id: 0 };

            if (editingClass) {
                const updateData = {
                    id: editingClass.ID,
                    name: classData.name,
                    mediumId: classData.mediumId,
                    standardId: classData.standardId,
                    syllabusId: classData.syllabusId,
                    classStaffId: classData.classStaffId,
                    group_id: classData.group_id
                };

                const response = await updateClass(updateData, schoolInfo.schoolPrefix);

                if (response.status && response.resp_code === "SUCCESS") {
                    await fetchClasses();
                    setSnackbar({
                        open: true,
                        message: "Class updated successfully!",
                        severity: "success",
                        position: { vertical: "top", horizontal: "center" },
                    });
                } else {
                    throw new Error(response.data || "Failed to update class");
                }
            } else {
                const response = await createClass(classData, schoolInfo.schoolPrefix);

                if (response.status && response.resp_code === "CREATED") {
                    await fetchClasses();
                    setSnackbar({
                        open: true,
                        message: "Class created successfully!",
                        severity: "success",
                        position: { vertical: "top", horizontal: "center" },
                    });
                } else {
                    throw new Error(response.data || "Failed to create class");
                }
            }
            handleCloseModal();
        } catch (error: any) {
            console.error("Error saving class:", error);
            setSnackbar({
                open: true,
                message: error.message || "Failed to save class",
                severity: "error",
                position: { vertical: "top", horizontal: "center" },
            });
        }
    };

    const handleDelete = async (id: number) => {
        try {
            const response = await deleteClass(id, schoolInfo.schoolPrefix || '');
            if (response.status === true) {
                setClasses(classes.filter(c => c.ID !== id));
                setSelectedClasses(selectedClasses.filter(classId => classId !== id));
                setSnackbar({
                    open: true,
                    message: 'Class deleted successfully!',
                    severity: 'success',
                    position: { vertical: 'top', horizontal: 'center' }
                });
            } else {
                throw new Error(response.message || 'Failed to delete class');
            }
        } catch (error: any) {
            console.error('Error deleting class:', error);

            if (error.response?.status === 409 && error.response?.data?.resp_code === 'RECORD_IN_USE') {
                setSnackbar({
                    open: true,
                    message: 'Cannot delete class as it has students enrolled',
                    severity: 'error',
                    position: { vertical: 'top', horizontal: 'center' }
                });
            } else {
                setSnackbar({
                    open: true,
                    message: error.response?.data?.error || 'Failed to delete class',
                    severity: 'error',
                    position: { vertical: 'top', horizontal: 'center' }
                });
            }
        }
    };

    const handleSelectAll = () => {
        if (selectAll) {
            setSelectedClasses([]);
        } else {
            setSelectedClasses(classes.map(c => c.ID));
        }
        setSelectAll(!selectAll);
    };

    const handleSelectClass = (id: number) => {
        if (selectedClasses.includes(id)) {
            setSelectedClasses(selectedClasses.filter(selectedId => selectedId !== id));
        } else {
            setSelectedClasses([...selectedClasses, id]);
        }
    };

    const filteredClasses = classes.filter(classData =>
        classData.Name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-gray-200 p-8 relative">
            <ListControls
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                viewMode={viewMode}
                setViewMode={setViewMode}
                itemCount={classes.length}
            />

            {loading ? (
                <div className="rounded-lg p-8 text-center">
                    <p className="text-xl font-semibold">Loading classes...</p>
                </div>
            ) : error ? (
                <div className="rounded-lg p-8 text-center">
                    <p className="text-xl font-semibold text-red-500">{error}</p>
                </div>
            ) : classes.length === 0 ? (
                <div className="rounded-lg p-8 text-center">
                    <p className="text-xl font-semibold mb-4">No classes found.</p>
                    <p className="text-gray-600">Click the "+" button to create a new class.</p>
                </div>
            ) : filteredClasses.length === 0 ? (
                <div className="rounded-lg p-8 text-center">
                    <p className="text-lg font-semibold">No classes match your search criteria.</p>
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
                                <th className="text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-2/12">Name</th>
                                <th className="text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-2/12">Medium</th>
                                <th className="text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-2/12">Standard</th>
                                <th className="text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-1/12">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {classes.map((classData, index) => (
                                <tr key={classData.ID} className="cursor-pointer">
                                    <td className="text-center">
                                        <Checkbox
                                            checked={selectedClasses.includes(classData.ID)}
                                            onChange={() => handleSelectClass(classData.ID)}
                                            onClick={(e) => e.stopPropagation()}
                                        />
                                    </td>
                                    <td className="text-center" onClick={() => handleOpenModal(classData)}>
                                        <div className="text-sm font-medium text-gray-900">{index + 1}</div>
                                    </td>
                                    <td className="text-center" onClick={() => handleOpenModal(classData)}>
                                        <div className="text-sm font-medium text-gray-900">{classData.Name}</div>
                                    </td>
                                    <td className="text-center" onClick={() => handleOpenModal(classData)}>
                                        <div className="text-sm font-medium text-gray-900">{classData.MediumId}</div>
                                    </td>
                                    <td className="text-center" onClick={() => handleOpenModal(classData)}>
                                        <div className="text-sm font-medium text-gray-900">{classData.StandardId}</div>
                                    </td>
                                    <td className="text-center">
                                        <IconButton
                                            aria-label="delete"
                                            onClick={() => handleDelete(classData.ID)}
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
                        Create New Class
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
                    <CreateClass
                        initialData={editingClass}
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

export default ListClasses;
