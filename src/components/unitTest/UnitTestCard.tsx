import { Tooltip } from "antd";
import { BookOpen, Calendar, Edit, Trash } from "lucide-react";
import React from "react";
import { PublishStatus, Subject, UnitTest } from "../../types/Types";

type PropType = {
    test: UnitTest;
    setSelectedTest: React.Dispatch<React.SetStateAction<UnitTest | null>>;
    handleStatusChange: (testId: number, status: string) => Promise<void>;
    setIsPreviewModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
    setIsManageMarksOpen: React.Dispatch<React.SetStateAction<boolean>>;
    setIsEditMode: React.Dispatch<React.SetStateAction<boolean>>;
    publishStatus: PublishStatus;
    subjects: Subject[];
};

const UnitTestCard = ({
    test,
    setSelectedTest,
    handleStatusChange,
    setIsPreviewModalOpen,
    setIsManageMarksOpen,
    setIsEditMode,
    publishStatus,
    subjects,
}: PropType) => {
    return (
        <div
            key={test.id}
            className="bg-white rounded-lg p-6 hover:shadow-lg transition-all duration-200
    border border-gray-100 hover:border-emerald-100 group relative"
        >
            <div className="flex justify-between">
                <div
                    className="space-y-3 flex-1 cursor-pointer"
                    onClick={() => {
                        setSelectedTest(test);
                        // setIsDetailsModalOpen(true);
                    }}
                >
                    <div className="flex items-center gap-2">
                        <BookOpen size={18} className="text-emerald-600" />
                        <span className="font-medium text-gray-700">
                            {subjects?.find(
                                (subject) => subject.id === test.subject_id
                            )?.name || "Unknown Subject"}
                        </span>
                        <Tooltip
                            color="transparent"
                            arrow={false}
                            trigger="click"
                            placement="bottomLeft"
                            overlayInnerStyle={{
                                padding: "0px",
                            }}
                            title={
                                <ul className="list-none p-0 m-0 w-[180px] bg-white rounded-lg shadow-md">
                                    <li
                                        className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                                        onClick={() =>
                                            handleStatusChange(
                                                test.id,
                                                "completed"
                                            )
                                        }
                                    >
                                        Completed
                                    </li>
                                    <li
                                        className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                                        onClick={() =>
                                            handleStatusChange(
                                                test.id,
                                                "postponed"
                                            )
                                        }
                                    >
                                        Postponed
                                    </li>
                                    <li
                                        className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                                        onClick={() =>
                                            handleStatusChange(
                                                test.id,
                                                "cancelled"
                                            )
                                        }
                                    >
                                        Cancelled
                                    </li>
                                </ul>
                            }
                        >
                            {test.is_completed && (
                                <span className="px-2 mx-1 py-1 text-xs bg-green-100 text-green-700 rounded-full">
                                    Completed
                                </span>
                            )}
                            {test.is_postponed_indefinitely && (
                                <span className="px-2 mx-1 py-1 text-xs bg-yellow-100 text-yellow-700 rounded-full">
                                    Postponed
                                </span>
                            )}{" "}
                            {test.is_exam_cancelled && (
                                <span className="px-2 mx-1 py-1 text-xs bg-red-100 text-red-700 rounded-full">
                                    Cancelled
                                </span>
                            )}
                            {!test?.is_completed &&
                                !test?.is_postponed_indefinitely &&
                                !test?.is_exam_cancelled && (
                                    <span className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded-full">
                                        Scheduled
                                    </span>
                                )}
                        </Tooltip>
                    </div>
                    <p className="text-gray-800">{test.portion_desc}</p>
                    <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-2 text-gray-500">
                            <Calendar size={16} />
                            <span>
                                {new Date(test.date).toLocaleDateString()}
                            </span>
                        </div>
                        <div className="text-gray-500">
                            Max Marks: {test.max_mark} | Pass Marks:{" "}
                            {test.pass_mark}
                        </div>
                    </div>
                </div>
                <div className="flex items-center space-x-2">
                    {test.is_completed && test.has_submitted_marks ? (
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => {
                                    setSelectedTest(test);
                                    setIsPreviewModalOpen(true);
                                }}
                                className="px-3 py-1.5 rounded-lg flex items-center gap-2 bg-blue-500
                        hover:bg-blue-600 text-white cursor-pointer transition-colors"
                            >
                                <BookOpen size={18} />
                                <span className="text-sm whitespace-nowrap">
                                    {publishStatus.is_published
                                        ? "View Marks"
                                        : "Preview & Publish"}
                                </span>
                            </button>
                            <button
                                onClick={() => {
                                    setSelectedTest(test);
                                    setIsManageMarksOpen(true);
                                }}
                                className="px-3 py-1.5 rounded-lg flex items-center gap-2 bg-green-500
                        hover:bg-green-600 text-white cursor-pointer transition-colors"
                            >
                                <Edit size={18} />
                                <span className="text-sm whitespace-nowrap">
                                    Edit Marks
                                </span>
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={() => {
                                if (test.is_completed) {
                                    setSelectedTest(test);
                                    setIsManageMarksOpen(true);
                                }
                            }}
                            disabled={!test.is_completed}
                            className={`px-3 py-1.5 rounded-lg flex items-center gap-2 relative group/tooltip
                        ${
                            test.is_completed
                                ? "bg-green-500 hover:bg-green-600 text-white cursor-pointer"
                                : "bg-gray-100 text-gray-400 cursor-not-allowed"
                        } transition-colors`}
                            title={
                                test.is_completed
                                    ? "Add/Edit Marks"
                                    : "Complete the exam to add marks"
                            }
                        >
                            <Edit size={18} />
                            <span className="text-sm whitespace-nowrap">
                                Add Marks
                            </span>
                            {!test.is_completed && (
                                <span
                                    className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white
                        px-2 py-1 rounded text-xs whitespace-nowrap opacity-0
                        group-hover/tooltip:opacity-100 transition-opacity"
                                >
                                    Complete the exam to add marks
                                </span>
                            )}
                        </button>
                    )}

                    <div className="flex items-start space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                            onClick={() => {
                                setSelectedTest(test);
                                setIsEditMode(true);
                            }}
                            className="p-2 hover:bg-blue-50 rounded-full transition-colors relative group/tooltip"
                            title="Edit Test"
                        >
                            <span
                                className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white px-2 py-1
                    rounded text-xs whitespace-nowrap opacity-0 group-hover/tooltip:opacity-100 transition-opacity"
                            >
                                Edit Test
                            </span>
                            <Edit size={18} className="text-blue-500" />
                        </button>
                        <button
                            // onClick={() =>
                            //     handleDelete(test.id)
                            // }
                            className="p-2 hover:bg-red-50 rounded-full transition-colors relative group/tooltip"
                            title="Delete Test"
                        >
                            <span
                                className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white px-2 py-1
                    rounded text-xs whitespace-nowrap opacity-0 group-hover/tooltip:opacity-100 transition-opacity"
                            >
                                Delete Test
                            </span>
                            <Trash size={18} className="text-red-500" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UnitTestCard;
