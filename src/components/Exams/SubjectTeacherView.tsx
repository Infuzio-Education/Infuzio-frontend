import { useEffect, useState } from "react";
import HeaderComponent from "./HeaderComponent";
import { ChevronRight } from "lucide-react";
import { Class, Exam, Subject } from "../../types/Types";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store/store";
import { getSubjects, getTermExamMarkClasswise } from "../../api/staffs";
import { message } from "antd";
import MarkEntryView, { StudentMark, SubjectDetails } from "./MarkEntryView";

type PropType = {
    selectedClass: Class;
    selectedExam: Exam;
    onBack: () => void;
};

const SubjectTeacherView = ({
    selectedClass,
    selectedExam,
    onBack,
}: PropType) => {
    const { staffInfo } = useSelector((state: RootState) => state.staffInfo);

    const [selectedSubject, setSelectedSubject] = useState<Subject | null>(
        null
    );

    const [selectedSubjectDetails, setSelectedSubjectDetails] =
        useState<SubjectDetails | null>(null);
    const [subjects, setSubjects] = useState<Subject[]>([]);

    const [studentMark, setStudentMark] = useState<StudentMark[]>([]);

    useEffect(() => {
        if (staffInfo?.staffID && selectedClass?.id) {
            fetchSubjects(selectedClass?.id, staffInfo?.staffID);
        }
    }, [staffInfo?.staffID, selectedClass?.id]);

    useEffect(() => {
        if (selectedClass && selectedExam && selectedSubject) {
            (async () => {
                const res = await getTermExamMarkClasswise(
                    selectedExam?.id,
                    selectedClass?.id,
                    selectedSubject?.id
                );
                setStudentMark(res?.studentMarks || []);
                const {
                    maxMark,
                    termExamSubjectID,
                    subjectName,
                    subjectID,
                    markEntryStatus,
                } = res;
                setSelectedSubjectDetails({
                    markEntryStatus,
                    maxMark,
                    subjectID,
                    subjectName,
                    termExamSubjectID,
                });
            })();
        }
    }, [selectedClass, selectedExam, selectedSubject]);

    const fetchSubjects = async (classID: number, staffID: number) => {
        try {
            const response = await getSubjects({
                classID,
                staffID,
                termExamSubjectsOnly: true,
            });

            setSubjects(response);
        } catch (error) {
            console.log(error);
            message?.error("Error fetching subjects");
        }
    };

    return (
        <div className="space-y-6">
            <HeaderComponent
                heading={
                    !selectedSubject
                        ? `${selectedClass.name} - ${selectedExam?.Name}`
                        : `${selectedSubject.name} - ${selectedClass.name}`
                }
                subHeading={
                    !selectedSubject
                        ? "Select your subject"
                        : `Enter marks for ${selectedExam?.Name}`
                }
                handleBack={
                    !selectedSubject ? onBack : () => setSelectedSubject(null)
                }
            />

            {!selectedSubjectDetails ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {subjects
                        // .filter((s) => s.isSubjectTeacher)
                        .map((subject) => (
                            <div
                                key={subject?.id}
                                onClick={() => setSelectedSubject(subject)}
                                className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-200
                            border-2 border-gray-100 hover:border-emerald-200 cursor-pointer group"
                            >
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-800 group-hover:text-emerald-600">
                                            {subject.name}
                                        </h3>
                                    </div>
                                    <span className="p-2 rounded-full bg-emerald-50 text-emerald-600">
                                        <ChevronRight size={20} />
                                    </span>
                                </div>
                            </div>
                        ))}
                </div>
            ) : (
                <MarkEntryView
                    onBack={() => setSelectedSubject(null)}
                    selectedSubject={selectedSubjectDetails}
                    setStudentMark={setStudentMark}
                    studentMark={studentMark}
                    selectedExam={selectedExam}
                />
            )}
        </div>
    );
};

export default SubjectTeacherView;
