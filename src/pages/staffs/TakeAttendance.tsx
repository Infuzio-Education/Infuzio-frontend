import React, { useState } from 'react';
import { Check, Clock, X, Search } from 'lucide-react';

interface Student {
    id: string;
    name: string;
    rollNo: string;
    attendance: 'present' | 'halfday' | 'absent' | null;
}

interface TakeAttendanceProps {
    classInfo: {
        name: string;
        section: string;
    };
    onClose: () => void;
}

const TakeAttendance: React.FC<TakeAttendanceProps> = ({ classInfo, onClose }) => {
    const [searchTerm, setSearchTerm] = useState('');
    // Mock data with more students
    const [students, setStudents] = useState<Student[]>(Array.from({ length: 45 }, (_, i) => ({
        id: (i + 1).toString(),
        name: `Student ${i + 1}`,
        rollNo: (i + 1).toString().padStart(3, '0'),
        attendance: null
    })));

    const handleSelectAll = (status: 'present' | 'halfday' | 'absent') => {
        setStudents(students.map(student => ({
            ...student,
            attendance: status
        })));
    };

    const handleAttendance = (studentId: string, status: 'present' | 'halfday' | 'absent') => {
        setStudents(students.map(student =>
            student.id === studentId ? { ...student, attendance: status } : student
        ));
    };

    const filteredStudents = students.filter(student =>
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.rollNo.includes(searchTerm)
    );

    const getAttendanceStats = () => {
        const present = students.filter(s => s.attendance === 'present').length;
        const halfday = students.filter(s => s.attendance === 'halfday').length;
        const absent = students.filter(s => s.attendance === 'absent').length;
        const pending = students.filter(s => s.attendance === null).length;
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
                        <p className="text-sm text-gray-600">
                            {classInfo.name} - {classInfo.section} | {new Date().toLocaleDateString()}
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
                        <p className="text-lg font-semibold text-emerald-700">{stats.present}</p>
                    </div>
                    <div className="bg-blue-50 p-3 rounded-lg">
                        <p className="text-xs text-gray-600">Half Day</p>
                        <p className="text-lg font-semibold text-blue-700">{stats.halfday}</p>
                    </div>
                    <div className="bg-red-50 p-3 rounded-lg">
                        <p className="text-xs text-gray-600">Absent</p>
                        <p className="text-lg font-semibold text-red-700">{stats.absent}</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-xs text-gray-600">Pending</p>
                        <p className="text-lg font-semibold text-gray-700">{stats.pending}</p>
                    </div>
                </div>
            </div>

            <div className="p-6 flex-1 overflow-hidden flex flex-col">
                {/* Controls */}
                <div className="space-y-4 mb-4">
                    {/* Search */}
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
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
                        <span className="text-sm font-medium text-gray-600">Select All:</span>
                        <button
                            onClick={() => handleSelectAll('present')}
                            className="px-4 py-2 bg-emerald-50 text-emerald-700 rounded-lg hover:bg-emerald-100 transition-colors text-sm font-medium"
                        >
                            Present
                        </button>
                        <button
                            onClick={() => handleSelectAll('halfday')}
                            className="px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium"
                        >
                            Half Day
                        </button>
                        <button
                            onClick={() => handleSelectAll('absent')}
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
                                key={student.id}
                                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                            >
                                <div>
                                    <h3 className="font-medium text-gray-800">{student.name}</h3>
                                    <p className="text-sm text-gray-500">Roll No: {student.rollNo}</p>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <button
                                        onClick={() => handleAttendance(student.id, 'present')}
                                        className={`p-2 rounded-full ${student.attendance === 'present'
                                            ? 'bg-emerald-100 text-emerald-700'
                                            : 'bg-gray-100 text-gray-500 hover:bg-emerald-50 hover:text-emerald-600'
                                            }`}
                                    >
                                        <Check size={18} />
                                    </button>
                                    <button
                                        onClick={() => handleAttendance(student.id, 'halfday')}
                                        className={`p-2 rounded-full ${student.attendance === 'halfday'
                                            ? 'bg-blue-100 text-blue-700'
                                            : 'bg-gray-100 text-gray-500 hover:bg-blue-50 hover:text-blue-600'
                                            }`}
                                    >
                                        <Clock size={18} />
                                    </button>
                                    <button
                                        onClick={() => handleAttendance(student.id, 'absent')}
                                        className={`p-2 rounded-full ${student.attendance === 'absent'
                                            ? 'bg-red-100 text-red-700'
                                            : 'bg-gray-100 text-gray-500 hover:bg-red-50 hover:text-red-600'
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
                        className="w-full px-6 py-2.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium"
                    >
                        Submit Attendance ({students.length - stats.pending}/{students.length} Marked)
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TakeAttendance; 