import { useState } from 'react';
import { ArrowLeft, Calendar, Clock, User } from 'lucide-react';
import { Period, TimetableDay, TimeTableProps } from '../../types/Types';

const TimeTable = ({ onBack }: TimeTableProps) => {
    const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    const periodNumbers = Array.from({ length: 7 }, (_, i) => i + 1);

    // Dummy timetable data matching backend structure
    const [timetableData] = useState({
        id: 4,
        classId: 1,
        className: "11 Science A",
        activeFrom: "2024-11-21T00:00:00Z",
        createdAt: "2024-11-23T18:04:41.216823+05:30",
        updatedAt: "2024-11-23T19:23:03.762697+05:30",
        isActive: true,
        lastUpdatedBy: 4,
        lastUpdatedStaffName: "Some Thing",
        timetableDays: [
            {
                weekDay: 1,
                periods: [
                    { periodIndex: 1, subjectName: "Advanced Mathematics", staffName: "David Wilson" },
                    { periodIndex: 2, subjectName: "Physics", staffName: "Emma Brown" },
                    { periodIndex: 3, subjectName: "Chemistry", staffName: "John Smith" },
                    { periodIndex: 4, subjectName: "Biology", staffName: "Sarah Johnson" },
                    { periodIndex: 5, subjectName: "English", staffName: "Michael Brown" },
                    { periodIndex: 6, subjectName: "Computer Science", staffName: "Alice Cooper" },
                    { periodIndex: 7, subjectName: "Physical Education", staffName: "Tom Clark" }
                ]
            },
            {
                weekDay: 2,
                periods: [
                    { periodIndex: 1, subjectName: "Physics", staffName: "Emma Brown" },
                    { periodIndex: 2, subjectName: "Advanced Mathematics", staffName: "David Wilson" },
                    { periodIndex: 3, subjectName: "English", staffName: "Michael Brown" },
                    { periodIndex: 4, subjectName: "Chemistry", staffName: "John Smith" },
                    { periodIndex: 5, subjectName: "Computer Science", staffName: "Alice Cooper" },
                    { periodIndex: 6, subjectName: "Biology", staffName: "Sarah Johnson" },
                    { periodIndex: 7, subjectName: "Physical Education", staffName: "Tom Clark" }
                ]
            },
            {
                weekDay: 3,
                periods: [
                    { periodIndex: 1, subjectName: "Chemistry", staffName: "John Smith" },
                    { periodIndex: 2, subjectName: "Biology", staffName: "Sarah Johnson" },
                    { periodIndex: 3, subjectName: "Advanced Mathematics", staffName: "David Wilson" },
                    { periodIndex: 4, subjectName: "Physics", staffName: "Emma Brown" },
                    { periodIndex: 5, subjectName: "Physical Education", staffName: "Tom Clark" },
                    { periodIndex: 6, subjectName: "English", staffName: "Michael Brown" },
                    { periodIndex: 7, subjectName: "Computer Science", staffName: "Alice Cooper" }
                ]
            },
            {
                weekDay: 4,
                periods: [
                    { periodIndex: 1, subjectName: "Biology", staffName: "Sarah Johnson" },
                    { periodIndex: 2, subjectName: "Chemistry", staffName: "John Smith" },
                    { periodIndex: 3, subjectName: "Physics", staffName: "Emma Brown" },
                    { periodIndex: 4, subjectName: "Advanced Mathematics", staffName: "David Wilson" },
                    { periodIndex: 5, subjectName: "Computer Science", staffName: "Alice Cooper" },
                    { periodIndex: 6, subjectName: "Physical Education", staffName: "Tom Clark" },
                    { periodIndex: 7, subjectName: "English", staffName: "Michael Brown" }
                ]
            },
            {
                weekDay: 5,
                periods: [
                    { periodIndex: 1, subjectName: "Computer Science", staffName: "Alice Cooper" },
                    { periodIndex: 2, subjectName: "English", staffName: "Michael Brown" },
                    { periodIndex: 3, subjectName: "Physical Education", staffName: "Tom Clark" },
                    { periodIndex: 4, subjectName: "Biology", staffName: "Sarah Johnson" },
                    { periodIndex: 5, subjectName: "Physics", staffName: "Emma Brown" },
                    { periodIndex: 6, subjectName: "Chemistry", staffName: "John Smith" },
                    { periodIndex: 7, subjectName: "Advanced Mathematics", staffName: "David Wilson" }
                ]
            }
        ] as TimetableDay[]
    });

    const getPeriod = (dayNumber: number, periodIndex: number): Period | undefined => {
        const day = timetableData.timetableDays.find(d => d.weekDay === dayNumber);
        return day?.periods.find(p => p.periodIndex === periodIndex);
    };

    return (
        <div className="space-y-4">
            {/* Header with Back Button */}
            <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow-sm">
                <div className="flex items-center gap-4">
                    <button
                        onClick={onBack}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <ArrowLeft size={20} className="text-gray-600" />
                    </button>
                    <div>
                        <h2 className="text-xl font-bold text-gray-800">
                            {timetableData.className} Timetable
                        </h2>
                        <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                            <div className="flex items-center gap-1">
                                <Calendar size={14} />
                                <span>Active from: {new Date(timetableData.activeFrom).toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <Clock size={14} />
                                <span>Last updated: {new Date(timetableData.updatedAt).toLocaleString()}</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <User size={14} />
                                <span>Updated by: {timetableData.lastUpdatedStaffName}</span>
                            </div>
                        </div>
                    </div>
                </div>
                {timetableData.isActive && (
                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                        Active
                    </span>
                )}
            </div>

            {/* Timetable Grid */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr>
                                <th className="border p-3 bg-gray-100 text-gray-600 font-medium">
                                    Days
                                </th>
                                {periodNumbers.map(num => (
                                    <th key={num} className="border p-3 bg-gray-100 text-gray-600 font-medium">
                                        {num}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {weekDays.map((day, index) => (
                                <tr key={day}>
                                    <td className="border p-3 bg-[#95B1A9] text-white font-medium">
                                        {day}
                                    </td>
                                    {periodNumbers.map(periodNum => {
                                        const period = getPeriod(index + 1, periodNum);
                                        return (
                                            <td key={periodNum} className="border p-3 min-w-[120px]">
                                                {period ? (
                                                    <div className="space-y-1">
                                                        <p className="font-medium text-gray-800">
                                                            {period.subjectName}
                                                        </p>
                                                        <p className="text-sm text-gray-500">
                                                            {period.staffName}
                                                        </p>
                                                    </div>
                                                ) : (
                                                    <div className="text-gray-400 text-sm text-center">-</div>
                                                )}
                                            </td>
                                        );
                                    })}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default TimeTable;