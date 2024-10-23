import React, { useState } from 'react';
import { Checkbox, Modal, Box, IconButton, Avatar } from "@mui/material";
import { PlusCircle, Trash2 } from "lucide-react";
import ListControls from '../../components/ListControls';
import CreateStudents from './CreateStudents';
import { Student } from '../../types/Types';

const ListStudents: React.FC = () => {
    const [openModal, setOpenModal] = useState<boolean>(false);
    const [editingStudent, setEditingStudent] = useState<Student | null>(null);
    const [students, setStudents] = useState<Student[]>([
        {
            id: 1,
            name: "John Doe",
            rollNumber: "001",
            classId: 1,
            dateOfBirth: "2005-05-15",
            gender: "Male",
            address: {
                line1: "123 Main St",
                city: "Anytown",
                state: "State",
                pinCode: "12345",
                country: "Country"
            },
            guardianName: "Jane Doe",
            guardianPhone: "1234567890",
            guardianEmail: "jane@example.com",
            imageUrl: ""
        },
        {
            id: 2,
            name: "Jane Smith",
            rollNumber: "002",
            classId: 1,
            dateOfBirth: "2005-08-20",
            gender: "Female",
            address: {
                line1: "456 Elm St",
                city: "Othertown",
                state: "State",
                pinCode: "67890",
                country: "Country"
            },
            guardianName: "John Smith",
            guardianPhone: "9876543210",
            guardianEmail: "john@example.com",
            imageUrl: ""
        },
    ]);

    const [selectedStudents, setSelectedStudents] = useState<number[]>([]);
    const [selectAll, setSelectAll] = useState<boolean>(false);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');

    const handleOpenModal = (student: Student | null) => {
        setEditingStudent(student);
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setEditingStudent(null);
        setOpenModal(false);
    };

    const handleSave = (updatedStudent: Student) => {
        if (editingStudent) {
            setStudents(students.map(student =>
                student.id === editingStudent.id ? { ...student, ...updatedStudent } : student
            ));
        } else {
            setStudents([...students, { ...updatedStudent, id: students.length + 1 }]);
        }
        handleCloseModal();
    };

    const handleDelete = (id: number) => {
        setStudents(students.filter(student => student.id !== id));
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

    return (
        <div className="min-h-screen bg-gray-200 p-8 relative">
            <ListControls
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                viewMode={viewMode}
                setViewMode={setViewMode}
                itemCount={students.length}
            />
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
                            <th className="text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-1/12">Image</th>
                            <th className="text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-2/12">Name</th>
                            <th className="text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-1/12">Roll No</th>
                            <th className="text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-2/12">Class</th>
                            <th className="text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-2/12">Guardian</th>
                            <th className="text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-2/12">Contact</th>
                            <th className="text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-1/12">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {students.map((student, index) => (
                            <tr key={student.id} className="cursor-pointer">
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
                                    <Avatar
                                        src={student.imageUrl}
                                        sx={{ width: 40, height: 40, margin: 'auto' }}
                                    />
                                </td>
                                <td className="text-center" onClick={() => handleOpenModal(student)}>
                                    <div className="text-sm font-medium text-gray-900">{student.name}</div>
                                </td>
                                <td className="text-center" onClick={() => handleOpenModal(student)}>
                                    <div className="text-sm font-medium text-gray-900">{student.rollNumber}</div>
                                </td>
                                <td className="text-center" onClick={() => handleOpenModal(student)}>
                                    <div className="text-sm font-medium text-gray-900">Class {student.classId}</div>
                                </td>
                                <td className="text-center" onClick={() => handleOpenModal(student)}>
                                    <div className="text-sm font-medium text-gray-900">{student.guardianName}</div>
                                </td>
                                <td className="text-center" onClick={() => handleOpenModal(student)}>
                                    <div className="text-sm font-medium text-gray-900">{student.guardianPhone}</div>
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
                    height: '90%', // Adjusted to 90% of viewport height
                    maxHeight: 900,
                    bgcolor: 'background.paper',
                    boxShadow: 24,
                    p: 4,
                    borderRadius: 2,
                    overflow: 'auto', // Add scrolling if content exceeds the height
                }}>
                    <CreateStudents
                        initialData={editingStudent}
                        onSave={handleSave}
                        onCancel={handleCloseModal}
                    />
                </Box>
            </Modal>
        </div>
    );
};

export default ListStudents;
