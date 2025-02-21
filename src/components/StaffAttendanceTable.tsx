import React, { useState, useEffect } from "react";
import { getStaffAttendanceByDate } from "../api/staffs"; // Assume this API function exists
import { CircularProgress } from "@mui/material";
import DatePicker from "react-datepicker"; // Assume react-datepicker is installed
import "react-datepicker/dist/react-datepicker.css";

interface StaffAttendance {
    staff_id: string;
    name: string;
    status: "a" | "f" | "m" | "e";
    date: string;
}

const StaffAttendanceTable: React.FC = () => {
    const [attendanceData, setAttendanceData] = useState<StaffAttendance[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedDate, setSelectedDate] = useState(new Date());

    useEffect(() => {
        fetchAttendance(selectedDate);
    }, [selectedDate]);

    const fetchAttendance = async (date: Date) => {
        setLoading(true);
        try {
            const formattedDate = date.toISOString().split("T")[0];
            const data = await getStaffAttendanceByDate(formattedDate);
            setAttendanceData(data);
            setError(null);
        } catch (error) {
            console.error("Error fetching staff attendance:", error);
            setError("Error fetching staff attendance");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6 bg-white rounded-lg shadow-sm">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
                Staff Attendance
            </h2>
            <div className="mb-4">
                <DatePicker
                    selected={selectedDate}
                    onChange={(date: Date) => setSelectedDate(date)}
                    className="border rounded-lg p-2"
                />
            </div>
            {loading ? (
                <div className="flex justify-center items-center h-[200px]">
                    <CircularProgress />
                </div>
            ) : error ? (
                <div className="text-center text-red-400 py-20 text-sm">
                    {error}
                </div>
            ) : (
                <table className="min-w-full bg-white">
                    <thead>
                        <tr>
                            <th className="py-2">Name</th>
                            <th className="py-2">Status</th>
                            <th className="py-2">Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {attendanceData.map((attendance) => (
                            <tr key={attendance.staff_id}>
                                <td className="border px-4 py-2">{attendance.name}</td>
                                <td className="border px-4 py-2">{attendance.status}</td>
                                <td className="border px-4 py-2">{attendance.date}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default StaffAttendanceTable; 