import { Trash } from "lucide-react";
import { Edit } from "lucide-react";
import { BookOpen, Calendar } from "lucide-react";
import { Class, Homework, Subject } from "../../types/Types";

type PropType = {
    homework: Homework;
    subjects: Subject[];
    classes: Class[];
    handleEdit: (homework: Homework) => void;
    handleDelete: (id: number) => void;
};

const homeWorkoutCard = ({
    homework,
    subjects,
    classes,
    handleEdit,
    handleDelete,
}: PropType) => {
    return (
        <div
            key={homework.id}
            className="bg-white rounded-lg p-6 hover:shadow-lg transition-all duration-200 
    border border-gray-100 hover:border-emerald-100 group relative"
        >
            <div className="flex justify-between">
                <div className="space-y-3">
                    <div className="flex items-center gap-2">
                        <BookOpen size={18} className="text-emerald-600" />
                        <span className="font-medium text-gray-700 group-hover:text-emerald-600 transition-colors">
                            {subjects.find((s) => s.id === homework?.subjectID)
                                ?.name || "Unknown Subject"}
                        </span>
                        <span className="text-gray-400">|</span>
                        <span className="text-gray-600">
                            {
                                classes.find((c) => c.id === homework?.classID)
                                    ?.name || "Unknown Class"
                            }
                        </span>
                    </div>
                    <p className="text-gray-800 group-hover:text-gray-900 transition-colors">
                        {homework.homeworkDesc}
                    </p>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Calendar
                            size={16}
                            className="group-hover:text-red-700 transition-colors"
                        />
                        <span className="group-hover:text-red-700 transition-colors">
                            Due:{" "}
                            {new Date(homework.dueDate).toLocaleDateString()}
                        </span>
                    </div>
                </div>
                <div className="flex items-start space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                        onClick={() => handleEdit(homework)}
                        className="p-2 hover:bg-blue-50 rounded-full transition-colors"
                    >
                        <Edit size={18} className="text-blue-500" />
                    </button>
                    <button
                        onClick={() => handleDelete(homework.id)}
                        className="p-2 hover:bg-red-50 rounded-full transition-colors"
                    >
                        <Trash size={18} className="text-red-500" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default homeWorkoutCard;
