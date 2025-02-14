import React, { useState } from "react";
import { Exam, GradeSystem } from "../../types/Types";
import { message } from "antd";
import { postTermExamMark } from "../../api/staffs";

export type StudentMark = {
    studentID: number;
    studentName: string;
    rollNumber: number;
    mark: number | null;
    isAbsent: boolean;
    grade: string;
};

export type SubjectDetails = {
    maxMark: number;
    termExamSubjectID: number;
    subjectName: string;
    subjectID: number;
    markEntryStatus: "Partial" | "Completed" | "Pending";
};

type PropType = {
    selectedSubject: SubjectDetails;
    selectedExam: Exam | null;
    studentMark: StudentMark[];
    setStudentMark: React.Dispatch<React.SetStateAction<StudentMark[]>>;
    onBack: () => void;
};

const MarkEntryView = ({
    selectedSubject,
    studentMark,
    // selectedExam,
    setStudentMark,
    onBack,
}: PropType) => {
    const [grades] = useState<GradeSystem[]>([
        { id: 1, category_id: 1, base_percentage: 90, grade_label: "A+" },
        { id: 2, category_id: 2, base_percentage: 85, grade_label: "A" },
        { id: 3, category_id: 3, base_percentage: 80, grade_label: "B+" },
        { id: 4, category_id: 4, base_percentage: 75, grade_label: "B" },
        { id: 5, category_id: 5, base_percentage: 70, grade_label: "C+" },
        { id: 6, category_id: 6, base_percentage: 65, grade_label: "C" },
        { id: 7, category_id: 7, base_percentage: 60, grade_label: "D+" },
        { id: 8, category_id: 8, base_percentage: 50, grade_label: "D" },
    ]);
    const [isSaving, setIsSaving] = useState(false);

    const postMarks = async () => {
        try {
            setIsSaving(true);
            const payload = studentMark?.map((item) => ({
                student_id: item?.studentID,
                term_exam_subject_id: selectedSubject?.termExamSubjectID,
                obtained_mark: item?.mark || 0,
                is_absent: item?.isAbsent,
            }));
            await postTermExamMark(payload);
            message?.success("Marks updated");
            setIsSaving(false);
        } catch (error) {
            console.log(error);
            setIsSaving(false);
            message?.error("Marks didn't updated, Please try again");
        }
    };

    const handleMarkUpdate = (
        studentID: number,
        mark: number,
        isAbsent: boolean
    ) => {
        if (studentMark) {
            const newMarks = [...(studentMark || [])]?.map((item) => {
                if (item?.studentID === studentID) {
                    return {
                        ...item,
                        mark,
                        isAbsent,
                    };
                }
                return item;
            });

            setStudentMark(newMarks);
        }
    };

    const calculateGrade = (
        marks: number,
        maxMarks: number,
        grades: GradeSystem[]
    ): string => {
        const percentage = (marks / maxMarks) * 100;

        // Sort grades by base_percentage in descending order
        const sortedGrades = [...grades].sort(
            (a, b) => b.base_percentage - a.base_percentage
        );

        for (const grade of sortedGrades) {
            if (percentage >= grade.base_percentage) {
                return grade.grade_label;
            }
        }

        return "F"; // Default grade if no other grade matches
    };

    const getMarkStatus = () => {
        const totalStudents = studentMark?.length;
        const markedStudents = studentMark?.filter((student) => {
            const mark = student?.mark;
            return mark && (mark > 0 || student?.isAbsent);
        }).length;
        return { totalStudents, markedStudents };
    };

    const validateMarks = (value: number, maxMarks: number) => {
        if (value < 0) return 0;
        if (value > maxMarks) return maxMarks;
        return value;
    };

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
                        {studentMark?.map((student) => {
                            const mark = student?.mark;
                            const maxMarks = selectedSubject?.maxMark || 100;
                            const percentage = student?.isAbsent
                                ? 0
                                : ((mark || 0) / maxMarks) * 100;

                            return (
                                <tr key={student?.studentID}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {student?.rollNumber}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {student?.studentName}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center gap-2">
                                            <input
                                                type="number"
                                                value={
                                                    student?.isAbsent
                                                        ? ""
                                                        : mark || ""
                                                }
                                                onChange={(e) => {
                                                    const value = validateMarks(
                                                        Number(e.target.value),
                                                        maxMarks
                                                    );
                                                    handleMarkUpdate(
                                                        student?.studentID,
                                                        value,
                                                        false
                                                    );
                                                }}
                                                disabled={student?.isAbsent}
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
                                                student?.isAbsent
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
                                            {student?.isAbsent
                                                ? "-"
                                                : calculateGrade(
                                                      mark || 0,
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
                                                    student?.isAbsent || false
                                                }
                                                onChange={(e) =>
                                                    handleMarkUpdate(
                                                        student.studentID,
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
                            onClick={onBack}
                            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 
                        rounded-lg hover:bg-gray-50 transition-colors duration-200"
                        >
                            Cancel
                        </button>

                        <button
                            onClick={postMarks}
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
