import { useEffect, useState } from "react";
import HeaderComponent from "./HeaderComponent";
import ClassTeacherSubjectSelectionTab from "./ClassTeacherSubjectSelectionTab";
import SubjectOverView from "./SubjectOverView";
import { getTermExamMarksForClassTeacher } from "../../api/staffs";
import { message } from "antd";
import { Class, Exam } from "../../types/Types";
import MarkEntryView, { StudentMark } from "./MarkEntryView";

export type StudentExam = {
    studentID: number;
    name: string;
    rollNumber: number;
    subjectMarks: Record<string, number | null | "absent">;
};

export type SubjectExam = {
    subjectId: number;
    subjectName: string;
    maxMark: number;
    markEntryStatus: "Partial" | "Completed" | "Pending";
    termExamSubjectID: number;
};

type PropType = {
    selectedClass: Class;
    selectedExam: Exam;
    onBack: () => void;
};

const ClassTeacherView = ({
    selectedClass,
    selectedExam,
    onBack,
}: PropType) => {
    const [selectedSubject, setSelectedSubject] = useState<SubjectExam | null>(
        null
    );
    const [subjects, setSubjects] = useState<SubjectExam[]>([]);
    const [students, setStudents] = useState<StudentExam[]>([]);
    const [studentMark, setStudentMark] = useState<StudentMark[]>([]);

    useEffect(() => {
        if (selectedClass?.isClassTeacher && selectedExam) {
            getMarkDetailsForClassTeacher(selectedExam?.id, selectedClass?.id);
        }
    }, [selectedClass, selectedExam]);

    useEffect(() => {
        if (selectedSubject) {
            setStudentMark(
                students?.map(
                    ({ name, rollNumber, studentID, subjectMarks }) => ({
                        studentID,
                        rollNumber,
                        studentName: name,
                        mark:
                            subjectMarks?.[selectedSubject?.subjectId] !==
                            "absent"
                                ? Number(
                                      subjectMarks?.[selectedSubject?.subjectId]
                                  ) || null
                                : null, // Ensure it's a number or null
                        isAbsent:
                            subjectMarks?.[selectedSubject?.subjectId] ===
                            "absent",
                        grade: "",
                    })
                )
            );
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedSubject]);

    const getMarkDetailsForClassTeacher = async (
        termExamId: number,
        classId: number
    ) => {
        try {
            const res = await getTermExamMarksForClassTeacher(
                termExamId,
                classId
            );
            setStudents(res?.students || []);
            setSubjects(res?.subjects || {});
            console.log("res", res);
        } catch (error) {
            message?.error("Couldn't fetch mark details");
            console.log(error);
        }
    };

    return (
        <div className="space-y-6">
            <HeaderComponent
                heading={`${selectedClass.name} - ${selectedExam?.Name}`}
                subHeading={`Class Teacher View`}
                handleBack={onBack}
            />

            <ClassTeacherSubjectSelectionTab
                selectedSubject={selectedSubject}
                setSelectedSubject={setSelectedSubject}
                subjects={subjects}
            />

            {!selectedSubject && (
                <SubjectOverView
                    setSelectedSubject={setSelectedSubject}
                    students={students}
                    subjects={subjects}
                />
            )}

            {selectedSubject && (
                <MarkEntryView
                    studentMark={studentMark}
                    selectedSubject={{
                        maxMark: selectedSubject?.maxMark,
                        termExamSubjectID: selectedSubject?.termExamSubjectID,
                        subjectName: selectedSubject?.subjectName,
                        subjectID: selectedSubject?.subjectId,
                        markEntryStatus: selectedSubject?.markEntryStatus,
                    }}
                    selectedExam={selectedExam}
                    setStudentMark={setStudentMark}
                    onBack={() => setSelectedSubject(null)}
                />
            )}
        </div>
    );
};

export default ClassTeacherView;
