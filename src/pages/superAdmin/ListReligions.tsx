import React, { useEffect, useState } from 'react';
import { Checkbox, Modal, Box, IconButton } from "@mui/material";
import { PlusCircle, Trash2 } from "lucide-react";
import Togglebar from '../../components/Togglebar';
import CreateReligion from './CreateReligion';
import SnackbarComponent from '../../components/SnackbarComponent';
import { Religion } from '../../types/Types';
import { createReligion, getReligions, updateReligion, deleteReligion } from '../../api/superAdmin';
import { useSelector } from 'react-redux';

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

    const { staffInfo } = useSelector((state: any) => state.staffInfo);
    const hasSchoolAdminPrivilege = staffInfo?.specialPrivileges?.some(
        (privilege: any) => privilege.privilege === "schoolAdmin"
    );

    useEffect(() => {
        fetchReligions();
    }, []);

    const fetchReligions = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await getReligions(
                hasSchoolAdminPrivilege ? staffInfo?.schoolCode : undefined
            );
            if (response.status === true) {
                setReligions(response.data);
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
            if (editingReligion) {
                const response = await updateReligion(
                    editingReligion.ID,
                    name,
                    hasSchoolAdminPrivilege ? staffInfo?.schoolCode : undefined
                );
                if (response.status === true) {
                    setReligions(prevReligions => prevReligions.map(religion =>
                        religion.ID === editingReligion.ID ? { ...religion, Name: name } : religion
                    ));
                    setSnackbar({
                        open: true,
                        message: 'Religion updated successfully!',
                        severity: 'success',
                        position: { vertical: 'top', horizontal: 'center' }
                    });
                } else {
                    throw new Error(response.data);
                }
            } else {
                const response = await createReligion(
                    name,
                    hasSchoolAdminPrivilege ? staffInfo?.schoolCode : undefined
                );
                if (response.status === true) {
                    await fetchReligions();
                    setSnackbar({
                        open: true,
                        message: 'Religion created successfully!',
                        severity: 'success',
                        position: { vertical: 'top', horizontal: 'center' }
                    });
                } else {
                    throw new Error(response.data);
                }
            }
        } catch (error: any) {
            console.error('Error creating/updating religion:', error);
            setSnackbar({
                open: true,
                message: error.response?.data?.error || 'Failed to create/update religion',
                severity: 'error',
                position: { vertical: 'top', horizontal: 'center' }
            });
        }
        handleCloseModal();
    };

    const handleDelete = async (id: number) => {
        try {
            const response = await deleteReligion(
                id,
                hasSchoolAdminPrivilege ? staffInfo?.schoolCode : undefined
            );
            if (response.status === true) {
                setReligions(religions.filter(religion => religion.ID !== id));
                setSelectedReligions(selectedReligions.filter(religionId => religionId !== id));
                setSnackbar({
                    open: true,
                    message: 'Religion deleted successfully!',
                    severity: 'success',
                    position: { vertical: 'top', horizontal: 'center' }
                });
            } else {
                throw new Error(response.message || 'Failed to delete religion');
            }
        } catch (error: any) {
            console.error('Error deleting religion:', error);

            if (error.response?.status === 409 && error.response?.data?.resp_code === 'RECORD_IN_USE') {
                setSnackbar({
                    open: true,
                    message: 'Cannot delete religion as it is being used by other records',
                    severity: 'error',
                    position: { vertical: 'top', horizontal: 'center' }
                });
            } else {
                setSnackbar({
                    open: true,
                    message: error.response?.data?.error || 'Failed to delete religion',
                    severity: 'error',
                    position: { vertical: 'top', horizontal: 'center' }
                });
            }
        }
    };

    const handleSelectAll = () => {
        setSelectedReligions(selectAll ? [] : religions.map(r => r.ID));
        setSelectAll(!selectAll);
    };

    const handleSelectReligion = (id: number) => {
        setSelectedReligions(prev =>
            prev.includes(id) ? prev.filter(selectedId => selectedId !== id) : [...prev, id]
        );
    };

    const filteredReligions = religions.filter(religion =>
        religion.Name && religion.Name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-gray-200 p-8 pt-5 relative">
            <Togglebar
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                viewMode={viewMode}
                setViewMode={setViewMode}
                itemCount={religions.length}
            />

            {loading ? (
                <div className="rounded-lg p-8 text-center">
                    <p className="text-xl font-semibold">Loading religions...</p>
                </div>
            ) : error ? (
                <div className="rounded-lg p-8 text-center">
                    <p className="text-xl font-semibold text-red-500">{error}</p>
                </div>
            ) : religions.length === 0 ? (
                <div className=" rounded-lg p-8 text-center">
                    <p className="text-xl font-semibold mb-4">No religions found.</p>
                    <p className="text-gray-600">Click the "+" button to create a new religion.</p>
                </div>
            ) : filteredReligions.length === 0 ? (
                <div className=" rounded-lg p-8 text-center">
                    <p className="text-lg font-semibold">No religions match your search criteria.</p>
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
                                <th className="text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-7/12">Religion Name</th>
                                <th className="text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-2/12">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredReligions.map((religion, index) => (
                                <tr key={religion.ID} className="cursor-pointer">
                                    <td className="text-center">
                                        <Checkbox
                                            checked={selectedReligions.includes(religion.ID)}
                                            onChange={() => handleSelectReligion(religion.ID)}
                                            onClick={(e) => e.stopPropagation()}
                                        />
                                    </td>
                                    <td className="text-center" onClick={() => handleOpenModal(religion)}>
                                        <div className="text-sm font-medium text-gray-900">{index + 1}</div>
                                    </td>
                                    <td className="text-center" onClick={() => handleOpenModal(religion)}>
                                        <div className="text-sm font-medium text-gray-900">{religion.Name}</div>
                                    </td>
                                    <td className="text-center">
                                        <IconButton
                                            aria-label="delete"
                                            onClick={() => handleDelete(religion.ID)}
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
                        initialData={editingReligion ? { name: editingReligion.Name } : undefined}
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
