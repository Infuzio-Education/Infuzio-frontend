import React, { useState, useEffect } from 'react';
import { Checkbox, Modal, Box, IconButton } from "@mui/material";
import { PlusCircle, Trash2, Mail, Phone, UserCircle2 } from "lucide-react";
import ListControls from '../../components/ListControls';
import CreateStaffs from './CreateStaffs';
import { Staff } from '../../types/Types';
import { listStaff, deleteStaff } from '../../api/superAdmin';
import SnackbarComponent from '../../components/SnackbarComponent';
import { useSchoolContext } from '../../contexts/SchoolContext';

const ListStaffs: React.FC = () => {
    const [openModal, setOpenModal] = useState<boolean>(false);
    const [editingStaff, setEditingStaff] = useState<Staff | null>(null);
    const [staffs, setStaffs] = useState<Staff[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedStaffs, setSelectedStaffs] = useState<number[]>([]);
    const [selectAll, setSelectAll] = useState<boolean>(false);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success' as 'success' | 'error',
        position: { vertical: 'top' as const, horizontal: 'center' as const }
    });

    const { schoolInfo } = useSchoolContext();

    const fetchStaffList = async () => {
        setLoading(true);
        setError(null);
        try {
            if (!schoolInfo.schoolPrefix) {
                throw new Error("School prefix not found");
            }
            const response = await listStaff(schoolInfo.schoolPrefix);
            if (response.status && response.resp_code === "SUCCESS") {
                setStaffs(response.data);
            } else {
                throw new Error("Failed to fetch staff data");
            }
        } catch (err: any) {
            setError(err.response?.data?.message || 'An error occurred while fetching staff data');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStaffList();
    }, []);

    const handleCloseSnackbar = () => {
        setSnackbar(prev => ({ ...prev, open: false }));
    };

    const handleOpenModal = (staff: Staff | null) => {
        setEditingStaff(staff);
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setEditingStaff(null);
        setOpenModal(false);
    };

    const handleSave = async (_staffData: Staff) => {
        try {
            await fetchStaffList(); // Refresh the list after save
            setSnackbar({
                open: true,
                message: editingStaff ? "Staff updated successfully!" : "Staff created successfully!",
                severity: "success",
                position: { vertical: "top", horizontal: "center" },
            });
            handleCloseModal();
        } catch (error: any) {
            setSnackbar({
                open: true,
                message: error.message || "Failed to save staff",
                severity: "error",
                position: { vertical: "top", horizontal: "center" },
            });
        }
    };

    const handleDelete = async (id: number) => {
        try {
            const response = await deleteStaff(id, schoolInfo.schoolPrefix || '');
            if (response.status === true) {
                setStaffs(staffs.filter(staff => staff.ID !== id));
                setSelectedStaffs(selectedStaffs.filter(staffId => staffId !== id));
                setSnackbar({
                    open: true,
                    message: 'Staff deleted successfully!',
                    severity: 'success',
                    position: { vertical: 'top', horizontal: 'center' }
                });
            } else {
                throw new Error(response.message || 'Failed to delete staff');
            }
        } catch (error: any) {
            console.error('Error deleting staff:', error);

            if (error.response?.status === 409 && error.response?.data?.resp_code === 'RECORD_IN_USE') {
                setSnackbar({
                    open: true,
                    message: 'Cannot delete staff as they are assigned to classes',
                    severity: 'error',
                    position: { vertical: 'top', horizontal: 'center' }
                });
            } else {
                setSnackbar({
                    open: true,
                    message: error.response?.data?.error || 'Failed to delete staff',
                    severity: 'error',
                    position: { vertical: 'top', horizontal: 'center' }
                });
            }
        }
    };

    const handleSelectAll = () => {
        if (selectAll) {
            setSelectedStaffs([]);
        } else {
            setSelectedStaffs(staffs.map(staff => staff.ID));
        }
        setSelectAll(!selectAll);
    };

    const handleSelectStaff = (id: number) => {
        if (selectedStaffs.includes(id)) {
            setSelectedStaffs(selectedStaffs.filter(selectedId => selectedId !== id));
        } else {
            setSelectedStaffs([...selectedStaffs, id]);
        }
    };

    const filteredStaffs = staffs.filter(staff =>
        staff.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-gray-200 p-8 pt-5 relative">
            <ListControls
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                viewMode={viewMode}
                setViewMode={setViewMode}
                itemCount={staffs.length}
            />

            {loading ? (
                <div className="rounded-lg p-8 text-center">
                    <p className="text-xl font-semibold">Loading staffs...</p>
                </div>
            ) : error ? (
                <div className="rounded-lg p-8 text-center">
                    <p className="text-xl font-semibold text-red-500">{error}</p>
                </div>
            ) : staffs.length === 0 ? (
                <div className="rounded-lg p-8 text-center">
                    <p className="text-xl font-semibold mb-4">No staffs found.</p>
                    <p className="text-gray-600">Click the "+" button to create a new staff.</p>
                </div>
            ) : filteredStaffs.length === 0 ? (
                <div className="rounded-lg p-8 text-center">
                    <p className="text-lg font-semibold">No staffs match your search criteria.</p>
                </div>
            ) : viewMode === 'grid' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {filteredStaffs.map((staff) => (
                        <div
                            key={staff.ID}
                            className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer transform transition duration-300 hover:scale-105 hover:shadow-xl"
                            onClick={() => handleOpenModal(staff)}
                        >
                            <div className="p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center space-x-3">
                                        <div className="bg-[#308369] rounded-full p-2">
                                            <UserCircle2 size={24} className="text-white" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-900">{staff.name}</h3>
                                            <span className="text-sm text-gray-500">
                                                {staff.id_card_number}
                                            </span>
                                        </div>
                                    </div>
                                    <Checkbox
                                        checked={selectedStaffs.includes(staff.ID)}
                                        onChange={() => handleSelectStaff(staff.ID)}
                                        onClick={(e) => e.stopPropagation()}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <div className="flex items-center text-gray-600">
                                        <Mail size={16} className="mr-2" />
                                        <span className="text-sm truncate">{staff.email}</span>
                                    </div>
                                    <div className="flex items-center text-gray-600">
                                        <Phone size={16} className="mr-2" />
                                        <span className="text-sm">{staff.mobile}</span>
                                    </div>
                                </div>

                                <div className="mt-4 pt-4 border-t border-gray-200">
                                    <div className="flex items-center justify-between">
                                        <span className={`px-3 py-1 rounded-full text-xs ${staff.is_teaching_staff
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-blue-100 text-blue-800'
                                            }`}>
                                            {staff.is_teaching_staff ? 'Teaching Staff' : 'Non-Teaching Staff'}
                                        </span>
                                        <IconButton
                                            aria-label="delete"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDelete(staff.ID);
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
                                <th className="text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-2/12">Role</th>
                                <th className="text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-2/12">Email</th>
                                <th className="text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-2/12">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {staffs.map((staff, index) => (
                                <tr key={staff.ID} className="cursor-pointer">
                                    <td className="text-center">
                                        <Checkbox
                                            checked={selectedStaffs.includes(staff.ID)}
                                            onChange={() => handleSelectStaff(staff.ID)}
                                            onClick={(e) => e.stopPropagation()}
                                        />
                                    </td>
                                    <td className="text-center" onClick={() => handleOpenModal(staff)}>
                                        <div className="text-sm font-medium text-gray-900">{index + 1}</div>
                                    </td>
                                    <td className="text-center" onClick={() => handleOpenModal(staff)}>
                                        <div className="text-sm font-medium text-gray-900">{staff.name}</div>
                                    </td>
                                    <td className="text-center" onClick={() => handleOpenModal(staff)}>
                                        <div className="text-sm font-medium text-gray-900">{staff.is_teaching_staff ? "Teaching" : "Non-Teaching"}</div>
                                    </td>
                                    <td className="text-center" onClick={() => handleOpenModal(staff)}>
                                        <div className="text-sm font-medium text-gray-900">{staff.email}</div>
                                    </td>
                                    <td className="text-center">
                                        <IconButton
                                            aria-label="delete"
                                            onClick={() => handleDelete(staff.ID)}
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
                        Create New Staff
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
                    width: 1000,
                    maxWidth: '90%',
                    height: 900,
                    maxHeight: '90%',
                    bgcolor: 'background.paper',
                    boxShadow: 24,
                    p: 4,
                    borderRadius: 2,
                }}>
                    <CreateStaffs
                        initialData={editingStaff}
                        onSave={handleSave}
                        onCancel={handleCloseModal}
                        schoolPrefix={schoolInfo.schoolPrefix || ''}
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

export default ListStaffs;