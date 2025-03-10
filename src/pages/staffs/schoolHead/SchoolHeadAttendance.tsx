import { useState, useEffect } from "react";
import {
    CircularProgress,
    Modal,
    Box,
    Typography,
    IconButton,
} from "@mui/material";
import { DatePicker, message } from "antd";
import { X, Check, Sun, Cloud, XCircle } from "lucide-react";
import {
    getAllStaffsInSchool,
    getStaffAttendanceSchoolHead,
    updateStaffAttendance,
} from "../../../api/staffs";
import { useSchoolContext } from "../../../contexts/SchoolContext";
import { Dayjs } from "dayjs";
import { useSelector } from "react-redux";

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

    const { staffInfo } = useSelector((state: any) => state.staffInfo);
    const { schoolInfo } = useSchoolContext();
    const schoolPrefix = schoolInfo.schoolPrefix || staffInfo.schoolCode;

    useEffect(() => {
        fetchAttendanceData(selectedDate?.toISOString()?.split("T")[0]);
    }, [selectedDate]);

    useEffect(() => {
        if (schoolPrefix) {
            fetchStaffData(schoolPrefix);
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

    const fetchStaffData = async (schoolPrefix: string) => {
        try {
            const response = await getAllStaffsInSchool(schoolPrefix);
            const mappedStaffData = Object.values(response).map(
                (staff: unknown) => {
                    const staffInfo = staff as StaffInfo;
                    return {
                        id: staffInfo.id,
                        name: staffInfo.name,
                        regNumber: staffInfo.regNumber,
                        isTeachingStaff: staffInfo.isTeachingStaff,
                    };
                }
            );
            setStaffData(mappedStaffData);
        } catch (error: unknown) {
            message.error("Error fetching staff data");
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
            const payload = {
                attendanceDate: selectedDate.toISOString().split("T")[0],
                attendances: newAttendance,
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

    return (
        <div className="p-6 bg-white rounded-lg shadow-lg">
            <Typography
                variant="h5"
                fontWeight="bold"
                className="text-gray-800 mb-4"
            >
                Staff Attendance
            </Typography>

            <div className="mb-4 flex justify-between">
                <DatePicker
                    onChange={handleDateChange}
                    className="border rounded-lg px-3 py-2 w-full sm:w-auto"
                />
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
                    }}
                >
                    <Box
                        display="flex"
                        justifyContent="space-between"
                        alignItems="center"
                        m={2}
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
                    <div className="max-h-[70vh] overflow-y-auto">
                        {staffData.map((staff) => (
                            <Box
                                key={staff.id}
                                mb={2}
                                display="flex"
                                alignItems="center"
                                justifyContent="space-between"
                            >
                                <Typography>{staff.name}</Typography>
                                <div className="">
                                    {statusOptions.map((option) => (
                                        <label
                                            key={option.value}
                                            className={`px-4 py-2 border rounded-lg cursor-pointer transition-all m-1 ${newAttendance.find(
                                                (att) =>
                                                    att.staffID === staff.id
                                            )?.status === option.value
                                                    ? "bg-blue-500 text-gray-700 border-blue-500"
                                                    : "border-gray-300 text-gray-700 hover:bg-gray-200"
                                                } ${option.value === "f"
                                                    ? "bg-green-100 text-green-700"
                                                    : option.value === "m"
                                                        ? "bg-yellow-100 text-yellow-700"
                                                        : option.value === "e"
                                                            ? "bg-orange-100 text-orange-700"
                                                            : "bg-red-100 text-red-700"
                                                }`}
                                        >
                                            <input
                                                type="radio"
                                                name={`attendance-${staff.id}`}
                                                value={option.value}
                                                checked={
                                                    newAttendance.find(
                                                        (att) =>
                                                            att.staffID ===
                                                            staff.id
                                                    )?.status === option.value
                                                }
                                                onChange={() =>
                                                    handleStatusChange(
                                                        staff.id,
                                                        option.value
                                                    )
                                                }
                                                className="hidden"
                                            />
                                            {option.label}
                                        </label>
                                    ))}
                                </div>
                            </Box>
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
                            {attendanceData.map((attendance, index) => (
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
