import { useEffect, useState } from "react";
import { BookOpenCheck } from "lucide-react";
import EmptyState from "../../components/EmptyState";
import { Exam, Class } from "../../types/Types";
import ExamCard from "../../components/Exams/ExamCard";
import HeaderComponent from "../../components/Exams/HeaderComponent";
import { message } from "antd";
import { getClassesGeneral, getTermExam } from "../../api/staffs";
import ClassCard, { ClassCardType } from "../../components/Exams/ClassCard";
import SelectedClassComponent from "../../components/Exams/SelectedClassComponent";
import { CircularProgress } from "@mui/material";

const Exams = () => {
    const [exams, setExams] = useState<Exam[]>([]);

    const [classes, setClasses] = useState<ClassCardType[]>([]);

    const [selectedExam, setSelectedExam] = useState<Exam | null>(null);
    const [selectedClass, setSelectedClass] = useState<Class | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchExams();
        fetchClasses();
    }, []);

    const fetchExams = async (page = 1) => {
        try {
            const response = await getTermExam(page);
            setExams(response);
            setLoading(false);
        } catch (error) {
            console.log(error);
            message?.error("Failed to fetch exams");
            setError("Couldn't fetch exams");
            setLoading(false);
        }
    };

    const fetchClasses = async (page = 1) => {
        try {
            const response = await getClassesGeneral({
                criteria: "my-classes",
                page,
                limit: 20,
            });

            setClasses((prevClasses) =>
                page === 1 ? response : [...prevClasses, ...response]
            );
        } catch (error) {
            console.log(error);
        }
    };

    return selectedClass && selectedExam ? (
        <SelectedClassComponent
            selectedExam={selectedExam}
            selectedClass={selectedClass}
            setSelectedClass={setSelectedClass}
        />
    ) : (
        <div className="space-y-6">
            <HeaderComponent
                heading={selectedExam ? selectedExam?.Name : "Exams"}
                subHeading={
                    selectedExam
                        ? " Select a class to proceed"
                        : "View and Add Marks in Exams"
                }
                handleBack={
                    selectedExam ? () => setSelectedExam(null) : undefined
                }
            />

            {loading ? (
                <div className="w-full flex justify-center h-[300px] items-center">
                    <CircularProgress />
                </div>
            ) : error ? (
                <div className="w-full flex justify-center h-[300px] items-center text-red-500">
                    {error}
                </div>
            ) : selectedExam ? (
                classes?.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {classes?.map((cls) => (
                            <ClassCard
                                key={cls?.id}
                                cls={cls}
                                handleClick={() =>
                                    setSelectedClass(cls as unknown as Class)
                                }
                            />
                        ))}
                    </div>
                ) : (
                    <div className="w-full text-center"> No Classes found </div>
                )
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {exams?.length === 0 ? (
                        <EmptyState
                            icon={<BookOpenCheck size={48} />}
                            title="No Exams Found"
                            message="There are no exams available at the moment."
                        />
                    ) : (
                        exams?.map((exam) => (
                            <ExamCard
                                key={exam?.id}
                                exam={exam}
                                setSelectedExam={setSelectedExam}
                            />
                        ))
                    )}
                </div>
            )}
        </div>
    );
};

export default Exams;
