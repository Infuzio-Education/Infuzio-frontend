import { useState, useEffect } from "react";
import {
    CircularProgress,
    Modal,
    Box,
    Typography,
    IconButton,
    TextField,
} from "@mui/material";
import { DatePicker, message } from "antd";
import { X, Check, Sun, Cloud, XCircle } from "lucide-react";
import {
    getStaffAttendanceSchoolHead,
    updateStaffAttendance,
} from "../../../api/staffs";
import { useSchoolContext } from "../../../contexts/SchoolContext";
import { Dayjs } from "dayjs";
import { useSelector } from "react-redux";
import { simpleStaffList } from "../../../api/superAdmin";

interface StaffAttendance {
    staffID: number;
    staffName: string;
    status: "a" | "f" | "m" | "e";
    markedBy: number;
    markedTime: string;
    markedByName: string;
}

interface StaffInfo {
    id: number;
    name: string;
    regNumber: string;
    isTeachingStaff: boolean;
}

const statusOptions = [
    { value: "f", label: "F" },
    { value: "m", label: "M" },
    { value: "e", label: "E" },
    { value: "a", label: "A" },
];

const SchoolHeadAttendance = () => {
    const [attendanceData, setAttendanceData] = useState<StaffAttendance[]>([]);
    const [staffData, setStaffData] = useState<StaffInfo[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newAttendance, setNewAttendance] = useState<
        { staffID: number; status: string }[]
    >([]);
    const [modalSearchTerm, setModalSearchTerm] = useState('');
    const [listSearchTerm, setListSearchTerm] = useState('');

    const { staffInfo } = useSelector((state: any) => state.staffInfo);
    const { schoolInfo } = useSchoolContext();
    const schoolPrefix = schoolInfo.schoolPrefix || staffInfo.schoolCode;

    const hasSchoolAdminPrivilege = staffInfo?.specialPrivileges?.some(
        (privilege: any) => privilege.privilege === "schoolAdmin"
    );

    useEffect(() => {
        fetchAttendanceData(selectedDate?.toISOString()?.split("T")[0]);
    }, [selectedDate]);

    useEffect(() => {
        if (schoolPrefix) {
            fetchAllStaff();
        }
    }, [schoolInfo]);

    const fetchAttendanceData = async (date: string) => {
        try {
            setLoading(true);
            const response = await getStaffAttendanceSchoolHead(date);
            setAttendanceData(response);
            setLoading(false);
            console.log(response);
        } catch (error) {
            message.error("Error fetching attendance data");
        }
    };

    const fetchAllStaff = async () => {
        try {
            const response = await simpleStaffList(hasSchoolAdminPrivilege ? staffInfo?.schoolCode : undefined);
            if (response.status && response.resp_code === "SUCCESS") {
                setStaffData(response.data.staffs)
            } else {
                message.error("Error fetching staff list")
            }
        } catch (error) {
            console.error('Error fetching staff list:', error);
            message.error('Failed to fetch staff list')
            setStaffData([])
        }
    };

    const handleDateChange = (
        date: Dayjs | null,
        dateString: string | string[]
    ) => {
        if (date) {
            setSelectedDate(
                new Date(Array.isArray(dateString) ? dateString[0] : dateString)
            );
        }
    };

    const handleStatusChange = (staffID: number, status: string) => {
        setNewAttendance((prev) => {
            const existing = prev.find((att) => att.staffID === staffID);
            if (existing) {
                return prev.map((att) =>
                    att.staffID === staffID ? { ...att, status } : att
                );
            } else {
                return [...prev, { staffID, status }];
            }
        });
    };

    const handleSubmitAttendance = async () => {
        try {
            // Create a payload with only the changed entries
            const changedAttendances = newAttendance.filter(newAtt => {
                const existingAtt = attendanceData.find(att => att.staffID === newAtt.staffID);
                return existingAtt && existingAtt.status !== newAtt.status;
            });

            if (changedAttendances.length === 0) {
                message?.info("No changes to submit");
                setIsModalOpen(false);
                return;
            }

            const payload = {
                attendanceDate: selectedDate.toISOString().split("T")[0],
                attendances: changedAttendances,
            };

            await updateStaffAttendance(payload);
            setIsModalOpen(false);
            message?.success("Attendance updated");
            fetchAttendanceData(selectedDate.toISOString().split("T")[0]);
        } catch (error) {
            console.error("Error submitting attendance:", error);
            message?.error("Error while updating attendance, Please try again");
        }
    };

    const openModal = () => {
        setNewAttendance(
            attendanceData.map((att) => ({
                staffID: att.staffID,
                status: att.status,
            }))
        );
        setIsModalOpen(true);
    };

    const filteredStaffModal = staffData.filter(staff =>
        [staff.name, staff.regNumber].some(field =>
            field?.toLowerCase().includes(modalSearchTerm.toLowerCase())
        )
    );

    const filteredAttendanceData = attendanceData.filter(attendance =>
        [attendance.staffName, attendance.staffID.toString()].some(field =>
            field.toLowerCase().includes(listSearchTerm.toLowerCase())
        )
    );

    return (
        <div className="p-6 bg-white rounded-lg shadow-lg">
            <Typography
                variant="h5"
                fontWeight="bold"
                className="text-gray-800 mb-4"
            >
                Staff Attendance
            </Typography>

            <div className="mb-4 flex justify-between gap-4 flex-wrap">
                <div className="flex gap-4 flex-1">
                    <DatePicker
                        onChange={handleDateChange}
                        className="border rounded-lg px-3 py-2"
                    />
                    <TextField
                        placeholder="Search attendance..."
                        variant="outlined"
                        size="small"
                        className="flex-1"
                        value={listSearchTerm}
                        onChange={(e) => setListSearchTerm(e.target.value)}
                        InputProps={{
                            style: {
                                borderRadius: '8px',
                                backgroundColor: '#f9fafb'
                            }
                        }}
                    />
                </div>
                <button
                    onClick={openModal}
                    className="bg-emerald-700 p-2 px-3 text-white font-medium rounded-full text-sm shadow-md"
                >
                    {attendanceData.length === 0
                        ? "Mark Attendance"
                        : "Update Attendance"}
                </button>
            </div>

            <div className="mb-4">
                <Typography variant="body2" className="text-gray-600">
                    Marked: {attendanceData.length} / {staffData.length}
                </Typography>
            </div>

            <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <Box
                    sx={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        bgcolor: "white",
                        boxShadow: 24,
                        p: 4,
                        borderRadius: 2,
                        width: 500,
                        pb: 2
                    }}
                >
                    <Box
                        display="flex"
                        justifyContent="space-between"
                        alignItems="center"
                    >
                        <Typography variant="h6" fontWeight="bold">
                            {attendanceData.length === 0
                                ? "Mark Attendance"
                                : "Update Attendance"}
                        </Typography>
                        <IconButton onClick={() => setIsModalOpen(false)}>
                            <X size={24} />
                        </IconButton>
                    </Box>

                    <Box>
                        <TextField
                            placeholder="Search staff..."
                            variant="outlined"
                            fullWidth
                            size="small"
                            value={modalSearchTerm}
                            onChange={(e) => setModalSearchTerm(e.target.value)}
                            InputProps={{
                                style: {
                                    borderRadius: '8px',
                                    backgroundColor: '#f9fafb',
                                }
                            }}
                        />
                    </Box>

                    <div className="h-[65vh] pt-3  overflow-y-auto">
                        {filteredStaffModal.map((staff) => (
                            <div
                                key={staff.id}
                                className=" p-1 flex items-center justify-between bg-white rounded-lg shadow-sm"
                            >
                                <span className="font-medium text-gray-800">{staff.name}</span>

                                <div className="flex">
                                    {statusOptions.map((option) => {
                                        const isSelected = newAttendance.find(att => att.staffID === staff.id)?.status === option.value;

                                        // Status styles with more prominent selection
                                        const getBaseStyle = (value: string) => {
                                            switch (value) {
                                                case 'f': return "text-green-700";
                                                case 'm': return "text-yellow-700";
                                                case 'e': return "text-orange-700";
                                                case 'a': return "text-red-700";
                                                default: return "text-gray-700";
                                            }
                                        };

                                        const getSelectedStyle = (value: string) => {
                                            switch (value) {
                                                case 'f': return "bg-green-500 text-white border-green-600";
                                                case 'm': return "bg-yellow-500 text-white border-yellow-600";
                                                case 'e': return "bg-orange-500 text-white border-orange-600";
                                                case 'a': return "bg-red-500 text-white border-red-600";
                                                default: return "bg-blue-500 text-white border-blue-600";
                                            }
                                        };

                                        return (
                                            <label
                                                key={option.value}
                                                className={`px-3 py-2 mx-1 font-medium cursor-pointer transition-all rounded-md
                                               ${isSelected
                                                        ? getSelectedStyle(option.value) + " shadow-md"
                                                        : "bg-gray-100 " + getBaseStyle(option.value) + " hover:bg-gray-200"}`}
                                            >
                                                <input
                                                    type="radio"
                                                    name={`attendance-${staff.id}`}
                                                    value={option.value}
                                                    checked={isSelected}
                                                    onChange={() => handleStatusChange(staff.id, option.value)}
                                                    className="hidden"
                                                />
                                                {option.label}
                                            </label>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>

                    <button
                        onClick={handleSubmitAttendance}
                        className="bg-emerald-700 p-2 text-white text-sm w-full font-medium rounded-full"
                    >
                        {attendanceData.length === 0
                            ? "Submit Attendance"
                            : "Update Attendance"}
                    </button>
                </Box>
            </Modal>

            {loading ? (
                <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    height={200}
                >
                    <CircularProgress />
                </Box>
            ) : attendanceData?.length > 0 ? (
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                        <thead className="bg-gray-100 text-gray-700 text-sm uppercase">
                            <tr>
                                <th className="py-3 px-5 text-left border-b">
                                    Name
                                </th>
                                <th className="py-3 px-5 text-left border-b">
                                    Status
                                </th>
                                <th className="py-3 px-5 text-left border-b">
                                    Marked By
                                </th>
                                <th className="py-3 px-5 text-left border-b">
                                    Marked Time
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredAttendanceData.map((attendance, index) => (
                                <tr
                                    key={attendance.staffID}
                                    className={`hover:bg-gray-50 ${index === attendanceData.length - 1
                                        ? "rounded-b-lg"
                                        : ""
                                        }`}
                                >
                                    <td
                                        className={`border px-5 py-3 ${index === 0 ? "rounded-tl-lg" : ""
                                            } ${index === attendanceData.length - 1
                                                ? "rounded-bl-lg"
                                                : ""
                                            }`}
                                    >
                                        {attendance.staffName}
                                    </td>
                                    <td className="border px-5 py-3">
                                        <span
                                            className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${attendance.status === "f"
                                                ? "bg-green-100 text-green-700"
                                                : attendance.status === "m"
                                                    ? "bg-yellow-100 text-yellow-700"
                                                    : attendance.status === "e"
                                                        ? "bg-orange-100 text-orange-700"
                                                        : "bg-red-100 text-red-700"
                                                }`}
                                        >
                                            {attendance.status === "f" && (
                                                <Check
                                                    size={16}
                                                    className="mr-1"
                                                />
                                            )}
                                            {attendance.status === "m" && (
                                                <Sun
                                                    size={16}
                                                    className="mr-1"
                                                />
                                            )}
                                            {attendance.status === "e" && (
                                                <Cloud
                                                    size={16}
                                                    className="mr-1"
                                                />
                                            )}
                                            {attendance.status === "a" && (
                                                <XCircle
                                                    size={16}
                                                    className="mr-1"
                                                />
                                            )}
                                            {attendance.status === "f"
                                                ? "Full Day"
                                                : attendance.status === "m"
                                                    ? "Morning Half"
                                                    : attendance.status === "e"
                                                        ? "Evening Half"
                                                        : "Absent"}
                                        </span>
                                    </td>
                                    <td className="border px-5 py-3">
                                        {attendance.markedByName}
                                    </td>
                                    <td
                                        className={`border px-5 py-3 ${index === 0 ? "rounded-tr-lg" : ""
                                            } ${index === attendanceData.length - 1
                                                ? "rounded-br-lg"
                                                : ""
                                            }`}
                                    >
                                        {new Date(
                                            attendance.markedTime
                                        ).toLocaleString()}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    height={200}
                >
                    <span className="font-medium">
                        No attendance data available
                    </span>
                </Box>
            )}
        </div>
    );
};

export default SchoolHeadAttendance;
