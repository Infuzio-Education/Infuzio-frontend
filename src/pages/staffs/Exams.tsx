import { useState } from 'react';
import { BookOpenCheck, Calendar, ChevronRight, ArrowLeft } from 'lucide-react';
import EmptyState from '../../components/EmptyState';
import {
    Exam,
    GradeSystem,
    Class,
    Subject,
    ExamStudent,
    StudentMark,
} from '../../types/Types';

// Add this function before the Exams component
const calculateGrade = (marks: number, maxMarks: number, grades: GradeSystem[]): string => {
    const percentage = (marks / maxMarks) * 100;

    // Sort grades by base_percentage in descending order
    const sortedGrades = [...grades].sort((a, b) => b.base_percentage - a.base_percentage);

    for (const grade of sortedGrades) {
        if (percentage >= grade.base_percentage) {
            return grade.grade_label;
        }
    }

    return 'F'; // Default grade if no other grade matches
};

const Exams = () => {
    const [exams] = useState<Exam[]>([
        {
            ID: 4,
            Name: "Onam Exam",
            AcademicYear: "2024",
            CreatedBy: 3,
            UpdatedBy: 0,
            gradeSystemId: 1,
            UpdateAt: "2024-11-26T22:50:25.998151+05:30",
            CreatedAt: "2024-11-26T22:50:25.998151+05:30"
        },
        {
            ID: 5,
            Name: "Christmas Exam",
            AcademicYear: "2024",
            CreatedBy: 3,
            UpdatedBy: 0,
            gradeSystemId: 1,
            UpdateAt: "2024-12-20T10:30:00.998151+05:30",
            CreatedAt: "2024-12-20T10:30:00.998151+05:30"
        }
    ]);

    const [classes] = useState<Class[]>([
        {
            id: 1,
            name: "Class 1A",
            isClassTeacher: true,
            ID: 1,
            Name: "Class 1A",
            ClassStaffId: 1,
            MediumId: 1,
            SyllabusId: 1,
            StandardId: 1,
            GroupID: 1
        },
        {
            id: 2,
            name: "Class 1B",
            isClassTeacher: false,
            ID: 2,
            Name: "Class 1B",
            ClassStaffId: 2,
            MediumId: 1,
            SyllabusId: 1,
            StandardId: 1,
            GroupID: 1
        }
    ]);

    const [subjects] = useState<Subject[]>([
        { id: 1, name: "Mathematics", code: "MATH", isSubjectTeacher: true },
        { id: 2, name: "Science", code: "SCI", isSubjectTeacher: false },
        { id: 3, name: "English", code: "ENG", isSubjectTeacher: false },
        { id: 4, name: "Social Studies", code: "SOC", isSubjectTeacher: false },
        { id: 5, name: "Malayalam", code: "MAL", isSubjectTeacher: false },
        { id: 6, name: "Hindi", code: "HIN", isSubjectTeacher: false },
        { id: 7, name: "Arabic", code: "ARB", isSubjectTeacher: false },
    ]);

    const [students, setStudents] = useState<ExamStudent[]>([
        {
            id: 1,
            name: "John Doe",
            rollNo: "001",
            marks: [
                { subjectId: 1, marks: 85, isAbsent: false },
                { subjectId: 2, marks: 78, isAbsent: false },
                { subjectId: 3, marks: 92, isAbsent: false },
                { subjectId: 4, marks: 88, isAbsent: false },
                { subjectId: 5, marks: 75, isAbsent: false },
                { subjectId: 6, marks: 82, isAbsent: false },
                { subjectId: 7, marks: 79, isAbsent: false },
            ]
        },
        {
            id: 2,
            name: "Jane Smith",
            rollNo: "002",
            marks: [
                { subjectId: 1, marks: 92, isAbsent: false },
                { subjectId: 2, marks: 85, isAbsent: false },
                { subjectId: 3, marks: 88, isAbsent: false },
                { subjectId: 4, marks: 90, isAbsent: false },
                { subjectId: 5, marks: 87, isAbsent: false },
                { subjectId: 6, marks: 84, isAbsent: false },
                { subjectId: 7, marks: 86, isAbsent: false },
            ]
        },
        {
            id: 3,
            name: "Mike Johnson",
            rollNo: "003",
            marks: [
                { subjectId: 1, marks: 78, isAbsent: false },
                { subjectId: 2, marks: 82, isAbsent: false },
                { subjectId: 3, marks: 85, isAbsent: false },
                { subjectId: 4, marks: 76, isAbsent: false },
                { subjectId: 5, marks: 80, isAbsent: false },
                { subjectId: 6, marks: 88, isAbsent: false },
                { subjectId: 7, marks: 84, isAbsent: false },
            ]
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
            ]
        }
    ]);

    const [selectedExam, setSelectedExam] = useState<Exam | null>(null);
    const [selectedClass, setSelectedClass] = useState<Class | null>(null);
    const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);

    const [grades] = useState<GradeSystem[]>([
        { category_id: 1, base_percentage: 90, grade_label: "A+" },
        { category_id: 2, base_percentage: 85, grade_label: "A" },
        { category_id: 3, base_percentage: 80, grade_label: "B+" },
        { category_id: 4, base_percentage: 75, grade_label: "B" },
        { category_id: 5, base_percentage: 70, grade_label: "C+" },
        { category_id: 6, base_percentage: 65, grade_label: "C" },
        { category_id: 7, base_percentage: 60, grade_label: "D+" },
        { category_id: 8, base_percentage: 50, grade_label: "D" },
    ]);

    // Function to handle mark updates
    const handleMarkUpdate = (studentId: number, marks: number, isAbsent: boolean) => {
        setStudents(prevStudents =>
            prevStudents.map(student => {
                if (student.id === studentId) {
                    return {
                        ...student,
                        marks: student.marks.map((mark: StudentMark) => {
                            if (mark.subjectId === selectedSubject?.id) {
                                return {
                                    ...mark,
                                    marks: isAbsent ? 0 : marks,
                                    isAbsent: isAbsent
                                };
                            }
                            return mark;
                        })
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

    // Render class selection after exam is selected
    if (selectedExam && !selectedClass) {
        return (
            <div className="space-y-6">
                {/* Header with Back Button */}
                <div className="bg-white p-6 rounded-xl shadow-sm">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setSelectedExam(null)}
                            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                        >
                            <ArrowLeft size={20} />
                        </button>
                        <div>
                            <h1 className="text-xl font-bold text-gray-800">{selectedExam.Name}</h1>
                            <p className="text-sm text-gray-500">Select a class to proceed</p>
                        </div>
                    </div>
                </div>

                {/* Classes Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {classes.map((cls) => (
                        <div
                            key={cls.id}
                            onClick={() => setSelectedClass(cls)}
                            className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 
                            border-2 border-gray-100 hover:border-emerald-200 cursor-pointer group"
                        >
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-800 group-hover:text-emerald-600">
                                        {cls.name}
                                    </h3>
                                    {cls.isClassTeacher && (
                                        <span className="inline-block mt-2 px-3 py-1 bg-emerald-100 text-emerald-700 
                                        text-xs font-medium rounded-full">
                                            Class Teacher
                                        </span>
                                    )}
                                </div>
                                <span className="p-2 rounded-full bg-emerald-50 text-emerald-600">
                                    <ChevronRight size={20} />
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    // Render subject selection or student list based on class teacher status
    if (selectedClass) {
        if (selectedClass.isClassTeacher) {
            return (
                <div className="space-y-6">
                    {/* Header */}
                    <div className="bg-white p-6 rounded-xl shadow-sm">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => setSelectedClass(null)}
                                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                            >
                                <ArrowLeft size={20} />
                            </button>
                            <div>
                                <h1 className="text-xl font-bold text-gray-800">
                                    {selectedClass.name} - {selectedExam?.Name}
                                </h1>
                                <p className="text-sm text-gray-500">Class Teacher View</p>
                            </div>
                        </div>
                    </div>

                    {/* Students Table with all subjects */}
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
                                        {subjects.map(subject => (
                                            <th key={subject.id} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                                {subject.name}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {students.map(student => (
                                        <tr key={student.id}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {student.rollNo}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {student.name}
                                            </td>
                                            {subjects.map(subject => {
                                                const mark = student.marks.find((m: StudentMark) => m.subjectId === subject.id);
                                                return (
                                                    <td key={subject.id} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                        {mark?.isAbsent ? 'Absent' : mark?.marks || '-'}
                                                    </td>
                                                );
                                            })}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            );
        } else {
            // Subject teacher view
            if (!selectedSubject) {
                return (
                    <div className="space-y-6">
                        {/* Header */}
                        <div className="bg-white p-6 rounded-xl shadow-sm">
                            <div className="flex items-center gap-4">
                                <button
                                    onClick={() => setSelectedClass(null)}
                                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                                >
                                    <ArrowLeft size={20} />
                                </button>
                                <div>
                                    <h1 className="text-xl font-bold text-gray-800">
                                        {selectedClass.name} - {selectedExam?.Name}
                                    </h1>
                                    <p className="text-sm text-gray-500">Select your subject</p>
                                </div>
                            </div>
                        </div>

                        {/* Subjects Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {subjects.filter(s => s.isSubjectTeacher).map((subject) => (
                                <div
                                    key={subject.id}
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
                    </div>
                );
            }

            // Mark entry view for subject teacher
            return (
                <div className="space-y-6">
                    {/* Header */}
                    <div className="bg-white p-6 rounded-xl shadow-sm">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => setSelectedSubject(null)}
                                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                            >
                                <ArrowLeft size={20} />
                            </button>
                            <div>
                                <h1 className="text-xl font-bold text-gray-800">
                                    {selectedSubject.name} - {selectedClass.name}
                                </h1>
                                <p className="text-sm text-gray-500">Enter marks for {selectedExam?.Name}</p>
                            </div>
                        </div>
                    </div>

                    {/* Mark Entry Table */}
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
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                            Marks
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                            Grade
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                            Status
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {students.map(student => {
                                        const mark = student.marks.find((m: StudentMark) => m.subjectId === selectedSubject?.id);
                                        const maxMarks = selectedExam?.subjectMaxMarks?.find(
                                            s => s.subjectId === selectedSubject?.id
                                        )?.maxMarks || 100;
                                        const percentage = mark?.isAbsent ? 0 : ((mark?.marks || 0) / maxMarks) * 100;

                                        return (
                                            <tr key={student.id}>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {student.rollNo}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {student.name}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center gap-2">
                                                        <input
                                                            type="number"
                                                            value={mark?.isAbsent ? '' : mark?.marks || ''}
                                                            onChange={(e) => {
                                                                const value = validateMarks(Number(e.target.value), maxMarks);
                                                                handleMarkUpdate(student.id, value, false);
                                                            }}
                                                            disabled={mark?.isAbsent}
                                                            min="0"
                                                            max={maxMarks}
                                                            className="w-20 px-3 py-1 border rounded focus:outline-none focus:ring-2 
                                                            focus:ring-emerald-500 disabled:bg-gray-100"
                                                        />
                                                        <span className="text-sm text-gray-500">/ {maxMarks}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${mark?.isAbsent
                                                        ? 'bg-gray-100 text-gray-600'
                                                        : percentage >= 90
                                                            ? 'bg-emerald-100 text-emerald-700'
                                                            : percentage >= 80
                                                                ? 'bg-blue-100 text-blue-700'
                                                                : percentage >= 70
                                                                    ? 'bg-yellow-100 text-yellow-700'
                                                                    : 'bg-red-100 text-red-700'
                                                        }`}>
                                                        {mark?.isAbsent ? '-' : calculateGrade(mark?.marks || 0, maxMarks, grades)}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <label className="inline-flex items-center">
                                                        <input
                                                            type="checkbox"
                                                            checked={mark?.isAbsent || false}
                                                            onChange={(e) => handleMarkUpdate(student.id, 0, e.target.checked)}
                                                            className="form-checkbox h-4 w-4 text-emerald-600"
                                                        />
                                                        <span className="ml-2 text-sm text-gray-600">Absent</span>
                                                    </label>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            );
        }
    }

    // Initial exam selection view
    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-white p-6 rounded-xl shadow-sm">
                <h1 className="text-xl font-bold text-gray-800">Exams</h1>
                <p className="text-sm text-gray-500 mt-1">View and Add Marks in Exams</p>
            </div>

            {/* Exams Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {exams.length === 0 ? (
                    <EmptyState
                        icon={<BookOpenCheck size={48} />}
                        title="No Exams Found"
                        message="There are no exams available at the moment."
                    />
                ) : (
                    exams.map((exam) => (
                        <div
                            key={exam.ID}
                            onClick={() => setSelectedExam(exam)}
                            className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 
                            border-2 border-gray-100 hover:border-emerald-200 cursor-pointer group"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-800 group-hover:text-emerald-600 
                                    transition-colors">
                                        {exam.Name}
                                    </h3>
                                    <p className="text-sm text-gray-500 mt-1">
                                        Academic Year: {exam.AcademicYear}
                                    </p>
                                </div>
                                <span className="p-2 rounded-full bg-emerald-50 text-emerald-600 
                                group-hover:bg-emerald-100 transition-colors">
                                    <ChevronRight size={20} />
                                </span>
                            </div>

                            <div className="flex items-center gap-2 text-sm text-gray-500 mt-4 pt-4 border-t">
                                <Calendar size={16} />
                                <span>Created: {new Date(exam.CreatedAt).toLocaleDateString()}</span>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default Exams; 