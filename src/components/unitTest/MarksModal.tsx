/* eslint-disable react-hooks/exhaustive-deps */
import { Save, X } from "lucide-react";
import { useEffect, useState } from "react";
import { InputNumber, message } from "antd";
import {
    AttendanceStudent,
    Subject,
    TestMark,
    UnitTest,
} from "../../types/Types";
import {
    getStudentsByClass,
    getUnitTestMark,
    postUnitTestmark,
    updateUnitTestMark,
} from "../../api/staffs";

type PropType = {
    selectedTest: UnitTest;
    setIsManageMarksOpen: React.Dispatch<React.SetStateAction<boolean>>;
    subjects: Subject[];
    setUnitTests: React.Dispatch<React.SetStateAction<UnitTest[]>>;
};

const MarksModal = ({
    selectedTest,
    setIsManageMarksOpen,
    subjects,
    setUnitTests,
}: PropType) => {
    const [students, setStudents] = useState<AttendanceStudent[]>([]);
    const [studentMarks, setStudentMarks] = useState<TestMark[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const fetchedStudents = await getStudentsByClass(
                    String(selectedTest?.class_id)
                );
                setStudents(fetchedStudents);
                if (selectedTest?.is_mark_added) {
                    const marks = await getUnitTestMark(selectedTest.id);
                    console.log(marks);

                    setStudentMarks(
                        marks?.map((item: any) => ({
                            unit_test_mark_id: item.id,
                            mark: item.mark || 0,
                            isAbsent: item.is_absent,
                            student_id: item.student_id,
                        }))
                    );
                } else {
                    setStudentMarks(
                        fetchedStudents.map((student: any) => ({
                            student_id: student.id,
                            unit_test_id: selectedTest.id,
                            mark: 0,
                            isAbsent: false,
                        }))
                    );
                }
            } catch (error) {
                console.error("Error fetching data:", error);
                message.error("Error fetching data");
            }
        };
        fetchData();
    }, [selectedTest]);

    const handleMarkUpdate = (
        student_id: string,
        mark: number,
        isAbsent: boolean
    ) => {
        setStudentMarks((prevMarks) =>
            prevMarks.map((stdMark) =>
                stdMark.student_id === student_id
                    ? { ...stdMark, mark, isAbsent }
                    : stdMark
            )
        );
    };

    const handleSubmitMarks = async () => {
        try {
            await postUnitTestmark(studentMarks);
            message.success("Marks published successfully");
            setIsManageMarksOpen(false);
            setUnitTests((prevTest) => {
                const newTest = prevTest?.map((item) => {
                    if (selectedTest.id === item.id) {
                        return {
                            ...item,
                            is_mark_added: true,
                        };
                    }
                    return item;
                });
                return newTest;
            });
        } catch (error) {
            console.error("Error submitting marks:", error);
            message.error("Failed to publish marks! Please try again later.");
        }
    };

    const handleUpdatedMarkPublish = async () => {
        try {
            await updateUnitTestMark(studentMarks);
            message?.success("Marks updated");
            setIsManageMarksOpen(false);
        } catch (error) {
            console.log(error);
            message?.error("Cannot update mark! Try again later");
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full p-6 max-h-[90vh] overflow-hidden flex flex-col">
                <div className="flex justify-between items-center mb-6 pb-4 border-b">
                    <div>
                        <h2 className="text-xl font-semibold text-gray-800">
                            Add Test Marks
                        </h2>
                        <p className="text-sm text-gray-500 mt-1">
                            {subjects?.find(
                                (subject) =>
                                    subject.id === selectedTest?.subject_id
                            )?.name || "Unknown Subject"}{" "}
                            - Max Marks: {selectedTest?.max_mark}
                        </p>
                    </div>
                    <button
                        onClick={() => setIsManageMarksOpen(false)}
                        className="p-2 hover:bg-gray-100 rounded-full"
                    >
                        <X size={20} className="text-gray-500" />
                    </button>
                </div>

                <div className="flex-1 overflow-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Roll No
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Student Name
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Marks
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Status
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {students.map((student) => {
                                const studentMark = studentMarks.find(
                                    (m) => m.student_id === student.id
                                );
                                return (
                                    <tr key={student.id}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {student.rollNumber}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {student.name}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <InputNumber
                                                min={0}
                                                max={selectedTest.max_mark}
                                                value={studentMark?.mark ?? 0}
                                                onChange={(value) =>
                                                    handleMarkUpdate(
                                                        student.id,
                                                        Number(value),
                                                        false
                                                    )
                                                }
                                            />
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <label className="inline-flex items-center">
                                                <input
                                                    type="checkbox"
                                                    checked={
                                                        studentMark?.isAbsent ||
                                                        false
                                                    }
                                                    onChange={(e) =>
                                                        handleMarkUpdate(
                                                            student.id,
                                                            0,
                                                            e.target.checked
                                                        )
                                                    }
                                                    className="form-checkbox h-4 w-4 text-red-600 transition duration-150 ease-in-out"
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

                <div className="mt-6 flex justify-end gap-3 pt-4 border-t">
                    <button
                        onClick={() => setIsManageMarksOpen(false)}
                        className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={
                            selectedTest?.is_mark_added
                                ? handleUpdatedMarkPublish
                                : handleSubmitMarks
                        }
                        className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors flex items-center gap-2"
                    >
                        <Save size={20} />{" "}
                        {selectedTest?.is_mark_added
                            ? "Update mark"
                            : "Submit Marks"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MarksModal;
