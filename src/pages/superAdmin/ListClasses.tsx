import React, { useState } from 'react';
import { Checkbox, Modal, Box, IconButton } from "@mui/material";
import { PlusCircle, Trash2 } from "lucide-react";
import ListControls from '../../components/ListControls';
import CreateClass from './CreateClass';
import { Class } from '../../types/Types';

const
    ListClasses: React.FC = () => {
        const [openModal, setOpenModal] = useState<boolean>(false);
        const [editingClass, setEditingClass] = useState<Class | null>(null);
        const [classes, setClasses] = useState<Class[]>([
            {
                id: 1, name: "Class 1A", section: "A", mediumId: 1, standardId: 1, classStaffId: 1, group_id: 1, syllabusId: 1
            },
            {
                id: 2, name: "Class 2B", section: "B", mediumId: 2, standardId: 2, classStaffId: 2, group_id: 2, syllabusId: 2
            },
        ]);

        const [selectedClasses, setSelectedClasses] = useState<number[]>([]);
        const [selectAll, setSelectAll] = useState<boolean>(false);
        const [searchTerm, setSearchTerm] = useState<string>('');
        const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');

        const handleOpenModal = (classData: Class | null) => {
            setEditingClass(classData);
            setOpenModal(true);
        };

        const handleCloseModal = () => {
            setEditingClass(null);
            setOpenModal(false);
        };

        const handleSave = (updatedClass: Class) => {
            if (editingClass) {
                setClasses(classes.map(c =>
                    c.id === editingClass.id ? { ...c, ...updatedClass } : c
                ));
            } else {
                setClasses([...classes, { ...updatedClass, id: classes.length + 1 }]);
            }
            handleCloseModal();
        };

        const handleDelete = (id: number) => {
            setClasses(classes.filter(c => c.id !== id));
        };

        const handleSelectAll = () => {
            if (selectAll) {
                setSelectedClasses([]);
            } else {
                setSelectedClasses(classes.map(c => c.id));
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

        return (
            <div className="min-h-screen bg-gray-200 p-8 relative">
                <ListControls
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    viewMode={viewMode}
                    setViewMode={setViewMode}
                    itemCount={classes.length}
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
                                <th className="text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-2/12">Name</th>
                                <th className="text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-2/12">Section</th>
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
                                            checked={selectedClasses.includes(classData.id)}
                                            onChange={() => handleSelectClass(classData.id)}
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
                                        <div className="text-sm font-medium text-gray-900">{classData.section}</div>
                                    </td>
                                    <td className="text-center" onClick={() => handleOpenModal(classData)}>
                                        <div className="text-sm font-medium text-gray-900">{classData.mediumId}</div>
                                    </td>
                                    <td className="text-center" onClick={() => handleOpenModal(classData)}>
                                        <div className="text-sm font-medium text-gray-900">{classData.standardId}</div>
                                    </td>
                                    <td className="text-center">
                                        <IconButton
                                            aria-label="delete"
                                            onClick={() => handleDelete(classData.id)}
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
            </div>
        );
    };

export default ListClasses;
