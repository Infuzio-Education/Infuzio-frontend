import React, { useState, useEffect } from "react";
import { Checkbox, IconButton } from "@mui/material";
import { Trash2 } from "lucide-react";
import Togglebar from "../../../components/Togglebar";
import { Staff } from "../../../types/Types";
import { getAllStaffsInSchool } from "../../../api/staffs";
import SnackbarComponent from "../../../components/SnackbarComponent";
import { useSchoolContext } from "../../../contexts/SchoolContext";
import GridView from "../../../components/GridView";

const AllStaffs: React.FC = () => {
    const [staffs, setStaffs] = useState<Staff[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedStaffs, setSelectedStaffs] = useState<number[]>([]);
    const [selectAll, setSelectAll] = useState<boolean>(false);
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: "",
        severity: "success" as "success" | "error",
        position: { vertical: "top" as const, horizontal: "center" as const },
    });

    const { schoolInfo } = useSchoolContext();

    const fetchStaffList = async () => {
        setLoading(true);
        setError(null);
        try {
            if (!schoolInfo.schoolPrefix) {
                throw new Error("School prefix not found");
            }
            const response = await getAllStaffsInSchool(
                schoolInfo.schoolPrefix
            );
            setStaffs(response || []);
        } catch (err: any) {
            setError(
                err.response?.data?.message ||
                    "An error occurred while fetching staff data"
            );
            setStaffs([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStaffList();
    }, [schoolInfo.schoolPrefix]);

    const handleCloseSnackbar = () => {
        setSnackbar((prev) => ({ ...prev, open: false }));
    };

    const handleSelectAll = () => {
        if (selectAll) {
            setSelectedStaffs([]);
        } else {
            setSelectedStaffs(
                staffs.map((staff) => staff.id).filter((id) => id !== undefined)
            );
        }
        setSelectAll(!selectAll);
    };

    const handleSelectStaff = (id: number) => {
        if (selectedStaffs.includes(id)) {
            setSelectedStaffs(
                selectedStaffs.filter((selectedId) => selectedId !== id)
            );
        } else {
            setSelectedStaffs([...selectedStaffs, id]);
        }
    };

    const filteredStaffs =
        staffs?.filter(
            (staff) =>
                staff?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                false
        ) || [];

    const getStaffContent = (staff: Staff) => ({
        title: staff.name,
        subtitle: staff.regNumber || undefined,
        email: staff.email,
        phone: staff.mobile,
        status: {
            label: staff.isTeachingStaff
                ? "Teaching Staff"
                : "Non-Teaching Staff",
            color: staff.isTeachingStaff
                ? "bg-green-100 text-green-800"
                : "bg-blue-100 text-blue-800",
        },
        avatar: {
            letter: staff.name.charAt(0).toUpperCase(),
        },
    });

    return (
        <div className="min-h-screen bg-gray-200 p-8 pt-5 relative">
            <Togglebar
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                viewMode={viewMode}
                setViewMode={setViewMode}
                itemCount={staffs?.length || 0}
            />

            {loading ? (
                <div className="rounded-lg p-8 text-center">
                    <p className="text-xl font-semibold">Loading staffs...</p>
                </div>
            ) : error ? (
                <div className="rounded-lg p-8 text-center">
                    <p className="text-xl font-semibold text-red-500">
                        {error}
                    </p>
                </div>
            ) : !staffs || staffs.length === 0 ? (
                <div className="rounded-lg p-8 text-center">
                    <p className="text-xl font-semibold mb-4">
                        No staffs found.
                    </p>
                </div>
            ) : filteredStaffs.length === 0 ? (
                <div className="rounded-lg p-8 text-center">
                    <p className="text-lg font-semibold">
                        No staffs match your search criteria.
                    </p>
                </div>
            ) : viewMode === "grid" ? (
                <GridView
                    items={filteredStaffs}
                    selectedItems={selectedStaffs}
                    onSelect={handleSelectStaff}
                    getItemContent={getStaffContent}
                    showDeleteIcon={false}
                />
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
                                <th className="text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-2/12">
                                    Name
                                </th>
                                <th className="text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-2/12">
                                    Role
                                </th>
                                <th className="text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-2/12">
                                    Email
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {staffs.map((staff, index) => (
                                <tr key={staff.id} className="cursor-pointer">
                                    <td className="text-center">
                                        <Checkbox
                                            checked={selectedStaffs.includes(
                                                staff.id || 0
                                            )}
                                            onChange={() =>
                                                handleSelectStaff(staff.id || 0)
                                            }
                                            onClick={(e) => e.stopPropagation()}
                                        />
                                    </td>
                                    <td className="text-center">
                                        <div className="text-sm font-medium text-gray-900">
                                            {index + 1}
                                        </div>
                                    </td>
                                    <td className="text-center">
                                        <div className="text-sm font-medium text-gray-900">
                                            {staff.name}
                                        </div>
                                    </td>
                                    <td className="text-center">
                                        <div className="text-sm font-medium text-gray-900">
                                            {staff.isTeachingStaff
                                                ? "Teaching"
                                                : "Non-Teaching"}
                                        </div>
                                    </td>
                                    <td className="text-center">
                                        <div className="text-sm font-medium text-gray-900">
                                            {staff.email}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

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

export default AllStaffs;
