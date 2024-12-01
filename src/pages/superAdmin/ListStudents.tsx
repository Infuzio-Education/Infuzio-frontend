import React, { useState, useEffect } from 'react';
import { Checkbox, Modal, Box, IconButton } from "@mui/material";
import { PlusCircle, Trash2, Mail, Phone, UserCircle2 } from "lucide-react";
import ListControls from '../../components/ListControls';
import CreateStudents from './CreateStudents';
import { Student } from '../../types/Types';
import { useSchoolContext } from '../../contexts/SchoolContext';
import { listStudents, deleteStudent } from '../../api/superAdmin';
import SnackbarComponent from '../../components/SnackbarComponent';

const ListStudents: React.FC = () => {
    const [openModal, setOpenModal] = useState<boolean>(false);
    const [editingStudent, setEditingStudent] = useState<Student | null>(null);
    const [students, setStudents] = useState<Student[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedStudents, setSelectedStudents] = useState<number[]>([]);
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

    const fetchStudents = async () => {
        setLoading(true);
        setError(null);
        try {
            if (!schoolInfo.schoolPrefix) {
                throw new Error("School prefix not found");
            }
            const response = await listStudents(schoolInfo.schoolPrefix);
            console.log('liststudents', response)
            if (response.status && response.resp_code === "SUCCESS") {
                setStudents(response.data.students);
            } else {
                throw new Error("Failed to fetch students");
            }
        } catch (err: any) {
            setError(err.response?.data?.message || 'An error occurred while fetching students');
            setSnackbar({
                open: true,
                message: err.response?.data?.message || 'Failed to fetch students',
                severity: 'error',
                position: { vertical: 'top', horizontal: 'center' },
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStudents();
    }, [schoolInfo.schoolPrefix]);

    const handleCloseSnackbar = () => {
        setSnackbar(prev => ({ ...prev, open: false }));
    };

    const handleOpenModal = (student: Student | null) => {
        setEditingStudent(student);
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setEditingStudent(null);
        setOpenModal(false);
    };

    const handleSave = async () => {
        try {
            await fetchStudents();
            setSnackbar({
                open: true,
                message: editingStudent ? "Student updated successfully!" : "Student created successfully!",
                severity: "success",
                position: { vertical: "top", horizontal: "center" },
            });
            handleCloseModal();
        } catch (error: any) {
            setSnackbar({
                open: true,
                message: error.message || "Failed to save student",
                severity: "error",
                position: { vertical: "top", horizontal: "center" },
            });
        }
    };

    const handleDelete = async (id: number) => {
        try {
            await deleteStudent(id, schoolInfo.schoolPrefix || '');
            setStudents(students.filter(student => student.id !== id));
            setSnackbar({
                open: true,
                message: "Student deleted successfully!",
                severity: "success",
                position: { vertical: "top", horizontal: "center" },
            });
        } catch (error: any) {
            setSnackbar({
                open: true,
                message: error.message || "Failed to delete student",
                severity: "error",
                position: { vertical: "top", horizontal: "center" },
            });
        }
    };

    const handleSelectAll = () => {
        if (selectAll) {
            setSelectedStudents([]);
        } else {
            setSelectedStudents(students.map(student => student.id));
        }
        setSelectAll(!selectAll);
    };

    const handleSelectStudent = (id: number) => {
        if (selectedStudents.includes(id)) {
            setSelectedStudents(selectedStudents.filter(selectedId => selectedId !== id));
        } else {
            setSelectedStudents([...selectedStudents, id]);
        }
    };

    const filteredStudents = students.filter(student =>
        student?.name?.toLowerCase()?.includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-gray-200 p-8 pt-5 relative">
            <ListControls
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                viewMode={viewMode}
                setViewMode={setViewMode}
                itemCount={students.length}
            />

            {loading ? (
                <div className="rounded-lg p-8 text-center">
                    <p className="text-xl font-semibold">Loading students...</p>
                </div>
            ) : error ? (
                <div className="rounded-lg p-8 text-center">
                    <p className="text-xl font-semibold text-red-500">{error}</p>
                </div>
            ) : students.length === 0 ? (
                <div className="rounded-lg p-8 text-center">
                    <p className="text-xl font-semibold mb-4">No students found.</p>
                    <p className="text-gray-600">Click the "+" button to create a new student.</p>
                </div>
            ) : filteredStudents.length === 0 ? (
                <div className="rounded-lg p-8 text-center">
                    <p className="text-lg font-semibold">No students match your search criteria.</p>
                </div>
            ) : viewMode === 'grid' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {filteredStudents.map((student) => (
                        <div
                            key={student.id}
                            className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer transform transition duration-300 hover:scale-105 hover:shadow-xl"
                            onClick={() => handleOpenModal(student)}
                        >
                            <div className="p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center space-x-3">
                                        <div className="bg-[#308369] rounded-full p-2">
                                            <UserCircle2 size={24} className="text-white" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-900">{student.name}</h3>
                                            <span className="text-sm text-gray-500">
                                                ID: {student.idCardNumber}
                                            </span>
                                        </div>
                                    </div>
                                    <Checkbox
                                        checked={selectedStudents.includes(student.id)}
                                        onChange={() => handleSelectStudent(student.id)}
                                        onClick={(e) => e.stopPropagation()}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <div className="flex items-center text-gray-600">
                                        <Mail size={16} className="mr-2" />
                                        <span className="text-sm truncate">{student.email}</span>
                                    </div>
                                    <div className="flex items-center text-gray-600">
                                        <Phone size={16} className="mr-2" />
                                        <span className="text-sm">{student.phone}</span>
                                    </div>
                                </div>

                                <div className="mt-4 pt-4 border-t border-gray-200">
                                    <div className="flex items-center justify-between">
                                        <span className="px-3 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                                            Class {student.classID}
                                        </span>
                                        <IconButton
                                            aria-label="delete"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDelete(student.id);
                                            }}
                                            size="small"
                                        >
                                            <Trash2 size={16} className="text-red-500" />
                                        </IconButton>
                                    </div>
                                </div>
                            </div>
                        </div>
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
                                <th className="text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-2/12">ID Number</th>
                                <th className="text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-2/12">Class</th>
                                <th className="text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-2/12">Contact</th>
                                <th className="text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-1/12">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredStudents.map((student, index) => (
                                <tr key={student.id} className="cursor-pointer" onClick={() => handleOpenModal(student)}>
                                    <td className="text-center">
                                        <Checkbox
                                            checked={selectedStudents.includes(student.id)}
                                            onChange={() => handleSelectStudent(student.id)}
                                            onClick={(e) => e.stopPropagation()}
                                        />
                                    </td>
                                    <td className="text-center" onClick={() => handleOpenModal(student)}>
                                        <div className="text-sm font-medium text-gray-900">{index + 1}</div>
                                    </td>
                                    <td className="text-center" onClick={() => handleOpenModal(student)}>
                                        <div className="text-sm font-medium text-gray-900">{student.name}</div>
                                    </td>
                                    <td className="text-center" onClick={() => handleOpenModal(student)}>
                                        <div className="text-sm font-medium text-gray-900">{student.idCardNumber}</div>
                                    </td>
                                    <td className="text-center" onClick={() => handleOpenModal(student)}>
                                        <div className="text-sm font-medium text-gray-900">Class {student.classID}</div>
                                    </td>
                                    <td className="text-center" onClick={() => handleOpenModal(student)}>
                                        <div className="text-sm font-medium text-gray-900">{student.phone}</div>
                                    </td>
                                    <td className="text-center">
                                        <IconButton
                                            aria-label="delete"
                                            onClick={() => handleDelete(student.id)}
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
                        Create New Student
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
                    width: '90%',
                    maxWidth: 1000,
                    height: '90%',
                    maxHeight: 900,
                    bgcolor: 'background.paper',
                    boxShadow: 24,
                    p: 4,
                    borderRadius: 2,
                    overflow: 'auto',
                }}>
                    <CreateStudents
                        initialData={editingStudent}
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

export default ListStudents;
