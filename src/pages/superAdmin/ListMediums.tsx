// src/pages/Mediums/ListMediums.tsx
import React, { useEffect, useState } from 'react';
import { Checkbox, Modal, Box, IconButton } from "@mui/material";
import { PlusCircle, Trash2 } from "lucide-react";
import ListControls from '../../components/ListControls';
import CreateMedium from './CreateMediums';
import { getMediums } from '../../api/superAdmin';

interface Medium {
    ID: number;
    Name: string;
}

const ListMediums: React.FC = () => {
    const [openModal, setOpenModal] = useState<boolean>(false);
    const [editingMedium, setEditingMedium] = useState<Medium | null>(null);
    const [mediums, setMediums] = useState<Medium[]>([
        { ID: 1, Name: "English Medium" },
        { ID: 2, Name: "Malayalam Medium" },
        { ID: 3, Name: "Hindi Medium" },
    ]);

    useEffect(()=>{
        fetchMediums();
    },[])

    const fetchMediums = async () => {
        try {
            const response = await getMediums();
            console.log(response);
            
            if (response.status === true && Array.isArray(response.data)) {
                setMediums(prevMediums => {
                    // Create a map of existing mediums by ID
                    const mediumMap = new Map(
                        prevMediums.map(medium => [medium.ID, medium])
                    );
                    
                    // Update or add new mediums
                    response.data.forEach((apiMedium: Medium) => {
                        mediumMap.set(apiMedium.ID, apiMedium);
                    });
                    
                    // Convert map back to array
                    return Array.from(mediumMap.values());
                });
            }
        } catch (error) {
            console.error("Error fetching mediums:", error);
        }
    };

    const [selectedMediums, setSelectedMediums] = useState<number[]>([]);
    const [selectAll, setSelectAll] = useState<boolean>(false);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [viewMode, setViewMode] = useState<string>('list');

    const handleOpenModal = (medium: Medium | null) => {
        setEditingMedium(medium);
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setEditingMedium(null);
        setOpenModal(false);
    };

    const handleSave = (name: string) => {
        if (editingMedium) {
            setMediums(mediums.map(medium =>
                medium.ID === editingMedium.ID ? { ...medium, name } : medium
            ));
        } else {
            setMediums([...mediums, { ID: mediums.length + 1, Name:name }]);
        }
        handleCloseModal();
    };

    const handleDelete = (id: number) => {
        setMediums(mediums.filter(medium => medium.ID !== id));
    };

    const handleSelectAll = () => {
        if (selectAll) {
            setSelectedMediums([]);
        } else {
            setSelectedMediums(mediums.map(medium => medium.ID));
        }
        setSelectAll(!selectAll);
    };

    const handleSelectMedium = (id: number) => {
        if (selectedMediums.includes(id)) {
            setSelectedMediums(selectedMediums.filter(selectedId => selectedId !== id));
        } else {
            setSelectedMediums([...selectedMediums, id]);
        }
    };

    return (
        <div className="min-h-screen bg-gray-200 p-8 relative">
            <ListControls
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                viewMode={viewMode}
                setViewMode={setViewMode}
                itemCount={mediums.length}
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
                            <th className="text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-8/12">Medium Name</th>
                            <th className="text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-2/12">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {mediums.map((medium, index) => (
                            <tr key={medium.ID} className="cursor-pointer">
                                <td className="text-center">
                                    <Checkbox
                                        checked={selectedMediums.includes(medium.ID)}
                                        onChange={() => handleSelectMedium(medium.ID)}
                                        onClick={(e) => e.stopPropagation()}
                                    />
                                </td>
                                <td className="text-center">
                                    <div className="text-sm font-medium text-gray-900">{index + 1}</div>
                                </td>
                                <td className="text-center" onClick={() => handleOpenModal(medium)}>
                                    <div className="text-sm font-medium text-gray-900">{medium.Name}</div>
                                </td>
                                <td className="text-center">
                                    <IconButton
                                        aria-label="delete"
                                        onClick={() => handleDelete(medium.ID)}
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
                        Create New Medium
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
                    <CreateMedium
                        initialData={editingMedium}
                        onSave={handleSave}
                        onCancel={handleCloseModal}
                    />
                </Box>
            </Modal>
        </div>
    );
};

export default ListMediums;