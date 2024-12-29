import { useState, useEffect } from "react";
import {
    Edit,
    Trash,
    ArrowLeft,
    Phone,
    Mail,
    User,
    Calendar,
    MapPin,
    BookOpen,
    Users,
    Heart,
    ChartLine,
    ClipboardList,
    Check,
    X,
    BookOpenCheck,
    ChevronLeft,
    ChevronRight,
} from "lucide-react";
import {
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer,
    Legend,
    Tooltip,
} from "recharts";
import { getStudentAttendanceByMonth } from "../../api/staffs";
import { CircularProgress } from "@mui/material";

import {
    ExamScore,
    UnitTestScore,
    // AttendanceRecord,
    mockExamScores,
    mockUnitTestScores,
    // mockAttendanceRecords,
    StudentDetailsProps,
    Student,
} from "../../types/Types";
import { getStudentDetails } from "../../api/staffs";

type Exam = {
    ID: number;
    Name: string;
    AcademicYear: string;
    CreatedBy: number;
    UpdatedBy: number;
    UpdateAt: string;
    CreatedAt: string;
};

type ChartData = {
    name: string;
    value: number;
    color: string;
};

type ParentInfo = {
    parentId: number;
    name: string;
    relationshipWithStudent: string;
    phone: string;
    email: string;
};

interface StudentAttendance {
    total_w_days: number;
    total_p_days: number;
    total_a_days: number;
    total_hd_days: number;
    DayWiseAttendance: Array<{
        day: number;
        status: "f" | "a" | "m" | "e";
    }>;
}

