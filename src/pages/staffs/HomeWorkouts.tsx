import { useEffect, useState } from "react";
import { Plus, Save, X, ListTodo } from "lucide-react";
import EmptyState from "../../components/EmptyState";
import { Class, Homework, Subject } from "../../types/Types";
import HomeWorkoutCard from "../../components/homeWorkout/homeWorkoutCard";
import {
    createHomework,
    deleteHomework,
    getHomeworkTeacher,
    getSubjectsOfStaff,
    updateHomework,
} from "../../api/staffs";
import { getClasses } from "../../api/staffs";
import { message } from "antd";
import { CircularProgress } from "@mui/material";

const HomeWorkouts = () => {
    const [homeworks, setHomeworks] = useState<Homework[]>([]);
    const [editingHomework, setEditingHomework] = useState<Homework | null>(
        null
    );
    const [newHomework, setNewHomework] = useState<Partial<Homework>>({});
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [classes, setClasses] = useState<Class[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchClasses = async () => {
            try {
                const fetchedClasses = await getClasses({
                    criteria: "my-classes",
                });
                setClasses(fetchedClasses);
            } catch (error) {
                console.error("Error fetching classes:", error);
            }
        };

        fetchClasses();
    }, []);

    useEffect(() => {
        const fetchSubjects = async () => {
            try {
                const fetchedSubjects = await getSubjectsOfStaff();
                setSubjects(fetchedSubjects);
            } catch (error) {
                console.error("Error fetching subjects of staff:", error);
            }
        };

        fetchSubjects();
    }, []);

    useEffect(() => {
        fetchHomeworks();
    }, []);

    const fetchHomeworks = async () => {
        try {
            const data = await getHomeworkTeacher();
            setHomeworks(data);
            setLoading(false);
        } catch (error) {
            if (error instanceof Error) {
                message?.error(
                    error?.message || "Error while fetching homeworks"
                );
            }
            setError("Couldn't fetch homeworks");
            setLoading(false)
        }
    };

    const handleCreate = async () => {
        try {
            if (
                newHomework.subjectId &&
                newHomework.classId &&
                newHomework.homeworkDesc &&
                newHomework.dueDate
            ) {
                await createHomework(newHomework);
                fetchHomeworks();

                setNewHomework({});
                setIsModalOpen(false);
            } else {
                message?.error("Please fill all the fields!");
            }
        } catch (error) {
            if (error instanceof Error) {
                message?.error(
                    error?.message ||
                        "Oops! Error while creating homework, please try again later"
                );
            }
        }
    };

    const handleEdit = (homework: Homework) => {
        setEditingHomework(homework);
        setIsEditModalOpen(true);
    };

    const handleUpdate = async () => {
        try {
            if (editingHomework) {
                if (
                    !editingHomework?.classID ||
                    !editingHomework?.subjectID ||
                    !editingHomework?.homeworkDesc ||
                    !editingHomework?.dueDate
                ) {
                    message?.error("Please fill all the fields");
                    return;
                }
                await updateHomework({
                    ...editingHomework,
                    subjectId: editingHomework?.subjectID,
                    classId: editingHomework?.classID,
                });
                setHomeworks(
                    homeworks.map((hw) =>
                        hw.id === editingHomework.id ? editingHomework : hw
                    )
                );
                setEditingHomework(null);
                setIsEditModalOpen(false);
            }
        } catch (error) {
            if (error instanceof Error) {
                message?.error(
                    error?.message ||
                        "Oops! Error while updating homework, please try again later"
                );
            }
        }
    };

    const handleDelete = async (id: number) => {
        try {
            await deleteHomework(id);
            setHomeworks(homeworks.filter((hw) => hw.id !== id));
        } catch (error) {
            if (error instanceof Error) {
                message?.error(
                    error?.message ||
                        "Oops! Error while deleting homework, please try again later"
                );
            }
        }
    };

    return (
        <div className="h-[calc(100vh-2rem)] flex flex-col space-y-4">
            {/* Header */}
            <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow-sm">
                <h1 className="text-xl font-bold text-gray-800">
                    Home Workouts
                </h1>
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

            {loading ? (
                <div className="w-full flex justify-center h-full items-center">
                    <CircularProgress />
                </div>
            ) : error ? (
                <div  className="w-full flex justify-center h-full items-center text-red-500">{error}</div>
            ) : (
                <div className="space-y-4 max-h-full overflow-y-auto">
                    {homeworks.length === 0 ? (
                        <EmptyState
                            icon={<ListTodo size={48} />}
                            title="No Homework Assignments"
                            message="Start by creating your first homework assignment. Click the 'Create Homework' button above."
                        />
                    ) : (
                        homeworks.map((homework) => (
                            <HomeWorkoutCard
                                key={homework?.id}
                                homework={homework}
                                handleDelete={handleDelete}
                                handleEdit={handleEdit}
                            />
                        ))
                    )}
                </div>
            )}

            {/* Edit Homework Modal */}
            {isEditModalOpen && editingHomework && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-xl max-w-3xl w-full p-6">
                        <div className="flex justify-between items-center mb-6 pb-4 border-b">
                            <h2 className="text-xl font-semibold text-gray-800">
                                Edit Homework
                            </h2>
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
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Subject
                                    </label>
                                    <select
                                        value={editingHomework.subjectID}
                                        onChange={(e) =>
                                            setEditingHomework({
                                                ...editingHomework,
                                                subjectId: Number(
                                                    e.target.value
                                                ),
                                            })
                                        }
                                        className="w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                    >
                                        <option value="">Select Subject</option>
                                        {subjects.map((subject) => (
                                            <option
                                                key={subject.id}
                                                value={subject.id}
                                            >
                                                {subject.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Class
                                    </label>
                                    <select
                                        value={editingHomework.classID}
                                        onChange={(e) =>
                                            setEditingHomework({
                                                ...editingHomework,
                                                classId: Number(e.target.value),
                                            })
                                        }
                                        className="w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                    >
                                        <option value="">Select Class</option>
                                        {classes.map((cls) => (
                                            <option key={cls.id} value={cls.id}>
                                                {cls.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Description
                                </label>
                                <textarea
                                    placeholder="Enter homework description..."
                                    value={editingHomework.homeworkDesc}
                                    onChange={(e) =>
                                        setEditingHomework({
                                            ...editingHomework,
                                            homeworkDesc: e.target.value,
                                        })
                                    }
                                    className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 h-32 resize-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Due Date
                                </label>
                                <input
                                    type="date"
                                    value={
                                        new Date(editingHomework.dueDate)
                                            ?.toISOString()
                                            .split("T")[0]
                                    }
                                    onChange={(e) =>
                                        setEditingHomework({
                                            ...editingHomework,
                                            dueDate: new Date(e?.target?.value)
                                                ?.toISOString()
                                                .split("T")[0],
                                        })
                                    }
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
                            <h2 className="text-xl font-semibold text-gray-800">
                                Create New Homework
                            </h2>
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
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Subject
                                    </label>
                                    <select
                                        value={newHomework.subjectId || ""}
                                        onChange={(e) =>
                                            setNewHomework({
                                                ...newHomework,
                                                subjectId: Number(
                                                    e.target.value
                                                ),
                                            })
                                        }
                                        className="w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                    >
                                        <option value="">Select Subject</option>
                                        {subjects.map((subject) => (
                                            <option
                                                key={subject.id}
                                                value={subject.id}
                                            >
                                                {subject.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Class
                                    </label>
                                    <select
                                        value={newHomework.classId || ""}
                                        onChange={(e) =>
                                            setNewHomework({
                                                ...newHomework,
                                                classId: Number(e.target.value),
                                            })
                                        }
                                        className="w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                    >
                                        <option value="">Select Class</option>
                                        {classes.map((cls) => (
                                            <option key={cls.id} value={cls.id}>
                                                {cls.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Description
                                </label>
                                <textarea
                                    placeholder="Enter homework description..."
                                    value={newHomework.homeworkDesc || ""}
                                    onChange={(e) =>
                                        setNewHomework({
                                            ...newHomework,
                                            homeworkDesc: e.target.value,
                                        })
                                    }
                                    className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 h-32 resize-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Due Date
                                </label>
                                <input
                                    type="date"
                                    value={newHomework.dueDate || ""}
                                    onChange={(e) =>
                                        setNewHomework({
                                            ...newHomework,
                                            dueDate: e.target.value,
                                        })
                                    }
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
