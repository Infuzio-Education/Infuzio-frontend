import React from "react";
import {
    Exam,
    ExamStudent,
    GradeSystem,
    StudentMark,
    Subject,
} from "../../types/Types";

type PropType = {
    selectedSubject: Subject;
    setSelectedSubject: React.Dispatch<React.SetStateAction<Subject | null>>;
    selectedExam: Exam | null;
    students: ExamStudent[];
    handleMarkUpdate: (
        studentId: number,
        marks: number,
        isAbsent: boolean
    ) => void;
    validateMarks: (value: number, maxMarks: number) => number;
    calculateGrade: (
        marks: number,
        maxMarks: number,
        grades: GradeSystem[]
    ) => string;
    getMarkStatus: () => {
        totalStudents: number;
        markedStudents: number;
    };
    isSaving: boolean;
    setIsSaving: React.Dispatch<React.SetStateAction<boolean>>;
    grades: GradeSystem[];
};

const MarkEntryView = ({
    selectedSubject,
    setSelectedSubject,
    selectedExam,
    students,
    handleMarkUpdate,
    validateMarks,
    calculateGrade,
    getMarkStatus,
    isSaving,
    setIsSaving,
    grades,
}: PropType) => {
    return (
        <div className="bg-white rounded-xl shadow-sm">
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                Roll No
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                Name
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                Marks
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                Grade
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                Status
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {students.map((student) => {
                            const mark = student.marks.find(
                                (m: StudentMark) =>
                                    m.subjectId === selectedSubject?.id
                            );
                            const maxMarks =
                                selectedExam?.subjectMaxMarks?.find(
                                    (s) => s.subjectId === selectedSubject?.id
                                )?.maxMarks || 100;
                            const percentage = mark?.isAbsent
                                ? 0
                                : ((mark?.marks || 0) / maxMarks) * 100;

                            return (
                                <tr key={student.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {student.rollNo}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {student.name}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center gap-2">
                                            <input
                                                type="number"
                                                value={
                                                    mark?.isAbsent
                                                        ? ""
                                                        : mark?.marks || ""
                                                }
                                                onChange={(e) => {
                                                    const value = validateMarks(
                                                        Number(e.target.value),
                                                        maxMarks
                                                    );
                                                    handleMarkUpdate(
                                                        student.id,
                                                        value,
                                                        false
                                                    );
                                                }}
                                                disabled={mark?.isAbsent}
                                                min="0"
                                                max={maxMarks}
                                                className="w-20 px-3 py-1 border rounded focus:outline-none focus:ring-2 
                                            focus:ring-emerald-500 disabled:bg-gray-100"
                                            />
                                            <span className="text-sm text-gray-500">
                                                / {maxMarks}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span
                                            className={`px-3 py-1 rounded-full text-sm font-medium ${
                                                mark?.isAbsent
                                                    ? "bg-gray-100 text-gray-600"
                                                    : percentage >= 90
                                                    ? "bg-emerald-100 text-emerald-700"
                                                    : percentage >= 80
                                                    ? "bg-blue-100 text-blue-700"
                                                    : percentage >= 70
                                                    ? "bg-yellow-100 text-yellow-700"
                                                    : "bg-red-100 text-red-700"
                                            }`}
                                        >
                                            {mark?.isAbsent
                                                ? "-"
                                                : calculateGrade(
                                                      mark?.marks || 0,
                                                      maxMarks,
                                                      grades
                                                  )}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <label className="inline-flex items-center">
                                            <input
                                                type="checkbox"
                                                checked={
                                                    mark?.isAbsent || false
                                                }
                                                onChange={(e) =>
                                                    handleMarkUpdate(
                                                        student.id,
                                                        0,
                                                        e.target.checked
                                                    )
                                                }
                                                className="form-checkbox h-4 w-4 text-emerald-600"
                                            />
                                            <span className="ml-2 text-sm text-gray-600">
                                                Absent
                                            </span>
                                        </label>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {/* Submit Button Section */}
            <div className="p-6 border-t bg-gray-50">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                            Last saved 2 mins ago
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-600">
                                {getMarkStatus().markedStudents} /{" "}
                                {getMarkStatus().totalStudents} students marked
                            </span>
                            <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-emerald-500 transition-all duration-500"
                                    style={{
                                        width: `${
                                            (getMarkStatus().markedStudents /
                                                getMarkStatus().totalStudents) *
                                            100
                                        }%`,
                                    }}
                                ></div>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setSelectedSubject(null)}
                            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 
                        rounded-lg hover:bg-gray-50 transition-colors duration-200"
                        >
                            Cancel
                        </button>

                        <button
                            onClick={async () => {
                                setIsSaving(true);
                                // TODO: Implement mark submission logic
                                await new Promise((resolve) =>
                                    setTimeout(resolve, 1000)
                                );
                                console.log("Submitting marks...");
                                setIsSaving(false);
                            }}
                            disabled={isSaving}
                            className={`px-6 py-2 bg-emerald-600 text-white rounded-lg 
                        transition-all duration-200 flex items-center gap-2
                        ${
                            isSaving
                                ? "opacity-70 cursor-not-allowed"
                                : "hover:bg-emerald-700 hover:shadow-md"
                        }`}
                        >
                            {isSaving ? (
                                <>
                                    <div
                                        className="w-4 h-4 border-2 border-white border-t-transparent 
                                rounded-full animate-spin"
                                    ></div>
                                    <span>Saving...</span>
                                </>
                            ) : (
                                <>
                                    <svg
                                        className="w-4 h-4"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M5 13l4 4L19 7"
                                        />
                                    </svg>
                                    <span>Save Marks</span>
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MarkEntryView;
