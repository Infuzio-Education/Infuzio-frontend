import { Tooltip } from "antd";
import { BookOpen, Calendar, ChevronDown, Edit, Trash2 } from "lucide-react";
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
    onDelete: (testId: number) => void;
};

const UnitTestCard = ({
    test,
    setSelectedTest,
    handleStatusChange,
    setIsPreviewModalOpen,
    setIsManageMarksOpen,
    setIsEditMode,
    subjects,
    onDelete,
}: PropType) => {
    // Hide edit buttons if test is cancelled
    const isTestCancelled = test?.status === "Cancelled";

    return (
        <div
            key={test.id}
            className="bg-white rounded-lg p-6 hover:shadow-lg transition-all duration-200
    border border-gray-100 hover:border-emerald-100 group relative"
        >
            <div className="flex justify-between flex-wrap gap-7">
                <div
                    className="space-y-3 flex-1 cursor-pointer"
                    onClick={() => {
                        setSelectedTest(test);
                        // setIsDetailsModalOpen(true);
                    }}
                >
                    <div className="flex items-center">
                        <BookOpen size={18} className="text-emerald-600" />
                        <span className="font-medium text-gray-700 pl-2 transition-colors">
                            {subjects?.find(
                                (subject) => subject.id === test.subject_id
                            )?.name || "Unknown Subject"}
                        </span>
                        <span className="text-gray-500 px-2">|</span>
                        <span>{test.class_name}</span>
                        <Tooltip
                            color="transparent"
                            arrow={false}
                            trigger="click"
                            placement="bottomLeft"
                            overlayInnerStyle={{ padding: "0px" }}
                            title={
                                test.status !== "Published" && test.status !== "Cancelled" && (
                                    <ul className="list-none p-0 m-0 w-[180px] bg-white rounded-lg shadow-md">
                                        <li
                                            className="px-4 py-2 text-sm bg-green-100 text-green-700 hover:bg-green-200 cursor-pointer transition-colors"
                                            onClick={() => handleStatusChange(test.id, "Completed")}
                                        >
                                            Completed
                                        </li>
                                        <li
                                            className="px-4 py-2 text-sm bg-yellow-100 text-yellow-700 hover:bg-yellow-200 cursor-pointer transition-colors"
                                            onClick={() => handleStatusChange(test.id, "Postponed")}
                                        >
                                            Postponed
                                        </li>
                                        <li
                                            className="px-4 py-2 text-sm bg-red-100 text-red-700 hover:bg-red-200 cursor-pointer transition-colors"
                                            onClick={() => handleStatusChange(test.id, "Cancelled")}
                                        >
                                            Cancelled
                                        </li>
                                    </ul>
                                )
                            }
                        >
                            <span
                                className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1 cursor-pointer ${test.status === 'Published' ? 'bg-blue-100 text-blue-700' :
                                    test.status === 'Postponed' ? 'bg-yellow-100 text-yellow-700' :
                                        test.status === 'Completed' ? 'bg-green-100 text-green-700' :
                                            'bg-red-100 text-red-700'
                                    }`}
                            >
                                {test.status}
                                {test.status !== "Published" && test.status !== "Cancelled" && (
                                    <ChevronDown size={16} className="ml-1" />
                                )}
                            </span>
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
                        <div className="text-gray-500 whitespace-nowrap">
                            Max Marks: {test.max_mark} | Pass Marks:{" "}
                            {test.pass_mark}
                        </div>
                    </div>
                </div>
                <div className="flex items-center space-x-2">
                    {test.is_mark_added && (
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
                                    {test?.status === "Published"
                                        ? "View Marks"
                                        : "Preview & Publish"}
                                </span>
                            </button>
                            {!isTestCancelled && (  // Only show Edit Marks if not cancelled
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
                            )}
                        </div>
                    )}

                    {!isTestCancelled && !test.is_mark_added && (
                        <>
                            <button
                                onClick={() => {
                                    if (test?.status === "Completed") {
                                        setSelectedTest(test);
                                        setIsManageMarksOpen(true);
                                    }
                                }}
                                disabled={!(test?.status === "Completed")}
                                className={`px-3 py-1.5 rounded-lg flex items-center gap-2 relative group/tooltip
                                ${test?.status === "Completed"
                                        ? "bg-green-500 hover:bg-green-600 text-white cursor-pointer"
                                        : "bg-gray-100 text-gray-400 cursor-not-allowed"
                                    } transition-colors`}
                                title={
                                    test?.status === "Completed"
                                        ? "Add/Edit Marks"
                                        : "Complete the exam to add marks"
                                }
                            >
                                <Edit size={18} />
                                <span className="text-sm whitespace-nowrap">
                                    Add Marks
                                </span>
                                {!(test?.status === "Completed") && (
                                    <span
                                        className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white
                                        px-2 py-1 rounded text-xs whitespace-nowrap opacity-0
                                        group-hover/tooltip:opacity-100 transition-opacity"
                                    >
                                        Complete the exam to add marks
                                    </span>
                                )}
                            </button>
                            <div className="flex items-start space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                    onClick={() => onDelete(test.id)}
                                    className="px-3 py-1.5 rounded-lg flex items-center text-red-500 cursor-pointer relative group/tooltip"
                                    title="Delete Unit Test"
                                >
                                    <Trash2 size={18} />
                                    <span
                                        className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white
                                        px-2 py-1 rounded text-xs whitespace-nowrap opacity-0
                                        group-hover/tooltip:opacity-100 transition-opacity"
                                    >
                                        Delete Unit Test
                                    </span>
                                </button>
                            </div>
                        </>
                    )}

                    {!isTestCancelled && (  // Only show Edit Test if not cancelled
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
                        </div>
                    )}
                </div>
            </div>
        </div >
    );
};

export default UnitTestCard;
