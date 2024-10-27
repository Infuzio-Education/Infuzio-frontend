import React, { useState, useEffect } from 'react';
import { Checkbox, Modal, Box, IconButton } from "@mui/material";
import { PlusCircle, Trash2 } from "lucide-react";
import CreateSection from './CreateSection';
import { Section } from '../../types/Types';
import ListControls from '../../components/ListControls';
import { createSections, getSections } from '../../api/superAdmin';
import SnackbarComponent from '../../components/SnackbarComponent';

const ListSections: React.FC = () => {
    const [openModal, setOpenModal] = useState<boolean>(false);
    const [editingSection, setEditingSection] = useState<Section | null>(null);
    const [sections, setSections] = useState<Section[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const [selectedSections, setSelectedSections] = useState<number[]>([]);
    const [selectAll, setSelectAll] = useState<boolean>(false);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success' as 'success' | 'error',
        position: { vertical: 'top' as const, horizontal: 'center' as const }
    });

    useEffect(() => {
        fetchSections();
    }, []);

    const fetchSections = async () => {
        try {
            setLoading(true);
            const response = await getSections();
            console.log('responseSections:',response);
            
            if (response.status && response.resp_code === 'SUCCESS' && Array.isArray(response.data)) {
                setSections(response.data);
                setError(null);
            } else {
                throw new Error('Invalid response structure');
            }
        } catch (err) {
            setError('Failed to fetch sections. Please try again later.');
            console.error('Error fetching sections:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleCloseSnackbar = () => {
        setSnackbar(prev => ({ ...prev, open: false }));
    };

    const handleOpenModal = (section: Section | null) => {
        setEditingSection(section);
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setEditingSection(null);
        setOpenModal(false);
    };

    const handleSave = async (sectionData: { sectionName: string, sectionCode: string }) => {
        try {
            const response = await createSections(sectionData);
            console.log(response);
            if (response.status && response.resp_code === 'SUCCESS') {
                const newSection: Section = {
                    ID: Date.now(),
                    Name: sectionData.sectionName,
                    SectionCode: sectionData.sectionCode
                };
                setSections((prevSections) => [...prevSections, newSection]);
                setSnackbar({
                    open: true,
                    message: 'Section created successfully!',
                    severity: 'success',
                    position: { vertical: 'top', horizontal: 'center' }
                });
            } else {
                throw new Error(response.data);
            }
        } catch (error: any) {
            console.error('Error creating section:', error);
            setSnackbar({
                open: true,
                message: 'Failed to create section. Please try again.',
                severity: 'error',
                position: { vertical: 'top', horizontal: 'center' }
            });
        }
        handleCloseModal();
    };

    const handleDelete = (id: number) => {
        setSections(sections.filter(section => section.ID !== id));
    };

    const handleSelectAll = () => {
        if (selectAll) {
            setSelectedSections([]);
        } else {
            setSelectedSections(sections.map(section => section.ID));
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

    if (loading) {
        return <div className="min-h-screen bg-gray-200 p-8 flex items-center justify-center">Loading...</div>;
    }

    if (error) {
        return <div className="min-h-screen bg-gray-200 p-8 flex items-center justify-center text-red-500">{error}</div>;
    }

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
                            <th className="text-center w-1/12">
                                <Checkbox
                                    checked={selectAll}
                                    onChange={handleSelectAll}
                                />
                            </th>
                            <th className="text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-1/12">Sl. No.</th>
                            <th className="text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-3/12">Section Name</th>
                            <th className="text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-2/12">Section Code</th>
                            <th className="text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-1/12">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {sections.map((section, index) => (
                            <tr key={section.ID} className="cursor-pointer">
                                <td className="text-center">
                                    <Checkbox
                                        checked={selectedSections.includes(section.ID)}
                                        onChange={() => handleSelectSection(section.ID)}
                                        onClick={(e) => e.stopPropagation()}
                                    />
                                </td>
                                <td className="text-center" onClick={() => handleOpenModal(section)}>
                                    <div className="text-sm font-medium text-gray-900">{index + 1}</div>
                                </td>
                                <td className="text-center" onClick={() => handleOpenModal(section)}>
                                    <div className="text-sm font-medium text-gray-900">{section.Name}</div>
                                </td>
                                <td className="text-center" onClick={() => handleOpenModal(section)}>
                                    <div className="text-sm font-medium text-gray-900">{section.SectionCode}</div>
                                </td>
                                <td className="text-center">
                                    <IconButton
                                        aria-label="delete"
                                        onClick={() => handleDelete(section.ID)}
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
                    width: 400,
                    bgcolor: 'background.paper',
                    boxShadow: 24,
                    p: 1,
                    borderRadius: 2,
                }}>
                    <CreateSection
                        initialData={editingSection}
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

export default ListSections;