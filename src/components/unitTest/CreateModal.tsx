import React from "react";
import { UnitTestData } from "../../types/StateTypes";
import { Plus, X } from "lucide-react";
import { Class, Subject } from "../../types/Types";

type PropType = {
    modalTitle: string;
    modalButtonText: string;
    setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
    setNewTest: React.Dispatch<React.SetStateAction<UnitTestData>>;
    newTest: UnitTestData;
    subjects: Subject[];
    classes: Class[];
    handleCreateOrUpdate: () => void;
};
const CreateModal = ({
    modalTitle,
    modalButtonText,
    setIsModalOpen,
    setNewTest,
    newTest,
    subjects,
    classes,
    handleCreateOrUpdate,
}: PropType) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-xl max-w-3xl w-full p-6">
                <div className="flex justify-between items-center mb-6 pb-4 border-b">
                    <h2 className="text-xl font-semibold text-gray-800">
                        {modalTitle}
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
                                value={newTest.subject_id}
                                onChange={(e) =>
                                    setNewTest({
                                        ...newTest,
                                        subject_id: e.target.value,
                                    })
                                }
                                className="w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            >
                                <option value="">Select Subject</option>
                                {subjects.map((subject) => (
                                    <option key={subject.id} value={subject.id}>
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
                                value={newTest.class_id}
                                onChange={(e) =>
                                    setNewTest({
                                        ...newTest,
                                        class_id: e.target.value,
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
                            Portion Description
                        </label>
                        <textarea
                            value={newTest.portion_desc}
                            onChange={(e) =>
                                setNewTest({
                                    ...newTest,
                                    portion_desc: e.target.value,
                                })
                            }
                            placeholder="Enter portion description..."
                            className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 h-32 resize-none"
                        />
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Date
                            </label>
                            <input
                                type="date"
                                value={newTest.date}
                                onChange={(e) =>
                                    setNewTest({
                                        ...newTest,
                                        date: e.target.value,
                                    })
                                }
                                className="w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Maximum Marks
                            </label>
                            <input
                                type="number"
                                value={newTest.max_mark}
                                onChange={(e) =>
                                    setNewTest({
                                        ...newTest,
                                        max_mark: e.target.value,
                                    })
                                }
                                className="w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Pass Marks
                            </label>
                            <input
                                type="number"
                                value={newTest.pass_mark}
                                onChange={(e) =>
                                    setNewTest({
                                        ...newTest,
                                        pass_mark: e.target.value,
                                    })
                                }
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
                        onClick={handleCreateOrUpdate}
                        className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700
                                transition-colors flex items-center gap-2"
                    >
                        <Plus size={20} /> {modalButtonText}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CreateModal;
