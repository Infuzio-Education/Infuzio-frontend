import React, { useState, useEffect } from 'react';
import { Checkbox, Modal, Box, IconButton } from "@mui/material";
import { PlusCircle, Trash2 } from "lucide-react";
import CreateSection from './CreateSection';
import { Section } from '../../types/Types';
import ListControls from '../../components/ListControls';
import { createSections, getSections, updateSection } from '../../api/superAdmin';
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
        severity: 'success' as 'success' | 'error' | 'info',
        position: { vertical: 'top' as const, horizontal: 'center' as const }
    });

    useEffect(() => {
        fetchSections();
    }, []);

    const fetchSections = async () => {
        try {
            setLoading(true);
            const response = await getSections();
            console.log(response);

            if (response.status && response.resp_code === 'SUCCESS') {
                const sectionsData = Array.isArray(response.data)
                    ? response.data
                    : response.data?.sections || [];

                setSections(sectionsData);
                setError(null);
            } else {
                throw new Error(response.message || 'Failed to fetch sections');
            }
        } catch (err) {
            setError('Failed to fetch sections. Please try again later.');
            console.error('Error fetching sections:', err);
            setSnackbar({
                open: true,
                message: 'Failed to fetch sections. Create a new section to get started!',
                severity: 'error',
                position: { vertical: 'top', horizontal: 'center' }
            });
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
            if (editingSection) {
                const formattedData = {
                    sectionName: sectionData.sectionName,
                    sectionCode: sectionData.sectionCode
                };

                const response = await updateSection(editingSection.ID, formattedData);
                if (response.status && response.resp_code === 'SUCCESS') {
                    setSections(prevSections => prevSections.map(section =>
                        section.ID === editingSection.ID
                            ? {
                                ...section,
                                Name: sectionData.sectionName,
                                SectionCode: sectionData.sectionCode
                            }
                            : section
                    ));
                    setSnackbar({
                        open: true,
                        message: 'Section updated successfully!',
                        severity: 'success',
                        position: { vertical: 'top', horizontal: 'center' }
                    });
                    fetchSections();
                } else {
                    throw new Error(response.message || 'Failed to update section');
                }
            } else {
                const formattedData = {
                    sectionName: sectionData.sectionName,
                    sectionCode: sectionData.sectionCode
                };

                const response = await createSections(formattedData);
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
                    fetchSections();
                } else {
                    throw new Error(response.message || 'Failed to create section');
                }
            }
        } catch (error: any) {
            console.error('Error creating/updating section:', error);
            setSnackbar({
                open: true,
                message: error.message || 'Failed to create/update section. Please try again.',
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
    const filteredSections = sections.filter(section =>
        section.Name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        section.SectionCode.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-gray-200 p-8 pt-5 relative">
            <ListControls
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                viewMode={viewMode}
                setViewMode={setViewMode}
                itemCount={sections.length}
            />

            {loading ? (
                <div className="rounded-lg p-8 text-center">
                    <p className="text-xl font-semibold">Loading sections...</p>
                </div>
            ) : error ? (
                <div className="rounded-lg p-8 text-center">
                    <p className="text-xl font-semibold text-red-500">{error}</p>
                </div>
            ) : sections.length === 0 ? (
                <div className="rounded-lg p-8 text-center">
                    <p className="text-xl font-semibold mb-4">No sections found</p>
                    <p className="text-gray-600 mb-4">Click the "+" button below to create your first section</p>
                </div>
            ) : filteredSections.length === 0 ? (
                <div className="rounded-lg p-8 text-center">
                    <p className="text-lg font-semibold">No sections match your search criteria.</p>
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
            )}

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