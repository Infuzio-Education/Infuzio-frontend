import { useNavigate } from "react-router-dom";
import { ClassesTabProps, ClassItem } from "../../types/Types";
import { useEffect, useState } from "react";
import { getClasses } from "../../api/staffs";
import ClassCard from "./ClassCard";
import SelectedClassDetails from "./SelectedClassDetails";
import TakeAttendance from "../../pages/staffs/TakeAttendance";
import { ArrowLeft } from "lucide-react";
import { CircularProgress } from "@mui/material";
import { ClassesTabState } from "../../types/StateTypes";

const ClassesTab = ({ setShowTimetable }: ClassesTabProps) => {
    const navigate = useNavigate();
    const [state, setState] = useState<ClassesTabState>({
        loading: true,
        error: "",
        classes: [],
        selectedClass: null,
        showAttendance: false,
    });

    const updateClassesTabState = (newState: Partial<ClassesTabState>) => {
        setState((prevState) => ({
            ...prevState,
            ...newState,
        }));
    };

    const fetchClasses = async () => {
        try {
            const response = await getClasses({
                criteria: "my-classes",
            });
            updateClassesTabState({ loading: false, classes: response });
        } catch (error) {
            updateClassesTabState({
                loading: false,
                error: "Error fetching classes, Try refreshing the page",
                classes: [],
            });
        }
    };

    useEffect(() => {
        fetchClasses();
    }, []);

    // Update the handleBack function
    const handleBack = () => {
        if (state.showAttendance) {
            updateClassesTabState({ showAttendance: false });
        } else {
            updateClassesTabState({ selectedClass: null });
        }
    };

    // Update the students navigation to include returnToClass flag
    const navigateToStudents = () => {
        navigate("/staffs/students", {
            state: {
                fromClass: state.selectedClass,
                returnTab: "classes",
                returnToClass: true, // Add this flag
            },
        });
    };

    return (
        <div>
            {state.selectedClass ? (
                <SelectedClassDetails
                    selectedClass={state.selectedClass}
                    updateClassesTabState={updateClassesTabState}
                    setShowTimetable={setShowTimetable}
                    navigateToStudents={navigateToStudents}
                    handleBack={handleBack}
                />
            ) : state.loading ? (
                <div className="flex justify-center items-center h-[300px]">
                    <CircularProgress />
                </div>
            ) : state.error ? (
                <div className="flex justify-center items-center h-[300px]">
                    <p className="text-red-500">{state.error}</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {state?.classes?.length > 0 ? (
                        state?.classes?.map((classItem: ClassItem) => (
                            <ClassCard
                                key={classItem.id}
                                classItem={classItem}
                                updateClassesTabState={updateClassesTabState}
                            />
                        ))
                    ) : (
                        <div className="flex justify-center items-center h-[300px] col-span-full">
                            <p className="text-red-500">No classes found</p>
                        </div>
                    )}
                </div>
            )}

            {state.showAttendance && state.selectedClass && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
                    <div className="w-full max-w-4xl">
                        <div className="flex items-center gap-4 mb-4">
                            <button
                                onClick={handleBack}
                                className="p-2 hover:bg-gray-100 rounded-full transition-colors bg-white"
                            >
                                <ArrowLeft size={20} />
                            </button>
                        </div>
                        <TakeAttendance
                            classInfo={{
                                name: state.selectedClass.name,
                                section: state.selectedClass.section,
                                id: state.selectedClass.id,
                            }}
                            onClose={() =>
                                updateClassesTabState({ showAttendance: false })
                            }
                        />
                    </div>
                </div>
            )}
        </div>
    );
};
export default ClassesTab;
