import { useState } from 'react';
import { Plus, Edit, Trash, Save, X, BookOpen, Calendar, ListTodo } from 'lucide-react';
import EmptyState from '../../components/EmptyState';
import { Homework } from '../../types/Types';

const HomeWorkouts = () => {
    const [homeworks, setHomeworks] = useState<Homework[]>([
        {
            id: 1,
            subjectId: 1,
            classId: 1,
            homeworkDesc: "Complete exercises from Chapter 1 to 3.",
            dueDate: "2024-03-30",
        },
        {
            id: 2,
            subjectId: 2,
            classId: 1,
            homeworkDesc: "Read pages 45 to 60 and summarize.",
            dueDate: "2024-04-02",
        },
        {
            id: 3,
            subjectId: 1,
            classId: 2,
            homeworkDesc: "Solve problems 1 to 10 on page 25.",
            dueDate: "2024-04-05",
        },
        {
            id: 4,
            subjectId: 3,
            classId: 1,
            homeworkDesc: "Write an essay on the importance of science.",
            dueDate: "2024-04-10",
        },
        {
            id: 5,
            subjectId: 4,
            classId: 2,
            homeworkDesc: "Prepare a presentation on World War II.",
            dueDate: "2024-04-15",
        },
        {
            id: 6,
            subjectId: 2,
            classId: 3,
            homeworkDesc: "Complete the lab report for the last experiment.",
            dueDate: "2024-04-20",
        },
        {
            id: 7,
            subjectId: 1,
            classId: 3,
            homeworkDesc: "Practice multiplication tables 1 to 12.",
            dueDate: "2024-04-25",
        },
        {
            id: 8,
            subjectId: 3,
            classId: 1,
            homeworkDesc: "Read Chapter 5 and answer the questions.",
            dueDate: "2024-04-30",
        },
    ]);
    const [editingHomework, setEditingHomework] = useState<Homework | null>(null);
    const [newHomework, setNewHomework] = useState<Partial<Homework>>({});
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    const subjects = [
        { id: 1, name: 'Mathematics' },
        { id: 2, name: 'Science' },
        { id: 3, name: 'English' },
        { id: 4, name: 'History' },
        { id: 5, name: 'Geography' },
        { id: 6, name: 'Physics' },
        { id: 7, name: 'Chemistry' },
        { id: 8, name: 'Biology' },
    ];

    const classes = [
        { id: 1, name: 'Class 1' },
        { id: 2, name: 'Class 2' },
        { id: 3, name: 'Class 3' },
        { id: 4, name: 'Class 4' },
        { id: 5, name: 'Class 5' },
        { id: 6, name: 'Class 6' },
    ];

    const handleCreate = () => {
        if (newHomework.subjectId && newHomework.classId && newHomework.homeworkDesc && newHomework.dueDate) {
            setHomeworks([...homeworks, { id: Date.now(), ...newHomework } as Homework]);
            setNewHomework({});
            setIsModalOpen(false);
        }
    };

    const handleEdit = (homework: Homework) => {
        setEditingHomework(homework);
        setIsEditModalOpen(true);
    };

    const handleUpdate = () => {
        if (editingHomework) {
            setHomeworks(homeworks.map(hw =>
                hw.id === editingHomework.id ? editingHomework : hw
            ));
            setEditingHomework(null);
            setIsEditModalOpen(false);
        }
    };

    const handleDelete = (id: number) => {
        setHomeworks(homeworks.filter(hw => hw.id !== id));
    };

    return (
        <div className="h-[calc(100vh-2rem)] flex flex-col space-y-4">
            {/* Header */}
            <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow-sm">
                <h1 className="text-xl font-bold text-gray-800">Home Workouts</h1>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 
                    transition-colors flex items-center gap-2"
                >
                    <Plus size={20} />
                    Create Homework
                </button>
            </div>

            {/* List of Homeworks */}
            <div className="space-y-4 max-h-full overflow-y-auto">
                {homeworks.length === 0 ? (
                    <EmptyState
                        icon={<ListTodo size={48} />}
                        title="No Homework Assignments"
                        message="Start by creating your first homework assignment. Click the 'Create Homework' button above."
                    />
                ) : (
                    homeworks.map(homework => (
                        <div
                            key={homework.id}
                            className="bg-white rounded-lg p-6 hover:shadow-lg transition-all duration-200 
                            border border-gray-100 hover:border-emerald-100 group relative"
                        >
                            <div className="flex justify-between">
                                <div className="space-y-3">
                                    <div className="flex items-center gap-2">
                                        <BookOpen size={18} className="text-emerald-600" />
                                        <span className="font-medium text-gray-700 group-hover:text-emerald-600 transition-colors">
                                            {subjects.find(s => s.id === homework.subjectId)?.name}
                                        </span>
                                        <span className="text-gray-400">|</span>
                                        <span className="text-gray-600">
                                            {classes.find(c => c.id === homework.classId)?.name}
                                        </span>
                                    </div>
                                    <p className="text-gray-800 group-hover:text-gray-900 transition-colors">
                                        {homework.homeworkDesc}
                                    </p>
                                    <div className="flex items-center gap-2 text-sm text-gray-500">
                                        <Calendar size={16} className="group-hover:text-red-700 transition-colors" />
                                        <span className="group-hover:text-red-700 transition-colors">
                                            Due: {new Date(homework.dueDate).toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex items-start space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        onClick={() => handleEdit(homework)}
                                        className="p-2 hover:bg-blue-50 rounded-full transition-colors"
                                    >
                                        <Edit size={18} className="text-blue-500" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(homework.id)}
                                        className="p-2 hover:bg-red-50 rounded-full transition-colors"
                                    >
                                        <Trash size={18} className="text-red-500" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Edit Homework Modal */}
            {isEditModalOpen && editingHomework && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-xl max-w-3xl w-full p-6">
                        <div className="flex justify-between items-center mb-6 pb-4 border-b">
                            <h2 className="text-xl font-semibold text-gray-800">Edit Homework</h2>
                            <button
                                onClick={() => setIsEditModalOpen(false)}
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
                                        value={editingHomework.subjectId}
                                        onChange={(e) => setEditingHomework({
                                            ...editingHomework,
                                            subjectId: Number(e.target.value)
                                        })}
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
                                        value={editingHomework.classId}
                                        onChange={(e) => setEditingHomework({
                                            ...editingHomework,
                                            classId: Number(e.target.value)
                                        })}
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
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                <textarea
                                    placeholder="Enter homework description..."
                                    value={editingHomework.homeworkDesc}
                                    onChange={(e) => setEditingHomework({
                                        ...editingHomework,
                                        homeworkDesc: e.target.value
                                    })}
                                    className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 h-32 resize-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
                                <input
                                    type="date"
                                    value={editingHomework.dueDate}
                                    onChange={(e) => setEditingHomework({
                                        ...editingHomework,
                                        dueDate: e.target.value
                                    })}
                                    className="w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                />
                            </div>
                        </div>
                        <div className="mt-6 flex justify-end gap-3">
                            <button
                                onClick={() => setIsEditModalOpen(false)}
                                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleUpdate}
                                className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 
                                transition-colors flex items-center gap-2"
                            >
                                <Save size={20} /> Update Homework
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Create Homework Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-xl max-w-3xl w-full p-6">
                        <div className="flex justify-between items-center mb-6 pb-4 border-b">
                            <h2 className="text-xl font-semibold text-gray-800">Create New Homework</h2>
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
                                        value={newHomework.subjectId || ''}
                                        onChange={(e) => setNewHomework({ ...newHomework, subjectId: Number(e.target.value) })}
                                        className="w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                    >
                                        <option value="">Select Subject</option>
                                        {subjects.map(subject => (
                                            <option key={subject.id} value={subject.id}>{subject.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Class</label>
                                    <select
                                        value={newHomework.classId || ''}
                                        onChange={(e) => setNewHomework({ ...newHomework, classId: Number(e.target.value) })}
                                        className="w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                    >
                                        <option value="">Select Class</option>
                                        {classes.map(cls => (
                                            <option key={cls.id} value={cls.id}>{cls.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                <textarea
                                    placeholder="Enter homework description..."
                                    value={newHomework.homeworkDesc || ''}
                                    onChange={(e) => setNewHomework({ ...newHomework, homeworkDesc: e.target.value })}
                                    className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 h-32 resize-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
                                <input
                                    type="date"
                                    value={newHomework.dueDate || ''}
                                    onChange={(e) => setNewHomework({ ...newHomework, dueDate: e.target.value })}
                                    className="w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                />
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
                                <Plus size={20} /> Create Homework
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default HomeWorkouts; 