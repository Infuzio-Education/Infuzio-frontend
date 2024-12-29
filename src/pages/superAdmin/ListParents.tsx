import React, { useState, useEffect } from 'react';
import { Checkbox, Modal, Box, IconButton } from "@mui/material";
import { PlusCircle, Trash2, Mail, Phone, UserCircle2 } from "lucide-react";
import Togglebar from '../../components/Togglebar';
import CreateParent from './CreateParent';
import { useSchoolContext } from '../../contexts/SchoolContext';
import { listParents } from '../../api/superAdmin';
import SnackbarComponent from '../../components/SnackbarComponent';
// import { Parent } from '../../types/Types';

const ListParents: React.FC = () => {
    const [openModal, setOpenModal] = useState<boolean>(false);
    const [editingParent, setEditingParent] = useState<any>(null);
    const [parents, setParents] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedParents, setSelectedParents] = useState<number[]>([]);
    const [selectAll, setSelectAll] = useState<boolean>(false);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success' as 'success' | 'error',
        position: { vertical: 'top' as const, horizontal: 'center' as const }
    });

    const { schoolInfo } = useSchoolContext();

    const fetchParents = async () => {
        setLoading(true);
        setError(null);
        try {
            if (!schoolInfo.schoolPrefix) {
                throw new Error("School prefix not found");
            }
            const response = await listParents(schoolInfo.schoolPrefix);
            console.log(response);
            if (response.status && response.resp_code === "SUCCESS") {
                setParents(response.data.parents);
            } else {
                throw new Error("Failed to fetch parents");
            }
        } catch (err: any) {
            setError(err.response?.data?.message || 'An error occurred while fetching parents');
            setSnackbar({
                open: true,
                message: err.response?.data?.message || 'Failed to fetch parents',
                severity: 'error',
                position: { vertical: 'top', horizontal: 'center' },
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchParents();
    }, [schoolInfo.schoolPrefix]);

    const handleCloseSnackbar = () => {
        setSnackbar(prev => ({ ...prev, open: false }));
    };

    const handleOpenModal = (parent: any | null) => {
        setEditingParent(parent);
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setEditingParent(null);
        setOpenModal(false);
    };

    const handleSave = async () => {
        try {
            await fetchParents();
            setSnackbar({
                open: true,
                message: editingParent ? "Parent updated successfully!" : "Parent created successfully!",
                severity: "success",
                position: { vertical: "top", horizontal: "center" },
            });
            handleCloseModal();
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || error.message || "Failed to save parent";
            setSnackbar({
                open: true,
                message: errorMessage,
                severity: "error",
                position: { vertical: "top", horizontal: "center" },
            });
        }
    };

    const handleDelete = async (id: number) => {
        try {
            // Implement delete API call here
            setParents(parents.filter(parent => parent.id !== id));
            setSnackbar({
                open: true,
                message: "Parent deleted successfully!",
                severity: "success",
                position: { vertical: "top", horizontal: "center" },
            });
        } catch (error: any) {
            setSnackbar({
                open: true,
                message: error.message || "Failed to delete parent",
                severity: "error",
                position: { vertical: "top", horizontal: "center" },
            });
        }
    };

    const handleSelectAll = () => {
        if (selectAll) {
            setSelectedParents([]);
        } else {
            setSelectedParents(parents.map(parent => parent.id));
        }
        setSelectAll(!selectAll);
    };

    const handleSelectParent = (id: number) => {
        if (selectedParents.includes(id)) {
            setSelectedParents(selectedParents.filter(selectedId => selectedId !== id));
        } else {
            setSelectedParents([...selectedParents, id]);
        }
    };

    const filteredParents = parents.filter(parent =>
        parent.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-gray-200 p-8 pt-5 relative">
            <Togglebar
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                viewMode={viewMode}
                setViewMode={setViewMode}
                itemCount={parents.length}
            />

            {loading ? (
                <div className="rounded-lg p-8 text-center">
                    <p className="text-xl font-semibold">Loading parents...</p>
                </div>
            ) : error ? (
                <div className="rounded-lg p-8 text-center">
                    <p className="text-xl font-semibold text-red-500">{error}</p>
                </div>
            ) : parents.length === 0 ? (
                <div className="rounded-lg p-8 text-center">
                    <p className="text-xl font-semibold mb-4">No parents found.</p>
                    <p className="text-gray-600">Click the "+" button to create a new parent.</p>
                </div>
            ) : filteredParents.length === 0 ? (
                <div className="rounded-lg p-8 text-center">
                    <p className="text-lg font-semibold">No parents match your search criteria.</p>
                </div>
            ) : viewMode === 'grid' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {filteredParents.map((parent) => (
                        <div
                            key={parent.id}
                            className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer transform transition duration-300 hover:scale-105 hover:shadow-xl"
                            onClick={() => handleOpenModal(parent)}
                        >
                            <div className="p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center space-x-3">
                                        <div className="bg-[#308369] rounded-full p-2">
                                            <UserCircle2 size={24} className="text-white" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-900">{parent.name}</h3>
                                        </div>
                                    </div>
                                    <Checkbox
                                        checked={selectedParents.includes(parent.id)}
                                        onChange={() => handleSelectParent(parent.id)}
                                        onClick={(e) => e.stopPropagation()}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <div className="flex items-center text-gray-600">
                                        <Mail size={16} className="mr-2" />
                                        <span className="text-sm truncate">{parent.email}</span>
                                    </div>
                                    <div className="flex items-center text-gray-600">
                                        <Phone size={16} className="mr-2" />
                                        <span className="text-sm">{parent.phone}</span>
                                    </div>
                                </div>

                                <div className="mt-4 pt-4 border-t border-gray-200">
                                    <div className="flex items-center justify-end">
                                        <IconButton
                                            aria-label="delete"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDelete(parent.id);
                                            }}
                                            size="small"
                                        >
                                            <Trash2 size={16} className="text-red-500" />
                                        </IconButton>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
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
                                <th className="text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-1/12">Sl.No</th>
                                <th className="text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-2/12">Name</th>
                                <th className="text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-2/12">Email</th>
                                <th className="text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-2/12">Phone</th>
                                <th className="text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-1/12">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredParents.map((parent, index) => (
                                <tr key={parent.id} className="cursor-pointer">
                                    <td className="text-center">
                                        <Checkbox
                                            checked={selectedParents.includes(parent.id)}
                                            onChange={() => handleSelectParent(parent.id)}
                                            onClick={(e) => e.stopPropagation()}
                                        />
                                    </td>
                                    <td className="text-center" onClick={() => handleOpenModal(parent)}>
                                        <div className="text-sm font-medium text-gray-900">{index + 1}</div>
                                    </td>
                                    <td className="text-center" onClick={() => handleOpenModal(parent)}>
                                        <div className="text-sm font-medium text-gray-900">{parent.name}</div>
                                    </td>
                                    <td className="text-center" onClick={() => handleOpenModal(parent)}>
                                        <div className="text-sm font-medium text-gray-900">{parent.email}</div>
                                    </td>
                                    <td className="text-center" onClick={() => handleOpenModal(parent)}>
                                        <div className="text-sm font-medium text-gray-900">{parent.phone}</div>
                                    </td>
                                    <td className="text-center">
                                        <IconButton
                                            aria-label="delete"
                                            onClick={() => handleDelete(parent.id)}
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
                        Create New Parent
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
                    <CreateParent
                        initialData={editingParent}
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

export default ListParents;
