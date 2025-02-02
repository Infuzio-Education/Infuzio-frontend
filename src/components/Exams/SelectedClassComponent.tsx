import React, { useState } from "react";
import ClassTeacherSubjectSelectionTab from "./ClassTeacherSubjectSelectionTab";
import SubjectOverView from "./SubjectOverView";
import MarkEntryView from "./MarkEntryView";
import { ArrowLeft, ChevronRight } from "lucide-react";
import {
    Class,
    Exam,
    ExamStudent,
    GradeSystem,
    Subject,
} from "../../types/Types";
import HeaderComponent from "./HeaderComponent";

type PropType = {
    selectedClass: Class;
    selectedExam: Exam | null;
    setSelectedClass: React.Dispatch<React.SetStateAction<Class | null>>;
};

const SelectedClassComponent = ({
    selectedClass,
    selectedExam,
    setSelectedClass,
}: PropType) => {
    const [selectedSubject, setSelectedSubject] = useState<Subject | null>(
        null
    );

    const [students, setStudents] = useState<ExamStudent[]>([
        {
            id: 1,
            name: "John Doe",
            rollNo: "001",
            marks: [
                { subjectId: 1, marks: 0, isAbsent: false }, // Math marks pending
                { subjectId: 2, marks: 78, isAbsent: false }, // Science marks added
                { subjectId: 3, marks: 92, isAbsent: false },
                { subjectId: 4, marks: 88, isAbsent: false },
                { subjectId: 5, marks: 75, isAbsent: false },
                { subjectId: 6, marks: 82, isAbsent: false },
                { subjectId: 7, marks: 79, isAbsent: false },
            ],
        },
        {
            id: 2,
            name: "Jane Smith",
            rollNo: "002",
            marks: [
                { subjectId: 1, marks: 0, isAbsent: false }, // Math marks pending
                { subjectId: 2, marks: 85, isAbsent: false }, // Science marks added
                { subjectId: 3, marks: 88, isAbsent: false },
                { subjectId: 4, marks: 90, isAbsent: false },
                { subjectId: 5, marks: 87, isAbsent: false },
                { subjectId: 6, marks: 84, isAbsent: false },
                { subjectId: 7, marks: 86, isAbsent: false },
            ],
        },
        {
            id: 3,
            name: "Mike Johnson",
            rollNo: "003",
            marks: [
                { subjectId: 1, marks: 0, isAbsent: false }, // Math marks pending
                { subjectId: 2, marks: 82, isAbsent: false }, // Science marks added
                { subjectId: 3, marks: 85, isAbsent: false },
                { subjectId: 4, marks: 76, isAbsent: false },
                { subjectId: 5, marks: 80, isAbsent: false },
                { subjectId: 6, marks: 88, isAbsent: false },
                { subjectId: 7, marks: 84, isAbsent: false },
            ],
        },
        {
            id: 4,
            name: "Sarah Williams",
            rollNo: "004",
            marks: [
                { subjectId: 1, marks: 95, isAbsent: false },
                { subjectId: 2, marks: 88, isAbsent: false },
                { subjectId: 3, marks: 90, isAbsent: false },
                { subjectId: 4, marks: 92, isAbsent: false },
                { subjectId: 5, marks: 85, isAbsent: false },
                { subjectId: 6, marks: 89, isAbsent: false },
                { subjectId: 7, marks: 87, isAbsent: false },
            ],
        },
    ]);

    const getSubjectMarkStatus = (subjectId: number) => {
        const totalStudents = students.length;
        const markedStudents = students.filter((student) => {
            const mark = student.marks.find((m) => m.subjectId === subjectId);
            return mark && (mark.marks > 0 || mark.isAbsent);
        }).length;

        if (markedStudents === 0) return "pending";
        if (markedStudents < totalStudents) return "partial";
        return "complete";
    };

    // Function to handle mark updates
    const handleMarkUpdate = (
        studentId: number,
        marks: number,
        isAbsent: boolean
    ) => {
        setStudents((prevStudents) =>
            prevStudents.map((student) => {
                if (student.id === studentId) {
                    return {
                        ...student,
                        marks: student.marks.map((mark: StudentMark) => {
                            if (mark.subjectId === selectedSubject?.id) {
                                return {
                                    ...mark,
                                    marks: isAbsent ? 0 : marks,
                                    isAbsent: isAbsent,
                                };
                            }
                            return mark;
                        }),
                    };
                }
                return student;
            })
        );
    };

    // Add this function to validate marks input
    const validateMarks = (value: number, maxMarks: number) => {
        if (value < 0) return 0;
        if (value > maxMarks) return maxMarks;
        return value;
    };

    // Add this function to calculate mark status
    const getMarkStatus = () => {
        const totalStudents = students.length;
        const markedStudents = students.filter((student) => {
            const mark = student.marks.find(
                (m) => m.subjectId === selectedSubject?.id
            );
            return mark && (mark.marks > 0 || mark.isAbsent);
        }).length;
        return { totalStudents, markedStudents };
    };

    const [subjects] = useState<any[]>([
        { id: 1, name: "Mathematics", code: "MATH", isSubjectTeacher: true },
        { id: 2, name: "Science", code: "SCI", isSubjectTeacher: false },
        { id: 3, name: "English", code: "ENG", isSubjectTeacher: false },
        { id: 4, name: "Social Studies", code: "SOC", isSubjectTeacher: false },
        { id: 5, name: "Malayalam", code: "MAL", isSubjectTeacher: false },
        { id: 6, name: "Hindi", code: "HIN", isSubjectTeacher: false },
        { id: 7, name: "Arabic", code: "ARB", isSubjectTeacher: false },
    ]);

    const renderGrade = (
        student: ExamStudent,
        subjectId: number,
        maxMarks: number
    ) => {
        const mark = student.marks.find((m) => m.subjectId === subjectId);
        const percentage = mark?.isAbsent
            ? 0
            : ((mark?.marks || 0) / maxMarks) * 100;

        return (
            <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                    mark?.isAbsent
                        ? "bg-gray-100 text-gray-600"
                        : percentage >= 90
                        ? "bg-emerald-100 text-emerald-700"
                        : percentage >= 80
                        ? "bg-blue-100 text-blue-700"
                        : percentage >= 70
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-red-100 text-red-700"
                }`}
            >
                {mark?.isAbsent
                    ? "-"
                    : calculateGrade(mark?.marks || 0, maxMarks, grades)}
            </span>
        );
    };

    // Add this function before the Exams component
    const calculateGrade = (
        marks: number,
        maxMarks: number,
        grades: GradeSystem[]
    ): string => {
        const percentage = (marks / maxMarks) * 100;

        // Sort grades by base_percentage in descending order
        const sortedGrades = [...grades].sort(
            (a, b) => b.base_percentage - a.base_percentage
        );

        for (const grade of sortedGrades) {
            if (percentage >= grade.base_percentage) {
                return grade.grade_label;
            }
        }

        return "F"; // Default grade if no other grade matches
    };

    const [grades] = useState<any[]>([
        { category_id: 1, base_percentage: 90, grade_label: "A+" },
        { category_id: 2, base_percentage: 85, grade_label: "A" },
        { category_id: 3, base_percentage: 80, grade_label: "B+" },
        { category_id: 4, base_percentage: 75, grade_label: "B" },
        { category_id: 5, base_percentage: 70, grade_label: "C+" },
        { category_id: 6, base_percentage: 65, grade_label: "C" },
        { category_id: 7, base_percentage: 60, grade_label: "D+" },
        { category_id: 8, base_percentage: 50, grade_label: "D" },
    ]);

    const [isSaving, setIsSaving] = useState(false);

    // if (selectedClass) {
    //         // Subject teacher view
    //         if (!selectedSubject) {
    //             return (
    //                 <div className="space-y-6">
    //                     {/* Header */}
    //                     <div className="bg-white p-6 rounded-xl shadow-sm">
    //                         <div className="flex items-center gap-4">
    //                             <button
    //                                 onClick={() => setSelectedClass(null)}
    //                                 className="p-2 hover:bg-gray-100 rounded-full transition-colors"
    //                             >
    //                                 <ArrowLeft size={20} />
    //                             </button>
    //                             <div>
    //                                 <h1 className="text-xl font-bold text-gray-800">
    //                                     {selectedClass.name} -{" "}
    //                                     {selectedExam?.Name}
    //                                 </h1>
    //                                 <p className="text-sm text-gray-500">
    //                                     Select your subject
    //                                 </p>
    //                             </div>
    //                         </div>
    //                     </div>

    //                     {/* Subjects Grid */}
    //                     <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
    //                         {subjects
    //                             .filter((s) => s.isSubjectTeacher)
    //                             .map((subject) => (
    //                                 <div
    //                                     key={subject.id}
    //                                     onClick={() =>
    //                                         setSelectedSubject(subject)
    //                                     }
    //                                     className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-200
    //                                 border-2 border-gray-100 hover:border-emerald-200 cursor-pointer group"
    //                                 >
    //                                     <div className="flex justify-between items-start">
    //                                         <div>
    //                                             <h3 className="text-lg font-semibold text-gray-800 group-hover:text-emerald-600">
    //                                                 {subject.name}
    //                                             </h3>
    //                                         </div>
    //                                         <span className="p-2 rounded-full bg-emerald-50 text-emerald-600">
    //                                             <ChevronRight size={20} />
    //                                         </span>
    //                                     </div>
    //                                 </div>
    //                             ))}
    //                     </div>
    //                 </div>
    //             );
    //         }

    //         // Mark entry view for subject teacher
    //         return (
    //             <div className="space-y-6">
    //                 {/* Header */}
    //                 <div className="bg-white p-6 rounded-xl shadow-sm">
    //                     <div className="flex items-center gap-4">
    //                         <button
    //                             onClick={() => setSelectedSubject(null)}
    //                             className="p-2 hover:bg-gray-100 rounded-full transition-colors"
    //                         >
    //                             <ArrowLeft size={20} />
    //                         </button>
    //                         <div>
    //                             <h1 className="text-xl font-bold text-gray-800">
    //                                 {selectedSubject.name} -{" "}
    //                                 {selectedClass.name}
    //                             </h1>
    //                             <p className="text-sm text-gray-500">
    //                                 Enter marks for {selectedExam?.Name}
    //                             </p>
    //                         </div>
    //                     </div>
    //                 </div>

    //                 {/* Mark Entry Table */}
    //                 <MarkEntryView
    //                     selectedExam={selectedExam}
    //                     selectedSubject={selectedSubject}
    //                     setSelectedSubject={setSelectedSubject}
    //                     students={students}
    //                 />
    //             </div>
    //         );
    //     }
    // }

    return (
        <div className="space-y-6">
            <HeaderComponent
                heading={
                    selectedClass?.isClassTeacher
                        ? `${selectedClass.name} - ${selectedExam?.Name}`
                        : !selectedSubject
                        ? `${selectedClass.name} - ${selectedExam?.Name}`
                        : `${selectedSubject.name} - ${selectedClass.name}`
                }
                subHeading={
                    selectedClass?.isClassTeacher
                        ? `Class Teacher View`
                        : !selectedSubject
                        ? "Select your subject"
                        : `Enter marks for ${selectedExam?.Name}`
                }
                handleBack={
                    selectedClass?.isClassTeacher || !selectedSubject
                        ? () => setSelectedClass(null)
                        : () => setSelectedSubject(null)
                }
            />

            {selectedClass?.isClassTeacher ? (
                <>
                    <ClassTeacherSubjectSelectionTab
                        getSubjectMarkStatus={getSubjectMarkStatus}
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
                </>
            ) : (
                <>
                    {!selectedSubject && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {subjects
                                .filter((s) => s.isSubjectTeacher)
                                .map((subject) => (
                                    <div
                                        key={subject.id}
                                        onClick={() =>
                                            setSelectedSubject(subject)
                                        }
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
                    )}
                </>
            )}
            {selectedSubject && (
                <MarkEntryView
                    {...{
                        selectedSubject,
                        setSelectedSubject,
                        selectedExam,
                        handleMarkUpdate,
                        validateMarks,
                        calculateGrade,
                        getMarkStatus,
                        isSaving,
                        setIsSaving,
                        grades,
                        students,
                    }}
                />
            )}
        </div>
    );
};

export default SelectedClassComponent;
