import { useEffect, useState } from "react";
import { ArrowLeft, Calendar, Clock, User } from "lucide-react";
import { Period, TimeTableProps, TimeTableData } from "../../types/Types";
import { getTimeTable } from "../../api/staffs";
import { CircularProgress } from "@mui/material";

const TimeTable = ({ onBack, classId }: TimeTableProps) => {
    const weekDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
    const periodNumbers = Array.from({ length: 7 }, (_, i) => i + 1);

    const [timetableData, setTimetableData] = useState<TimeTableData | null>(
        null
    );
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    useEffect(() => {
        if (classId) {
            setLoading(true);
            fetchTimetable();
        }
    }, [classId]);

    const fetchTimetable = async () => {
        try {
            const timetable = await getTimeTable(classId);
            console.log(timetable);
            setTimetableData(timetable);
        } catch (error) {
            setError("Error fetching timetable");
        } finally {
            setLoading(false);
        }
    };

    const getPeriod = (
        dayNumber: number,
        periodIndex: number
    ): Period | undefined => {
        const day = timetableData?.timetableDays?.find(
            (d: any) => d.weekDay === dayNumber
        );
        return day?.periods.find((p) => p.periodIndex === periodIndex);
    };

    return (
        // timetableData ? (
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
                            {timetableData?.className} Timetable
                        </h2>
                        {timetableData && (
                            <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                                <div className="flex items-center gap-1">
                                    <Calendar size={14} />
                                    <span>
                                        Active from:{" "}
                                        {new Date(
                                            timetableData?.activeFrom
                                        ).toLocaleDateString()}
                                    </span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Clock size={14} />
                                    <span>
                                        Last updated:{" "}
                                        {timetableData?.updatedAt
                                            ? new Date(
                                                  timetableData?.updatedAt
                                              ).toLocaleString()
                                            : "Unavailable"}
                                    </span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <User size={14} />
                                    <span>
                                        Updated by:{" "}
                                        {timetableData?.lastUpdatedStaffName}
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
                {timetableData?.isActive && (
                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                        Active
                    </span>
                )}
            </div>

            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                {loading ? (
                    <div className="flex justify-center items-center py-20">
                        <CircularProgress />
                    </div>
                ) : error ? (
                    <div className="text-center text-red-400 py-20  text-sm  w-full flex justify-center items-center h-full">
                        {error}
                    </div>
                ) : timetableData ? (
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                            <thead>
                                <tr>
                                    <th className="border p-3 bg-gray-100 text-gray-600 font-medium">
                                        Days
                                    </th>
                                    {periodNumbers?.map((num) => (
                                        <th
                                            key={num}
                                            className="border p-3 bg-gray-100 text-gray-600 font-medium"
                                        >
                                            {num}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {weekDays?.map((day, index) => (
                                    <tr key={day}>
                                        <td className="border p-3 bg-[#95B1A9] text-white font-medium">
                                            {day}
                                        </td>
                                        {periodNumbers?.map((periodNum) => {
                                            const period = getPeriod(
                                                index + 1,
                                                periodNum
                                            );
                                            return (
                                                <td
                                                    key={periodNum}
                                                    className="border p-3 min-w-[120px]"
                                                >
                                                    {period ? (
                                                        <div className="space-y-1">
                                                            <p className="font-medium text-gray-800">
                                                                {
                                                                    period?.subjectName
                                                                }
                                                            </p>
                                                            <p className="text-sm text-gray-500">
                                                                {
                                                                    period?.staffName
                                                                }
                                                            </p>
                                                        </div>
                                                    ) : (
                                                        <div className="text-gray-400 text-sm text-center">
                                                            -
                                                        </div>
                                                    )}
                                                </td>
                                            );
                                        })}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <span className="text-center text-red-400 py-20  text-sm w-full flex justify-center items-center h-full">
                        No time table found
                    </span>
                )}
            </div>
        </div>
    );
};

export default TimeTable;
