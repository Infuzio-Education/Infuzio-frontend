import React, { useState, useEffect } from "react";
import { Checkbox } from "@mui/material";
import Togglebar from "../../../components/Togglebar";
import { Staff } from "../../../types/Types";
import { getAllStaffsInSchool } from "../../../api/staffs";
import SnackbarComponent from "../../../components/SnackbarComponent";
import { useSchoolContext } from "../../../contexts/SchoolContext";
import GridView from "../../../components/GridView";
import { useSelector } from "react-redux";
import { Modal, Box } from "@mui/material";
import { getStaffById } from "../../../api/superAdmin";
import {
    Phone,
    Mail,
    User,
    Calendar,
    Droplet,
    Accessibility,
    Church,
    Users,
    Home,
    Building2,
    Building,
    MapPin,
    Globe
} from "lucide-react";

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
    const [openModal, setOpenModal] = useState<boolean>(false);
    const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);


    const { staffInfo } = useSelector((state: any) => state.staffInfo);
    const { schoolInfo } = useSchoolContext();
    const schoolPrefix = schoolInfo.schoolPrefix || staffInfo.schoolCode;

    const fetchStaffList = async () => {
        setLoading(true);
        setError(null);
        try {
            if (!schoolPrefix) {
                throw new Error("School prefix not found");
            }
            const response = await getAllStaffsInSchool(
                schoolPrefix
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
    }, [schoolPrefix]);

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

    const handleOpenModal = async (staff: Staff) => {
        try {
            setSelectedStaff(null);
            setOpenModal(true);

            if (staff.id && schoolPrefix) {
                const response = await getStaffById(staff.id, schoolPrefix);

                if (response.status && response.resp_code === "SUCCESS") {
                    setSelectedStaff(response.data);
                } else {
                    throw new Error("Failed to fetch staff details");
                }
            }
        } catch (error: any) {
            console.error('Error fetching staff details:', error);
            setSnackbar({
                open: true,
                message: error.response?.data?.message || 'Failed to fetch staff details',
                severity: 'error',
                position: { vertical: 'top', horizontal: 'center' }
            });
            handleCloseModal();
        }
    };

    const handleCloseModal = () => {
        setSelectedStaff(null);
        setOpenModal(false);
    };

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
                    onItemClick={handleOpenModal}
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
                                <tr key={staff.id} className="cursor-pointer" onClick={() => handleOpenModal(staff)}>
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

            <Modal
                open={openModal}
                onClose={handleCloseModal}
                aria-labelledby="staff-detail-modal"
            >
                <Box sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 800,
                    bgcolor: 'background.paper',
                    boxShadow: 24,
                    borderRadius: 2,
                    maxHeight: '90vh',
                    overflowY: 'auto'
                }}>
                    {selectedStaff ? (
                        <div>
                            <div className="bg-gray-50 p-6 border-b">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center space-x-4">
                                        <div className="w-16 h-16 rounded-full bg-green-600 flex items-center justify-center text-white text-2xl font-bold">
                                            {selectedStaff.name.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <h2 className="text-2xl font-bold text-gray-900">{selectedStaff.name}</h2>
                                            <p className="text-sm text-gray-500">ID: {selectedStaff.regNumber}</p>
                                        </div>
                                    </div>
                                    <div className={`px-3 py-1 rounded-full ${selectedStaff.isTeachingStaff
                                        ? 'bg-green-100 text-green-800'
                                        : 'bg-blue-100 text-blue-800'
                                        }`}>
                                        {selectedStaff.isTeachingStaff ? 'Teaching Staff' : 'Non-Teaching Staff'}
                                    </div>
                                </div>
                            </div>

                            <div className="p-6">
                                <div className="mb-8">
                                    <h3 className="text-lg font-semibold mb-4 text-gray-900 border-b pb-2">Contact Information</h3>
                                    <div className="grid grid-cols-2 gap-6">
                                        <DetailItem icon={Phone} label="Mobile" value={selectedStaff.mobile} />
                                        <DetailItem icon={Mail} label="Email" value={selectedStaff.email} />
                                    </div>
                                </div>

                                <div className="mb-8">
                                    <h3 className="text-lg font-semibold mb-4 text-gray-900 border-b pb-2">Personal Information</h3>
                                    <div className="grid grid-cols-2 gap-6">
                                        <DetailItem icon={User} label="Gender" value={selectedStaff.gender} />
                                        <DetailItem icon={Calendar} label="Date of Birth" value={new Date(selectedStaff.dob).toLocaleDateString()} />
                                        <DetailItem icon={Droplet} label="Blood Group" value={selectedStaff.bloodGroup} />
                                        <DetailItem icon={Accessibility} label="PWD Status" value={selectedStaff.pwd ? 'Yes' : 'No'} />
                                        <DetailItem icon={Church} label="Religion" value={selectedStaff.religion} />
                                        <DetailItem icon={Users} label="Caste" value={selectedStaff.caste} />
                                    </div>
                                </div>

                                <div className="mb-8">
                                    <h3 className="text-lg font-semibold mb-4 text-gray-900 border-b pb-2">Address Information</h3>
                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="col-span-2">
                                            <DetailItem
                                                icon={Home}
                                                label="Address"
                                                value={`${selectedStaff.house || ''}, ${selectedStaff.street1 || ''}, ${selectedStaff.street2 || ''}`}
                                            />
                                        </div>
                                        <DetailItem icon={Building2} label="City" value={selectedStaff.city} />
                                        <DetailItem icon={Building} label="State" value={selectedStaff.state} />
                                        <DetailItem icon={MapPin} label="Pincode" value={selectedStaff.pincode} />
                                        <DetailItem icon={Globe} label="Country" value={selectedStaff.country} />
                                    </div>
                                </div>
                            </div>

                            <div className="bg-gray-50 px-6 py-4 border-t flex justify-end">
                                <button
                                    onClick={handleCloseModal}
                                    className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="p-8 text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
                            <p className="text-lg font-semibold text-gray-700">Loading staff details...</p>
                        </div>
                    )}
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

const DetailItem = ({ icon: Icon, label, value }: { icon?: React.ElementType; label: string; value: string | number }) => (
    <div className="space-y-1">
        <div className="flex items-center space-x-2">
            {Icon && <Icon size={16} className="text-gray-500" />}
            <span className="text-sm font-medium text-gray-500">{label}</span>
        </div>
        <p className="text-sm text-gray-900 pl-6">{value || 'N/A'}</p>
    </div>
);

export default AllStaffs;
