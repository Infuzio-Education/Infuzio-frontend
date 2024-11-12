import { useState } from 'react';
import { Users, CheckCircle2, ChartLine, Sheet, PenLine, UsersRound } from 'lucide-react';
import TakeAttendance from './TakeAttendance';

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

            {showAttendance && (
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

const AttendanceTab = () => (
    <div className="space-y-6">
        <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">My Attendance Overview</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-green-50 rounded-lg">
                    <p className="text-sm text-gray-600">Present Days</p>
                    <p className="text-2xl font-bold text-green-600">22</p>
                </div>
                <div className="p-4 bg-red-50 rounded-lg">
                    <p className="text-sm text-gray-600">Absent Days</p>
                    <p className="text-2xl font-bold text-red-600">2</p>
                </div>
                <div className="p-4 bg-blue-50 rounded-lg">
                    <p className="text-sm text-gray-600">Attendance Rate</p>
                    <p className="text-2xl font-bold text-blue-600">91.6%</p>
                </div>
            </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Attendance</h3>
            <div className="space-y-3">
                {[
                    { date: '2024-01-15', status: 'Present', time: '8:45 AM' },
                    { date: '2024-01-14', status: 'Present', time: '8:30 AM' },
                    { date: '2024-01-13', status: 'Absent', time: '-' },
                    { date: '2024-01-12', status: 'Present', time: '8:40 AM' },
                ].map((record) => (
                    <div key={record.date} className="flex items-center justify-between py-2 border-b">
                        <div className="flex items-center space-x-3">
                            <div className={`w-2 h-2 rounded-full ${record.status === 'Present' ? 'bg-green-500' : 'bg-red-500'
                                }`}></div>
                            <span className="text-gray-600">{record.date}</span>
                        </div>
                        <div className="flex items-center space-x-4">
                            <span className={`text-sm ${record.status === 'Present' ? 'text-green-600' : 'text-red-600'
                                }`}>
                                {record.status}
                            </span>
                            <span className="text-sm text-gray-500">{record.time}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </div>
);

export default StaffHome; 