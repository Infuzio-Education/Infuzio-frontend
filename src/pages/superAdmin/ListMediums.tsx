import React, { useEffect, useState } from 'react';
import { Checkbox, Modal, Box, IconButton } from "@mui/material";
import { PlusCircle, Trash2 } from "lucide-react";
import Togglebar from '../../components/Togglebar';
import CreateMedium from './CreateMedium';
import { getMediums, createMediums, updateMediums, deleteMedium } from '../../api/superAdmin';
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
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
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
            if (editingMedium) {
                const response = await updateMediums(editingMedium.ID, name);
                if (response.status && response.resp_code === "SUCCESS") {
                    setMediums(prevMediums =>
                        prevMediums.map(medium =>
                            medium.ID === editingMedium.ID ? { ...medium, Name: name } : medium
                        )
                    );
                    setSnackbar({
                        open: true,
                        message: "Medium updated successfully!",
                        severity: "success",
                        position: { vertical: "top", horizontal: "center" },
                    });
                } else {
                    throw new Error(response.data || "Failed to update medium");
                }
            } else {
                const response = await createMediums(name);
                if (response.status && response.resp_code === "CREATED") {
                    await fetchMediums();
                    setSnackbar({
                        open: true,
                        message: "Medium created successfully!",
                        severity: "success",
                        position: { vertical: "top", horizontal: "center" },
                    });
                } else {
                    throw new Error(response.data || "Failed to create medium");
                }
            }
        } catch (error: any) {
            console.error("Error saving medium:", error);
            setSnackbar({
                open: true,
                message: error.response?.data?.error || "Failed to save medium. Please try again.",
                severity: "error",
                position: { vertical: "top", horizontal: "center" },
            });
        }
        handleCloseModal();
    };

    const handleDelete = async (id: number) => {
        console.log('id', id);
        try {
            const response = await deleteMedium(id);
            if (response.status === true) {
                setMediums(mediums.filter(medium => medium.ID !== id));
                setSelectedMediums(selectedMediums.filter(mediumId => mediumId !== id));
                setSnackbar({
                    open: true,
                    message: 'Medium deleted successfully!',
                    severity: 'success',
                    position: { vertical: 'top', horizontal: 'center' }
                });
            } else {
                throw new Error(response.message || 'Failed to delete medium');
            }
        } catch (error: any) {
            console.error('Error deleting medium:', error);

            if (error.response?.status === 409 && error.response?.data?.resp_code === 'RECORD_IN_USE') {
                setSnackbar({
                    open: true,
                    message: 'Cannot delete medium as it is being used by other records',
                    severity: 'error',
                    position: { vertical: 'top', horizontal: 'center' }
                });
            } else {
                setSnackbar({
                    open: true,
                    message: error.response?.data?.error || 'Failed to delete medium',
                    severity: 'error',
                    position: { vertical: 'top', horizontal: 'center' }
                });
            }
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
            <Togglebar
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                viewMode={viewMode}
                setViewMode={setViewMode}
                itemCount={mediums.length}
            />

            {loading ? (
                <div className="rounded-lg p-8 text-center">
                    <p className="text-xl font-semibold">Loading mediums...</p>
                </div>
            ) : error ? (
                <div className=" rounded-lg p-8 text-center">
                    <p className="text-xl font-semibold text-red-500">{error}</p>
                </div>
            ) : mediums.length === 0 ? (
                <div className="rounded-lg p-8 text-center">
                    <p className="text-xl font-semibold mb-4">No mediums found.</p>
                    <p className="text-gray-600">Click the "+" button to create a new medium.</p>
                </div>
            ) : filteredMediums.length === 0 ? (
                <div className="rounded-lg p-8 text-center">
                    <p className="text-lg font-semibold">No mediums match your search criteria.</p>
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
                    p: 3,
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
