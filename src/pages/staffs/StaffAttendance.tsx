import { useState } from 'react';
import {
    Check, X, Clock, ChevronLeft, ChevronRight,
    Printer, Filter, Calendar as CalendarIcon
} from 'lucide-react';
import {
    format, isSameMonth,
    // startOfMonth, endOfMonth
    isToday, addMonths, subMonths
} from 'date-fns';

const StaffAttendance = () => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [showFilters, setShowFilters] = useState(false);
    const [filterStatus, setFilterStatus] = useState<string[]>([]);

    // Updated dummy data with current month dates
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1;
    const [attendanceData] = useState<Record<string, { status: string; time: string }>>({
        [`${currentYear}-${String(currentMonth).padStart(2, '0')}-01`]: { status: 'present', time: '9:00 AM' },
        [`${currentYear}-${String(currentMonth).padStart(2, '0')}-02`]: { status: 'present', time: '8:55 AM' },
        [`${currentYear}-${String(currentMonth).padStart(2, '0')}-03`]: { status: 'present', time: '9:02 AM' },
        [`${currentYear}-${String(currentMonth).padStart(2, '0')}-04`]: { status: 'halfday', time: '9:00 AM' },
        [`${currentYear}-${String(currentMonth).padStart(2, '0')}-05`]: { status: 'present', time: '8:50 AM' },
        [`${currentYear}-${String(currentMonth).padStart(2, '0')}-06`]: { status: 'present', time: '8:58 AM' },
        [`${currentYear}-${String(currentMonth).padStart(2, '0')}-07`]: { status: 'absent', time: '-' },
        [`${currentYear}-${String(currentMonth).padStart(2, '0')}-08`]: { status: 'present', time: '8:57 AM' },
        [`${currentYear}-${String(currentMonth).padStart(2, '0')}-09`]: { status: 'present', time: '8:45 AM' },
        [`${currentYear}-${String(currentMonth).padStart(2, '0')}-10`]: { status: 'halfday', time: '9:05 AM' },
        [`${currentYear}-${String(currentMonth).padStart(2, '0')}-11`]: { status: 'present', time: '8:52 AM' },
        [`${currentYear}-${String(currentMonth).padStart(2, '0')}-12`]: { status: 'present', time: '8:48 AM' },
        [`${currentYear}-${String(currentMonth).padStart(2, '0')}-13`]: { status: 'present', time: '8:55 AM' },
        [`${currentYear}-${String(currentMonth).padStart(2, '0')}-14`]: { status: 'absent', time: '-' },
        [`${currentYear}-${String(currentMonth).padStart(2, '0')}-15`]: { status: 'present', time: '9:01 AM' }
    });

    // Calculate stats from dummy data
    const stats = {
        present: Object.values(attendanceData).filter(a => a.status === 'present').length,
        absent: Object.values(attendanceData).filter(a => a.status === 'absent').length,
        halfday: Object.values(attendanceData).filter(a => a.status === 'halfday').length,
        total: Object.keys(attendanceData).length
    };

    const attendanceRate = ((stats.present + (stats.halfday * 0.5)) / stats.total * 100).toFixed(1);

    // const monthStart = startOfMonth(currentDate);
    // const monthEnd = endOfMonth(currentDate);
    const days = Array.from({ length: 31 }, (_, i) => new Date(currentYear, currentMonth - 1, i + 1));

    const getAttendanceStatus = (date: Date) => {
        const dateStr = format(date, 'yyyy-MM-dd');
        return attendanceData[dateStr];
    };

    const handlePreviousMonth = () => {
        setCurrentDate(prev => subMonths(prev, 1));
    };

    const handleNextMonth = () => {
        setCurrentDate(prev => addMonths(prev, 1));
    };

    const handlePrint = () => {
        window.print();
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'present':
                return (
                    <div className="flex flex-col items-center">
                        <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center">
                            <Check className="text-emerald-500" size={14} />
                        </div>
                    </div>
                );
            case 'absent':
                return (
                    <div className="flex flex-col items-center">
                        <div className="w-6 h-6 rounded-full bg-red-100 flex items-center justify-center">
                            <X className="text-red-500" size={14} />
                        </div>
                    </div>
                );
            case 'halfday':
                return (
                    <div className="flex flex-col items-center">
                        <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center">
                            <Clock className="text-blue-500" size={14} />
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case 'present':
                return 'Present';
            case 'absent':
                return 'Absent';
            case 'halfday':
                return 'Half Day';
            default:
                return '';
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'present':
                return 'text-emerald-600';
            case 'absent':
                return 'text-red-600';
            case 'halfday':
                return 'text-blue-600';
            default:
                return 'text-gray-400';
        }
    };

    return (
        <div className="space-y-4">
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 print:grid-cols-4">
                <div className="bg-emerald-50 p-3 rounded-lg">
                    <p className="text-xs text-gray-600">Present Days</p>
                    <p className="text-xl font-bold text-emerald-600">{stats.present}</p>
                </div>
                <div className="bg-red-50 p-3 rounded-lg">
                    <p className="text-xs text-gray-600">Absent Days</p>
                    <p className="text-xl font-bold text-red-600">{stats.absent}</p>
                </div>
                <div className="bg-blue-50 p-3 rounded-lg">
                    <p className="text-xs text-gray-600">Half Days</p>
                    <p className="text-xl font-bold text-blue-600">{stats.halfday}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-xs text-gray-600">Attendance Rate</p>
                    <p className="text-xl font-bold text-gray-600">{attendanceRate}%</p>
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
                                onClick={handlePreviousMonth}
                                className="p-1 hover:bg-gray-100 rounded-full"
                            >
                                <ChevronLeft size={20} />
                            </button>
                            <span className="text-sm font-medium">
                                {format(currentDate, 'MMMM yyyy')}
                            </span>
                            <button
                                onClick={handleNextMonth}
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
                        <button
                            onClick={handlePrint}
                            className="p-2 hover:bg-gray-100 rounded-lg flex items-center gap-1 text-sm print:hidden"
                        >
                            <Printer size={16} />
                            Print
                        </button>
                    </div>
                </div>

                {/* Filters Panel */}
                {showFilters && (
                    <div className="p-3 border-b bg-gray-50">
                        <div className="flex gap-2">
                            {['present', 'absent', 'halfday'].map(status => (
                                <label key={status} className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        checked={filterStatus.includes(status)}
                                        onChange={(e) => {
                                            if (e.target.checked) {
                                                setFilterStatus([...filterStatus, status]);
                                            } else {
                                                setFilterStatus(filterStatus.filter(s => s !== status));
                                            }
                                        }}
                                        className="rounded border-gray-300"
                                    />
                                    <span className="capitalize text-sm">{status}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                )}

                {/* Calendar Grid */}
                <div className="p-3">
                    <div className="grid grid-cols-7 gap-1">
                        {/* Weekday headers */}
                        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                            <div key={day} className="text-center text-xs font-medium text-gray-500 py-1">
                                {day}
                            </div>
                        ))}

                        {/* Calendar days with status text */}
                        {days.map((date: Date, idx: number) => {
                            const attendance = getAttendanceStatus(date);
                            const isCurrentMonth = isSameMonth(date, currentDate);
                            const shouldShow = !filterStatus.length || (attendance && filterStatus.includes(attendance.status));

                            if (!shouldShow) return null;

                            return (
                                <div
                                    key={idx}
                                    className={`
                                        h-20 p-1 rounded-md border flex flex-col items-center
                                        ${!isCurrentMonth ? 'bg-gray-50 text-gray-400' : 'bg-white'}
                                        ${isToday(date) ? 'border-emerald-500' : 'border-gray-100'}
                                        ${attendance ? 'hover:bg-gray-50' : ''}
                                    `}
                                >
                                    <span className={`text-xs ${isToday(date) ? 'font-bold' : ''}`}>
                                        {format(date, 'd')}
                                    </span>
                                    {attendance && (
                                        <div className="flex-1 flex flex-col items-center justify-center gap-0.5">
                                            {getStatusIcon(attendance.status)}
                                            <span className={`text-xs font-medium ${getStatusColor(attendance.status)}`}>
                                                {getStatusText(attendance.status)}
                                            </span>
                                            <span className="text-[10px] text-gray-500">
                                                {attendance.time}
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
                            <span className="text-xs text-gray-600">Present</span>
                        </div>
                        <div className="flex items-center space-x-1">
                            <Clock size={14} className="text-blue-500" />
                            <span className="text-xs text-gray-600">Half Day</span>
                        </div>
                        <div className="flex items-center space-x-1">
                            <X size={14} className="text-red-500" />
                            <span className="text-xs text-gray-600">Absent</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StaffAttendance;
