import { useEffect, useState, useMemo } from "react";
import {
    Check,
    X,
    Clock,
    ChevronLeft,
    ChevronRight,
    Printer,
    Filter,
    Calendar as CalendarIcon,
} from "lucide-react";
import {
    startOfMonth,
    endOfMonth,
    startOfWeek,
    endOfWeek,
    addDays,
    format,
    isToday,
    isSameMonth,
} from "date-fns";
import { getStaffAttendanceByMonth } from "../../api/staffs";
import { StaffAttendanceData } from "../../types/StateTypes";

type AttendanceStatus = "f" | "a" | "m" | "e";

const ATTENDANCE_FILTERS = [
    { value: "f", label: "Full Day", color: "emerald" },
    { value: "a", label: "Absent", color: "red" },
    { value: "m", label: "Half Day (M)", color: "yellow" },
    { value: "e", label: "Half Day (E)", color: "orange" },
];

const StaffAttendance = () => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [showFilters, setShowFilters] = useState(false);
    const [filterStatus, setFilterStatus] = useState<AttendanceStatus[]>([]);

    const [year, setYear] = useState(currentDate?.getFullYear());
    const [month, setMonth] = useState(currentDate?.getMonth() + 1);

    // Updated initial state with more dummy data
    const [attendanceData, setAttendanceData] = useState<StaffAttendanceData | null>({
        total_w_days: 0,
        total_p_days: 0,
        total_a_days: 0,
        total_hd_days: 0,
        DayWiseAttendance: null,
    });

    useEffect(() => {
        fetchStaffAttendanceData({ year: String(year), month: String(month) });
    }, [year, month]);

    useEffect(() => {
        setYear(currentDate?.getFullYear());
        setMonth(currentDate?.getMonth() + 1);
    }, [currentDate]);

    const fetchStaffAttendanceData = async ({
        year,
        month,
    }: {
        year: string;
        month: string;
    }) => {
        try {
            const data = await getStaffAttendanceByMonth({ year, month });
            setAttendanceData(data);
        } catch (error) {
            console.log(error);
        }
    };

    const days = useMemo(() => {
        const startDate = startOfWeek(startOfMonth(currentDate));
        const endDate = endOfWeek(endOfMonth(currentDate));

        const calendarDays = [];
        let date = startDate;

        while (date <= endDate) {
            calendarDays.push(date);
            date = addDays(date, 1);
        }

        return calendarDays;
    }, [currentDate]);

    const filteredAttendance = useMemo(() => {
        if (filterStatus.length === 0) return attendanceData?.DayWiseAttendance;
        return attendanceData?.DayWiseAttendance?.filter((attendance) =>
            filterStatus.includes(attendance.status as AttendanceStatus)
        );
    }, [attendanceData?.DayWiseAttendance, filterStatus]);

    const getAttendanceStatus = (date: Date) => {
        const dayOfMonth = date.getDate();
        if (isSameMonth(date, currentDate)) {
            return filteredAttendance?.find(
                (attendance) => attendance.day === dayOfMonth
            );
        }
        return null;
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "m": // morning (half day)
                return (
                    <div className="flex flex-col items-center">
                        <div className="w-6 h-6 rounded-full bg-yellow-100 flex items-center justify-center">
                            <Clock className="text-yellow-500" size={14} />
                        </div>
                    </div>
                );
            case "e": // evening (half day)
                return (
                    <div className="flex flex-col items-center">
                        <div className="w-6 h-6 rounded-full bg-orange-100 flex items-center justify-center">
                            <Clock className="text-orange-500" size={14} />
                        </div>
                    </div>
                );
            case "f": // full day
                return (
                    <div className="flex flex-col items-center">
                        <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center">
                            <Check className="text-emerald-500" size={14} />
                        </div>
                    </div>
                );
            case "a": // absent
                return (
                    <div className="flex flex-col items-center">
                        <div className="w-6 h-6 rounded-full bg-red-100 flex items-center justify-center">
                            <X className="text-red-500" size={14} />
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case "m":
                return "Half Day (M)";
            case "e":
                return "Half Day (E)";
            case "f":
                return "Full Day";
            case "a":
                return "Absent";
            default:
                return "";
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "m":
                return "text-yellow-600";
            case "e":
                return "text-orange-600";
            case "f":
                return "text-emerald-600";
            case "a":
                return "text-red-600";
            default:
                return "text-gray-400";
        }
    };

    // Navigate to previous and next months
    const goToPreviousMonth = () =>
        setCurrentDate(addDays(startOfMonth(currentDate), -1));
    const goToNextMonth = () =>
        setCurrentDate(addDays(endOfMonth(currentDate), 1));

    if (!attendanceData?.DayWiseAttendance) {
        // Show only calendar without attendance data
        return (
            <div className="bg-white rounded-lg shadow-md max-w-3xl mx-auto">
                <div className="p-3 border-b flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <h3 className="text-base font-semibold flex items-center gap-2">
                            <CalendarIcon size={18} className="text-gray-500" />
                            Calendar
                        </h3>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={goToPreviousMonth}
                                className="p-1 hover:bg-gray-100 rounded-full"
                            >
                                <ChevronLeft size={20} />
                            </button>
                            <span className="text-sm font-medium">
                                {format(currentDate, "MMMM yyyy")}
                            </span>
                            <button
                                onClick={goToNextMonth}
                                className="p-1 hover:bg-gray-100 rounded-full"
                            >
                                <ChevronRight size={20} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Basic Calendar Grid */}
                <div className="p-3">
                    <div className="grid grid-cols-7 gap-1">
                        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                            (day) => (
                                <div
                                    key={day}
                                    className="text-center text-xs font-medium text-gray-500 py-1"
                                >
                                    {day}
                                </div>
                            )
                        )}
                        {days.map((date, idx) => (
                            <div
                                key={idx}
                                className={`
                                    h-20 p-1 rounded-md border flex flex-col items-center
                                    ${!isSameMonth(date, currentDate) ? "bg-gray-50 text-gray-400" : "bg-white"}
                                    ${isToday(date) ? "border-emerald-500" : "border-gray-100"}
                                `}
                            >
                                <span
                                    className={`text-xs ${isToday(date) ? "font-bold" : ""}`}
                                >
                                    {format(date, "d")}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 print:grid-cols-4">
                <div className="bg-emerald-50 p-3 rounded-lg">
                    <p className="text-xs text-gray-600">Present Days</p>
                    <p className="text-xl font-bold text-emerald-600">
                        {attendanceData?.total_p_days}
                    </p>
                </div>
                <div className="bg-red-50 p-3 rounded-lg">
                    <p className="text-xs text-gray-600">Absent Days</p>
                    <p className="text-xl font-bold text-red-600">
                        {attendanceData?.total_a_days}
                    </p>
                </div>
                <div className="bg-yellow-50 p-3 rounded-lg">
                    <p className="text-xs text-gray-600">Half Days</p>
                    <p className="text-xl font-bold text-yellow-600">
                        {attendanceData?.total_hd_days}
                    </p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-xs text-gray-600">Attendance Rate</p>
                    <p className="text-xl font-bold text-gray-600">
                        {((attendanceData?.total_p_days +
                            attendanceData?.total_hd_days / 2) /
                            attendanceData?.total_w_days) *
                            100}
                        %
                    </p>
                </div>
            </div>

            {/* Calendar View */}
            <div className="bg-white rounded-lg shadow-md max-w-3xl mx-auto">
                {/* Calendar Header with Navigation */}
                <div className="p-3 border-b flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <h3 className="text-base font-semibold flex items-center gap-2">
                            <CalendarIcon size={18} className="text-gray-500" />
                            Attendance Calendar
                        </h3>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={goToPreviousMonth}
                                className="p-1 hover:bg-gray-100 rounded-full"
                            >
                                <ChevronLeft size={20} />
                            </button>
                            <span className="text-sm font-medium">
                                {format(currentDate, "MMMM yyyy")}
                            </span>
                            <button
                                onClick={goToNextMonth}
                                className="p-1 hover:bg-gray-100 rounded-full"
                            >
                                <ChevronRight size={20} />
                            </button>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className="p-2 hover:bg-gray-100 rounded-lg flex items-center gap-1 text-sm"
                        >
                            <Filter size={16} />
                            Filter
                        </button>
                        <button className="p-2 hover:bg-gray-100 rounded-lg flex items-center gap-1 text-sm print:hidden">
                            <Printer size={16} />
                            Print
                        </button>
                    </div>
                </div>

                {showFilters && (
                    <div className="p-3 border-b">
                        <div className="flex flex-wrap gap-2">
                            {ATTENDANCE_FILTERS.map(
                                ({ value, label, color }) => (
                                    <button
                                        key={value}
                                        onClick={() => {
                                            setFilterStatus((prev) =>
                                                prev.includes(
                                                    value as AttendanceStatus
                                                )
                                                    ? prev.filter(
                                                        (s) => s !== value
                                                    )
                                                    : [
                                                        ...prev,
                                                        value as AttendanceStatus,
                                                    ]
                                            );
                                        }}
                                        className={`px-3 py-1 rounded-full text-sm border
                                        ${filterStatus.includes(
                                            value as AttendanceStatus
                                        )
                                                ? `bg-${color}-100 border-${color}-500 text-${color}-700`
                                                : "border-gray-300 hover:bg-gray-50"
                                            }`}
                                    >
                                        {label}
                                    </button>
                                )
                            )}
                        </div>
                    </div>
                )}

                {/* Calendar Grid */}
                <div className="p-3">
                    <div className="grid grid-cols-7 gap-1">
                        {/* Weekday headers */}
                        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                            (day) => (
                                <div
                                    key={day}
                                    className="text-center text-xs font-medium text-gray-500 py-1"
                                >
                                    {day}
                                </div>
                            )
                        )}

                        {/* Calendar days */}
                        {days.map((date, idx) => {
                            const isCurrentMonth = isSameMonth(
                                date,
                                currentDate
                            );
                            const attendance = isCurrentMonth
                                ? getAttendanceStatus(date)
                                : null;

                            return (
                                <div
                                    key={idx}
                                    className={`
                    h-20 p-1 rounded-md border flex flex-col items-center
                    ${!isCurrentMonth ? "bg-gray-50 text-gray-400" : "bg-white"}
                    ${isToday(date) ? "border-emerald-500" : "border-gray-100"}
                    ${attendance ? "hover:bg-gray-50" : ""}
                `}
                                >
                                    <span
                                        className={`text-xs ${isToday(date) ? "font-bold" : ""}`}
                                    >
                                        {format(date, "d")}
                                    </span>
                                    {attendance && isCurrentMonth && (
                                        <div className="flex-1 flex flex-col items-center justify-center gap-0.5">
                                            {getStatusIcon(attendance.status)}
                                            <span
                                                className={`text-xs font-medium ${getStatusColor(
                                                    attendance.status
                                                )}`}
                                            >
                                                {getStatusText(
                                                    attendance.status
                                                )}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Legend */}
                <div className="p-2 border-t">
                    <div className="flex items-center justify-center space-x-4">
                        <div className="flex items-center space-x-1">
                            <Check size={14} className="text-emerald-500" />
                            <span className="text-xs text-gray-600">
                                Full Day
                            </span>
                        </div>
                        <div className="flex items-center space-x-1">
                            <Clock size={14} className="text-yellow-500" />
                            <span className="text-xs text-gray-600">
                                Half Day (Morning)
                            </span>
                        </div>
                        <div className="flex items-center space-x-1">
                            <Clock size={14} className="text-orange-500" />
                            <span className="text-xs text-gray-600">
                                Half Day (Evening)
                            </span>
                        </div>
                        <div className="flex items-center space-x-1">
                            <X size={14} className="text-orange-500" />
                            <span className="text-xs text-gray-600">
                                Absent
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StaffAttendance;
