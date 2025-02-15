import { SubjectExam } from "./ClassTeacherView";

type PropType = {
    subjects: SubjectExam[];
    setSelectedSubject: React.Dispatch<
        React.SetStateAction<SubjectExam | null>
    >;
    selectedSubject: SubjectExam | null;
};
const ClassTeacherSubjectSelectionTab = ({
    subjects,
    setSelectedSubject,
    selectedSubject,
}: PropType) => {
    return (
        <div className="bg-white rounded-xl shadow-sm p-4">
            <h3 className="text-sm font-medium text-gray-700 mb-3">
                Add/View Marks by Subject
            </h3>
            <div className="flex flex-wrap gap-2">
                {subjects.map((subject) => {
                    const status = subject?.markEntryStatus;
                    return (
                        <button
                            key={subject?.subjectId}
                            onClick={() => setSelectedSubject({ ...subject })}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all
                                            flex items-center gap-2 
                                            ${
                                                selectedSubject?.subjectId ===
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
