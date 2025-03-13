import { Check, Save, X } from "lucide-react";
import { StudentMark, UnitTest } from "../../types/Types";
import { useEffect, useState } from "react";
import { getUnitTestMark, publishUnitTestMark } from "../../api/staffs";
import { message } from "antd";

type PropType = {
    selectedTest: UnitTest;
    setIsPreviewModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
    publishStatus: boolean;
    setUnitTests: React.Dispatch<React.SetStateAction<UnitTest[]>>;
};

const PreviewModal = ({
    selectedTest,
    setIsPreviewModalOpen,
    publishStatus,
    setUnitTests,
}: PropType) => {
    const [studentMarks, setStudentMarks] = useState<StudentMark[]>([]);
    const [btnIsloading, SetBtnIsLoading] = useState(false);

    useEffect(() => {
        if (selectedTest) {
            fetchMarks(selectedTest.id);
        }
    }, [selectedTest]);

    const fetchMarks = async (unitTestId: number) => {
        try {
            const response = await getUnitTestMark(unitTestId);

            setStudentMarks(response);
        } catch (error) {
            console.log(error);

            message?.error("Error fetching unit test marks");
        }
    };

    const handlePublishMark = async () => {
        try {
            SetBtnIsLoading(true);
            await publishUnitTestMark(selectedTest?.id);
            SetBtnIsLoading(false);
            setIsPreviewModalOpen(false);
            message?.success("Mark published successfully");
            setUnitTests((prevTest) => {
                const newTest = prevTest?.map((item) => {
                    if (selectedTest.id === item.id) {
                        return {
                            ...item,
                            status: "Published" as
                                | "Completed"
                                | "Not started"
                                | "Cancelled"
                                | "Postponed"
                                | "Published",
                        };
                    }
                    return item;
                });
                return newTest;
            });
        } catch (error) {
            message?.error(`Couldn't publish mark!`);
            console.log(error);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full p-6 max-h-[90vh] overflow-hidden flex flex-col">
                <div className="flex justify-between items-center mb-6 pb-4 border-b">
                    <div>
                        <h2 className="text-xl font-semibold text-gray-800">
                            Mark Sheet Preview
                        </h2>
                        <p className="text-sm text-gray-500 mt-1">
                            {selectedTest.FKSubjectID?.Name ||
                                "Unknown Subject"}{" "}
                            - Max Marks: {selectedTest.max_mark}
                        </p>
                    </div>
                    <button
                        onClick={() => setIsPreviewModalOpen(false)}
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
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Result
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {studentMarks.map((studentMark) => {
                                const isPassed =
                                    !studentMark.is_absent &&
                                    studentMark.obtained_mark >= selectedTest.pass_mark;

                                return (
                                    <tr key={studentMark.student_id}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {studentMark?.roll_number}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {studentMark?.name}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {studentMark.is_absent
                                                ? "-"
                                                : studentMark.obtained_mark || "N/A"}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            {studentMark.is_absent ? (
                                                <span className="text-gray-500 text-sm">
                                                    Absent
                                                </span>
                                            ) : (
                                                <span className="text-gray-500 text-sm">
                                                    Present
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            {studentMark.is_absent ? (
                                                <span className="text-gray-500">
                                                    -
                                                </span>
                                            ) : (
                                                <span
                                                    className={`px-3 py-1.5 text-sm font-medium rounded-full inline-flex items-center gap-1.5
                                                            ${isPassed
                                                            ? "bg-green-100 text-green-700 border border-green-200"
                                                            : "bg-red-100 text-red-700 border border-red-200"
                                                        }`}
                                                >
                                                    {isPassed ? (
                                                        <>
                                                            <Check size={14} />
                                                            Pass
                                                        </>
                                                    ) : (
                                                        <>
                                                            <X size={14} />
                                                            Fail
                                                        </>
                                                    )}
                                                </span>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                <div className="mt-6 flex justify-between items-center pt-4 border-t">
                    <div className="text-sm text-gray-500">
                        {publishStatus ? (
                            <span>
                                Published
                                {/* on :{" "}
                                {new Date(
                                    publishStatus.published_at!
                                ).toLocaleString()} */}
                            </span>
                        ) : (
                            <span>* Review the marks before publishing</span>
                        )}
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={() => setIsPreviewModalOpen(false)}
                            className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            Close
                        </button>
                        {!publishStatus && selectedTest?.status !== "Cancelled" && (
                            <button
                                onClick={handlePublishMark}
                                disabled={btnIsloading}
                                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700
                                        transition-colors flex items-center gap-2"
                            >
                                <Save size={20} /> Publish Marks
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PreviewModal;
