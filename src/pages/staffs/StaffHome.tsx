import { useState } from 'react';
import { Users, CheckCircle2, ChartLine, Sheet, PenLine, UsersRound, Calendar as CalendarIcon, Check, X, Clock, ChevronLeft, ChevronRight, Printer, Filter } from 'lucide-react';
import TakeAttendance from './TakeAttendance';
import { format, startOfMonth, endOfMonth, isSameMonth, isToday, addMonths, subMonths, eachDayOfInterval } from 'date-fns';

type TabType = 'overview' | 'classes' | 'attendance';

interface ClassType {
    id: string;
    name: string;
    section: string;
    studentCount: number;
    isClassTeacher: boolean;
    subjects: string[];
}

const StaffHome = () => {
    const [activeTab, setActiveTab] = useState<TabType>('overview');

    const tabs = [
        { id: 'overview', label: 'Overview', icon: <ChartLine size={18} /> },
        { id: 'classes', label: 'Classes', icon: <Users size={18} /> },
        { id: 'attendance', label: 'My Attendance', icon: <CheckCircle2 size={18} /> },
    ];

    const renderContent = () => {
        switch (activeTab) {
            case 'classes':
                return <ClassesTab />;
            case 'attendance':
                return <AttendanceTab />;
            default:
                return <OverviewTab />;
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-800">Welcome Back!</h1>
                <div className="text-sm text-gray-600">
                    {new Date().toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                    })}
                </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-8">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as TabType)}
                            className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm
                                ${activeTab === tab.id
                                    ? 'border-emerald-700 text-emerald-700'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                        >
                            {tab.icon}
                            <span className="ml-2">{tab.label}</span>
                        </button>
                    ))}
                </nav>
            </div>

            {/* Tab Content */}
            {renderContent()}
        </div>
    );
};

const OverviewTab = () => (
    <>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold text-gray-700 mb-2">Today's Classes</h3>
                <p className="text-3xl font-bold text-emerald-600">5</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold text-gray-700 mb-2">Students Present</h3>
                <p className="text-3xl font-bold text-blue-600">42/45</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold text-gray-700 mb-2">Attendance Rate</h3>
                <p className="text-3xl font-bold text-orange-600">95%</p>
            </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Activity</h2>
            <div className="space-y-4">
                <div className="flex items-center justify-between py-2 border-b">
                    <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                        <p className="text-gray-600">Attendance marked for Class X-A</p>
                    </div>
                    <span className="text-sm text-gray-500">2 hours ago</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b">
                    <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <p className="text-gray-600">New announcement posted</p>
                    </div>
                    <span className="text-sm text-gray-500">4 hours ago</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b">
                    <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                        <p className="text-gray-600">Exam schedule updated</p>
                    </div>
                    <span className="text-sm text-gray-500">Yesterday</span>
                </div>
            </div>
        </div>
    </>
);

