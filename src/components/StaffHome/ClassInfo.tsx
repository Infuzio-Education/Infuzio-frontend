import { ClassItem } from "../../types/Types";

const ClassInfo = ({ selectedClass }: { selectedClass: ClassItem }) => {
    return (
        <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-800">
                    Class Information
                </h3>
                {selectedClass.isClassTeacher && (
                    <span className="px-3 py-1 text-sm font-medium text-emerald-700 bg-emerald-100 rounded-full">
                        Class Teacher
                    </span>
                )}
            </div>
            <div className="space-y-4">
                <div>
                    <h4 className="text-sm font-medium text-gray-600">
                        Subjects Teaching
                    </h4>
                    <div className="mt-2 flex flex-wrap gap-2">
                        {selectedClass?.subjectsTaught?.map((subject) => (
                            <span
                                key={subject}
                                className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-full"
                            >
                                {subject}
                            </span>
                        )) || (
                            <span className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-full">
                                No subjects found
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ClassInfo;
