import React, { useEffect, useState } from 'react';
import { Checkbox, Modal, Box, IconButton } from "@mui/material";
import { PlusCircle, Trash2 } from "lucide-react";
import ListControls from '../../components/ListControls';
import SnackbarComponent from '../../components/SnackbarComponent';
import { Caste } from '../../types/Types';
import { createCaste, getCastes, updateCaste, deleteCaste } from '../../api/superAdmin';
import CreateCaste from './CreateCaste';

const ListCastes: React.FC = () => {
    const [openModal, setOpenModal] = useState<boolean>(false);
    const [editingCaste, setEditingCaste] = useState<Caste | null>(null);
    const [castes, setCastes] = useState<Caste[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedCastes, setSelectedCastes] = useState<number[]>([]);
    const [selectAll, setSelectAll] = useState<boolean>(false);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success' as 'success' | 'error',
        position: { vertical: 'top' as const, horizontal: 'center' as const }
    });

    console.log("castes", castes);

    useEffect(() => {
        fetchCastes();
    }, []);


    const fetchCastes = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await getCastes();
            if (response.status === true) {
                const mappedCastes = response.data.map((item: any) => ({
                    ID: item.ID,
                    Name: item.Name,
                    ReligionID: item.ReligionID
                }));
                setCastes(mappedCastes);
            } else {
                throw new Error('Failed to fetch castes');
            }
        } catch (error) {
            setError('Failed to load castes. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleCloseSnackbar = () => {
        setSnackbar(prev => ({ ...prev, open: false }));
    };

    const handleOpenModal = (caste: Caste | null) => {
        setEditingCaste(caste);
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setEditingCaste(null);
        setOpenModal(false);
    };

    const handleSave = async (name: string, religion_id: number) => {
        try {
            if (editingCaste) {
                const response = await updateCaste(editingCaste.ID, name, religion_id);
                if (response.status === true) {
                    setCastes(prevCastes => prevCastes.map(caste =>
                        caste.ID === editingCaste.ID
                            ? { ...caste, Name: name, ReligionID: religion_id }
                            : caste
                    ));
                    setSnackbar({
                        open: true,
                        message: 'Caste updated successfully!',
                        severity: 'success',
                        position: { vertical: 'top', horizontal: 'center' }
                    });
                } else {
                    throw new Error(response.data);
                }
            } else {
                const response = await createCaste({ Name: name, ReligionID: religion_id });
                console.log('Create caste response:', response);

                if (response.status === true) {
                    await fetchCastes();

                    setSnackbar({
                        open: true,
                        message: 'Caste created successfully!',
                        severity: 'success',
                        position: { vertical: 'top', horizontal: 'center' }
                    });
                } else {
                    throw new Error(response.data);
                }
            }
        } catch (error: any) {
            console.error('Error creating/updating caste:', error);
            setSnackbar({
                open: true,
                message: error.message || 'Failed to create/update caste',
                severity: 'error',
                position: { vertical: 'top', horizontal: 'center' }
            });
        }
        handleCloseModal();
    };

    const handleDelete = async (id: number) => {
        try {
            const response = await deleteCaste(id);
            if (response.status === true) {
                setCastes(castes.filter(caste => caste.ID !== id));
                setSnackbar({
                    open: true,
                    message: 'Caste deleted successfully!',
                    severity: 'success',
                    position: { vertical: 'top', horizontal: 'center' }
                });
            } else {
                throw new Error(response.message || 'Failed to delete caste');
            }
        } catch (error: any) {
            console.error('Error deleting caste:', error);
            setSnackbar({
                open: true,
                message: error.message || 'Failed to delete caste',
                severity: 'error',
                position: { vertical: 'top', horizontal: 'center' }
            });
        }
    };

    const handleSelectAll = () => {
        setSelectedCastes(selectAll ? [] : castes.map(c => c.ID));
        setSelectAll(!selectAll);
    };

    const handleSelectCaste = (id: number) => {
        setSelectedCastes(prev =>
            prev.includes(id) ? prev.filter(selectedId => selectedId !== id) : [...prev, id]
        );
    };

    const filteredCastes = castes.filter(caste =>
        caste.Name && caste.Name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-gray-200 p-8 pt-5 relative">
            <ListControls
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                viewMode={viewMode}
                setViewMode={setViewMode}
                itemCount={castes.length}
            />

            {loading ? (
                <div className="rounded-lg p-8 text-center">
                    <p className="text-xl font-semibold">Loading castes...</p>

                </div>
            ) : error ? (
                <div className="rounded-lg p-8 text-center">
                    <p className="text-xl font-semibold text-red-500">{error}</p>
                </div>
            ) : castes.length === 0 ? (
                <div className="rounded-lg p-8 text-center">
                    <p className="text-xl font-semibold mb-4">No castes found.</p>
                    <p className="text-gray-600">Click the "+" button to create a new caste.</p>
                </div>
            ) : filteredCastes.length === 0 ? (
                <div className="rounded-lg p-8 text-center">
                    <p className="text-lg font-semibold">No castes match your search criteria.</p>
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
                                <th className="text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-7/12">Caste Name</th>
                                <th className="text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-2/12">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredCastes.map((caste, index) => (
                                <tr key={caste.ID} className="cursor-pointer">
                                    <td className="text-center">
                                        <Checkbox
                                            checked={selectedCastes.includes(caste.ID)}
                                            onChange={() => handleSelectCaste(caste.ID)}
                                            onClick={(e) => e.stopPropagation()}
                                        />
                                    </td>
                                    <td className="text-center" onClick={() => handleOpenModal(caste)}>
                                        <div className="text-sm font-medium text-gray-900">{index + 1}</div>
                                    </td>
                                    <td className="text-center" onClick={() => handleOpenModal(caste)}>
                                        <div className="text-sm font-medium text-gray-900">{caste.Name}</div>
                                    </td>
                                    <td className="text-center">
                                        <IconButton
                                            aria-label="delete"
                                            onClick={() => handleDelete(caste.ID)}
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
                        Create New Caste
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
                    <CreateCaste
                        initialData={editingCaste || undefined}
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

export default ListCastes;