const StudentDetails = ({
    studentId,
    onBack,
    onEdit,
    onDelete,
}: StudentDetailsProps) => {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1;

    const [activeTab, setActiveTab] = useState("details");
    const [examScores] = useState<ExamScore[]>(mockExamScores);
    const [unitTestScores] = useState<UnitTestScore[]>(mockUnitTestScores);
    // const [attendanceRecords] = useState<AttendanceRecord[]>(mockAttendanceRecords);]
    const [student, setStudent] = useState<Student | null>(null);

    useEffect(() => {
        fetchStudentDetails();
    }, [studentId]);

    const fetchStudentDetails = async () => {
        try {
            const response = await getStudentDetails(studentId);
            setStudent(response);
        } catch (error) {
            console.log(error);
        }
    };

    const [selectedExam, setSelectedExam] = useState<number | null>(null);
    const [exams] = useState<Exam[]>([
        {
            ID: 4,
            Name: "Onam Exam",
            AcademicYear: "2024",
            CreatedBy: 3,
            UpdatedBy: 0,
            UpdateAt: "2024-11-26T22:50:25.998151+05:30",
            CreatedAt: "2024-11-26T22:50:25.998151+05:30",
        },
        {
            ID: 5,
            Name: "First Terminal",
            AcademicYear: "2024",
            CreatedBy: 3,
            UpdatedBy: 0,
            UpdateAt: "2024-12-15T10:30:00.998151+05:30",
            CreatedAt: "2024-12-15T10:30:00.998151+05:30",
        },
    ]);
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [selectedMonth, setSelectedMonth] = useState(
        new Date().getMonth() + 1
    );
    const [overallMonth, setOverallMonth] = useState(new Date().getMonth() + 1);
    const [overallYear, setOverallYear] = useState(new Date().getFullYear());

    const [attendanceLoading, setAttendanceLoading] = useState(false);
    const [attendanceError, setAttendanceError] = useState<string | null>(null);
    const [attendanceData, setAttendanceData] = useState<StudentAttendance>({
        total_w_days: 20,
        total_p_days: 15,
        total_a_days: 2,
        total_hd_days: 3,
        DayWiseAttendance: [
            { day: 1, status: "f" },
            { day: 2, status: "f" },
            { day: 3, status: "a" },
            { day: 4, status: "m" },
            { day: 5, status: "f" },
            { day: 8, status: "f" },
            { day: 9, status: "e" },
            { day: 10, status: "f" },
            { day: 11, status: "f" },
            { day: 12, status: "a" },
            { day: 15, status: "f" },
            { day: 16, status: "f" },
            { day: 17, status: "m" },
            { day: 18, status: "f" },
            { day: 19, status: "f" },
            { day: 22, status: "f" },
            { day: 23, status: "e" },
            { day: 24, status: "f" },
            { day: 25, status: "f" },
            { day: 26, status: "f" },
        ],
    });

    useEffect(() => {
        const fetchAttendance = async () => {
            try {
                setAttendanceLoading(true);
                setAttendanceError(null);
                const data = await getStudentAttendanceByMonth({
                    studentId: studentId,
                    month: String(selectedMonth),
                    year: String(selectedYear),
                });
                setAttendanceData(data);
            } catch (error) {
                setAttendanceError("Failed to fetch attendance data");
                console.error("Error fetching attendance:", error);
            } finally {
                setAttendanceLoading(false);
            }
        };

        if (activeTab === "attendance") {
            fetchAttendance();
        }
    }, [studentId, selectedMonth, selectedYear, activeTab]);

    const tabs = [
        { id: "details", label: "Basic Details", icon: <User size={18} /> },
        { id: "parents", label: "Parents", icon: <Users size={18} /> },
        {
            id: "termexams",
            label: "Term Exams",
            icon: <BookOpenCheck size={18} />,
        },
        {
            id: "unittests",
            label: "Unit Tests",
            icon: <ClipboardList size={18} />,
        },
        { id: "attendance", label: "Attendance", icon: <Calendar size={18} /> },
        { id: "overall", label: "Overall", icon: <ChartLine size={18} /> },
    ];

    const getAttendanceColor = (status: string) => {
        switch (status) {
            case "f":
                return "bg-green-100 text-green-800 border-green-200";
            case "a":
                return "bg-red-100 text-red-800 border-red-200";
            case "m":
            case "e":
                return "bg-yellow-100 text-yellow-800 border-yellow-200";
            default:
                return "bg-gray-100 text-gray-800 border-gray-200";
        }
    };

    const getDaysInMonth = (year: number, month: number) => {
        return new Date(year, month, 0).getDate();
    };

    const getFirstDayOfMonth = (year: number, month: number) => {
        return new Date(year, month - 1, 1).getDay();
    };

    const renderTabContent = () => {
        switch (activeTab) {
            case "details":
                return student ? (
                    <div className="space-y-6">
                        {/* Academic Information */}
                        <div className="bg-white p-6 rounded-xl shadow-sm">
                            <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center gap-2">
                                <BookOpen size={18} className="text-gray-400" />
                                Academic Information
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-1">
                                    <label className="text-sm text-gray-400">
                                        Admission Number
                                    </label>
                                    <p className="font-medium text-gray-800">
                                        {student?.admissionNumber}
                                    </p>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-sm text-gray-400">
                                        Date of Admission
                                    </label>
                                    <p className="font-medium text-gray-800">
                                        {new Date(
                                            student?.dateOfAdmission
                                        ).toLocaleDateString()}
                                    </p>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-sm text-gray-400">
                                        Class
                                    </label>
                                    <p className="font-medium text-gray-800">
                                        {student.className}
                                    </p>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-sm text-gray-400">
                                        Remarks
                                    </label>
                                    <p className="font-medium text-gray-800">
                                        {student.remarks}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Personal Information */}
                        <div className="bg-white p-6 rounded-xl shadow-sm">
                            <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center gap-2">
                                <User size={18} className="text-gray-400" />
                                Personal Information
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-1">
                                    <label className="text-sm text-gray-400">
                                        Religion
                                    </label>
                                    <p className="font-medium text-gray-800">
                                        {student.religion}
                                    </p>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-sm text-gray-400">
                                        Caste
                                    </label>
                                    <p className="font-medium text-gray-800">
                                        {student.caste}
                                    </p>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-sm text-gray-400">
                                        Category
                                    </label>
                                    <p className="font-medium text-gray-800">
                                        {student.reservationCategory}
                                    </p>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-sm text-gray-400">
                                        Nationality
                                    </label>
                                    <p className="font-medium text-gray-800">
                                        {student.nationality}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Address Information */}
                        <div className="bg-white p-6 rounded-xl shadow-sm">
                            <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center gap-2">
                                <MapPin size={18} className="text-gray-400" />
                                Address Information
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-1">
                                    <label className="text-sm text-gray-400">
                                        House
                                    </label>
                                    <p className="font-medium text-gray-800">
                                        {student.house}
                                    </p>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-sm text-gray-400">
                                        Street 1
                                    </label>
                                    <p className="font-medium text-gray-800">
                                        {student.street1}
                                    </p>
                                </div>
                                {student.street2 && (
                                    <div className="space-y-1">
                                        <label className="text-sm text-gray-400">
                                            Street 2
                                        </label>
                                        <p className="font-medium text-gray-800">
                                            {student.street2}
                                        </p>
                                    </div>
                                )}
                                <div className="space-y-1">
                                    <label className="text-sm text-gray-400">
                                        City
                                    </label>
                                    <p className="font-medium text-gray-800">
                                        {student.city}
                                    </p>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-sm text-gray-400">
                                        State & PIN
                                    </label>
                                    <p className="font-medium text-gray-800">
                                        {student.state} - {student.pincode}
                                    </p>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-sm text-gray-400">
                                        Country
                                    </label>
                                    <p className="font-medium text-gray-800">
                                        {student.country}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    ""
                );
            case "parents":
                return (
                    <div className="bg-white p-6 rounded-xl shadow-sm">
                        <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center gap-2">
                            <Users size={18} className="text-gray-400" />
                            Parent Information
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {student?.parentInfo.map((parent: ParentInfo) => (
                                <div
                                    key={parent.parentId}
                                    className="bg-gray-50 p-4 rounded-lg"
                                >
                                    <h4 className="font-medium text-gray-700 mb-3">
                                        {parent.relationshipWithStudent}
                                    </h4>
                                    <div className="space-y-3">
                                        <p className="text-gray-800 font-medium">
                                            {parent.name}
                                        </p>
                                        <p className="text-gray-600 flex items-center gap-2">
                                            <Phone
                                                size={14}
                                                className="text-gray-400"
                                            />
                                            {parent.phone}
                                        </p>
                                        <p className="text-gray-600 flex items-center gap-2">
                                            <Mail
                                                size={14}
                                                className="text-gray-400"
                                            />
                                            {parent.email}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                );
            case "termexams":
                return (
                    <div className="space-y-6">
                        {selectedExam === null ? (
                            // Show exam cards with improved styling and borders
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {exams.map((exam) => (
                                    <div
                                        key={exam.ID}
                                        onClick={() => setSelectedExam(exam.ID)}
                                        className="bg-gray-50 p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer border-2 border-gray-200 hover:border-emerald-300 relative overflow-hidden"
                                    >
                                        <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-50 rounded-bl-full -z-10" />
                                        <div className="flex justify-between items-start mb-4">
                                            <div>
                                                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                                                    {exam.Name}
                                                </h3>
                                                <p className="text-sm text-gray-500 flex items-center gap-2">
                                                    <Calendar size={14} />
                                                    Academic Year:{" "}
                                                    {exam.AcademicYear}
                                                </p>
                                            </div>
                                            <span className="px-4 py-2 bg-white text-emerald-600 text-sm font-medium rounded-lg border-2 border-emerald-200 hover:bg-emerald-50 transition-colors">
                                                View Results
                                            </span>
                                        </div>
                                        <div className="text-sm text-gray-600 mt-4 pt-4 border-t-2 border-gray-200">
                                            <p className="flex items-center gap-2">
                                                <Calendar
                                                    size={14}
                                                    className="text-gray-400"
                                                />
                                                Created:{" "}
                                                {new Date(
                                                    exam.CreatedAt
                                                ).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            // Show exam results
                            <div className="bg-white p-6 rounded-xl shadow-sm">
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="text-lg font-semibold text-gray-800">
                                        {
                                            exams.find(
                                                (e) => e.ID === selectedExam
                                            )?.Name
                                        }{" "}
                                        Results
                                    </h3>
                                    <button
                                        onClick={() => setSelectedExam(null)}
                                        className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors flex items-center gap-2"
                                    >
                                        <ArrowLeft size={16} />
                                        Back to Exams
                                    </button>
                                </div>

                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                                    Subject
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                                    Max Marks
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                                    Marks Obtained
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                                    Result
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200">
                                            {examScores
                                                .filter(
                                                    (score: ExamScore) =>
                                                        score.examName ===
                                                        exams.find(
                                                            (e) =>
                                                                e.ID ===
                                                                selectedExam
                                                        )?.Name
                                                )
                                                .map(
                                                    (
                                                        score: ExamScore,
                                                        index: number
                                                    ) => (
                                                        <tr key={index}>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                                {score.subject}
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                                {score.maxMarks}
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                                {
                                                                    score.marksObtained
                                                                }
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap">
                                                                <span
                                                                    className={`px-3 py-1.5 text-sm font-medium rounded-full inline-flex items-center gap-1.5
                                                                ${
                                                                    score.isPassed
                                                                        ? "bg-green-100 text-green-700 border border-green-200"
                                                                        : "bg-red-100 text-red-700 border border-red-200"
                                                                }`}
                                                                >
                                                                    {score.isPassed ? (
                                                                        <>
                                                                            <Check
                                                                                size={
                                                                                    14
                                                                                }
                                                                            />
                                                                            Pass
                                                                        </>
                                                                    ) : (
                                                                        <>
                                                                            <X
                                                                                size={
                                                                                    14
                                                                                }
                                                                            />
                                                                            Fail
                                                                        </>
                                                                    )}
                                                                </span>
                                                            </td>
                                                        </tr>
                                                    )
                                                )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                    </div>
                );
            case "unittests":
                return (
                    <div className="bg-white p-6 rounded-xl shadow-sm">
                        <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center gap-2">
                            <ClipboardList
                                size={18}
                                className="text-gray-400"
                            />
                            Unit Test Performance
                        </h3>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                            Test
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                            Subject
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                            Marks
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                            Result
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                            Date
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {unitTestScores.map(
                                        (
                                            score: UnitTestScore,
                                            index: number
                                        ) => (
                                            <tr key={index}>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {score.testName}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {score.subject}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {score.marksObtained}/
                                                    {score.maxMarks}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span
                                                        className={`px-3 py-1.5 text-sm font-medium rounded-full inline-flex items-center gap-1.5
                                                    ${
                                                        score.isPassed
                                                            ? "bg-green-100 text-green-700 border border-green-200"
                                                            : "bg-red-100 text-red-700 border border-red-200"
                                                    }`}
                                                    >
                                                        {score.isPassed ? (
                                                            <>
                                                                <Check
                                                                    size={14}
                                                                />
                                                                Pass
                                                            </>
                                                        ) : (
                                                            <>
                                                                <X size={14} />
                                                                Fail
                                                            </>
                                                        )}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {new Date(
                                                        score.date
                                                    ).toLocaleDateString()}
                                                </td>
                                            </tr>
                                        )
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                );
            case "overall":
                const chartData: ChartData[] = [
                    {
                        name: "Present",
                        value: attendanceData?.total_p_days || 0,
                        color: "#10B981",
                    },
                    {
                        name: "Absent",
                        value: attendanceData?.total_a_days || 0,
                        color: "#EF4444",
                    },
                    {
                        name: "Half Day",
                        value: attendanceData?.total_hd_days || 0,
                        color: "#F59E0B",
                    },
                    {
                        name: "Holiday",
                        value: attendanceData
                            ? attendanceData.total_w_days -
                              (attendanceData.total_p_days +
                                  attendanceData.total_a_days +
                                  attendanceData.total_hd_days)
                            : 0,
                        color: "#3B82F6",
                    },
                ];

                return (
                    <div className="space-y-6">
                        {/* Attendance Overview */}
                        <div className="bg-white p-6 rounded-xl shadow-sm">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-lg font-semibold text-gray-800">
                                    Attendance Overview
                                </h3>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => {
                                            if (overallMonth === 1) {
                                                setOverallMonth(12);
                                                setOverallYear(
                                                    (prev) => prev - 1
                                                );
                                            } else {
                                                setOverallMonth(
                                                    (prev) => prev - 1
                                                );
                                            }
                                        }}
                                        className="p-1.5 hover:bg-gray-100 rounded-lg"
                                    >
                                        <ChevronLeft size={18} />
                                    </button>

                                    <span className="text-sm font-medium text-gray-600">
                                        {new Date(
                                            overallYear,
                                            overallMonth - 1
                                        ).toLocaleString("default", {
                                            month: "long",
                                        })}{" "}
                                        {overallYear}
                                    </span>

                                    <button
                                        onClick={() => {
                                            if (overallMonth === 12) {
                                                setOverallMonth(1);
                                                setOverallYear(
                                                    (prev) => prev + 1
                                                );
                                            } else {
                                                setOverallMonth(
                                                    (prev) => prev + 1
                                                );
                                            }
                                        }}
                                        className="p-1.5 hover:bg-gray-100 rounded-lg"
                                    >
                                        <ChevronRight size={18} />
                                    </button>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Pie Chart */}
                                <div className="h-64">
                                    <ResponsiveContainer
                                        width="100%"
                                        height="100%"
                                    >
                                        <PieChart>
                                            <Pie
                                                data={chartData}
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={60}
                                                outerRadius={80}
                                                paddingAngle={5}
                                                dataKey="value"
                                            >
                                                {chartData.map(
                                                    (
                                                        entry: ChartData,
                                                        index: number
                                                    ) => (
                                                        <Cell
                                                            key={`cell-${index}`}
                                                            fill={entry.color}
                                                        />
                                                    )
                                                )}
                                            </Pie>
                                            <Tooltip
                                                formatter={(value) => [
                                                    `${value} Days`,
                                                    "",
                                                ]}
                                                contentStyle={{
                                                    borderRadius: "8px",
                                                }}
                                            />
                                            <Legend
                                                verticalAlign="middle"
                                                align="right"
                                                layout="vertical"
                                                iconType="circle"
                                            />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>

                                {/* Summary Cards */}
                                <div className="grid grid-cols-2 gap-4 content-center">
                                    {chartData.map((item) => (
                                        <div
                                            key={item.name}
                                            className="p-4 rounded-lg border"
                                            style={{
                                                backgroundColor: `${item.color}10`,
                                                borderColor: `${item.color}30`,
                                            }}
                                        >
                                            <p
                                                className="text-sm"
                                                style={{ color: item.color }}
                                            >
                                                {item.name}
                                            </p>
                                            <p
                                                className="text-2xl font-bold mt-1"
                                                style={{ color: item.color }}
                                            >
                                                {item.value}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Exams Overview */}
                        <div className="bg-white p-6 rounded-xl shadow-sm">
                            <h3 className="text-lg font-semibold text-gray-800 mb-6">
                                Exams Overview
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Term Exams Summary */}
                                <div className="space-y-4">
                                    <h4 className="font-medium text-gray-700 flex items-center gap-2">
                                        <BookOpenCheck size={16} />
                                        Term Exams Performance
                                    </h4>
                                    <div className="space-y-3">
                                        {exams.map((exam) => {
                                            const examScoresFiltered =
                                                examScores.filter(
                                                    (score) =>
                                                        score.examName ===
                                                        exam.Name
                                                );
                                            const totalMarks =
                                                examScoresFiltered.reduce(
                                                    (sum, score) =>
                                                        sum +
                                                        score.marksObtained,
                                                    0
                                                );
                                            const maxMarks =
                                                examScoresFiltered.reduce(
                                                    (sum, score) =>
                                                        sum + score.maxMarks,
                                                    0
                                                );
                                            const percentage =
                                                maxMarks > 0
                                                    ? (totalMarks / maxMarks) *
                                                      100
                                                    : 0;
                                            const passedSubjects =
                                                examScoresFiltered.filter(
                                                    (score) => score.isPassed
                                                ).length;

                                            return (
                                                <div
                                                    key={exam.ID}
                                                    className="bg-gray-50 p-4 rounded-lg"
                                                >
                                                    <div className="flex justify-between items-start mb-2">
                                                        <div>
                                                            <h5 className="font-medium text-gray-800">
                                                                {exam.Name}
                                                            </h5>
                                                            <p className="text-sm text-gray-500">
                                                                {new Date(
                                                                    exam.CreatedAt
                                                                ).toLocaleDateString()}
                                                            </p>
                                                        </div>
                                                        <span
                                                            className={`px-3 py-1 rounded-full text-sm font-medium ${
                                                                percentage >= 75
                                                                    ? "bg-green-100 text-green-700"
                                                                    : percentage >=
                                                                        50
                                                                      ? "bg-yellow-100 text-yellow-700"
                                                                      : "bg-red-100 text-red-700"
                                                            }`}
                                                        >
                                                            {percentage.toFixed(
                                                                1
                                                            )}
                                                            %
                                                        </span>
                                                    </div>
                                                    <div className="mt-2 space-y-2">
                                                        <div className="flex justify-between text-sm">
                                                            <span className="text-gray-600">
                                                                Total Marks
                                                            </span>
                                                            <span className="font-medium">
                                                                {totalMarks}/
                                                                {maxMarks}
                                                            </span>
                                                        </div>
                                                        <div className="flex justify-between text-sm">
                                                            <span className="text-gray-600">
                                                                Subjects Passed
                                                            </span>
                                                            <span className="font-medium">
                                                                {passedSubjects}
                                                                /
                                                                {
                                                                    examScoresFiltered.length
                                                                }
                                                            </span>
                                                        </div>
                                                        <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
                                                            <div
                                                                className="bg-emerald-500 h-1.5 rounded-full"
                                                                style={{
                                                                    width: `${percentage}%`,
                                                                }}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Unit Tests Summary */}
                                <div className="space-y-4">
                                    <h4 className="font-medium text-gray-700 flex items-center gap-2">
                                        <ClipboardList size={16} />
                                        Unit Tests Performance
                                    </h4>
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <div className="space-y-4">
                                            {/* Average Score */}
                                            <div>
                                                <div className="flex justify-between mb-1">
                                                    <span className="text-sm text-gray-600">
                                                        Average Score
                                                    </span>
                                                    <span className="text-sm font-medium">
                                                        82%
                                                    </span>
                                                </div>
                                                <div className="w-full bg-gray-200 rounded-full h-1.5">
                                                    <div
                                                        className="bg-emerald-500 h-1.5 rounded-full"
                                                        style={{ width: "82%" }}
                                                    />
                                                </div>
                                            </div>

                                            {/* Tests Summary */}
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="bg-white p-3 rounded-lg border border-gray-200">
                                                    <p className="text-sm text-gray-600">
                                                        Total Tests
                                                    </p>
                                                    <p className="text-xl font-semibold text-gray-800">
                                                        {unitTestScores.length}
                                                    </p>
                                                </div>
                                                <div className="bg-white p-3 rounded-lg border border-gray-200">
                                                    <p className="text-sm text-gray-600">
                                                        Tests Passed
                                                    </p>
                                                    <p className="text-xl font-semibold text-green-600">
                                                        {
                                                            unitTestScores.filter(
                                                                (test) =>
                                                                    test.isPassed
                                                            ).length
                                                        }
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            case "attendance":
                return (
                    <div className="space-y-4">
                        {/* Month/Year Selector and Summary - Always visible */}
                        <div className="bg-white p-4 rounded-xl shadow-sm">
                            <div className="flex flex-wrap justify-between items-center gap-4 mb-4">
                                {/* Month/Year Controls */}
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => {
                                            if (selectedMonth === 1) {
                                                setSelectedMonth(12);
                                                setSelectedYear(
                                                    (prev) => prev - 1
                                                );
                                            } else {
                                                setSelectedMonth(
                                                    (prev) => prev - 1
                                                );
                                            }
                                        }}
                                        disabled={
                                            selectedYear === currentYear - 2 &&
                                            selectedMonth === 1
                                        }
                                        className={`p-1.5 rounded-lg ${
                                            selectedYear === currentYear - 2 &&
                                            selectedMonth === 1
                                                ? "text-gray-300 cursor-not-allowed"
                                                : "hover:bg-gray-100 text-gray-600"
                                        }`}
                                    >
                                        <ChevronLeft size={18} />
                                    </button>

                                    <select
                                        value={selectedMonth}
                                        onChange={(e) => {
                                            const newMonth = Number(
                                                e.target.value
                                            );
                                            if (
                                                selectedYear === currentYear &&
                                                newMonth > currentMonth
                                            ) {
                                                return;
                                            }
                                            setSelectedMonth(newMonth);
                                        }}
                                        className="px-2 py-1.5 border rounded-lg text-sm focus:ring-1 focus:ring-emerald-500"
                                    >
                                        {[
                                            "Jan",
                                            "Feb",
                                            "Mar",
                                            "Apr",
                                            "May",
                                            "Jun",
                                            "Jul",
                                            "Aug",
                                            "Sep",
                                            "Oct",
                                            "Nov",
                                            "Dec",
                                        ].map((month, index) => (
                                            <option
                                                key={month}
                                                value={index + 1}
                                                disabled={
                                                    selectedYear ===
                                                        currentYear &&
                                                    index + 1 > currentMonth
                                                }
                                            >
                                                {month}
                                            </option>
                                        ))}
                                    </select>

                                    <select
                                        value={selectedYear}
                                        onChange={(e) => {
                                            const newYear = Number(
                                                e.target.value
                                            );
                                            if (newYear > currentYear) {
                                                return;
                                            }
                                            setSelectedYear(newYear);
                                            if (
                                                newYear === currentYear &&
                                                selectedMonth > currentMonth
                                            ) {
                                                setSelectedMonth(currentMonth);
                                            }
                                        }}
                                        className="px-2 py-1.5 border rounded-lg text-sm focus:ring-1 focus:ring-emerald-500"
                                    >
                                        {Array.from(
                                            { length: 3 },
                                            (_, i) => currentYear - 2 + i
                                        ).map((year) => (
                                            <option
                                                key={year}
                                                value={year}
                                                disabled={year > currentYear}
                                            >
                                                {year}
                                            </option>
                                        ))}
                                    </select>

                                    <button
                                        onClick={() => {
                                            if (selectedMonth === 12) {
                                                if (
                                                    selectedYear + 1 <=
                                                    currentYear
                                                ) {
                                                    setSelectedMonth(1);
                                                    setSelectedYear(
                                                        (prev) => prev + 1
                                                    );
                                                }
                                            } else if (
                                                !(
                                                    selectedYear ===
                                                        currentYear &&
                                                    selectedMonth + 1 >
                                                        currentMonth
                                                )
                                            ) {
                                                setSelectedMonth(
                                                    (prev) => prev + 1
                                                );
                                            }
                                        }}
                                        disabled={
                                            selectedYear === currentYear &&
                                            selectedMonth === currentMonth
                                        }
                                        className={`p-1.5 rounded-lg ${
                                            selectedYear === currentYear &&
                                            selectedMonth === currentMonth
                                                ? "text-gray-300 cursor-not-allowed"
                                                : "hover:bg-gray-100 text-gray-600"
                                        }`}
                                    >
                                        <ChevronRight size={18} />
                                    </button>
                                </div>

                                {/* Summary Pills - Show only when data is available */}
                                {attendanceData && (
                                    <div className="flex flex-wrap items-center gap-2">
                                        <span className="px-3 py-1 bg-green-50 text-green-700 text-sm rounded-full border border-green-200">
                                            Present:{" "}
                                            {attendanceData.total_p_days || 0}
                                        </span>
                                        <span className="px-3 py-1 bg-red-50 text-red-700 text-sm rounded-full border border-red-200">
                                            Absent:{" "}
                                            {attendanceData.total_a_days || 0}
                                        </span>
                                        <span className="px-3 py-1 bg-yellow-50 text-yellow-700 text-sm rounded-full border border-yellow-200">
                                            Half:{" "}
                                            {attendanceData.total_hd_days || 0}
                                        </span>
                                        <span className="px-3 py-1 bg-blue-50 text-blue-700 text-sm rounded-full border border-blue-200">
                                            Total:{" "}
                                            {attendanceData.total_w_days || 0}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Loading, Error, and Calendar Content */}
                        {attendanceLoading ? (
                            <div className="flex justify-center p-8">
                                <CircularProgress />
                            </div>
                        ) : attendanceError ? (
                            <div className="text-red-500 text-center p-8">
                                {attendanceError}
                            </div>
                        ) : attendanceData ? (
                            <div className="space-y-4">
                                {/* Calendar */}
                                <div className="bg-white p-4 rounded-xl shadow-sm max-w-3xl mx-auto">
                                    <div className="grid grid-cols-7 gap-x-0.5 gap-y-1">
                                        {/* Week days header */}
                                        <div className="col-span-7 grid grid-cols-7">
                                            {[
                                                "S",
                                                "M",
                                                "T",
                                                "W",
                                                "T",
                                                "F",
                                                "S",
                                            ].map((day) => (
                                                <div
                                                    key={day}
                                                    className="text-center text-sm font-medium text-gray-500 pb-2"
                                                >
                                                    {day}
                                                </div>
                                            ))}
                                        </div>

                                        {/* Empty cells */}
                                        {Array.from(
                                            {
                                                length: getFirstDayOfMonth(
                                                    selectedYear,
                                                    selectedMonth
                                                ),
                                            },
                                            (_, i) => (
                                                <div
                                                    key={`empty-${i}`}
                                                    className="w-14 h-14"
                                                />
                                            )
                                        )}

                                        {/* Calendar days */}
                                        {Array.from(
                                            {
                                                length: getDaysInMonth(
                                                    selectedYear,
                                                    selectedMonth
                                                ),
                                            },
                                            (_, i) => {
                                                const day = (i + 1).toString();
                                                const attendance =
                                                    attendanceData?.DayWiseAttendance?.find(
                                                        (a) => a.day === i + 1
                                                    );
                                                const status =
                                                    attendance?.status || null;

                                                return (
                                                    <div
                                                        key={i}
                                                        className={`w-14 h-14 rounded border ${
                                                            status
                                                                ? getAttendanceColor(
                                                                      status
                                                                  )
                                                                : "border-gray-200"
                                                        } flex flex-col items-center justify-center mx-auto`}
                                                    >
                                                        <span className="text-sm font-medium leading-none">
                                                            {day}
                                                        </span>
                                                        {status && (
                                                            <span className="text-xs leading-none mt-1.5">
                                                                {status ===
                                                                    "e" ||
                                                                status === "m"
                                                                    ? "HD"
                                                                    : status.toUpperCase()}
                                                            </span>
                                                        )}
                                                    </div>
                                                );
                                            }
                                        )}
                                    </div>
                                </div>

                                {/* Legend */}
                                <div className="bg-white p-4 rounded-xl shadow-sm">
                                    <div className="flex flex-wrap gap-3">
                                        <span className="flex items-center gap-1.5 text-xs">
                                            <span className="w-3 h-3 rounded-full bg-green-100 border border-green-200"></span>
                                            Present (P)
                                        </span>
                                        <span className="flex items-center gap-1.5 text-xs">
                                            <span className="w-3 h-3 rounded-full bg-red-100 border border-red-200"></span>
                                            Absent (A)
                                        </span>
                                        <span className="flex items-center gap-1.5 text-xs">
                                            <span className="w-3 h-3 rounded-full bg-blue-100 border border-blue-200"></span>
                                            Holiday (H)
                                        </span>
                                        <span className="flex items-center gap-1.5 text-xs">
                                            <span className="w-3 h-3 rounded-full bg-yellow-100 border border-yellow-200"></span>
                                            Half Day (HD)
                                        </span>
                                        <span className="flex items-center gap-1.5 text-xs">
                                            <span className="w-3 h-3 rounded-full bg-purple-100 border border-purple-200"></span>
                                            Special (SH)
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ) : null}
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="space-y-6">
            {student && (
                <>
                    {/* Header with Back Button - Sticky on mobile */}
                    <div className="flex justify-between items-center bg-white p-6 rounded-xl shadow-sm sticky top-0 z-20 lg:relative lg:top-auto">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={onBack}
                                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                            >
                                <ArrowLeft size={20} />
                            </button>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-800">
                                    Student Profile
                                </h1>
                                <p className="text-sm text-gray-500">
                                    View and manage student information
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => onEdit(student)}
                                className="px-4 py-2 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors flex items-center gap-2"
                            >
                                <Edit size={18} /> Edit Profile
                            </button>
                            <button
                                onClick={() => onDelete(student.id)}
                                className="px-4 py-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-colors flex items-center gap-2"
                            >
                                <Trash size={18} /> Delete
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-12 gap-6">
                        {/* Left Column - Make it sticky */}
                        <div className="col-span-12 lg:col-span-4 lg:sticky top-6 self-start">
                            <div className="bg-white p-6 rounded-xl shadow-sm">
                                <div className="flex flex-col items-center pb-6 border-b">
                                    <div className="w-32 h-32 bg-gray-200 rounded-full mb-4 ring-4 ring-emerald-50">
                                        {student.profilePic ? (
                                            <img
                                                src={student.profilePic}
                                                alt={student.name}
                                                className="w-full h-full rounded-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full rounded-full flex items-center justify-center bg-emerald-100">
                                                <User
                                                    size={40}
                                                    className="text-emerald-600"
                                                />
                                            </div>
                                        )}
                                    </div>
                                    <h2 className="text-2xl font-bold text-gray-800">
                                        {student.name}
                                    </h2>
                                    <div className="flex items-center gap-2 mt-2">
                                        <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-medium rounded-full">
                                            {student.className}
                                        </span>
                                        <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                                            ID: {student.idCardNumber}
                                        </span>
                                    </div>
                                </div>

                                <div className="pt-6 space-y-4">
                                    <div className="flex items-center gap-3 text-gray-600 p-2 hover:bg-gray-50 rounded-lg transition-colors">
                                        <Phone
                                            size={18}
                                            className="text-gray-400"
                                        />
                                        <div>
                                            <p className="text-sm text-gray-400">
                                                Phone
                                            </p>
                                            <p className="font-medium">
                                                {student.phone}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 text-gray-600 p-2 hover:bg-gray-50 rounded-lg transition-colors">
                                        <Mail
                                            size={18}
                                            className="text-gray-400"
                                        />
                                        <div>
                                            <p className="text-sm text-gray-400">
                                                Email
                                            </p>
                                            <p className="font-medium">
                                                {student.email}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 text-gray-600 p-2 hover:bg-gray-50 rounded-lg transition-colors">
                                        <Calendar
                                            size={18}
                                            className="text-gray-400"
                                        />
                                        <div>
                                            <p className="text-sm text-gray-400">
                                                Date of Birth
                                            </p>
                                            <p className="font-medium">
                                                {new Date(
                                                    student.dob
                                                ).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 text-gray-600 p-2 hover:bg-gray-50 rounded-lg transition-colors">
                                        <Heart
                                            size={18}
                                            className="text-gray-400"
                                        />
                                        <div>
                                            <p className="text-sm text-gray-400">
                                                Blood Group
                                            </p>
                                            <p className="font-medium">
                                                {student.bloodGroup}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Column */}
                        <div className="col-span-12 lg:col-span-8">
                            {/* Tabs Navigation - Sticky */}
                            <div className="bg-white rounded-xl shadow-sm sticky top-6 z-10">
                                <div className="border-b overflow-x-auto">
                                    <ul className="flex min-w-max text-sm font-medium">
                                        {tabs.map((tab) => (
                                            <li
                                                key={tab.id}
                                                className="flex-shrink-0"
                                                style={{ minWidth: "100px" }}
                                            >
                                                <button
                                                    onClick={() =>
                                                        setActiveTab(tab.id)
                                                    }
                                                    className={`w-full p-3 border-b-2 ${
                                                        activeTab === tab.id
                                                            ? "border-emerald-500 text-emerald-600"
                                                            : "border-transparent hover:text-gray-500 hover:border-gray-300"
                                                    }`}
                                                    role="tab"
                                                    aria-selected={
                                                        activeTab === tab.id
                                                    }
                                                >
                                                    <div className="flex items-center justify-center gap-2">
                                                        {tab.icon}
                                                        <span className="text-sm font-medium">
                                                            {tab.label}
                                                        </span>
                                                    </div>
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>

                            {/* Tab Content - Scrollable */}
                            <div className="mt-6 h-[calc(100vh-220px)] overflow-y-auto pr-4">
                                {renderTabContent()}
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default StudentDetails;
