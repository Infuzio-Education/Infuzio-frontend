import { useMemo } from "react";
import { ClassItem } from "../../types/Types";
import { ArrowLeft, PenLine, Sheet, UsersRound } from "lucide-react";
import ClassInfo from "./ClassInfo";
import ActionCard from "./ActionCard";
import { ClassesTabState } from "../../types/StateTypes";

const SelectedClassDetails = ({
    selectedClass,
    updateClassesTabState,
    setShowTimetable,
    navigateToStudents,
    handleBack,
}: {
    selectedClass: ClassItem;
    updateClassesTabState: (state: Partial<ClassesTabState>) => void;
    setShowTimetable: (show: boolean) => void;
    navigateToStudents: () => void;
    handleBack: () => void;
}) => {
    const actionCards = useMemo(
        () => [
            {
                title: "Take Attendance",
                description: "Mark today's attendance for the class",
                Icon: PenLine,
                iconBgColor: "bg-emerald-100",
                iconHoverBgColor: "bg-emerald-200",
                iconTextColor: "text-emerald-600",
                actionText: "Start Now",
                onClick: () =>
                    updateClassesTabState({ showAttendance: true }),
            },
            {
                title: "Time Table",
                description: "View class schedule and periods",
                Icon: Sheet,
                iconBgColor: "bg-blue-100",
                iconHoverBgColor: "bg-blue-200",
                iconTextColor: "text-blue-600",
                actionText: "View Schedule",
                onClick: () => setShowTimetable(true),
            },
            {
                title: "View Students",
                description: "See all students in this class",
                Icon: UsersRound,
                iconBgColor: "bg-purple-100",
                iconHoverBgColor: "bg-purple-200",
                iconTextColor: "text-purple-600",
                actionText: "View List",
                onClick: navigateToStudents,
            },
        ],
        [selectedClass]
    );
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                    <button
                        onClick={handleBack}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        <h2 className="text-xl font-bold text-gray-800">
                            {selectedClass.name}
                        </h2>
                        <p className="text-sm text-gray-600">
                            {selectedClass.studentCount} Students
                        </p>
                    </div>
                </div>
            </div>
            {/* Class Action Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Take Attendance Card */}
                {actionCards.map((card, index) => (
                    <ActionCard key={index} {...card} />
                ))}
            </div>
            {/* Class Info Card */}
            <ClassInfo selectedClass={selectedClass} />
        </div>
    );
};

export default SelectedClassDetails;
