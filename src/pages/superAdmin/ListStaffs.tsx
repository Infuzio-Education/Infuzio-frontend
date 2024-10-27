import React, { useEffect, useState } from 'react';
import { Checkbox, Modal, Box, IconButton, Avatar } from "@mui/material";
import { PlusCircle, Trash2 } from "lucide-react";
import ListControls from '../../components/ListControls';
import CreateStaffs from './CreateStaffs';
import { Staff } from '../../types/Types';
import { listStaff } from '../../api/superAdmin';



const ListStaffs: React.FC = () => {
    const [openModal, setOpenModal] = useState<boolean>(false);
    const [editingStaff, setEditingStaff] = useState<Staff | null>(null);
    const [staffs, setStaffs] = useState<Staff[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchStaffList = async () => {
        try {
            setLoading(true);
            const response = await listStaff("MKKDY");
            if (response.status && response.resp_code === "SUCCESS") {
                setStaffs(response.data);
            } else {
                setError("Failed to fetch staff data");
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

    const [selectedStaffs, setSelectedStaffs] = useState<number[]>([]);
    const [selectAll, setSelectAll] = useState<boolean>(false);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');

    const handleOpenModal = (staff: Staff | null) => {
        setEditingStaff(staff);
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setEditingStaff(null);
        setOpenModal(false);
    };

    const handleSave = async () => {
        await fetchStaffList(); // Refresh the list after save
        handleCloseModal();
    };

    const handleDelete = (id: number) => {
        setStaffs(staffs.filter(staff => staff.ID !== id));
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

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    }

    if (error) {
        return <div className="min-h-screen flex items-center justify-center text-red-500">{error}</div>;
    }

    return (
        <div className="min-h-screen bg-gray-200 p-8 relative">
            <ListControls
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                viewMode={viewMode}
                setViewMode={setViewMode}
                itemCount={staffs.length}
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
                            <th className="text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-1/12">Sl.No</th>
                            <th className="text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-1/12">Image</th>
                            <th className="text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-2/12">Name</th>
                            <th className="text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-2/12">Role</th>
                            <th className="text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-2/12">Subjects</th>
                            <th className="text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-2/12">Email</th>
                            <th className="text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-2/12">Mobile</th>
                            <th className="text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-1/12">Actions</th>
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
                                    <Avatar
                                        src={staff.profile_pic_link}
                                        sx={{ width: 40, height: 40, margin: 'auto' }}
                                    />
                                </td>
                                <td className="text-center" onClick={() => handleOpenModal(staff)}>
                                    <div className="text-sm font-medium text-gray-900">{staff.name}</div>
                                </td>
                                <td className="text-center" onClick={() => handleOpenModal(staff)}>
                                    <div className="text-sm font-medium text-gray-900">
                                        {staff.is_teaching_staff ? 'Teaching Staff' : 'Non-Teaching Staff'}
                                    </div>
                                </td>
                                <td className="text-center" onClick={() => handleOpenModal(staff)}>
                                    <div className="text-sm font-medium text-gray-900">
                                        {Array.isArray(staff.subjects) ? staff.subjects.join(', ') : ''}
                                    </div>
                                </td>
                                <td className="text-center" onClick={() => handleOpenModal(staff)}>
                                    <div className="text-sm font-medium text-gray-900">{staff.email}</div>
                                </td>
                                <td className="text-center" onClick={() => handleOpenModal(staff)}>
                                    <div className="text-sm font-medium text-gray-900">{staff.mobile}</div>
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
                        schoolPrefix='MKKDY'
                    />
                </Box>
            </Modal>
        </div>
    );
};

export default ListStaffs;