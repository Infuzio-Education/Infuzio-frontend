import React, { useEffect, useState } from "react";
import { Check, Clock, X, Search } from "lucide-react";
import { AttendanceStudent, TakeAttendanceProps } from "../../types/Types";
import {
    getAttendanceByClass,
    getStudentsByClass,
    takeAttendance,
} from "../../api/staffs";

const TakeAttendance: React.FC<TakeAttendanceProps> = ({
    classInfo,
    onClose,
}) => {
    const [searchTerm, setSearchTerm] = useState("");
    // Mock data with more students
    const [students, setStudents] = useState<AttendanceStudent[]>([]);

    const fetchAttendance = async () => {
        try {
            const date = new Date();
            const formattedDate = `${date.getDate().toString().padStart(2, "0")}-${(date.getMonth() + 1).toString().padStart(2, "0")}-${date.getFullYear()}`;
            const data = await getAttendanceByClass({
                classId: classInfo?.id,
                date: formattedDate,
            });
            if (data && data.length > 0) {
                setStudents([...data]);
            }
        } catch (error) {
            try {
                const students = await getStudentsByClass(classInfo?.id);
                setStudents(students);
            } catch (error) {
                console.error("Error fetching attendance:", error);
            }
        }
    };

    useEffect(() => {
        fetchAttendance();
    }, []);

    const handleSelectAll = (status: "a" | "f" | "m" | "e") => {
        setStudents(
            students.map((student) => ({
                ...student,
                attendance: status,
            }))
        );
    };

    const handleAttendance = (
        studentId: string,
        status: "a" | "f" | "m" | "e"
    ) => {
        setStudents(
            students.map((student) =>
                student.id === studentId
                    ? { ...student, attendance: status }
                    : student
            )
        );
    };

    const filteredStudents = students.filter(
        (student) =>
            student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            student.rollNumber.includes(searchTerm)
    );

    const handleSubmit = async () => {
        try {
            await takeAttendance({
                class_id: classInfo?.id,
                attendance_date: new Date().toISOString(),
                attendance: students.map((student) => ({
                    studentId: student.id,
                    status: student.attendance,
                })) as { studentId: string; status: "f" | "a" | "m" | "e" }[],
            });
            onClose();
        } catch (error) {
            console.error("Error submitting attendance:", error);
        }
    };

    const getAttendanceStats = () => {
        const present = students.filter((s) => s.attendance === "f").length;
        const halfday = students.filter((s) => s.attendance === "m").length;
        const absent = students.filter((s) => s.attendance === "a").length;
        const pending = students.filter((s) => !s?.attendance).length;
        return { present, halfday, absent, pending };
    };

    const stats = getAttendanceStats();

    return (
        <div className="bg-white rounded-lg shadow-sm max-h-[90vh] flex flex-col">
            {/* Header */}
            <div className="p-6 border-b">
                <div className="flex justify-between items-center mb-4">
                    <div>
                        <h2 className="text-xl font-bold text-gray-800">
                            Take Attendance
                        </h2>
                        <p className="text-sm mt-2 font-semibold text-gray-600">
                            {classInfo.name} |{" "}
                            {new Date().toLocaleDateString("en-US", {
                                weekday: "long",
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                            })}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-4 gap-4 mt-4">
                    <div className="bg-emerald-50 p-3 rounded-lg">
                        <p className="text-xs text-gray-600">Present</p>
                        <p className="text-lg font-semibold text-emerald-700">
                            {stats.present}
                        </p>
                    </div>
                    <div className="bg-blue-50 p-3 rounded-lg">
                        <p className="text-xs text-gray-600">Half Day</p>
                        <p className="text-lg font-semibold text-blue-700">
                            {stats.halfday}
                        </p>
                    </div>
                    <div className="bg-red-50 p-3 rounded-lg">
                        <p className="text-xs text-gray-600">Absent</p>
                        <p className="text-lg font-semibold text-red-700">
                            {stats.absent}
                        </p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-xs text-gray-600">Pending</p>
                        <p className="text-lg font-semibold text-gray-700">
                            {stats.pending}
                        </p>
                    </div>
                </div>
            </div>

            <div className="p-6 flex-1 overflow-hidden flex flex-col">
                {/* Controls */}
                <div className="space-y-4 mb-4">
                    {/* Search */}
                    <div className="relative">
                        <Search
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                            size={20}
                        />
                        <input
                            type="text"
                            placeholder="Search by name or roll number..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                    </div>

                    {/* Select All Options */}
                    <div className="flex items-center space-x-4">
                        <span className="text-sm font-medium text-gray-600">
                            Select All:
                        </span>
                        <button
                            onClick={() => handleSelectAll("f")}
                            className="px-4 py-2 bg-emerald-50 text-emerald-700 rounded-lg hover:bg-emerald-100 transition-colors text-sm font-medium"
                        >
                            Present
                        </button>
                        <button
                            onClick={() => handleSelectAll("m")}
                            className="px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium"
                        >
                            Half Day
                        </button>
                        <button
                            onClick={() => handleSelectAll("a")}
                            className="px-4 py-2 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors text-sm font-medium"
                        >
                            Absent
                        </button>
                    </div>
                </div>

                {/* Students List */}
                <div className="flex-1 overflow-y-auto pr-2">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {filteredStudents.map((student) => (
                            <div
                                key={student?.id}
                                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                            >
                                <div>
                                    <h3 className="font-medium text-gray-800">
                                        {student?.name}
                                    </h3>
                                    {student?.rollNumber && (
                                        <p className="text-sm text-gray-500">
                                            Roll No: {student?.rollNumber}
                                        </p>
                                    )}
                                </div>
                                <div className="flex items-center space-x-2">
                                    <button
                                        onClick={() =>
                                            handleAttendance(student.id, "f")
                                        }
                                        className={`p-2 rounded-full ${
                                            student?.attendance === "f"
                                                ? "bg-emerald-100 text-emerald-700"
                                                : "bg-gray-100 text-gray-500 hover:bg-emerald-50 hover:text-emerald-600"
                                        }`}
                                    >
                                        <Check size={18} />
                                    </button>
                                    <button
                                        onClick={() =>
                                            handleAttendance(student.id, "m")
                                        }
                                        className={`p-2 rounded-full ${
                                            student?.attendance === "m"
                                                ? "bg-blue-100 text-blue-700"
                                                : "bg-gray-100 text-gray-500 hover:bg-blue-50 hover:text-blue-600"
                                        }`}
                                    >
                                        <Clock size={18} />
                                    </button>
                                    <button
                                        onClick={() =>
                                            handleAttendance(student.id, "a")
                                        }
                                        className={`p-2 rounded-full ${
                                            student?.attendance === "a"
                                                ? "bg-red-100 text-red-700"
                                                : "bg-gray-100 text-gray-500 hover:bg-red-50 hover:text-red-600"
                                        }`}
                                    >
                                        <X size={18} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Submit Button - Fixed at bottom */}
                <div className="pt-4 mt-4 border-t">
                    <button
                        className="w-full px-6 py-2.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium disabled:opacity-70 disabled:hover:bg-emerald-600 disabled:cursor-not-allowed"
                        disabled={stats.pending > 0}
                        onClick={handleSubmit}
                    >
                        Submit Attendance ({students.length - stats.pending}/
                        {students.length} Marked)
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TakeAttendance;
