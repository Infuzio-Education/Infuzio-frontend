import React from "react";
import { StudentExam, SubjectExam } from "./ClassTeacherView";
// import { ExamStudent, Subject } from "../../types/Types";


// type Subject = {
//     subjectName: string;
//     maxMark: number;
//     markEntryStatus: "Partial" | "Completed";
// };

// type SubjectsRecord = Record<string, Subject>;

type PropType = {
    subjects: SubjectExam[];
    setSelectedSubject: React.Dispatch<React.SetStateAction<SubjectExam | null>>;
    students: StudentExam[];
};

const SubjectOverView = ({
    subjects,
    setSelectedSubject,
    students,
}: PropType) => {
    return (
        <div className="bg-white rounded-xl shadow-sm">
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                Roll No
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                Name
                            </th>
                            {subjects.map((subject) => (
                                <th
                                    key={subject.subjectId}
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase"
                                >
                                    {subject.subjectName}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {students.map((student) => (
                            <tr key={student.rollNumber}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {student.rollNumber}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {student.name}
                                </td>
                                {subjects.map((subject) => {
                                    const mark = student?.subjectMarks?.[subject.subjectId];
                                    return (
                                        <td
                                            key={subject.subjectId}
                                            className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 cursor-pointer hover:bg-gray-50"
                                            onClick={() => setSelectedSubject(subject)}
                                        >
                                            {mark ?? "-"}
                                        </td>
                                    );
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default SubjectOverView;
