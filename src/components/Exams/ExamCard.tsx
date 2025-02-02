import { ChevronRight } from "lucide-react";
import { Calendar } from "lucide-react";
import React from "react";
import { Exam } from "../../types/Types";

type PropType = {
    exam: Exam;
    setSelectedExam: React.Dispatch<React.SetStateAction<Exam | null>>;
};

const ExamCard = ({ exam, setSelectedExam }: PropType) => {
    return (
        <div
            key={exam?.id}
            onClick={() => setSelectedExam(exam)}
            className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 
    border-2 border-gray-100 hover:border-emerald-200 cursor-pointer group"
        >
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3
                        className="text-lg font-semibold text-gray-800 group-hover:text-emerald-600 
            transition-colors"
                    >
                        {exam?.Name}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                        Academic Year: {exam?.AcademicYear}
                    </p>
                </div>
                <span
                    className="p-2 rounded-full bg-emerald-50 text-emerald-600 
        group-hover:bg-emerald-100 transition-colors"
                >
                    <ChevronRight size={20} />
                </span>
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-500 mt-4 pt-4 border-t">
                <Calendar size={16} />
                <span>
                    Created: {new Date(exam?.CreatedAt).toLocaleDateString()}
                </span>
            </div>
        </div>
    );
};

export default ExamCard;
