import React, { useEffect, useState } from 'react';
import { Checkbox, Modal, Box, IconButton } from "@mui/material";
import { PlusCircle, Trash2 } from "lucide-react";
import ListControls from '../../components/ListControls';
import CreateMedium from './CreateMediums';
import { getMediums, createMediums } from '../../api/superAdmin';
import SnackbarComponent from '../../components/SnackbarComponent';
import { Medium } from '../../types/Types';


const ListMediums: React.FC = () => {
    const [openModal, setOpenModal] = useState<boolean>(false);
    const [editingMedium, setEditingMedium] = useState<Medium | null>(null);
    const [mediums, setMediums] = useState<Medium[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedMediums, setSelectedMediums] = useState<number[]>([]);
    const [selectAll, setSelectAll] = useState<boolean>(false);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [viewMode, setViewMode] = useState<string>('list');
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success' as 'success' | 'error',
        position: { vertical: 'top' as const, horizontal: 'center' as const }
    });

    useEffect(() => {
        fetchMediums();
    }, []);

    const fetchMediums = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await getMediums();
            if (response.status === true && Array.isArray(response.data)) {
                setMediums(response.data);
            } else {
                throw new Error('Failed to fetch mediums');
            }
        } catch (error) {
            setError('Failed to load mediums. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleCloseSnackbar = () => {
        setSnackbar(prev => ({ ...prev, open: false }));
    };

    const handleOpenModal = (medium: Medium | null) => {
        setEditingMedium(medium);
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setEditingMedium(null);
        setOpenModal(false);
    };

    const handleSave = async (name: string) => {
        try {
            const response = await createMediums(name);
            if (response.status === true) {
                const newMedium: Medium = { ID: response.data.id, Name: name };
                setMediums([...mediums, newMedium]);
                setSnackbar({
                    open: true,
                    message: 'Medium created successfully!',
                    severity: 'success',
                    position: { vertical: 'top', horizontal: 'center' }
                });
            } else {
                throw new Error(response.data);
            }
        } catch (error: any) {
            setSnackbar({
                open: true,
                message: error.response.data.error || 'Failed to create medium',
                severity: 'error',
                position: { vertical: 'top', horizontal: 'center' }
            });
        }
        handleCloseModal();
    };

    const handleDelete = async (id: number) => {
        try {
            
                setMediums(mediums.filter(medium => medium.ID !== id));
                setSnackbar({
                    open: true,
                    message: 'Medium deleted successfully!',
                    severity: 'success',
                    position: { vertical: 'top', horizontal: 'center' }
                });
        } catch (error: any) {
            setSnackbar({
                open: true,
                message: error.message || 'Failed to delete medium',
                severity: 'error',
                position: { vertical: 'top', horizontal: 'center' }
            });
        }
    };

    const handleSelectAll = () => {
        setSelectedMediums(selectAll ? [] : mediums.map(m => m.ID));
        setSelectAll(!selectAll);
    };

    const handleSelectMedium = (id: number) => {
        setSelectedMediums(prev =>
            prev.includes(id) ? prev.filter(selectedId => selectedId !== id) : [...prev, id]
        );
    };

    const filteredMediums = mediums.filter(medium =>
        medium.Name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-gray-200 p-8 pt-5 relative">
            <ListControls
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                viewMode={viewMode}
                setViewMode={setViewMode}
                itemCount={filteredMediums.length}
            />

            {loading ? (
                <div>Loading mediums...</div>
            ) : error ? (
                <div className="text-red-500">{error}</div>
            ) : filteredMediums.length > 0 ? (
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
                                <th className="text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-7/12">Medium Name</th>
                                <th className="text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-2/12">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredMediums.map((medium, index) => (
                                <tr key={medium.ID} className="cursor-pointer">
                                    <td className="text-center">
                                        <Checkbox
                                            checked={selectedMediums.includes(medium.ID)}
                                            onChange={() => handleSelectMedium(medium.ID)}
                                            onClick={(e) => e.stopPropagation()}
                                        />
                                    </td>
                                    <td className="text-center" onClick={() => handleOpenModal(medium)}>
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
            ) : (
                <div>No mediums available</div>
            )}

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

export default ListMediums;