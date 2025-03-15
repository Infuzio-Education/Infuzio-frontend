import { SubjectExam } from "./ClassTeacherView";
import { publishTermExamMarks, unPublishTermExamMarks } from "../../api/staffs";
import { message, Modal } from "antd";
import { useState } from "react";

type PropType = {
    subjects: SubjectExam[];
    setSelectedSubject: React.Dispatch<
        React.SetStateAction<SubjectExam | null>
    >;
    selectedSubject: SubjectExam | null;
    selectedClass: any;
    isPublished: boolean;
    onPublishStatusChange: (newStatus: boolean) => void;
};
const ClassTeacherSubjectSelectionTab = ({
    selectedClass,
    subjects,
    setSelectedSubject,
    selectedSubject,
    isPublished,
    onPublishStatusChange,
}: PropType) => {
    const [publishing, setPublishing] = useState(false);

    const handlePublish = () => {
        Modal.confirm({
            title: `Confirm ${isPublished ? 'Unpublish' : 'Publish'}`,
            content: `Are you sure you want to ${isPublished ? 'unpublish' : 'publish'} all marks for this class?`,
            okText: isPublished ? 'Unpublish' : 'Publish',
            okButtonProps: {
                danger: isPublished,
                type: 'primary'
            },
            cancelText: 'Cancel',
            async onOk() {
                try {
                    setPublishing(true);
                    const term_exam_subject_ids = subjects.map(
                        (subject) => subject.termExamSubjectID
                    );
                    const class_id = selectedClass.id;

                    if (isPublished) {
                        const response = await unPublishTermExamMarks(term_exam_subject_ids, class_id);
                        if (response.resp_code === 'SUCCESS') {
                            message.success("Marks unpublished successfully!");
                            onPublishStatusChange(false);
                        } else {
                            message.error("Failed to unpublish marks");
                        }
                    } else {
                        const response = await publishTermExamMarks(term_exam_subject_ids, class_id);
                        if (response.resp_code === 'SUCCESS') {
                            message.success("Marks published successfully!");
                            onPublishStatusChange(true);
                        } else {
                            message.error("Failed to publish marks");
                        }
                    }
                } catch (error) {
                    console.error("Publish error:", error);
                    message.error(`Failed to ${isPublished ? 'unpublish' : 'publish'} marks`);
                } finally {
                    setPublishing(false);
                }
            },
            onCancel() {
                // Do nothing if user cancels
            }
        });
    };

    return (
        <div className="bg-white rounded-xl shadow-sm p-4">
            {/* Header with Title and Publish Button */}
            <div className="flex justify-between items-center mb-3">
                <h3 className="text-sm font-medium text-gray-700">
                    Add/View Marks by Subject
                </h3>
                <div className="flex items-center gap-2">
                    {/* Tooltip Container */}
                    <div className="relative group">
                        <span className="text-gray-400 hover:text-gray-500 cursor-help">
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
                                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                            </svg>
                        </span>
                        {/* Tooltip Content */}
                        <div className="absolute hidden group-hover:block -right-40 -top-40 mt-2 w-64 bg-white shadow-lg rounded-lg p-4 border border-gray-200 z-10">
                            <div className="text-sm text-gray-600 space-y-2">
                                <p className="font-medium">Publishing Marks:</p>
                                <ul className="list-disc pl-4 space-y-1">
                                    <li>✅ Published marks are visible to students</li>
                                    <li>❌ Unpublished marks remain hidden</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={handlePublish}
                        disabled={publishing}
                        className={`px-4 py-2 ${isPublished ? 'bg-red-600 hover:bg-red-700' : 'bg-emerald-600 hover:bg-emerald-700'} text-white 
                            rounded-lg transition-all duration-200 flex items-center gap-2 text-sm font-medium
                            ${publishing ? "opacity-75 cursor-not-allowed" : ""}`}
                    >
                        {publishing ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                {isPublished ? "Unpublishing..." : "Publishing..."}
                            </>
                        ) : (
                            <>
                                <svg
                                    className="w-4 h-4"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    {isPublished ? (
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M6 18L18 6M6 6l12 12"
                                        />
                                    ) : (
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M5 13l4 4L19 7"
                                        />
                                    )}
                                </svg>
                                {isPublished ? "Unpublish All Marks" : "Publish All Marks"}
                            </>
                        )}
                    </button>
                </div>
            </div>

            <div className="flex flex-wrap gap-2">
                {subjects.map((subject) => {
                    const status = subject?.markEntryStatus;
                    return (
                        <button
                            key={subject?.subjectId}
                            onClick={() => setSelectedSubject({ ...subject })}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all
                                            flex items-center gap-2 
                                            ${selectedSubject?.subjectId ===
                                    subject?.subjectId
                                    ? "bg-emerald-100 text-emerald-700 border-2 border-emerald-200"
                                    : "bg-gray-100 text-gray-700 hover:bg-gray-200 border-2 border-transparent"
                                }`}
                        >
                            <span>{subject?.subjectName}</span>
                            {status === "Pending" && (
                                <span
                                    className="inline-flex items-center px-2 py-0.5 rounded-full text-xs 
                                            bg-amber-100 text-amber-700"
                                >
                                    Add Marks
                                </span>
                            )}
                            {status === "Partial" && (
                                <span
                                    className="inline-flex items-center px-2 py-0.5 rounded-full text-xs 
                                            bg-blue-100 text-blue-700"
                                >
                                    Partial
                                </span>
                            )}
                            {status === "Completed" && (
                                <span
                                    className="inline-flex items-center px-2 py-0.5 rounded-full text-xs 
                                            bg-emerald-100 text-emerald-700"
                                >
                                    ✓ Complete
                                </span>
                            )}
                        </button>
                    );
                })}
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
                    <div className="text-amber-700 text-sm font-medium">
                        Pending
                    </div>
                    <div className="text-2xl font-bold text-amber-800 mt-1">
                        {
                            subjects?.filter(
                                (s) => s.markEntryStatus === "Pending"
                            ).length
                        }
                    </div>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <div className="text-blue-700 text-sm font-medium">
                        Partial
                    </div>
                    <div className="text-2xl font-bold text-blue-800 mt-1">
                        {
                            subjects?.filter(
                                (s) => s.markEntryStatus === "Partial"
                            ).length
                        }
                    </div>
                </div>
                <div className="bg-emerald-50 p-4 rounded-lg border border-emerald-200">
                    <div className="text-emerald-700 text-sm font-medium">
                        Complete
                    </div>
                    <div className="text-2xl font-bold text-emerald-800 mt-1">
                        {
                            subjects?.filter(
                                (s) => s.markEntryStatus === "Completed"
                            ).length
                        }
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ClassTeacherSubjectSelectionTab;
