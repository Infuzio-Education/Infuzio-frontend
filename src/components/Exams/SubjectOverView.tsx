import React from "react";
import { ExamStudent, Subject } from "../../types/Types";

type PropType = {
    subjects: Subject[];
    setSelectedSubject: React.Dispatch<React.SetStateAction<Subject | null>>;
    students: ExamStudent[];
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
                                    key={subject.id}
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase"
                                >
                                    {subject.name}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {students.map((student) => (
                            <tr key={student.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {student.rollNo}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {student.name}
                                </td>
                                {subjects.map((subject) => {
                                    const mark = student.marks.find(
                                        (m) => m.subjectId === subject.id
                                    );
                                    return (
                                        <td
                                            key={subject.id}
                                            className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 cursor-pointer hover:bg-gray-50"
                                            onClick={() =>
                                                setSelectedSubject(subject)
                                            }
                                        >
                                            {mark?.isAbsent
                                                ? "Absent"
                                                : mark?.marks || "-"}
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
