// src/pages/Standards/ListStandards.tsx
import React, { useState } from 'react';
import { Checkbox, Modal, Box, IconButton } from "@mui/material";
import { PlusCircle, Trash2 } from "lucide-react";
import ListControls from '../../components/ListControls';
import CreateStandard from './CreateStandards';

interface Standard {
    id: number;
    name: string;
}

const ListStandards: React.FC = () => {
    const [openModal, setOpenModal] = useState<boolean>(false);
    const [editingStandard, setEditingStandard] = useState<Standard | null>(null);
    const [standards, setStandards] = useState<Standard[]>([
        { id: 1, name: "First Standard" },
        { id: 2, name: "Second Standard" },
    ]);

    const [selectedStandards, setSelectedStandards] = useState<number[]>([]);
    const [selectAll, setSelectAll] = useState<boolean>(false);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [viewMode, setViewMode] = useState<string>('list');

    const handleOpenModal = (standard: Standard | null) => {
        setEditingStandard(standard);
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setEditingStandard(null);
        setOpenModal(false);
    };

    const handleSave = (name: string) => {
        if (editingStandard) {
            setStandards(standards.map(standard =>
                standard.id === editingStandard.id ? { ...standard, name } : standard
            ));
        } else {
            setStandards([...standards, { id: standards.length + 1, name }]);
        }
        handleCloseModal();
    };

    const handleDelete = (id: number) => {
        setStandards(standards.filter(standard => standard.id !== id));
    };

    const handleSelectAll = () => {
        if (selectAll) {
            setSelectedStandards([]);
        } else {
            setSelectedStandards(standards.map(standard => standard.id));
        }
        setSelectAll(!selectAll);
    };

    const handleSelectStandard = (id: number) => {
        if (selectedStandards.includes(id)) {
            setSelectedStandards(selectedStandards.filter(selectedId => selectedId !== id));
        } else {
            setSelectedStandards([...selectedStandards, id]);
        }
    };

    return (
        <div className="min-h-screen bg-gray-200 p-8 relative">
            <ListControls
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                viewMode={viewMode}
                setViewMode={setViewMode}
                itemCount={standards.length}
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
                            <th className="text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-1/12">SL No</th>
                            <th className="text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-8/12">Standard Name</th>
                            <th className="text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-2/12">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {standards.map((standard, index) => (
                            <tr key={standard.id} className="cursor-pointer">
                                <td className="text-center">
                                    <Checkbox
                                        checked={selectedStandards.includes(standard.id)}
                                        onChange={() => handleSelectStandard(standard.id)}
                                        onClick={(e) => e.stopPropagation()}
                                    />
                                </td>
                                <td className="text-center">
                                    <div className="text-sm font-medium text-gray-900">{index + 1}</div>
                                </td>
                                <td className="text-center" onClick={() => handleOpenModal(standard)}>
                                    <div className="text-sm font-medium text-gray-900">{standard.name}</div>
                                </td>
                                <td className="text-center">
                                    <IconButton
                                        aria-label="delete"
                                        onClick={() => handleDelete(standard.id)}
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
                        Create New Standard
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
                    width: 400,
                    bgcolor: 'background.paper',
                    boxShadow: 24,
                    p: 4,
                    borderRadius: 2,
                }}>
                    <CreateStandard
                        initialData={editingStandard}
                        onSave={handleSave}
                        onCancel={handleCloseModal}
                    />
                </Box>
            </Modal>
        </div>
    );
};

export default ListStandards;   