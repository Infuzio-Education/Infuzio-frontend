import React, { useEffect, useState } from 'react';
import { Checkbox, Modal, Box, IconButton } from "@mui/material";
import { PlusCircle, Trash2 } from "lucide-react";
import Togglebar from '../../components/Togglebar';
import CreateClass from './CreateClass';
import { Class, ClassSubmitData } from '../../types/Types';
import { useSchoolContext } from '../../contexts/SchoolContext';
import { getClasses, createClass, updateClass, deleteClass } from '../../api/superAdmin';
import SnackbarComponent from '../../components/SnackbarComponent';

interface GroupedClasses {
    [standardId: string]: {
        standardName: string;
        classes: Class[];
    };
}

const ListClasses: React.FC = () => {
    const [openModal, setOpenModal] = useState<boolean>(false);
    const [editingClass, setEditingClass] = useState<Class | null>(null);
    const [classes, setClasses] = useState<Class[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedClasses, setSelectedClasses] = useState<number[]>([]);
    const [selectAll, setSelectAll] = useState<boolean>(false);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
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
            const classesResponse = await getClasses(schoolInfo.schoolPrefix);

            if (classesResponse.status && classesResponse.resp_code === "SUCCESS") {
                console.log("classesResponse", classesResponse.data);
                setClasses(classesResponse.data);
            }
        } catch (err: any) {
            setError(err.response?.data?.message || 'An error occurred while fetching data');
            setSnackbar({
                open: true,
                message: err.response?.data?.message || 'Failed to fetch data',
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
            const hasLetter = /[a-zA-Z]/.test(classData.name);
            if (!hasLetter) {
                setSnackbar({
                    open: true,
                    message: "Class name must contain at least one letter",
                    severity: "error",
                    position: { vertical: "top", horizontal: "center" },
                });
                return;
            }

            if (editingClass) {
                const updateData = {
                    id: editingClass.id,
                    name: classData.name,
                    mediumId: classData.mediumId,
                    standardId: classData.standardId,
                    syllabusId: classData.syllabusId,
                    classStaffId: classData.classStaffId,
                    academicYearId: classData.academicYearId
                };

                if (classData.group_id) {
                    Object.assign(updateData, { group_id: classData.group_id });
                }

                const response = await updateClass(updateData, schoolInfo.schoolPrefix || '');

                if (response.status && response.resp_code === "SUCCESS") {
                    await fetchClasses();
                    setSnackbar({
                        open: true,
                        message: "Class updated successfully!",
                        severity: "success",
                        position: { vertical: "top", horizontal: "center" },
                    });
                    handleCloseModal();
                } else if (response.resp_code === "DATA ALREADY_EXIST") {
                    setSnackbar({
                        open: true,
                        message: "A class with this name already exists",
                        severity: "error",
                        position: { vertical: "top", horizontal: "center" },
                    });
                } else {
                    throw new Error(response.data || "Failed to update class");
                }
            } else {
                const createData = {
                    name: classData.name,
                    mediumId: classData.mediumId,
                    standardId: classData.standardId,
                    syllabusId: classData.syllabusId,
                    classStaffId: classData.classStaffId,
                    academicYearId: classData.academicYearId
                };

                if (classData.group_id) {
                    Object.assign(createData, { group_id: classData.group_id });
                }
                const response = await createClass(createData, schoolInfo.schoolPrefix || '');
                console.log("response", response);
                if (response.status && response.data.resp_code === "CREATED") {
                    await fetchClasses();
                    setSnackbar({
                        open: true,
                        message: "Class created successfully!",
                        severity: "success",
                        position: { vertical: "top", horizontal: "center" },
                    });
                    handleCloseModal();
                } else if (response.resp_code === "DATA ALREADY_EXIST") {
                    setSnackbar({
                        open: true,
                        message: "A class with this name already exists",
                        severity: "error",
                        position: { vertical: "top", horizontal: "center" },
                    });
                } else {
                    throw new Error(response.error || "Failed to create class");
                }
            }
        } catch (error: any) {
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
                setClasses(classes.filter(c => c.id !== id));
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
            const validIds = classes
                .map(c => c.id)
                .filter((id): id is number => id !== undefined);
            setSelectedClasses(validIds);
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

    const filteredClasses = (classes || []).filter(classData =>
        classData?.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const groupClassesByStandard = (classes: Class[]) => {
        const grouped: GroupedClasses = {};

        classes.forEach((classData) => {
            if (classData?.standardId && classData?.standard) {
                const standardId = classData.standardId.toString();
                if (!grouped[standardId]) {
                    grouped[standardId] = {
                        standardName: classData.standard,
                        classes: []
                    };
                }
                grouped[standardId].classes.push(classData);
            }
        });

        return grouped;
    };

    const ClassCard = ({ classData }: { classData: Class }) => {
        return (
            <div
                className="bg-white rounded-lg p-3 hover:shadow-md transition-shadow cursor-pointer border border-gray-200 w-full"
                onClick={() => handleOpenModal(classData)}
            >
                <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                        <h3 className="text-sm font-semibold text-gray-800 truncate">{classData.name}</h3>
                        <p className="text-xs text-gray-600">
                            {classData.group ? `${classData.group}` : `${classData.mediumName}`}
                        </p>
                    </div>
                    <Checkbox
                        checked={selectedClasses.includes(classData.id)}
                        onChange={() => handleSelectClass(classData.id)}
                        onClick={(e) => e.stopPropagation()}
                        size="small"
                    />
                </div>
                <div className="space-y-1">
                    <div className="flex items-center text-xs text-gray-600">
                        <span className="font-medium">Class teacher:</span>
                        <span className="ml-1 truncate">{classData.classStaffName || 'Not Assigned'}</span>
                    </div>
                    <div className="flex items-center text-xs text-gray-600">
                        <span className="font-medium">Students:</span>
                        <span className="ml-1">{classData.studentCount || 0}</span>
                    </div>
                </div>
                <div className="mt-2 flex justify-end">
                    <IconButton
                        aria-label="delete"
                        onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(classData.id);
                        }}
                        size="small"
                    >
                        <Trash2 size={16} className="text-red-500" />
                    </IconButton>
                </div>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gray-200 p-8 relative">
            <Togglebar
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                viewMode={viewMode}
                setViewMode={setViewMode}
                itemCount={(classes || []).length}
            />

            {loading ? (
                <div className="rounded-lg p-8 text-center">
                    <p className="text-xl font-semibold">Loading classes...</p>
                </div>
            ) : error ? (
                <div className="rounded-lg p-8 text-center">
                    <p className="text-xl font-semibold text-red-500">{error}</p>
                </div>
            ) : !classes || classes.length === 0 ? (
                <div className="rounded-lg p-8 text-center">
                    <p className="text-xl font-semibold mb-4">No classes found.</p>
                    <p className="text-gray-600">Click the "+" button to create a new class.</p>
                </div>
            ) : filteredClasses.length === 0 ? (
                <div className="rounded-lg p-8 text-center">
                    <p className="text-lg font-semibold">No classes match your search criteria.</p>
                </div>
            ) : viewMode === 'grid' ? (
                <div className="flex gap-2 p-1 overflow-x-auto relative">
                    {Object.entries(groupClassesByStandard(filteredClasses))
                        .sort(([, a], [, b]) => a.standardName.localeCompare(b.standardName))
                        .map(([standardId, { standardName, classes }], index, array) => (
                            <React.Fragment key={standardId}>
                                <div className="min-w-[280px]">
                                    <h3 className="text-lg font-semibold mb-3 text-gray-700 flex items-center justify-between">
                                        <span>{standardName}</span>
                                        <span className="text-sm text-gray-500">({classes.length})</span>
                                    </h3>
                                    <div className="flex flex-col gap-2">
                                        {classes.length > 0 ? (
                                            classes.map((classData) => (
                                                <ClassCard key={classData.id} classData={classData} />
                                            ))
                                        ) : (
                                            <div className="text-center py-8 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                                                <p className="text-sm text-gray-500">No classes</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                {index < array.length - 1 && (
                                    <div className="min-h-[calc(100vh-200px)] border-r border-gray-300 mx-1" />
                                )}
                            </React.Fragment>
                        ))}
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
                                <tr key={classData.id} className="cursor-pointer">
                                    <td className="text-center">
                                        <Checkbox
                                            checked={classData.id !== undefined && selectedClasses.includes(classData.id)}
                                            onChange={() => classData.id !== undefined && handleSelectClass(classData.id)}
                                            onClick={(e) => e.stopPropagation()}
                                        />
                                    </td>
                                    <td className="text-center" onClick={() => handleOpenModal(classData)}>
                                        <div className="text-sm font-medium text-gray-900">{index + 1}</div>
                                    </td>
                                    <td className="text-center" onClick={() => handleOpenModal(classData)}>
                                        <div className="text-sm font-medium text-gray-900">{classData.name}</div>
                                    </td>
                                    <td className="text-center" onClick={() => handleOpenModal(classData)}>
                                        <div className="text-sm font-medium text-gray-900">{classData.mediumName}</div>
                                    </td>
                                    <td className="text-center" onClick={() => handleOpenModal(classData)}>
                                        <div className="text-sm font-medium text-gray-900">{classData.standard}</div>
                                    </td>
                                    <td className="text-center">
                                        <IconButton
                                            aria-label="delete"
                                            onClick={() => classData.id !== undefined && handleDelete(classData.id)}
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
                    width: 700,
                    maxWidth: '90%',
                    height: 490,
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
