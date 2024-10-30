import React, { useState, useEffect } from 'react';
import { Checkbox, Modal, Box, IconButton } from "@mui/material";
import { PlusCircle, Trash2 } from "lucide-react";
import ListControls from '../../components/ListControls';
import CreateSyllabus from './CreateSyllubus';
import { Syllabus } from '../../types/Types';
import { getSyllabus, createSyllabus } from '../../api/superAdmin';
import SnackbarComponent from '../../components/SnackbarComponent';

const ListSyllabus: React.FC = () => {
    const [openModal, setOpenModal] = useState<boolean>(false);
    const [editingIndex, setEditingIndex] = useState<number | null>(null);
    const [syllabuses, setSyllabuses] = useState<Syllabus[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedSyllabuses, setSelectedSyllabuses] = useState<number[]>([]);
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
        fetchSyllabuses();
    }, []);

    const fetchSyllabuses = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await getSyllabus();
            setSyllabuses(response);
        } catch (err) {
            setError('Failed to load syllabuses. Please try again.');
            setSyllabuses([]);
        } finally {
            setLoading(false);
        }
    };

    const handleCloseSnackbar = () => {
        setSnackbar(prev => ({ ...prev, open: false }));
    };

    const handleOpenModal = (index: number | null) => {
        setEditingIndex(index);
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setEditingIndex(null);
        setOpenModal(false);
    };

    const handleSave = async (syllabus: Syllabus) => {
        try {
            const response = await createSyllabus(syllabus.Name);
            if (response.status === 200 || response.status === 201) {
                const newSyllabus: Syllabus = { ID: response.data.id, Name: syllabus.Name };
                setSyllabuses([...syllabuses, newSyllabus]);
                setSnackbar({
                    open: true,
                    message: 'Syllabus created successfully!',
                    severity: 'success',
                    position: { vertical: 'top', horizontal: 'center' }
                });
            } else {
                throw new Error(response.data.error || 'Failed to create syllabus');
            }
        } catch (error: any) {
            setSnackbar({
                open: true,
                message: error.message || 'Failed to create syllabus',
                severity: 'error',
                position: { vertical: 'top', horizontal: 'center' }
            });
        }
        handleCloseModal();
    };

    const handleSelectAll = () => {
        setSelectedSyllabuses(selectAll ? [] : syllabuses.map(s => s.ID));
        setSelectAll(!selectAll);
    };

    const handleSelectSyllabus = (id: number) => {
        setSelectedSyllabuses(prev =>
            prev.includes(id) ? prev.filter(selectedId => selectedId !== id) : [...prev, id]
        );
    };

    const filteredSyllabuses = Array.isArray(syllabuses)
        ? syllabuses.filter(syllabus =>
            syllabus?.Name?.toLowerCase().includes(searchTerm.toLowerCase())
        )
        : [];

    return (
        <div className="min-h-screen bg-gray-200 p-8 pt-5 relative">
            <ListControls
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                viewMode={viewMode}
                setViewMode={setViewMode}
                itemCount={filteredSyllabuses.length}
            />

            {loading ? (
                <div className="rounded-lg p-8 text-center">
                    <p className="text-xl font-semibold">Loading syllabuses...</p>
                </div>
            ) : error ? (
                <div className="rounded-lg p-8 text-center">
                    <p className="text-xl font-semibold text-red-500">{error}</p>
                </div>
            ) : syllabuses.length === 0 ? (
                <div className="rounded-lg p-8 text-center">
                    <p className="text-xl font-semibold mb-4">No syllabuses found.</p>
                    <p className="text-gray-600">Click the "+" button to create a new syllabus.</p>
                </div>
            ) : filteredSyllabuses.length === 0 ? (
                <div className="rounded-lg p-8 text-center">
                    <p className="text-lg font-semibold">No syllabuses match your search criteria.</p>
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
                                <th className="text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-2/12">Sl.No</th>
                                <th className="text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-7/12">Syllabus Name</th>
                                <th className="text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-2/12">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredSyllabuses.map((syllabus, index) => (
                                <tr key={syllabus.ID} className="cursor-pointer">
                                    <td className="text-center">
                                        <Checkbox
                                            checked={selectedSyllabuses.includes(syllabus.ID)}
                                            onChange={() => handleSelectSyllabus(syllabus.ID)}
                                            onClick={(e) => e.stopPropagation()}
                                        />
                                    </td>
                                    <td className="text-center" onClick={() => handleOpenModal(index)}>
                                        <div className="text-sm font-medium text-gray-900">{index + 1}</div>
                                    </td>
                                    <td className="text-center" onClick={() => handleOpenModal(index)}>
                                        <div className="text-sm font-medium text-gray-900">{syllabus.Name}</div>
                                    </td>
                                    <td className="text-center">
                                        <IconButton
                                            aria-label="delete"
                                        // onClick={() => handleDelete(syllabus.ID)}
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
                        Create New Syllabus
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
                    <CreateSyllabus
                        initialData={editingIndex !== null ? syllabuses[editingIndex] : null}
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

export default ListSyllabus;