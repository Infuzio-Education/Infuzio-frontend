import { ClassItem } from "../../types/Types";

const ClassCard = ({
    classItem,
    updateClassesTabState,
    setSelectedClass,
}: {
    classItem: ClassItem;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    updateClassesTabState: (state: any) => void;
    setSelectedClass: (classItem: ClassItem) => void;
}) => {
    return (
        <div
            key={classItem.id}
            onClick={() => {
                setSelectedClass(classItem);
                updateClassesTabState({ selectedClass: classItem });
            }}
            className={`cursor-pointer transition-all duration-200 ${
                classItem?.isClassTeacher
                    ? "bg-emerald-50 border-2 border-emerald-500"
                    : "bg-white border border-gray-200 hover:border-blue-500"
            } p-6 rounded-lg`}
        >
            <div className="flex justify-between items-start">
                <div>
                    {classItem?.isClassTeacher && (
                        <span className="inline-block px-2 py-1 text-xs font-semibold text-emerald-700 bg-emerald-100 rounded-full mb-2">
                            Class Teacher
                        </span>
                    )}
                    <h3 className="text-lg font-bold text-gray-800">
                        {classItem.name}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                        {classItem?.studentCount} Students
                    </p>
                    <div className="mt-2 flex flex-wrap gap-1">
                        {classItem?.subjectsTaught?.map((subject) => (
                            <span
                                key={subject}
                                className="px-2 py-0.5 text-xs bg-gray-100 text-gray-600 rounded-full"
                            >
                                {subject}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ClassCard;
