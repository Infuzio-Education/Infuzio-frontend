import React, { useEffect, useState } from "react";
import { Modal, Box, IconButton, Checkbox } from "@mui/material";
import { Pencil, PlusCircle, Trash2, ArrowLeft, X, Plus } from "lucide-react";
import Togglebar from "../../components/Togglebar";
import SnackbarComponent from "../../components/SnackbarComponent";
import { getTermExams, createTermExam, updateTermExam, deleteTermExam, getAcademicYears, getSchoolStandards, addTermExamStandard, getGradeCategories, removeTermExamStandard, getTermExamsStandards } from "../../api/superAdmin";
import { useSelector } from "react-redux";
import CreateTermExams from "./CreateTermExams";
import { AcademicYear, TermExam, Standard, TermExamStandard } from "../../types/Types";


const ListTermExams: React.FC = () => {
    const [openModal, setOpenModal] = useState(false);
    const [termExams, setTermExams] = useState<TermExam[]>([]);
    const [academicYears, setAcademicYears] = useState<AcademicYear[]>([]);
    const [editingExam, setEditingExam] = useState<TermExam | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: "",
        severity: "success" as "success" | "error",
        position: { vertical: "top" as const, horizontal: "center" as const },
    });
    const [selectedExams, setSelectedExams] = useState<number[]>([]);
    const [selectAll, setSelectAll] = useState<boolean>(false);
    const [showStandards, setShowStandards] = useState(false);
    const [selectedTermExam, setSelectedTermExam] = useState<TermExam | null>(null);
    const [standards, setStandards] = useState<TermExamStandard[]>([]);
    const [standardsModalOpen, setStandardsModalOpen] = useState(false);
    const [availableStandards, setAvailableStandards] = useState<Standard[]>([]);
    const [standardsModalAnchor, setStandardsModalAnchor] = useState<HTMLElement | null>(null);
    const [selectedStandard, setSelectedStandard] = useState<Standard | null>(null);
    const [gradeSelectionOpen, setGradeSelectionOpen] = useState(false);
    const [grades, setGrades] = useState<any[]>([]);

    const { staffInfo } = useSelector((state: any) => state.staffInfo);
    const schoolPrefix = staffInfo?.school_prefix;

    const hasSchoolAdminPrivilege = staffInfo?.specialPrivileges?.some(
        (privilege: any) => privilege.privilege === "schoolAdmin"
    );

    useEffect(() => {
        fetchData();
        fetchAcademicYears();
        fetchGradeCategories();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await getTermExams();
            if (response?.data) {
                setTermExams(response.data);
            } else {
                setTermExams([]);
            }
        } catch (err) {
            setError("Failed to load term exams");
            setTermExams([]);
        } finally {
            setLoading(false);
        }
    };

    const fetchAcademicYears = async () => {
        try {
            const response = await getAcademicYears(schoolPrefix);
            if (response?.data) {
                setAcademicYears(response.data);
            } else {
                setAcademicYears([]);
            }
        } catch (error) {
            console.error("Error fetching academic years:", error);
            setAcademicYears([]);
        }
    };

    const fetchGradeCategories = async () => {
        try {
            const response = await getGradeCategories(
                hasSchoolAdminPrivilege ? staffInfo?.schoolCode : undefined
            );
            if (response?.data) {
                setGrades(response.data);
            }
        } catch (error) {
            setSnackbar({
                open: true,
                message: "Failed to fetch grade categories",
                severity: "error",
                position: { vertical: "top", horizontal: "center" },
            });
        }
    };

    const handleEdit = (exam: TermExam) => {
        setEditingExam(exam);
        setOpenModal(true);
    };

    const handleSave = async (data: { Name: string; AcademicYear: number }) => {
        try {
            if (editingExam) {
                await updateTermExam({
                    id: editingExam.id,
                    Name: data.Name,
                    AcademicYearID: data.AcademicYear
                });
            } else {
                await createTermExam(data);
            }
            fetchData();
            setOpenModal(false);
            setEditingExam(null);
            setSnackbar({
                open: true,
                message: `Term exam ${editingExam ? 'updated' : 'created'} successfully!`,
                severity: "success",
                position: { vertical: "top", horizontal: "center" },
            });
        } catch (error) {
            setSnackbar({
                open: true,
                message: "Operation failed. Please try again.",
                severity: "error",
                position: { vertical: "top", horizontal: "center" },
            });
        }
    };

    const handleDelete = async (id: number) => {
        try {
            await deleteTermExam(id);
            setTermExams(prev => prev.filter(exam => exam.id !== id));
            setSnackbar({
                open: true,
                message: "Term exam deleted successfully!",
                severity: "success",
                position: { vertical: "top", horizontal: "center" },
            });
        } catch (error) {
            setSnackbar({
                open: true,
                message: "Delete failed. Please try again.",
                severity: "error",
                position: { vertical: "top", horizontal: "center" },
            });
        }
    };

    const handleSelectAll = () => {
        setSelectedExams(selectAll ? [] : termExams.map(exam => exam.id));
        setSelectAll(!selectAll);
    };

    const handleSelectExam = (id: number) => {
        setSelectedExams(prev =>
            prev.includes(id) ? prev.filter(selectedId => selectedId !== id) : [...prev, id]
        );
    };

    // Filter term exams based on search term
    const filteredTermExams = termExams.filter(exam =>
        exam.Name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        exam.AcademicYear.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleRowClick = async (exam: TermExam) => {
        setSelectedTermExam(exam);
        setShowStandards(true);
        setLoading(true);
        try {
            const response = await getTermExamsStandards(exam.id);
            if (response?.data) {
                setStandards(response.data);
            }
        } catch (error) {
            console.error("Error fetching standards:", error);
            setSnackbar({
                open: true,
                message: "Failed to fetch standards",
                severity: "error",
                position: { vertical: "top", horizontal: "center" },
            });
        } finally {
            setLoading(false);
        }
    };

    const handleBackToExams = () => {
        setShowStandards(false);
        setSelectedTermExam(null);
        setStandards([]);
    };

    const handleAddStandardsClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
        event.stopPropagation();
        setStandardsModalAnchor(event.currentTarget);
        try {
            const response = await getSchoolStandards(schoolPrefix);
            if (response?.data) {
                // Filter out standards that are already added
                const filteredStandards = response.data.filter((standard: Standard) =>
                    !standards.some(existingStandard => existingStandard.standard_name === standard.Name)
                );
                setAvailableStandards(filteredStandards);
            }
            setStandardsModalOpen(true);
        } catch (error) {
            setSnackbar({
                open: true,
                message: "Failed to fetch standards",
                severity: "error",
                position: { vertical: "top", horizontal: "center" },
            });
        }
    };

    const handleStandardSelect = async (standard: Standard) => {
        setSelectedStandard(standard);
        await fetchGradeCategories();
        setGradeSelectionOpen(true);
    };

    const handleGradeSubmit = async (gradeTypeId: number) => {
        if (!selectedStandard || !selectedTermExam) return;

        try {
            await addTermExamStandard({
                term_exam_id: selectedTermExam.id,
                grade_type_id: gradeTypeId,
                standard_id: selectedStandard.ID
            });

            // Refresh standards list
            const response = await getTermExamsStandards(selectedTermExam.id);
            if (response?.data) {
                setStandards(response.data);
            }

            setGradeSelectionOpen(false);
            setStandardsModalOpen(false);
            setSelectedStandard(null);

            setSnackbar({
                open: true,
                message: "Standard added successfully!",
                severity: "success",
                position: { vertical: "top", horizontal: "center" },
            });
        } catch (error) {
            setSnackbar({
                open: true,
                message: "Failed to add standard",
                severity: "error",
                position: { vertical: "top", horizontal: "center" },
            });
        }
    };

    const handleRemoveStandard = async (term_exam_standard_id: number) => {
        if (!selectedTermExam) return;

        try {
            await removeTermExamStandard(term_exam_standard_id);

            // Refresh standards list after deletion
            const response = await getTermExamsStandards(selectedTermExam.id);
            if (response?.data) {
                setStandards(response.data);
            }

            setSnackbar({
                open: true,
                message: "Standard removed successfully!",
                severity: "success",
                position: { vertical: "top", horizontal: "center" },
            });
        } catch (error) {
            setSnackbar({
                open: true,
                message: "Failed to remove standard",
                severity: "error",
                position: { vertical: "top", horizontal: "center" },
            });
        }
    };

    return (
        <div className="min-h-screen bg-gray-200 p-8 pt-5 relative">
            <Togglebar
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                viewMode={viewMode}
                setViewMode={setViewMode}
                itemCount={termExams.length}
            />

            <div className="p-4 space-y-4">
                <div className="flex justify-between items-center">
                    {showStandards ? (
                        <div className="flex items-center gap-4">
                            <button
                                onClick={handleBackToExams}
                                className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
                            >
                                <ArrowLeft size={20} />
                            </button>
                            <h2 className="text-xl font-bold">
                                Standards for {selectedTermExam?.Name}
                            </h2>
                        </div>
                    ) : (
                        <h1 className="text-xl font-bold">Term Exams</h1>
                    )}
                </div>

                {loading ? (
                    <div className="rounded-lg p-8 text-center">
                        <p className="text-xl font-semibold">Loading term exams...</p>
                    </div>
                ) : error ? (
                    <div className="rounded-lg p-8 text-center">
                        <p className="text-xl font-semibold text-red-500">{error}</p>
                    </div>
                ) : termExams.length === 0 ? (
                    <div className="rounded-lg p-8 text-center">
                        <p className="text-xl font-semibold mb-4">No term exams found.</p>
                        <p className="text-gray-600">Click the "+" button to create a new term exam.</p>
                    </div>
                ) : filteredTermExams.length === 0 ? (
                    <div className="rounded-lg p-8 text-center">
                        <p className="text-lg font-semibold">No term exams match your search criteria.</p>
                    </div>
                ) : (
                    showStandards ? (
                        <div>
                            {loading ? (
                                <div className="bg-white rounded-lg p-8 text-center">
                                    <p className="text-xl font-semibold">Loading standards...</p>
                                </div>
                            ) : standards.length === 0 ? (
                                <div className="bg-white rounded-lg p-8 text-center">
                                    <p className="text-xl font-semibold mb-4">No standards found</p>
                                    <p className="text-gray-600 mb-6">No standards have been assigned to this term exam yet.</p>
                                    <button
                                        className="text-sm text-blue-600 hover:text-blue-800 inline-flex items-center gap-2 mx-auto"
                                        onClick={handleAddStandardsClick}
                                    >
                                        <Plus size={20} className="text-blue-500" />
                                        Add Standards
                                    </button>
                                </div>
                            ) : (
                                <div className="bg-white shadow-md rounded-lg overflow-hidden">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="bg-gray-300">
                                                <th className="text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-2/12">Sl.No</th>
                                                <th className="text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-5/12">Standard Name</th>
                                                <th className="text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-3/12">Grade Type</th>
                                                <th className="text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-2/12">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {standards.map((standard, index) => (
                                                <tr key={standard.id}>
                                                    <td className="text-center py-3">
                                                        <div className="text-sm font-medium text-gray-900">{index + 1}</div>
                                                    </td>
                                                    <td className="text-center py-3">
                                                        <div className="text-sm font-medium text-gray-900">{standard.standard_name}</div>
                                                    </td>
                                                    <td className="text-center py-3">
                                                        <div className="text-sm font-medium text-gray-900">{standard.grade_name}</div>
                                                    </td>
                                                    <td className="text-center py-3">
                                                        <IconButton
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleRemoveStandard(standard.id);
                                                            }}
                                                        >
                                                            <X size={20} className="text-red-500" />
                                                        </IconButton>
                                                    </td>
                                                </tr>
                                            ))}
                                            <tr className="hover:bg-gray-50">
                                                <td colSpan={5} className="px-6 py-2 border-t">
                                                    <button
                                                        className="text-sm text-blue-600 hover:text-blue-800 inline-flex items-center gap-2"
                                                        onClick={handleAddStandardsClick}
                                                    >
                                                        <Plus size={20} className="text-blue-500" />
                                                        Add Standards
                                                    </button>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="bg-white shadow-md rounded-lg overflow-hidden">
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-gray-300">
                                        <th className="text-center w-1/12">
                                            <Checkbox
                                                checked={selectAll}
                                                onChange={handleSelectAll}
                                            />
                                        </th>
                                        <th className="text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-1/12">Sl.No</th>
                                        <th className="text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-4/12">Term Exam Name</th>
                                        <th className="text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-4/12">Status</th>
                                        <th className="text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-2/12">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {filteredTermExams.map((exam, index) => (
                                        <tr
                                            key={exam.id}
                                            className="cursor-pointer hover:bg-gray-50"
                                            onClick={() => handleRowClick(exam)}
                                        >
                                            <td className="text-center py-3">
                                                <Checkbox
                                                    checked={selectedExams.includes(exam.id)}
                                                    onChange={() => handleSelectExam(exam.id)}
                                                />
                                            </td>
                                            <td className="text-center py-3">
                                                <div className="text-sm font-medium text-gray-900">{index + 1}</div>
                                            </td>
                                            <td className="text-center py-3">
                                                <div className="text-sm font-medium text-gray-900">{exam.Name}</div>
                                            </td>
                                            <td className="text-center py-3">
                                                <span className={`px-3 py-1 rounded-full text-xs ${exam.Status === 'publish'
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-blue-100 text-blue-800'
                                                    }`}>
                                                    {exam.Status}
                                                </span>
                                            </td>
                                            <td className="text-center py-3">
                                                <div className="flex justify-center gap-2">
                                                    <IconButton
                                                        aria-label="edit"
                                                        onClick={() => handleEdit(exam)}
                                                    >
                                                        <Pencil size={20} className="text-blue-500" />
                                                    </IconButton>
                                                    <IconButton
                                                        aria-label="delete"
                                                        onClick={() => handleDelete(exam.id)}
                                                    >
                                                        <Trash2 size={20} className="text-red-500" />
                                                    </IconButton>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )
                )}
            </div>

            <div className="fixed bottom-10 right-16 flex items-center space-x-2">
                {!showStandards && (
                    <button
                        className="bg-green-500 text-white p-2 rounded-full shadow-lg relative group hover:bg-green-600"
                        onClick={() => {
                            setEditingExam(null);
                            setOpenModal(true);
                        }}
                    >
                        <PlusCircle size={34} />
                        <span className="absolute left-[-140px] top-1/2 transform -translate-y-1/2 bg-white text-black text-sm py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow">
                            Create Term Exam
                        </span>
                    </button>
                )}
            </div>

            <Modal open={openModal} onClose={() => {
                setOpenModal(false);
                setEditingExam(null);
            }}>
                <Box sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 500,
                    bgcolor: 'background.paper',
                    boxShadow: 24,
                    p: 4,
                    borderRadius: 2
                }}>
                    {academicYears.length > 0 ? (
                        <CreateTermExams
                            initialData={editingExam}
                            academicYears={academicYears}
                            onSave={handleSave}
                            onCancel={() => {
                                setOpenModal(false);
                                setEditingExam(null);
                            }}
                        />
                    ) : (
                        <div className="p-4 text-center">
                            <p className="text-red-500">No academic years available</p>
                            <button
                                className="mt-4 bg-gray-200 px-4 py-2 rounded"
                                onClick={() => {
                                    setOpenModal(false);
                                    setEditingExam(null);
                                }}
                            >
                                Close
                            </button>
                        </div>
                    )}
                </Box>
            </Modal>

            <Modal
                open={standardsModalOpen}
                onClose={() => setStandardsModalOpen(false)}
                style={{
                    position: 'absolute',
                    top: standardsModalAnchor ? standardsModalAnchor.getBoundingClientRect().bottom + window.scrollY : 0,
                    left: standardsModalAnchor ? standardsModalAnchor.getBoundingClientRect().left + window.scrollX : 0,
                }}
            >
                <Box sx={{
                    width: 400,
                    bgcolor: 'background.paper',
                    boxShadow: 24,
                    p: 2,
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-30%, -50%)',
                    borderRadius: 2,
                    maxHeight: '400px',
                    overflowY: 'auto'
                }}>
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-semibold">Available Standards</h2>
                        <IconButton onClick={() => setStandardsModalOpen(false)} size="small">
                            <X size={20} />
                        </IconButton>
                    </div>
                    {availableStandards.length === 0 ? (
                        <p className="text-center text-gray-500 py-4">No standards available</p>
                    ) : (
                        <div className="space-y-2">
                            {availableStandards.map((standard) => (
                                <div
                                    key={standard.ID}
                                    className="flex items-center justify-between p-2 hover:bg-gray-50 rounded"
                                >
                                    <span>{standard.Name}</span>
                                    <button
                                        className="text-blue-600 hover:text-blue-800 text-sm"
                                        onClick={() => handleStandardSelect(standard)}
                                    >
                                        Add
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </Box>
            </Modal>

            <Modal
                open={gradeSelectionOpen}
                onClose={() => {
                    setGradeSelectionOpen(false);
                    setSelectedStandard(null);
                }}
            >
                <Box sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 400,
                    bgcolor: 'background.paper',
                    boxShadow: 24,
                    p: 2,
                    borderRadius: 2,
                }}>
                    <div className="p-4">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-semibold">Select Grade Type</h2>
                            <IconButton
                                onClick={() => {
                                    setGradeSelectionOpen(false);
                                    setSelectedStandard(null);
                                }}
                                size="small"
                            >
                                <X size={20} />
                            </IconButton>
                        </div>
                        <div className="space-y-2">
                            {grades.length === 0 ? (
                                <p className="text-center text-gray-500 py-4">No grade categories available</p>
                            ) : (
                                grades.map((grade) => (
                                    <button
                                        key={grade.id}
                                        className="w-full p-2 text-left hover:bg-gray-50 rounded transition-colors"
                                        onClick={() => handleGradeSubmit(grade.id)}
                                    >
                                        {grade.name}
                                    </button>
                                ))
                            )}
                        </div>
                    </div>
                </Box>
            </Modal>

            <SnackbarComponent
                open={snackbar.open}
                message={snackbar.message}
                severity={snackbar.severity}
                position={snackbar.position}
                onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
            />

        </div>
    );
};

export default ListTermExams;
