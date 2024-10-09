import React, { useState } from 'react';
import { Checkbox, Modal, Box, IconButton } from "@mui/material";
import { PlusCircle, Trash2 } from "lucide-react";
import ListControls from '../../components/ListControls';
import CreateSubject from './CreateSubject';
import { Subject } from '../../types/Types';

const ListSubjects: React.FC = () => {
    const [openModal, setOpenModal] = useState<boolean>(false);
    const [editingSubject, setEditingSubject] = useState<Subject | null>(null);
    const [subjects, setSubjects] = useState<Subject[]>([
        { id: 1, name: "Mathematics", code: "MATH", minMarks: 35, maxMarks: 100 },
        { id: 2, name: "Science", code: "SCI", minMarks: 35, maxMarks: 100 },
    ]);

    const [selectedSubjects, setSelectedSubjects] = useState<number[]>([]);
    const [selectAll, setSelectAll] = useState<boolean>(false);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [viewMode, setViewMode] = useState<string>('list');

    const handleOpenModal = (subject: Subject | null) => {
        setEditingSubject(subject);
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setEditingSubject(null);
        setOpenModal(false);
    };

    const handleSave = (updatedSubject: Subject) => {
        if (editingSubject) {
            setSubjects(subjects.map(subject =>
                subject.id === editingSubject.id ? { ...subject, ...updatedSubject } : subject
            ));
        } else {
            setSubjects([...subjects, { ...updatedSubject, id: subjects.length + 1 }]);
        }
        handleCloseModal();
    };

    const handleDelete = (id: number) => {
        setSubjects(subjects.filter(subject => subject.id !== id));
    };

    const handleSelectAll = () => {
        if (selectAll) {
            setSelectedSubjects([]);
        } else {
            setSelectedSubjects(subjects.map(subject => subject.id));
        }
        setSelectAll(!selectAll);
    };

    const handleSelectSubject = (id: number) => {
        if (selectedSubjects.includes(id)) {
            setSelectedSubjects(selectedSubjects.filter(selectedId => selectedId !== id));
        } else {
            setSelectedSubjects([...selectedSubjects, id]);
        }
    };

    return (
        <div className="min-h-screen bg-gray-200 p-8 relative">
            <ListControls
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                viewMode={viewMode}
                setViewMode={setViewMode}
                itemCount={subjects.length}
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
                            <th className="text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-3/12">Subject Name</th>
                            <th className="text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-2/12">Subject Code</th>
                            <th className="text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-2/12">Min Marks</th>
                            <th className="text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-2/12">Max Marks</th>
                            <th className="text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-2/12">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {subjects.map((subject) => (
                            <tr key={subject.id} className="cursor-pointer">
                                <td className="text-center">
                                    <Checkbox
                                        checked={selectedSubjects.includes(subject.id)}
                                        onChange={() => handleSelectSubject(subject.id)}
                                        onClick={(e) => e.stopPropagation()}
                                    />
                                </td>
                                <td className="text-center" onClick={() => handleOpenModal(subject)}>
                                    <div className="text-sm font-medium text-gray-900">{subject.name}</div>
                                </td>
                                <td className="text-center" onClick={() => handleOpenModal(subject)}>
                                    <div className="text-sm font-medium text-gray-900">{subject.code}</div>
                                </td>
                                <td className="text-center" onClick={() => handleOpenModal(subject)}>
                                    <div className="text-sm font-medium text-gray-900">{subject.minMarks}</div>
                                </td>
                                <td className="text-center" onClick={() => handleOpenModal(subject)}>
                                    <div className="text-sm font-medium text-gray-900">{subject.maxMarks}</div>
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
<<<<<<< HEAD
                    width: 400,
=======
                    width: 1000, // Increased the width to 600px
                    maxWidth: '90%', // Ensures modal doesn't exceed 90% of viewport width
                    height: 900, // Added height for more space
                    maxHeight: '90%', // Ensures modal doesn't exceed 90% of viewport height
>>>>>>> super-admin
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
        </div>
    );
};

export default ListSubjects;