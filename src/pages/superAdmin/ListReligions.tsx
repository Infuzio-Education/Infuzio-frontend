import React, { useEffect, useState } from 'react';
import { Checkbox, Modal, Box, IconButton } from "@mui/material";
import { PlusCircle, Trash2 } from "lucide-react";
import ListControls from '../../components/ListControls';
import CreateReligion from './CreateReligion';
import SnackbarComponent from '../../components/SnackbarComponent';
import { Religion } from '../../types/Types';
import { createReligion, getReligions } from '../../api/superAdmin';

const ListReligions: React.FC = () => {
    const [openModal, setOpenModal] = useState<boolean>(false);
    const [editingReligion, setEditingReligion] = useState<Religion | null>(null);
    const [religions, setReligions] = useState<Religion[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedReligions, setSelectedReligions] = useState<number[]>([]);
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
        fetchReligions();
    }, []);

    const fetchReligions = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await getReligions();
            console.log("API response:", response);
            if (response.status === true) {
                const mappedReligions = response.data.map((item: any) => ({
                    id: item.ID,
                    name: item.Name
                }));
                setReligions(mappedReligions);
                console.log("REL", religions);

            } else {
                throw new Error('Failed to fetch religions');
            }
        } catch (error) {
            setError('Failed to load religions. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleCloseSnackbar = () => {
        setSnackbar(prev => ({ ...prev, open: false }));
    };

    const handleOpenModal = (religion: Religion | null) => {
        setEditingReligion(religion);
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setEditingReligion(null);
        setOpenModal(false);
    };

    const handleSave = async (name: string) => {
        try {
            const response = await createReligion(name);
            console.log(response);
            if (response.status === true) {
                const newReligion: Religion = {
                    id: Date.now(),
                    name: name,
                };
                setReligions((prevReligion) => [...prevReligion, newReligion]);
                setSnackbar({
                    open: true,
                    message: 'Religion created successfully!',
                    severity: 'success',
                    position: { vertical: 'top', horizontal: 'center' }
                });
            } else {
                throw new Error(response.data);
            }
        } catch (error: any) {
            console.error('Error creating religion:', error);
        }
        handleCloseModal();
    };

    const handleDelete = async (id: number) => {
        try {
            setReligions(religions.filter(religion => religion.id !== id));
            setSnackbar({
                open: true,
                message: 'Religion deleted successfully!',
                severity: 'success',
                position: { vertical: 'top', horizontal: 'center' }
            });
        } catch (error: any) {
            setSnackbar({
                open: true,
                message: error.message || 'Failed to delete religion',
                severity: 'error',
                position: { vertical: 'top', horizontal: 'center' }
            });
        }
    };

    const handleSelectAll = () => {
        setSelectedReligions(selectAll ? [] : religions.map(r => r.id));
        setSelectAll(!selectAll);
    };

    const handleSelectReligion = (id: number) => {
        setSelectedReligions(prev =>
            prev.includes(id) ? prev.filter(selectedId => selectedId !== id) : [...prev, id]
        );
    };

    const filteredReligions = religions.filter(religion =>
        religion.name && religion.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    return (
        <div className="min-h-screen bg-gray-200 p-8 pt-5 relative">
            <ListControls
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                viewMode={viewMode}
                setViewMode={setViewMode}
                itemCount={filteredReligions.length}
            />

            {loading ? (
                <div>Loading religions...</div>
            ) : error ? (
                <div className="text-red-500">{error}</div>
            ) : filteredReligions.length > 0 ? (
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
                                <th className="text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-7/12">Religion Name</th>
                                <th className="text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-2/12">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredReligions.map((religion, index) => (
                                <tr key={religion.id} className="cursor-pointer">
                                    <td className="text-center">
                                        <Checkbox
                                            checked={selectedReligions.includes(religion.id)}
                                            onChange={() => handleSelectReligion(religion.id)}
                                            onClick={(e) => e.stopPropagation()}
                                        />
                                    </td>
                                    <td className="text-center" onClick={() => handleOpenModal(religion)}>
                                        <div className="text-sm font-medium text-gray-900">{index + 1}</div>
                                    </td>
                                    <td className="text-center" onClick={() => handleOpenModal(religion)}>
                                        <div className="text-sm font-medium text-gray-900">{religion.name}</div>
                                    </td>
                                    <td className="text-center">
                                        <IconButton
                                            aria-label="delete"
                                            onClick={() => handleDelete(religion.id)}
                                        >
                                            <Trash2 size={20} className="text-red-500" />
                                        </IconButton>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div>No religions available</div>
            )}

            <div className="fixed bottom-10 right-16 flex items-center space-x-2">
                <button
                    className="bg-green-500 text-white p-2 rounded-full shadow-lg relative group hover:bg-green-600"
                    onClick={() => handleOpenModal(null)}
                >
                    <PlusCircle size={34} />
                    <span className="absolute left-[-140px] top-1/2 transform -translate-y-1/2 bg-white text-black text-sm py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow">
                        Create New Religion
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
                    p: 3,
                    borderRadius: 2,
                }}>
                    <CreateReligion
                        initialData={editingReligion ? { name: editingReligion.name } : undefined}
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

export default ListReligions;