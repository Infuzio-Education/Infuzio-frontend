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
                { subjectId: 1, marks: 0, isAbsent: false },  // Math marks pending
                { subjectId: 2, marks: 78, isAbsent: false }, // Science marks added
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
                { subjectId: 1, marks: 0, isAbsent: false },  // Math marks pending
                { subjectId: 2, marks: 85, isAbsent: false }, // Science marks added
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
                { subjectId: 1, marks: 0, isAbsent: false },  // Math marks pending
                { subjectId: 2, marks: 82, isAbsent: false }, // Science marks added
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

    const [isSaving, setIsSaving] = useState(false);

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

    // Add this function to calculate mark status
    const getMarkStatus = () => {
        const totalStudents = students.length;
        const markedStudents = students.filter(student => {
            const mark = student.marks.find(m => m.subjectId === selectedSubject?.id);
            return mark && (mark.marks > 0 || mark.isAbsent);
        }).length;
        return { totalStudents, markedStudents };
    };

    const renderGrade = (student: ExamStudent, subjectId: number, maxMarks: number) => {
        const mark = student.marks.find(m => m.subjectId === subjectId);
        const percentage = mark?.isAbsent ? 0 : ((mark?.marks || 0) / maxMarks) * 100;

        return (
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
        );
    };

    // Move the function inside the component
    const getSubjectMarkStatus = (subjectId: number) => {
        const totalStudents = students.length;
        const markedStudents = students.filter(student => {
            const mark = student.marks.find(m => m.subjectId === subjectId);
            return mark && (mark.marks > 0 || mark.isAbsent);
        }).length;

        if (markedStudents === 0) return 'pending';
        if (markedStudents < totalStudents) return 'partial';
        return 'complete';
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
                                    <div className="flex items-center gap-2">
                                        <h3 className="text-lg font-semibold text-gray-800 group-hover:text-emerald-600">
                                            {cls.name}
                                        </h3>
                                        {cls.isClassTeacher && (
                                            <span className="px-3 py-1 bg-emerald-100 text-emerald-700 
                                            text-xs font-medium rounded-full">
                                                Class Teacher
                                            </span>
                                        )}
                                    </div>

                                    {/* Add subjects list */}
                                    <div className="mt-3 space-y-1">
                                        <div className="flex flex-wrap gap-2">
                                            {subjects
                                                .filter(subject => subject.isSubjectTeacher)
                                                .map(subject => (
                                                    <span
                                                        key={subject.id}
                                                        className="px-2 py-1 bg-gray-100 text-gray-600 
                                                        text-xs rounded-full"
                                                    >
                                                        {subject.name}
                                                    </span>
                                                ))
                                            }
                                        </div>
                                    </div>
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

                    {/* Subject Selection Tabs */}
                    <div className="bg-white rounded-xl shadow-sm p-4">
                        <h3 className="text-sm font-medium text-gray-700 mb-3">Add/View Marks by Subject</h3>
                        <div className="flex flex-wrap gap-2">
                            {subjects.map(subject => {
                                const status = getSubjectMarkStatus(subject.id);
                                return (
                                    <button
                                        key={subject.id}
                                        onClick={() => setSelectedSubject(subject)}
                                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all
                                            flex items-center gap-2 
                                            ${selectedSubject?.id === subject.id
                                                ? 'bg-emerald-100 text-emerald-700 border-2 border-emerald-200'
                                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border-2 border-transparent'
                                            }`}
                                    >
                                        <span>{subject.name}</span>
                                        {status === 'pending' && (
                                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs 
                                            bg-amber-100 text-amber-700">
                                                Add Marks
                                            </span>
                                        )}
                                        {status === 'partial' && (
                                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs 
                                            bg-blue-100 text-blue-700">
                                                Partial
                                            </span>
                                        )}
                                        {status === 'complete' && (
                                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs 
                                            bg-emerald-100 text-emerald-700">
                                                ✓ Complete
                                            </span>
                                        )}
                                    </button>
                                );
                            })}
                        </div>

                        {/* Summary Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                            <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
                                <div className="text-amber-700 text-sm font-medium">Pending</div>
                                <div className="text-2xl font-bold text-amber-800 mt-1">
                                    {subjects.filter(s => getSubjectMarkStatus(s.id) === 'pending').length}
                                </div>
                            </div>
                            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                                <div className="text-blue-700 text-sm font-medium">Partial</div>
                                <div className="text-2xl font-bold text-blue-800 mt-1">
                                    {subjects.filter(s => getSubjectMarkStatus(s.id) === 'partial').length}
                                </div>
                            </div>
                            <div className="bg-emerald-50 p-4 rounded-lg border border-emerald-200">
                                <div className="text-emerald-700 text-sm font-medium">Complete</div>
                                <div className="text-2xl font-bold text-emerald-800 mt-1">
                                    {subjects.filter(s => getSubjectMarkStatus(s.id) === 'complete').length}
                                </div>
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
                                        {selectedSubject ? (
                                            <>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                                    Marks
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                                    Grade
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                                    Status
                                                </th>
                                            </>
                                        ) : (
                                            subjects.map(subject => (
                                                <th key={subject.id} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                                    {subject.name}
                                                </th>
                                            ))
                                        )}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {students.map(student => {
                                        const maxMarks = 100; // Replace with actual max marks
                                        return (
                                            <tr key={student.id}>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {student.rollNo}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {student.name}
                                                </td>
                                                {selectedSubject ? (
                                                    <>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="flex items-center gap-2">
                                                                <input
                                                                    type="number"
                                                                    value={student.marks.find(m => m.subjectId === selectedSubject.id)?.marks || ''}
                                                                    onChange={(e) => {
                                                                        const value = validateMarks(Number(e.target.value), maxMarks);
                                                                        handleMarkUpdate(student.id, value, false);
                                                                    }}
                                                                    disabled={student.marks.find(m => m.subjectId === selectedSubject.id)?.isAbsent}
                                                                    className="w-20 px-3 py-1 border rounded focus:outline-none focus:ring-2 
                                                                    focus:ring-emerald-500 disabled:bg-gray-100"
                                                                />
                                                                <span className="text-sm text-gray-500">/ {maxMarks}</span>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            {renderGrade(student, selectedSubject.id, maxMarks)}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <label className="inline-flex items-center">
                                                                <input
                                                                    type="checkbox"
                                                                    checked={student.marks.find(m => m.subjectId === selectedSubject.id)?.isAbsent || false}
                                                                    onChange={(e) => handleMarkUpdate(student.id, 0, e.target.checked)}
                                                                    className="form-checkbox h-4 w-4 text-emerald-600"
                                                                />
                                                                <span className="ml-2 text-sm text-gray-600">Absent</span>
                                                            </label>
                                                        </td>
                                                    </>
                                                ) : (
                                                    subjects.map(subject => {
                                                        const mark = student.marks.find(m => m.subjectId === subject.id);
                                                        return (
                                                            <td key={subject.id} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                                {mark?.isAbsent ? 'Absent' : mark?.marks || '-'}
                                                            </td>
                                                        );
                                                    })
                                                )}
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>

                        {/* Show submit button section only when a subject is selected */}
                        {selectedSubject && (
                            <div className="p-6 border-t bg-gray-50">
                                <div className="max-w-7xl mx-auto flex items-center justify-between">
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                                            Last saved 2 mins ago
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm text-gray-600">
                                                {getMarkStatus().markedStudents} / {getMarkStatus().totalStudents} students marked
                                            </span>
                                            <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-emerald-500 transition-all duration-500"
                                                    style={{
                                                        width: `${(getMarkStatus().markedStudents / getMarkStatus().totalStudents) * 100}%`
                                                    }}
                                                ></div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <button
                                            onClick={() => setSelectedSubject(null)}
                                            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 
                                            rounded-lg hover:bg-gray-50 transition-colors duration-200"
                                        >
                                            Cancel
                                        </button>

                                        <button
                                            onClick={async () => {
                                                setIsSaving(true);
                                                await new Promise(resolve => setTimeout(resolve, 1000));
                                                setIsSaving(false);
                                            }}
                                            disabled={isSaving}
                                            className={`px-6 py-2 bg-emerald-600 text-white rounded-lg 
                                            transition-all duration-200 flex items-center gap-2
                                            ${isSaving ? 'opacity-70 cursor-not-allowed' : 'hover:bg-emerald-700 hover:shadow-md'}`}
                                        >
                                            {isSaving ? (
                                                <>
                                                    <div className="w-4 h-4 border-2 border-white border-t-transparent 
                                                    rounded-full animate-spin"></div>
                                                    <span>Saving...</span>
                                                </>
                                            ) : (
                                                <>
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                    </svg>
                                                    <span>Save Marks</span>
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
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

                        {/* Submit Button Section */}
                        <div className="p-6 border-t bg-gray-50">
                            <div className="max-w-7xl mx-auto flex items-center justify-between">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                                        Last saved 2 mins ago
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm text-gray-600">
                                            {getMarkStatus().markedStudents} / {getMarkStatus().totalStudents} students marked
                                        </span>
                                        <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-emerald-500 transition-all duration-500"
                                                style={{
                                                    width: `${(getMarkStatus().markedStudents / getMarkStatus().totalStudents) * 100}%`
                                                }}
                                            ></div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={() => setSelectedSubject(null)}
                                        className="px-4 py-2 text-gray-700 bg-white border border-gray-300 
                                        rounded-lg hover:bg-gray-50 transition-colors duration-200"
                                    >
                                        Cancel
                                    </button>

                                    <button
                                        onClick={async () => {
                                            setIsSaving(true);
                                            // TODO: Implement mark submission logic
                                            await new Promise(resolve => setTimeout(resolve, 1000));
                                            console.log('Submitting marks...');
                                            setIsSaving(false);
                                        }}
                                        disabled={isSaving}
                                        className={`px-6 py-2 bg-emerald-600 text-white rounded-lg 
                                        transition-all duration-200 flex items-center gap-2
                                        ${isSaving
                                                ? 'opacity-70 cursor-not-allowed'
                                                : 'hover:bg-emerald-700 hover:shadow-md'}`}
                                    >
                                        {isSaving ? (
                                            <>
                                                <div className="w-4 h-4 border-2 border-white border-t-transparent 
                                                rounded-full animate-spin"></div>
                                                <span>Saving...</span>
                                            </>
                                        ) : (
                                            <>
                                                <svg
                                                    className="w-4 h-4"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M5 13l4 4L19 7"
                                                    />
                                                </svg>
                                                <span>Save Marks</span>
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
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