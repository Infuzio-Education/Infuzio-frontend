import { useState } from "react";
import { Users, ChartLine } from "lucide-react";
import StaffAttendance from "./StaffAttendance";
import TimeTable from "./TimeTable";
import OverviewTab from "../../components/StaffHome/OverviewTab";
import ClassesTab from "../../components/StaffHome/ClassesTab";
import { useLocation } from "react-router-dom";

type TabType = "overview" | "classes" | "attendance";

const StaffHome = () => {
    const location = useLocation();
    const [activeTab, setActiveTab] = useState<TabType>(
        location.state?.activeTab || "overview"
    );
    // const [selectedClass, setSelectedClass] = useState<any | null>(
    //     location.state?.selectedClass || null
    // );
    const [showTimetable, setShowTimetable] = useState(false);

    const tabs = [
        { id: "overview", label: "Overview", icon: <ChartLine size={18} /> },
        { id: "classes", label: "Classes", icon: <Users size={18} /> },
        { id: "attendance", label: "My Attendance", icon: <Users size={18} /> },
    ];

    // Update renderContent to pass selectedClass props
    const renderContent = () => {
        switch (activeTab) {
            case "classes":
                return (
                    <ClassesTab
                        setShowTimetable={setShowTimetable}
                    />
                );
            case "attendance":
                return <StaffAttendance />;
            default:
                return <OverviewTab />;
        }
    };

    return (
        <>
            {showTimetable ? (
                <TimeTable
                    onBack={() => {
                        setShowTimetable(false);
                        // selectedClass state is maintained
                    }}
                />
            ) : (
                <div className="space-y-6">
                    <div className="flex justify-between items-center">
                        <h1 className="text-2xl font-bold text-gray-800">
                            Welcome Back!
                        </h1>
                        <div className="text-sm text-gray-600">
                            {new Date().toLocaleDateString("en-US", {
                                weekday: "long",
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                            })}
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="border-b border-gray-200">
                        <nav className="-mb-px flex space-x-8">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() =>
                                        setActiveTab(tab.id as TabType)
                                    }
                                    className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm
                                        ${
                                            activeTab === tab.id
                                                ? "border-emerald-700 text-emerald-700"
                                                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                                        }`}
                                >
                                    {tab.icon}
                                    <span className="ml-2">{tab.label}</span>
                                </button>
                            ))}
                        </nav>
                    </div>

                    {/* Tab Content */}
                    {renderContent()}
                </div>
            )}
        </>
    );
};

export default StaffHome;