const ClassesTab = () => {
    const [selectedClass, setSelectedClass] = useState<ClassType | null>(null);
    const [showAttendance, setShowAttendance] = useState(false);

    // Mock data for classes
    const classes: ClassType[] = [
        {
            id: '1',
            name: 'Class X',
            section: 'A',
            studentCount: 40,
            isClassTeacher: true,
            subjects: ['Mathematics', 'Physics']
        },
        {
            id: '2',
            name: 'Class X',
            section: 'B',
            studentCount: 38,
            isClassTeacher: false,
            subjects: ['Mathematics']
        },
        {
            id: '3',
            name: 'Class IX',
            section: 'A',
            studentCount: 42,
            isClassTeacher: false,
            subjects: ['Physics']
        }
    ];

    return (
        <div className="space-y-6">
            {selectedClass ? (
                // Selected Class View
                <div className="space-y-6">
                    <div className="flex justify-between items-center">
                        <div>
                            <h2 className="text-xl font-bold text-gray-800">
                                {selectedClass.name} - {selectedClass.section}
                            </h2>
                            <p className="text-sm text-gray-600">
                                {selectedClass.studentCount} Students
                            </p>
                        </div>
                        <button
                            onClick={() => setSelectedClass(null)}
                            className="px-5 py-2.5 text-sm font-medium text-emerald-700 bg-emerald-50 
                            hover:bg-emerald-100 rounded-full transition-all duration-200 flex items-center 
                            gap-2 border border-emerald-200 hover:border-emerald-300 shadow-sm"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="transform rotate-180"
                            >
                                <path d="M5 12h14" />
                                <path d="m12 5 7 7-7 7" />
                            </svg>
                            Back to Classes
                        </button>
                    </div>

                    {/* Class Action Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Take Attendance Card */}
                        <div
                            onClick={() => setShowAttendance(true)}
                            className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow cursor-pointer group"
                        >
                            <div className="p-6 space-y-4">
                                <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center group-hover:bg-emerald-200 transition-colors">
                                    <PenLine className="w-6 h-6 text-emerald-600" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-800">Take Attendance</h3>
                                    <p className="text-sm text-gray-500 mt-1">Mark today's attendance for the class</p>
                                </div>
                                <div className="flex items-center text-emerald-600 text-sm font-medium">
                                    Start Now →
                                </div>
                            </div>
                        </div>

                        {/* Time Table Card */}
                        <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow cursor-pointer group">
                            <div className="p-6 space-y-4">
                                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                                    <Sheet className="w-6 h-6 text-blue-600" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-800">Time Table</h3>
                                    <p className="text-sm text-gray-500 mt-1">View class schedule and periods</p>
                                </div>
                                <div className="flex items-center text-blue-600 text-sm font-medium">
                                    View Schedule →
                                </div>
                            </div>
                        </div>

                        {/* View Students Card */}
                        <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow cursor-pointer group">
                            <div className="p-6 space-y-4">
                                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                                    <UsersRound className="w-6 h-6 text-purple-600" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-800">View Students</h3>
                                    <p className="text-sm text-gray-500 mt-1">See all students in this class</p>
                                </div>
                                <div className="flex items-center text-purple-600 text-sm font-medium">
                                    View List →
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Class Info Card */}
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-semibold text-gray-800">Class Information</h3>
                            {selectedClass.isClassTeacher && (
                                <span className="px-3 py-1 text-sm font-medium text-emerald-700 bg-emerald-100 rounded-full">
                                    Class Teacher
                                </span>
                            )}
                        </div>

                        <div className="space-y-4">
                            <div>
                                <h4 className="text-sm font-medium text-gray-600">Subjects Teaching</h4>
                                <div className="mt-2 flex flex-wrap gap-2">
                                    {selectedClass.subjects.map(subject => (
                                        <span
                                            key={subject}
                                            className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-full"
                                        >
                                            {subject}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                // Classes Grid View
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {classes.map((classItem) => (
                        <div
                            key={classItem.id}
                            onClick={() => setSelectedClass(classItem)}
                            className={`cursor-pointer transition-all duration-200 ${classItem.isClassTeacher
                                ? 'bg-emerald-50 border-2 border-emerald-500'
                                : 'bg-white border border-gray-200 hover:border-blue-500'
                                } p-6 rounded-lg`}
                        >
                            <div className="flex justify-between items-start">
                                <div>
                                    {classItem.isClassTeacher && (
                                        <span className="inline-block px-2 py-1 text-xs font-semibold text-emerald-700 bg-emerald-100 rounded-full mb-2">
                                            Class Teacher
                                        </span>
                                    )}
                                    <h3 className="text-lg font-bold text-gray-800">
                                        {classItem.name} - {classItem.section}
                                    </h3>
                                    <p className="text-sm text-gray-600 mt-1">
                                        {classItem.studentCount} Students
                                    </p>
                                    <div className="mt-2 flex flex-wrap gap-1">
                                        {classItem.subjects.map(subject => (
                                            <span
                                                key={subject}
                                                className="px-2 py-0.5 text-xs bg-gray-100 text-gray-600 rounded-full"
                                            >
                                                {subject}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {showAttendance && selectedClass && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
                    <div className="w-full max-w-4xl">
                        <TakeAttendance
                            classInfo={{
                                name: selectedClass.name,
                                section: selectedClass.section
                            }}
                            onClose={() => setShowAttendance(false)}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

const AttendanceTab = () => {
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

    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

    const getAttendanceStatus = (date: Date) => {
        const dateStr = format(date, 'yyyy-MM-dd');
        console.log('Checking date:', dateStr, 'Status:', attendanceData[dateStr]); // Debug log
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

export default StaffHome; 