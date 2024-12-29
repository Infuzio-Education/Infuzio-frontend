import React, { useState, useEffect } from "react";
import { Modal, Box, IconButton, Checkbox } from "@mui/material";
import { PlusCircle, Trash2 } from "lucide-react";
import Togglebar from "../../components/Togglebar";
import SnackbarComponent from "../../components/SnackbarComponent";
import { getWorkingDays, createWorkingDays, updateWorkingDays, deleteWorkingDays } from "../../api/superAdmin";
import CreateWorkingDays from "./CreateWorkingDays";
import { WorkingDay } from "../../types/Types";

const ListWorkingDays: React.FC = () => {
    const [openModal, setOpenModal] = useState<boolean>(false);
    const [workingDayGroups, setWorkingDayGroups] = useState<WorkingDay[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
    const [selectedGroups, setSelectedGroups] = useState<number[]>([]);
    const [selectAll, setSelectAll] = useState<boolean>(false);
    const [editingGroup, setEditingGroup] = useState<WorkingDay | null>(null);
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: "",
        severity: "success" as "success" | "error",
        position: { vertical: "top" as const, horizontal: "center" as const },
    });

    useEffect(() => {
        fetchWorkingDays();
    }, []);

    const fetchWorkingDays = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await getWorkingDays();
            if (response.status === true && response.resp_code === "SUCCESS") {
                setWorkingDayGroups(response.data);
            } else {
                throw new Error("Failed to fetch working days");
            }
        } catch (err) {
            setError("Failed to load working days. Please try again.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (group: WorkingDay | null) => {
        setEditingGroup(group);
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setEditingGroup(null);
        setOpenModal(false);
    };

    const handleSave = async (data: { group_name: string; days: number[] }) => {
        try {
            if (editingGroup) {
                const response = await updateWorkingDays(editingGroup.id, data);
                if (response.status === true) {
                    await fetchWorkingDays();
                    setSnackbar({
                        open: true,
                        message: "Working days updated successfully!",
                        severity: "success",
                        position: { vertical: "top", horizontal: "center" },
                    });
                }
            } else {
                const response = await createWorkingDays(data);
                if (response.status === true) {
                    await fetchWorkingDays();
                    setSnackbar({
                        open: true,
                        message: "Working days created successfully!",
                        severity: "success",
                        position: { vertical: "top", horizontal: "center" },
                    });
                }
            }
            handleCloseModal();
        } catch (error: any) {
            setSnackbar({
                open: true,
                message: error.response?.data?.error || "Failed to save working days",
                severity: "error",
                position: { vertical: "top", horizontal: "center" },
            });
        }
    };

    const handleDelete = async (id: number) => {
        try {
            const response = await deleteWorkingDays(id);
            if (response.status === true) {
                setWorkingDayGroups(prev => prev.filter(group => group.id !== id));
                setSelectedGroups(prev => prev.filter(groupId => groupId !== id));
                setSnackbar({
                    open: true,
                    message: "Working days deleted successfully!",
                    severity: "success",
                    position: { vertical: "top", horizontal: "center" },
                });
            }
        } catch (error: any) {
            if (error.response?.status === 409 && error.response?.data?.resp_code === 'RECORD_IN_USE') {
                setSnackbar({
                    open: true,
                    message: 'Cannot delete working days as it is being used by other records',
                    severity: 'error',
                    position: { vertical: "top", horizontal: "center" },
                });
            } else {
                setSnackbar({
                    open: true,
                    message: error.response?.data?.error || "Failed to delete working days",
                    severity: "error",
                    position: { vertical: "top", horizontal: "center" },
                });
            }
        }
    };

    const handleSelectAll = () => {
        setSelectedGroups(selectAll ? [] : workingDayGroups.map(group => group.id));
        setSelectAll(!selectAll);
    };

    const handleSelectGroup = (id: number) => {
        setSelectedGroups(prev =>
            prev.includes(id) ? prev.filter(selectedId => selectedId !== id) : [...prev, id]
        );
    };

    const getDayNames = (days: number[]): string => {
        const dayMap: { [key: number]: string } = {
            1: 'Mon', 2: 'Tue', 3: 'Wed', 4: 'Thu',
            5: 'Fri', 6: 'Sat', 7: 'Sun', 8: '2nd Sat'
        };
        return days.map(day => dayMap[day]).join(', ');
    };

    const filteredGroups = workingDayGroups.filter(group =>
        group.group_name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-gray-200 p-8 pt-5 relative">
            <Togglebar
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                viewMode={viewMode}
                setViewMode={setViewMode}
                itemCount={workingDayGroups.length}
            />

            {loading ? (
                <div className="rounded-lg p-8 text-center">
                    <p className="text-xl font-semibold">Loading working days...</p>
                </div>
            ) : error ? (
                <div className="rounded-lg p-8 text-center">
                    <p className="text-xl font-semibold text-red-500">{error}</p>
                </div>
            ) : workingDayGroups.length === 0 ? (
                <div className="rounded-lg p-8 text-center">
                    <p className="text-xl font-semibold mb-4">No working days found.</p>
                    <p className="text-gray-600">Click the "+" button to create new working days.</p>
                </div>
            ) : filteredGroups.length === 0 ? (
                <div className="rounded-lg p-8 text-center">
                    <p className="text-lg font-semibold">No working days match your search criteria.</p>
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
                                <th className="text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-1/12">
                                    Sl.No
                                </th>
                                <th className="text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-4/12">
                                    Group Name
                                </th>
                                <th className="text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-4/12">
                                    Working Days
                                </th>
                                <th className="text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-2/12">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredGroups.map((group, index) => (
                                <tr key={group.id} className="cursor-pointer">
                                    <td className="text-center">
                                        <Checkbox
                                            checked={selectedGroups.includes(group.id)}
                                            onChange={() => handleSelectGroup(group.id)}
                                            onClick={(e) => e.stopPropagation()}
                                        />
                                    </td>
                                    <td className="text-center" onClick={() => handleOpenModal(group)}>
                                        <div className="text-sm font-medium text-gray-900">{index + 1}</div>
                                    </td>
                                    <td className="text-center" onClick={() => handleOpenModal(group)}>
                                        <div className="text-sm font-medium text-gray-900">{group.group_name}</div>
                                    </td>
                                    <td className="text-center" onClick={() => handleOpenModal(group)}>
                                        <div className="text-sm text-gray-500">{getDayNames(group.days)}</div>
                                    </td>
                                    <td className="text-center">
                                        <IconButton
                                            aria-label="delete"
                                            onClick={() => handleDelete(group.id)}
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

            <div className="fixed bottom-10 right-16">
                <button
                    className="bg-green-500 text-white p-2 rounded-full shadow-lg relative group hover:bg-green-600"
                    onClick={() => handleOpenModal(null)}
                >
                    <PlusCircle size={34} />
                    <span className="absolute left-[-140px] top-1/2 transform -translate-y-1/2 bg-white text-black text-sm py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow">
                        Create Working Days
                    </span>
                </button>
            </div>

            <Modal open={openModal} onClose={handleCloseModal}>
                <Box sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 1000,
                    maxWidth: '90%',
                    height: 900,
                    maxHeight: '90vh',
                    bgcolor: 'background.paper',
                    boxShadow: 24,
                    p: 4,
                    borderRadius: 2,
                    overflow: 'auto'
                }}>
                    <CreateWorkingDays
                        initialData={editingGroup}
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
                onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
            />
        </div>
    );
};

export default ListWorkingDays; 