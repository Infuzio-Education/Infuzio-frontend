import React, { useState } from 'react';
import { Checkbox, Modal, Box, IconButton } from "@mui/material";
import { PlusCircle, Trash2 } from "lucide-react";
import CreateSection from './CreateSection';
import { Section } from '../../types/Types';
import ListControls from '../../components/ListControls'; // Import the new component

const ListSections: React.FC = () => {
    const [openModal, setOpenModal] = useState<boolean>(false);
    const [editingSection, setEditingSection] = useState<Section | null>(null);
    const [sections, setSections] = useState<Section[]>([
        { id: 1, name: "Lower Primary", code: "LP", classes: ["1st", "2nd", "3rd", "4th"] },
        { id: 2, name: "Upper Primary", code: "UP", classes: ["5th", "6th", "7th", "8th"] },
    ]);

    const [selectedSections, setSelectedSections] = useState<number[]>([]);
    const [selectAll, setSelectAll] = useState<boolean>(false);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [viewMode, setViewMode] = useState<string>('list');

    const handleOpenModal = (section: Section | null) => {
        setEditingSection(section);
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setEditingSection(null);
        setOpenModal(false);
    };

    const handleSave = (updatedSection: Section) => {
        if (editingSection) {
            setSections(sections.map(section =>
                section.id === editingSection.id ? { ...section, ...updatedSection } : section
            ));
        } else {
            setSections([...sections, { ...updatedSection, id: sections.length + 1 }]);
        }
        handleCloseModal();
    };

    const handleDelete = (id: number) => {
        setSections(sections.filter(section => section.id !== id));
    };

    const handleSelectAll = () => {
        if (selectAll) {
            setSelectedSections([]);
        } else {
            setSelectedSections(sections.map(section => section.id));
        }
        setSelectAll(!selectAll);
    };

    const handleSelectSection = (id: number) => {
        if (selectedSections.includes(id)) {
            setSelectedSections(selectedSections.filter(selectedId => selectedId !== id));
        } else {
            setSelectedSections([...selectedSections, id]);
        }
    };

    return (
        <div className="min-h-screen bg-gray-200 p-8 relative">
            <ListControls
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                viewMode={viewMode}
                setViewMode={setViewMode}
                itemCount={sections.length}
            />
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <table className="w-full">
                    <thead>
                        <tr className="bg-gray-300">
                            <th className=" text-center w-1/12">
                                <Checkbox
                                    checked={selectAll}
                                    onChange={handleSelectAll}
                                />
                            </th>
                            <th className="text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-4/12">Section Name</th>
                            <th className="text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-2/12">Section Code</th>
                            <th className="text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-4/12">Classes</th>
                            <th className="text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-1/12">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {sections.map((section) => (
                            <tr key={section.id} className="cursor-pointer">
                                <td className=" text-center">
                                    <Checkbox
                                        checked={selectedSections.includes(section.id)}
                                        onChange={() => handleSelectSection(section.id)}
                                        onClick={(e) => e.stopPropagation()}
                                    />
                                </td>
                                <td className="text-center" onClick={() => handleOpenModal(section)}>
                                    <div className="text-sm font-medium text-gray-900">{section.name}</div>
                                </td>
                                <td className="text-center" onClick={() => handleOpenModal(section)}>
                                    <div className="text-sm font-medium text-gray-900">{section.code}</div>
                                </td>
                                <td className="text-center" onClick={() => handleOpenModal(section)}>
                                    <div className="text-sm font-medium text-gray-900">{section.classes.join(", ")}</div>
                                </td>
                                <td className="text-center">
                                    <IconButton
                                        aria-label="delete"
                                        onClick={() => handleDelete(section.id)}
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
                        Create New Section
                    </span>
                </button>
            </div>
            <Modal
                open={openModal}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 600,
                    height: 600,
                    bgcolor: 'background.paper',
                    boxShadow: 24,
                    p: 4,
                }}>
                    <CreateSection
                        initialData={editingSection}
                        onSave={handleSave}
                        onCancel={handleCloseModal}
                    />
                </Box>
            </Modal>
        </div>
    );
};

export default ListSections;
