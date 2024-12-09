import { useState, useEffect } from 'react';
import { Plus, Edit, Trash, Save, X, BookOpen, Calendar, Check, AlertCircle } from 'lucide-react';
import EmptyState from '../../components/EmptyState';
import { BookOpenCheck } from 'lucide-react';
import {
    UnitTest,
    TestMark,
    PublishStatus
} from '../../types/Types';

type SimpleStudent = {
    id: number;
    name: string;
    rollNumber: string;
    class_id: number;
};

const UnitTests = () => {
    const [unitTests, setUnitTests] = useState<UnitTest[]>([]);
    const [selectedTest, setSelectedTest] = useState<UnitTest | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const [newTest, setNewTest] = useState({
        subject_id: '',
        class_id: '',
        portion_desc: '',
        date: '',
        max_mark: '',
        pass_mark: ''
    });
    const [isManageMarksOpen, setIsManageMarksOpen] = useState(false);
    const [studentMarks, setStudentMarks] = useState<TestMark[]>([]);
    const [isEditMode, setIsEditMode] = useState(false);
    const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
    const [publishStatus, setPublishStatus] = useState<PublishStatus>({
        is_published: false
    });

    // Dummy data for dropdowns
    const subjects = [
        { id: 1, name: 'Mathematics' },
        { id: 2, name: 'Science' },
        { id: 3, name: 'English' },
        { id: 4, name: 'History' }
    ];

    const classes = [
        { id: 1, name: 'Class 1' },
        { id: 2, name: 'Class 2' },
        { id: 3, name: 'Class 3' },
        { id: 4, name: 'Class 4' }
    ];

    // Dummy unit tests data
    const dummyTests: UnitTest[] = [
        {
            id: 1,
            subject_id: 1,
            class_id: 1,
            portion_desc: "Chapters 1 to 5 - Algebra Basics",
            date: "2024-03-25T10:00:00Z",
            is_completed: false,
            is_postponed_indefinitely: false,
            max_mark: 100,
            pass_mark: 40,
            has_submitted_marks: false,
            is_exam_cancelled: false,
            created_staff_id: 1,
            FKSubjectID: { Name: "Mathematics" }
        },
        {
            id: 2,
            subject_id: 2,
            class_id: 1,
            portion_desc: "Unit 1 - Forces and Motion",
            date: "2024-03-28T10:00:00Z",
            is_completed: true,
            is_postponed_indefinitely: false,
            max_mark: 100,
            pass_mark: 40,
            has_submitted_marks: true,
            is_exam_cancelled: false,
            created_staff_id: 1,
            FKSubjectID: { Name: "Science" }
        }
    ];

    // Update the students state to use SimpleStudent type
    const [students] = useState<SimpleStudent[]>([
        { id: 1, name: "John Doe", rollNumber: "R001", class_id: 1 },
        { id: 2, name: "Jane Smith", rollNumber: "R002", class_id: 1 },
        { id: 3, name: "Mike Johnson", rollNumber: "R003", class_id: 1 },
        { id: 4, name: "Mike Johnson", rollNumber: "R004", class_id: 1 },
    ]);

    useEffect(() => {
        // For now, use dummy data
        setUnitTests(dummyTests);
    }, []);

    const handleStatusUpdate = async (testId: number, updates: Partial<UnitTest>) => {
        try {
            const testIndex = unitTests.findIndex(t => t.id === testId);
            if (testIndex === -1) return;

            // Reset all status flags if setting a new status
            const resetStatuses = {
                is_completed: false,
                is_postponed_indefinitely: false,
                is_exam_cancelled: false,
            };

            // Apply the new status
            const updatedTest = {
                ...unitTests[testIndex],
                ...resetStatuses,
                ...updates
            };

            // Update the state immediately
            const updatedTests = [...unitTests];
            updatedTests[testIndex] = updatedTest;
            setUnitTests(updatedTests);

            // Update the selected test to reflect changes in the modal
            setSelectedTest(updatedTest);

            // TODO: Implement API call to update test status
        } catch (error) {
            console.error('Failed to update test status:', error);
        }
    };

    const handleCreate = async () => {
        try {
            if (isEditMode && selectedTest) {
                // Handle edit
                const updatedTest: UnitTest = {
                    ...selectedTest,
                    subject_id: Number(newTest.subject_id),
                    class_id: Number(newTest.class_id),
                    portion_desc: newTest.portion_desc,
                    date: newTest.date,
                    max_mark: Number(newTest.max_mark),
                    pass_mark: Number(newTest.pass_mark),
                    FKSubjectID: {
                        Name: subjects.find(s => s.id === Number(newTest.subject_id))?.name || ''
                    }
                };

                // TODO: Implement API call to update test
                setUnitTests(tests =>
                    tests.map(test => test.id === selectedTest.id ? updatedTest : test)
                );
            } else {
                // Handle create (existing code)
                const newUnitTest: UnitTest = {
                    id: Date.now(),
                    subject_id: Number(newTest.subject_id),
                    class_id: Number(newTest.class_id),
                    portion_desc: newTest.portion_desc,
                    date: newTest.date,
                    max_mark: Number(newTest.max_mark),
                    pass_mark: Number(newTest.pass_mark),
                    is_completed: false,
                    is_postponed_indefinitely: false,
                    has_submitted_marks: false,
                    is_exam_cancelled: false,
                    created_staff_id: 1, // TODO: Get from auth context
                    FKSubjectID: {
                        Name: subjects.find(s => s.id === Number(newTest.subject_id))?.name || ''
                    }
                };

                setUnitTests([...unitTests, newUnitTest]);
            }

            setNewTest({
                subject_id: '',
                class_id: '',
                portion_desc: '',
                date: '',
                max_mark: '',
                pass_mark: ''
            });
            setIsModalOpen(false);
            setIsEditMode(false);
        } catch (error) {
            console.error('Failed to create/update unit test:', error);
        }
    };

    const handleMarkUpdate = (studentId: number, value: string, isAbsent: boolean) => {
        setStudentMarks(prevMarks => {
            const existingMarkIndex = prevMarks.findIndex(m => m.student_id === studentId);
            const newMark: TestMark = {
                student_id: studentId,
                test_id: selectedTest?.id || 0,
                marks: isAbsent ? 0 : Number(value),
                is_absent: isAbsent
            };

            if (existingMarkIndex >= 0) {
                const updatedMarks = [...prevMarks];
                updatedMarks[existingMarkIndex] = newMark;
                return updatedMarks;
            }

            return [...prevMarks, newMark];
        });
    };

    const handleSubmitMarks = async () => {
        try {
            // TODO: Implement API call to submit marks
            console.log('Submitting marks:', studentMarks);

            // Update only has_submitted_marks without affecting other statuses
            const testIndex = unitTests.findIndex(t => t.id === selectedTest?.id);
            if (testIndex >= 0) {
                const updatedTest = {
                    ...unitTests[testIndex],
                    has_submitted_marks: true
                };

                // Update the states
                const updatedTests = [...unitTests];
                updatedTests[testIndex] = updatedTest;
                setUnitTests(updatedTests);
                setSelectedTest(updatedTest);
            }

            setIsManageMarksOpen(false);
        } catch (error) {
            console.error('Failed to submit marks:', error);
        }
    };

    const handlePublishMarks = async () => {
        try {
            // TODO: Implement API call to publish marks
            setPublishStatus({
                is_published: true,
                published_at: new Date().toISOString()
            });
            setIsPreviewModalOpen(false);
        } catch (error) {
            console.error('Failed to publish marks:', error);
        }
    };


    const renderMarksModal = () => (
        isManageMarksOpen && selectedTest && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full p-6 max-h-[90vh] overflow-hidden flex flex-col">
                    <div className="flex justify-between items-center mb-6 pb-4 border-b">
                        <div>
                            <h2 className="text-xl font-semibold text-gray-800">Add Test Marks</h2>
                            <p className="text-sm text-gray-500 mt-1">
                                {selectedTest.FKSubjectID.Name} - Max Marks: {selectedTest.max_mark}
                            </p>
                        </div>
                        <button
                            onClick={() => setIsManageMarksOpen(false)}
                            className="p-2 hover:bg-gray-100 rounded-full"
                        >
                            <X size={20} className="text-gray-500" />
                        </button>
                    </div>

                    <div className="flex-1 overflow-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Roll No
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Student Name
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Marks
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {students.map(student => {
                                    const studentMark = studentMarks.find(m => m.student_id === student.id);
                                    return (
                                        <tr key={student.id}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {student.rollNumber}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {student.name}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <input
                                                    type="number"
                                                    min="0"
                                                    max={selectedTest.max_mark}
                                                    value={studentMark?.marks || ''}
                                                    onChange={(e) => handleMarkUpdate(student.id, e.target.value, false)}
                                                    disabled={studentMark?.is_absent}
                                                    className="w-20 px-3 py-1 border rounded focus:outline-none focus:ring-2 
                                                    focus:ring-emerald-500 disabled:bg-gray-100"
                                                />
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <label className="inline-flex items-center">
                                                    <input
                                                        type="checkbox"
                                                        checked={studentMark?.is_absent || false}
                                                        onChange={(e) => handleMarkUpdate(student.id, '0', e.target.checked)}
                                                        className="form-checkbox h-4 w-4 text-red-600 transition duration-150 
                                                        ease-in-out"
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

                    <div className="mt-6 flex justify-end gap-3 pt-4 border-t">
                        <button
                            onClick={() => setIsManageMarksOpen(false)}
                            className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSubmitMarks}
                            className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 
                            transition-colors flex items-center gap-2"
                        >
                            <Save size={20} /> Submit Marks
                        </button>
                    </div>
                </div>
            </div>
        )
    );

    const handleDelete = async (testId: number) => {
        if (window.confirm('Are you sure you want to delete this exam?')) {
            try {
                // TODO: Implement API call to delete test
                setUnitTests(tests => tests.filter(test => test.id !== testId));
                setIsDetailsModalOpen(false);
            } catch (error) {
                console.error('Failed to delete test:', error);
            }
        }
    };

    const handleEdit = () => {
        if (!selectedTest) return;

        setNewTest({
            subject_id: String(selectedTest.subject_id),
            class_id: String(selectedTest.class_id),
            portion_desc: selectedTest.portion_desc,
            date: selectedTest.date,
            max_mark: String(selectedTest.max_mark),
            pass_mark: String(selectedTest.pass_mark)
        });
        setIsEditMode(true);
        setIsModalOpen(true);
        setIsDetailsModalOpen(false);
    };

    const modalTitle = isEditMode ? "Edit Unit Test" : "Schedule New Unit Test";
    const modalButtonText = isEditMode ? "Update Unit Test" : "Create Unit Test";

    const renderActionButtons = () => (
        <div className="flex flex-wrap gap-3">
            {/* Status Buttons */}
            <div className="flex items-center gap-2">
                <button
                    onClick={() => handleStatusUpdate(selectedTest?.id || 0,
                        selectedTest?.is_completed ? {} : { is_completed: true }
                    )}
                    className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2
                        ${selectedTest?.is_completed
                            ? 'bg-green-100 text-green-700 hover:bg-green-200'
                            : 'bg-green-500 hover:bg-green-600 text-white'}`}
                >
                    <Check size={18} />
                    {selectedTest?.is_completed ? 'Completed (Click to Unmark)' : 'Mark as Completed'}
                </button>

                <button
                    onClick={() => handleStatusUpdate(selectedTest?.id || 0,
                        selectedTest?.is_postponed_indefinitely ? {} : { is_postponed_indefinitely: true }
                    )}
                    className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2
                        ${selectedTest?.is_postponed_indefinitely
                            ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                            : 'bg-yellow-500 hover:bg-yellow-600 text-white'}`}
                >
                    <AlertCircle size={18} />
                    {selectedTest?.is_postponed_indefinitely ? 'Postponed (Click to Unmark)' : 'Mark as Postponed'}
                </button>

                <button
                    onClick={() => handleStatusUpdate(selectedTest?.id || 0,
                        selectedTest?.is_exam_cancelled ? {} : { is_exam_cancelled: true }
                    )}
                    className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2
                        ${selectedTest?.is_exam_cancelled
                            ? 'bg-red-100 text-red-700 hover:bg-red-200'
                            : 'bg-red-500 hover:bg-red-600 text-white'}`}
                >
                    <X size={18} />
                    {selectedTest?.is_exam_cancelled ? 'Cancelled (Click to Unmark)' : 'Cancel Exam'}
                </button>
            </div>
        </div>
    );

    return (
        <div className="h-[calc(100vh-2rem)] flex flex-col space-y-4">
            {/* Header */}
            <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow-sm">
                <h1 className="text-xl font-bold text-gray-800">Unit Tests</h1>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 
                    transition-colors flex items-center gap-2"
                >
                    <Plus size={20} />
                    Schedule Unit Test
                </button>
            </div>

            {/* List of Unit Tests */}
            <div className="space-y-4 max-h-full overflow-y-auto">
                {unitTests.length === 0 ? (
                    <EmptyState
                        icon={<BookOpenCheck size={48} />}
                        title="No Unit Tests Found"
                        message="Get started by scheduling your first unit test. Click the 'Schedule Unit Test' button above."
                    />
                ) : (
                    unitTests.map(test => (
                        <div
                            key={test.id}
                            className="bg-white rounded-lg p-6 hover:shadow-lg transition-all duration-200 
                            border border-gray-100 hover:border-emerald-100 group relative"
                        >
                            <div className="flex justify-between">
                                <div
                                    className="space-y-3 flex-1 cursor-pointer"
                                    onClick={() => {
                                        setSelectedTest(test);
                                        setIsDetailsModalOpen(true);
                                    }}
                                >
                                    <div className="flex items-center gap-2">
                                        <BookOpen size={18} className="text-emerald-600" />
                                        <span className="font-medium text-gray-700">
                                            {test.FKSubjectID.Name}
                                        </span>
                                        {test.is_completed && (
                                            <span className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded-full">
                                                Completed
                                            </span>
                                        )}
                                        {test.is_postponed_indefinitely && (
                                            <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-700 rounded-full">
                                                Postponed
                                            </span>
                                        )}
                                        {test.is_exam_cancelled && (
                                            <span className="px-2 py-1 text-xs bg-red-100 text-red-700 rounded-full">
                                                Cancelled
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-gray-800">
                                        {test.portion_desc}
                                    </p>
                                    <div className="flex items-center gap-4 text-sm">
                                        <div className="flex items-center gap-2 text-gray-500">
                                            <Calendar size={16} />
                                            <span>{new Date(test.date).toLocaleDateString()}</span>
                                        </div>
                                        <div className="text-gray-500">
                                            Max Marks: {test.max_mark} | Pass Marks: {test.pass_mark}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                    {/* Add Marks Button - Always visible */}
                                    {test.is_completed && test.has_submitted_marks ? (
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => {
                                                    setSelectedTest(test);
                                                    setIsPreviewModalOpen(true);
                                                }}
                                                className="px-3 py-1.5 rounded-lg flex items-center gap-2 bg-blue-500 
                                                hover:bg-blue-600 text-white cursor-pointer transition-colors"
                                            >
                                                <BookOpen size={18} />
                                                <span className="text-sm whitespace-nowrap">
                                                    {publishStatus.is_published ? 'View Marks' : 'Preview & Publish'}
                                                </span>
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setSelectedTest(test);
                                                    setIsManageMarksOpen(true);
                                                }}
                                                className="px-3 py-1.5 rounded-lg flex items-center gap-2 bg-green-500 
                                                hover:bg-green-600 text-white cursor-pointer transition-colors"
                                            >
                                                <Edit size={18} />
                                                <span className="text-sm whitespace-nowrap">Edit Marks</span>
                                            </button>
                                        </div>
                                    ) : (
                                        <button
                                            onClick={() => {
                                                if (test.is_completed) {
                                                    setSelectedTest(test);
                                                    setIsManageMarksOpen(true);
                                                }
                                            }}
                                            disabled={!test.is_completed}
                                            className={`px-3 py-1.5 rounded-lg flex items-center gap-2 relative group/tooltip
                                                ${test.is_completed
                                                    ? 'bg-green-500 hover:bg-green-600 text-white cursor-pointer'
                                                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                } transition-colors`}
                                            title={test.is_completed ? "Add/Edit Marks" : "Complete the exam to add marks"}
                                        >
                                            <Edit size={18} />
                                            <span className="text-sm whitespace-nowrap">Add Marks</span>
                                            {!test.is_completed && (
                                                <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white 
                                                px-2 py-1 rounded text-xs whitespace-nowrap opacity-0 
                                                group-hover/tooltip:opacity-100 transition-opacity">
                                                    Complete the exam to add marks
                                                </span>
                                            )}
                                        </button>
                                    )}

                                    {/* Edit and Delete buttons - Show on hover */}
                                    <div className="flex items-start space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={() => {
                                                setSelectedTest(test);
                                                handleEdit();
                                            }}
                                            className="p-2 hover:bg-blue-50 rounded-full transition-colors relative group/tooltip"
                                            title="Edit Test"
                                        >
                                            <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white px-2 py-1 
                                            rounded text-xs whitespace-nowrap opacity-0 group-hover/tooltip:opacity-100 transition-opacity">
                                                Edit Test
                                            </span>
                                            <Edit size={18} className="text-blue-500" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(test.id)}
                                            className="p-2 hover:bg-red-50 rounded-full transition-colors relative group/tooltip"
                                            title="Delete Test"
                                        >
                                            <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white px-2 py-1 
                                            rounded text-xs whitespace-nowrap opacity-0 group-hover/tooltip:opacity-100 transition-opacity">
                                                Delete Test
                                            </span>
                                            <Trash size={18} className="text-red-500" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Create Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-xl max-w-3xl w-full p-6">
                        <div className="flex justify-between items-center mb-6 pb-4 border-b">
                            <h2 className="text-xl font-semibold text-gray-800">{modalTitle}</h2>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                            >
                                <X size={20} className="text-gray-500" />
                            </button>
                        </div>

                        <div className="space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                                    <select
                                        value={newTest.subject_id}
                                        onChange={(e) => setNewTest({ ...newTest, subject_id: e.target.value })}
                                        className="w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                    >
                                        <option value="">Select Subject</option>
                                        {subjects.map(subject => (
                                            <option key={subject.id} value={subject.id}>
                                                {subject.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Class</label>
                                    <select
                                        value={newTest.class_id}
                                        onChange={(e) => setNewTest({ ...newTest, class_id: e.target.value })}
                                        className="w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                    >
                                        <option value="">Select Class</option>
                                        {classes.map(cls => (
                                            <option key={cls.id} value={cls.id}>
                                                {cls.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Portion Description</label>
                                <textarea
                                    value={newTest.portion_desc}
                                    onChange={(e) => setNewTest({ ...newTest, portion_desc: e.target.value })}
                                    placeholder="Enter portion description..."
                                    className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 h-32 resize-none"
                                />
                            </div>

                            <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                                    <input
                                        type="datetime-local"
                                        value={newTest.date}
                                        onChange={(e) => setNewTest({ ...newTest, date: e.target.value })}
                                        className="w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Maximum Marks</label>
                                    <input
                                        type="number"
                                        value={newTest.max_mark}
                                        onChange={(e) => setNewTest({ ...newTest, max_mark: e.target.value })}
                                        className="w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Pass Marks</label>
                                    <input
                                        type="number"
                                        value={newTest.pass_mark}
                                        onChange={(e) => setNewTest({ ...newTest, pass_mark: e.target.value })}
                                        className="w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 flex justify-end gap-3">
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleCreate}
                                className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 
                                transition-colors flex items-center gap-2"
                            >
                                <Plus size={20} /> {modalButtonText}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Details Modal */}
            {isDetailsModalOpen && selectedTest && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-xl max-w-3xl w-full p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-semibold text-gray-800">Unit Test Details</h2>
                            <button
                                onClick={() => setIsDetailsModalOpen(false)}
                                className="p-2 hover:bg-gray-100 rounded-full"
                            >
                                <X size={20} className="text-gray-500" />
                            </button>
                        </div>

                        <div className="space-y-6">
                            {/* Test Details */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <p className="text-sm text-gray-500">Subject</p>
                                    <p className="font-medium">{selectedTest.FKSubjectID.Name}</p>
                                </div>
                                <div className="space-y-2">
                                    <p className="text-sm text-gray-500">Date</p>
                                    <p className="font-medium">
                                        {new Date(selectedTest.date).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            {renderActionButtons()}
                        </div>
                    </div>
                </div>
            )}

            {/* Marks Management Modal */}
            {renderMarksModal()}

            {/* Preview Modal */}
            {isPreviewModalOpen && selectedTest && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full p-6 max-h-[90vh] overflow-hidden flex flex-col">
                        <div className="flex justify-between items-center mb-6 pb-4 border-b">
                            <div>
                                <h2 className="text-xl font-semibold text-gray-800">Mark Sheet Preview</h2>
                                <p className="text-sm text-gray-500 mt-1">
                                    {selectedTest.FKSubjectID.Name} - Max Marks: {selectedTest.max_mark}
                                </p>
                            </div>
                            <button
                                onClick={() => setIsPreviewModalOpen(false)}
                                className="p-2 hover:bg-gray-100 rounded-full"
                            >
                                <X size={20} className="text-gray-500" />
                            </button>
                        </div>

                        <div className="flex-1 overflow-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Roll No
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Student Name
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Marks
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Status
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Result
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {students.map(student => {
                                        const studentMark = studentMarks.find(m => m.student_id === student.id);
                                        const isPassed = studentMark && !studentMark.is_absent &&
                                            studentMark.marks >= selectedTest.pass_mark;

                                        return (
                                            <tr key={student.id}>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {student.rollNumber}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {student.name}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {studentMark?.is_absent ? '-' : studentMark?.marks || 0}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                    {studentMark?.is_absent ? (
                                                        <span className="text-gray-500 text-sm">
                                                            Absent
                                                        </span>
                                                    ) : (
                                                        <span className="text-gray-500 text-sm">
                                                            Present
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                    {studentMark?.is_absent ? (
                                                        <span className="text-gray-500">-</span>
                                                    ) : (
                                                        <span className={`px-3 py-1.5 text-sm font-medium rounded-full inline-flex items-center gap-1.5
                                                            ${isPassed
                                                                ? 'bg-green-100 text-green-700 border border-green-200'
                                                                : 'bg-red-100 text-red-700 border border-red-200'}`}
                                                        >
                                                            {isPassed ? (
                                                                <>
                                                                    <Check size={14} />
                                                                    Pass
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <X size={14} />
                                                                    Fail
                                                                </>
                                                            )}
                                                        </span>
                                                    )}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>

                        <div className="mt-6 flex justify-between items-center pt-4 border-t">
                            <div className="text-sm text-gray-500">
                                {publishStatus.is_published ? (
                                    <span>Published on: {new Date(publishStatus.published_at!).toLocaleString()}</span>
                                ) : (
                                    <span>* Review the marks before publishing</span>
                                )}
                            </div>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setIsPreviewModalOpen(false)}
                                    className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                                >
                                    Close
                                </button>
                                {!publishStatus.is_published && (
                                    <button
                                        onClick={handlePublishMarks}
                                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 
                                        transition-colors flex items-center gap-2"
                                    >
                                        <Save size={20} /> Publish Marks
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UnitTests; 