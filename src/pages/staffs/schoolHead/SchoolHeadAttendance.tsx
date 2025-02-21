import React, { useState, useEffect } from "react";
import {
    CircularProgress,
    Button,
    Modal,
    Select,
    MenuItem,
    Box,
    Typography,
    IconButton,
} from "@mui/material";
import { DatePicker } from "antd";
import { X } from "lucide-react";
import axios from "axios";

interface StaffAttendance {
    staffID: number;
    staffName: string;
    status: "a" | "f" | "m" | "e";
    markedBy: number;
    markedTime: string;
    markedByName: string;
}

const exampleData: StaffAttendance[] = [
    {
        staffID: 1,
        staffName: "John Doe",
        status: "f",
        markedBy: 2,
        markedTime: "2025-02-16T16:56:35.222819+05:30",
        markedByName: "Jane Smith",
    },
    {
        staffID: 2,
        staffName: "Jane Smith",
        status: "a",
        markedBy: 2,
        markedTime: "2025-02-16T16:56:35.223134+05:30",
        markedByName: "Jane Smith",
    },
    {
        staffID: 3,
        staffName: "Alice Johnson",
        status: "m",
        markedBy: 2,
        markedTime: "2025-02-16T16:56:35.223281+05:30",
        markedByName: "Jane Smith",
    },
    {
        staffID: 4,
        staffName: "Bob Brown",
        status: "e",
        markedBy: 2,
        markedTime: "2025-02-16T16:56:35.223406+05:30",
        markedByName: "Jane Smith",
    },
];

const SchoolHeadAttendance = () => {
    const [attendanceData, setAttendanceData] = useState<StaffAttendance[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newAttendance, setNewAttendance] = useState<
        { staffID: number; status: string }[]
    >([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setLoading(true);
        setTimeout(() => {
            setAttendanceData(exampleData);
            setNewAttendance(
                exampleData.map((staff) => ({
                    staffID: staff.staffID,
                    status: staff.status,
                }))
            );
            setLoading(false);
        }, 1000);
    }, [selectedDate]);

    const handleDateChange = (date: any, dateString: string | string[]) => {
        setSelectedDate(new Date(dateString as string));
    };

    const handleStatusChange = (staffID: number, status: string) => {
        setNewAttendance((prev) =>
            prev.map((att) =>
                att.staffID === staffID ? { ...att, status } : att
            )
        );
    };

    const handleSubmitAttendance = async () => {
        try {
            const payload = {
                attendanceDate: selectedDate.toISOString().split("T")[0],
                attendances: newAttendance,
            };
            await axios.post("/api/attendance", payload);
            setIsModalOpen(false);
        } catch (error) {
            console.error("Error submitting attendance:", error);
            setError("Error submitting attendance");
        }
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
                    onClick={() => setIsModalOpen(true)}
                    className="bg-emerald-700 p-2 px-3 text-white font-medium rounded-full text-sm shadow-md"
                >
                    Mark Attendance
                </button>
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
                        width: 400,
                    }}
                >
                    <Box
                        display="flex"
                        justifyContent="space-between"
                        alignItems="center"
                        mb={2}
                    >
                        <Typography variant="h6" fontWeight="bold">
                            Mark Attendance
                        </Typography>
                        <IconButton onClick={() => setIsModalOpen(false)}>
                            <X size={24} />
                        </IconButton>
                    </Box>

                    {exampleData.map((staff) => (
                        <Box
                            key={staff.staffID}
                            mb={2}
                            display="flex"
                            alignItems="center"
                            justifyContent="space-between"
                        >
                            <Typography>{staff.staffName}</Typography>
                            <Select
                                value={
                                    newAttendance.find(
                                        (att) => att.staffID === staff.staffID
                                    )?.status || ""
                                }
                                onChange={(e) =>
                                    handleStatusChange(
                                        staff.staffID,
                                        e.target.value
                                    )
                                }
                                size="small"
                                sx={{ minWidth: 120 }}
                            >
                                <MenuItem value="f">Full Day</MenuItem>
                                <MenuItem value="a">Absent</MenuItem>
                                <MenuItem value="m">Half Day</MenuItem>
                                <MenuItem value="e">Excused</MenuItem>
                            </Select>
                        </Box>
                    ))}

                    <button
                        onClick={handleSubmitAttendance}
                        className="bg-emerald-700 p-2 text-white text-sm w-full font-medium rounded-full"
                    >
                        Submit Attendance
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
            ) : error ? (
                <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    height={200}
                    color="red"
                >
                    {error}
                </Box>
            ) : (
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
                                    className={`hover:bg-gray-50 ${
                                        index === attendanceData.length - 1
                                            ? "rounded-b-lg"
                                            : ""
                                    }`}
                                >
                                    <td
                                        className={`border px-5 py-3 ${
                                            index === 0
                                                ? "rounded-tl-lg"
                                                : ""
                                        } ${
                                            index ===
                                            attendanceData.length - 1
                                                ? "rounded-bl-lg"
                                                : ""
                                        }`}
                                    >
                                        {attendance.staffName}
                                    </td>
                                    <td className="border px-5 py-3">
                                        {attendance.status}
                                    </td>
                                    <td className="border px-5 py-3">
                                        {attendance.markedByName}
                                    </td>
                                    <td
                                        className={`border px-5 py-3 ${
                                            index === 0
                                                ? "rounded-tr-lg"
                                                : ""
                                        } ${
                                            index ===
                                            attendanceData.length - 1
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
            )}
        </div>
    );
};

export default SchoolHeadAttendance;
