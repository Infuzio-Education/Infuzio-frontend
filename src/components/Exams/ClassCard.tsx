import { ChevronRight } from "lucide-react";

export type ClassCardType = {
    isClassTeacher: boolean;
    name: string;
    id: number;
    subjectsTaught: string[];
};

type PropType = {
    cls: ClassCardType;
    handleClick: () => void;
};

const ClassCard = ({ cls, handleClick }: PropType) => {

    return (
        <div
            key={cls.id}
            onClick={handleClick}
            className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 
    border-2 border-gray-100 hover:border-emerald-200 cursor-pointer group"
        >
            <div className="flex justify-between items-start">
                <div>
                    <div className="flex items-center gap-2">
                        <h3 className="text-lg font-semibold text-gray-800 group-hover:text-emerald-600">
                            {cls.name}
                        </h3>
                        {cls.isClassTeacher && (
                            <span
                                className="px-3 py-1 bg-emerald-100 text-emerald-700 
                    text-xs font-medium rounded-full"
                            >
                                Class Teacher
                            </span>
                        )}
                    </div>

                    {/* Add subjects list */}
                    <div className="mt-3 space-y-1">
                        <div className="flex flex-wrap gap-2">
                            {cls.subjectsTaught.map((subject) => (
                                <span
                                    key={subject}
                                    className="px-2 py-1 bg-gray-100 text-gray-600 
                                text-xs rounded-full"
                                >
                                    {subject}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
                <span className="p-2 rounded-full bg-emerald-50 text-emerald-600">
                    <ChevronRight size={20} />
                </span>
            </div>
        </div>
    );
};

export default ClassCard;
