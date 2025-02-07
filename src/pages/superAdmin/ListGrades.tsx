import React, { useState, useEffect } from 'react';
import { Checkbox, Modal, Box, IconButton } from "@mui/material";
import { PlusCircle, Trash2, Edit2 } from "lucide-react";
import Togglebar from '../../components/Togglebar';
import CreateGrade from './CreateGrade';
import SnackbarComponent from '../../components/SnackbarComponent';
import { createGradeCategory, getGradeCategories, deleteGradeCategory, updateGradeCategory, getGradeBoundaries, createGradeBoundary, deleteGradeBoundary, updateGradeBoundary } from '../../api/superAdmin';
import CreateBoundary from './CreateBoundary';
import { Grade, GradeSystem, GradeSnackbar } from '../../types/Types';
import { useSelector } from 'react-redux';

const ListGrades: React.FC = () => {
    const [openModal, setOpenModal] = useState<boolean>(false);
    const [editingGrade, setEditingGrade] = useState<Grade | null>(null);
    const [grades, setGrades] = useState<Grade[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedGrades, setSelectedGrades] = useState<number[]>([]);
    // const [selectAll, setSelectAll] = useState<boolean>(false);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [snackbar, setSnackbar] = useState<GradeSnackbar>({
        open: false,
        message: '',
        severity: 'success' as 'success' | 'error',
        position: { vertical: 'top' as const, horizontal: 'center' as const }
    });
    const [selectedGrade, setSelectedGrade] = useState<Grade | null>(null);
    const [showBoundaries, setShowBoundaries] = useState(false);
    const [boundaries, setBoundaries] = useState<GradeSystem[]>([]);
    const [editingBoundary, setEditingBoundary] = useState<GradeSystem | null>(null);

    const { staffInfo } = useSelector((state: any) => state.staffInfo);
    const hasSchoolAdminPrivilege = staffInfo?.specialPrivileges?.some(
        (privilege: any) => privilege.privilege === "schoolAdmin"
    );

    useEffect(() => {
        fetchGrades();
    }, []);

    const fetchGrades = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await getGradeCategories(
                hasSchoolAdminPrivilege ? staffInfo?.schoolCode : undefined
            );
            if (response.status === true) {
                setGrades(response.data);
            } else {
                throw new Error('Failed to fetch grades');
            }
        } catch (error) {
            setError('Failed to load grades. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleCloseSnackbar = () => {
        setSnackbar(prev => ({ ...prev, open: false }));
    };

    const handleOpenModal = (grade: Grade | null) => {
        setEditingGrade(grade);
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setEditingGrade(null);
        setEditingBoundary(null);
        setOpenModal(false);
    };

    const handleSave = async (name: string) => {
        try {
            if (editingGrade) {
                const response = await updateGradeCategory(
                    editingGrade.id,
                    name,
                    hasSchoolAdminPrivilege ? staffInfo?.schoolCode : undefined
                );
                if (response.status === true) {
                    setGrades(prevGrades => prevGrades.map(grade =>
                        grade.id === editingGrade.id ? { ...grade, name } : grade
                    ));
                    setSnackbar({
                        open: true,
                        message: 'Grade category updated successfully!',
                        severity: 'success',
                        position: { vertical: 'top', horizontal: 'center' }
                    });
                } else {
                    throw new Error(response.message || 'Failed to update grade category');
                }
            } else {
                const response = await createGradeCategory(
                    name,
                    hasSchoolAdminPrivilege ? staffInfo?.schoolCode : undefined
                );
                if (response.status === true) {
                    await fetchGrades();
                    setSnackbar({
                        open: true,
                        message: 'Grade category created successfully!',
                        severity: 'success',
                        position: { vertical: 'top', horizontal: 'center' }
                    });
                } else {
                    throw new Error(response.message || 'Failed to create grade category');
                }
            }
            handleCloseModal();
        } catch (error: any) {
            setSnackbar({
                open: true,
                message: error.response?.data?.error || error.message || 'Failed to save grade',
                severity: 'error',
                position: { vertical: 'top', horizontal: 'center' }
            });
        }
    };

    const handleDelete = async (id: number) => {
        try {
            const response = await deleteGradeCategory(
                id,
                hasSchoolAdminPrivilege ? staffInfo?.schoolCode : undefined
            );
            if (response.status === true) {
                setGrades(grades.filter(grade => grade.id !== id));
                setSelectedGrades(selectedGrades.filter(gradeId => gradeId !== id));
                setSnackbar({
                    open: true,
                    message: 'Grade category deleted successfully!',
                    severity: 'success',
                    position: { vertical: 'top', horizontal: 'center' }
                });
            }
        } catch (error: any) {
            setSnackbar({
                open: true,
                message: error.response?.data?.error || 'Failed to delete grade category',
                severity: 'error',
                position: { vertical: 'top', horizontal: 'center' }
            });
        }
    };

    // const handleSelectAll = () => {
    //     setSelectedGrades(selectAll ? [] : grades.map(g => g.id));
    //     setSelectAll(!selectAll);
    // };

    const handleSelectGrade = (id: number) => {
        if (!grades) return;
        setSelectedGrades(prev =>
            prev.includes(id) ? prev.filter(selectedId => selectedId !== id) : [...prev, id]
        );
    };

    const filteredGrades = grades?.filter(grade =>
        grade?.name?.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

    const handleGradeClick = async (grade: Grade) => {
        setSelectedGrade(grade);
        setShowBoundaries(true);
        try {
            const response = await getGradeBoundaries(
                grade.id,
                hasSchoolAdminPrivilege ? staffInfo?.schoolCode : undefined
            );
            if (response.status && response.data) {
                const boundaryData = Array.isArray(response.data) ? response.data : [];
                const formattedBoundaries = boundaryData.map((boundary: any) => ({
                    id: boundary.id || boundary.ID,
                    category_id: boundary.category_id,
                    base_percentage: boundary.base_percentage,
                    grade_label: boundary.grade_label,
                    is_failed: boundary.is_failed
                }));
                setBoundaries(formattedBoundaries);
            }
        } catch (error) {
            console.error('Error fetching boundaries:', error);
            setBoundaries([]);
            setSnackbar({
                open: true,
                message: 'Failed to load grade boundaries',
                severity: 'error',
                position: { vertical: 'top', horizontal: 'center' }
            });
        }
    };

    const handleBackToGrades = () => {
        setSelectedGrade(null);
        setShowBoundaries(false);
    };

    const handleSaveBoundary = async (boundaryData: {
        category_id: number;
        base_percentage: number;
        grade_label: string;
        id?: number;
    }) => {
        try {
            let response;
            if (editingBoundary) {
                response = await updateGradeBoundary({
                    id: editingBoundary.id,
                    category_id: selectedGrade?.id || 0,
                    base_percentage: boundaryData.base_percentage,
                    grade_label: boundaryData.grade_label,
                    is_failed: editingBoundary.is_failed || false
                }, hasSchoolAdminPrivilege ? staffInfo?.schoolCode : undefined);
            } else {
                response = await createGradeBoundary({
                    ...boundaryData,
                    category_id: selectedGrade?.id || 0
                }, hasSchoolAdminPrivilege ? staffInfo?.schoolCode : undefined);
            }

            if (response.status) {
                setSnackbar({
                    open: true,
                    message: editingBoundary
                        ? 'Grade boundary updated successfully!'
                        : 'Grade boundary created successfully!',
                    severity: 'success',
                    position: { vertical: 'top', horizontal: 'center' }
                });
                handleCloseModal();

                if (selectedGrade) {
                    const boundariesResponse = await getGradeBoundaries(
                        selectedGrade.id,
                        hasSchoolAdminPrivilege ? staffInfo?.schoolCode : undefined
                    );
                    if (boundariesResponse.status && boundariesResponse.data) {
                        const formattedBoundaries = boundariesResponse.data.map((boundary: any) => ({
                            id: boundary.id || boundary.ID,
                            category_id: boundary.category_id,
                            base_percentage: boundary.base_percentage,
                            grade_label: boundary.grade_label,
                            is_failed: boundary.is_failed
                        }));
                        setBoundaries(formattedBoundaries);
                    }
                }
            }
        } catch (error: any) {
            setSnackbar({
                open: true,
                message: error.message || 'Failed to save boundary',
                severity: 'error',
                position: { vertical: 'top', horizontal: 'center' }
            });
        }
    };

    const handleDeleteBoundary = async (boundaryId: number) => {
        try {
            const response = await deleteGradeBoundary(
                boundaryId,
                hasSchoolAdminPrivilege ? staffInfo?.schoolCode : undefined
            );
            if (response.status) {
                setBoundaries(prev => prev.filter(boundary => boundary.id !== boundaryId));
                setSnackbar({
                    open: true,
                    message: 'Grade boundary deleted successfully!',
                    severity: 'success',
                    position: { vertical: 'top', horizontal: 'center' }
                });
            }
        } catch (error: any) {
            setSnackbar({
                open: true,
                message: error.response?.data?.error || 'Failed to delete grade boundary',
                severity: 'error',
                position: { vertical: 'top', horizontal: 'center' }
            });
        }
    };

    const handleEditBoundary = (boundary: GradeSystem) => {
        setEditingBoundary(boundary);
        setOpenModal(true);
    };

    return (
        <div className="min-h-screen bg-gray-200 p-8 pt-5 relative">
            {!showBoundaries ? (
                <>
                    <Togglebar
                        searchTerm={searchTerm}
                        setSearchTerm={setSearchTerm}
                        viewMode={viewMode}
                        setViewMode={setViewMode}
                        itemCount={grades?.length || 0}
                    />

                    {loading ? (
                        <div className="rounded-lg p-8 text-center">
                            <p className="text-xl font-semibold">Loading grades...</p>
                        </div>
                    ) : error ? (
                        <div className="rounded-lg p-8 text-center">
                            <p className="text-xl font-semibold text-red-500">{error}</p>
                        </div>
                    ) : !grades || grades.length === 0 ? (
                        <div className="rounded-lg p-8 text-center">
                            <p className="text-xl font-semibold mb-4">No grades found.</p>
                            <p className="text-gray-600">Click the "+" button to create a new grade.</p>
                        </div>
                    ) : filteredGrades.length === 0 ? (
                        <div className="rounded-lg p-8 text-center">
                            <p className="text-lg font-semibold">No grades match your search criteria.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {filteredGrades.map((grade) => (
                                <div
                                    key={grade.id}
                                    className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer transform transition duration-300 hover:scale-105 hover:shadow-xl"
                                    onClick={() => handleGradeClick(grade)}
                                >
                                    <div className="p-6">
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="flex items-center space-x-3">
                                                <div className="bg-[#308369] rounded-full p-2">
                                                    <span className="text-white font-bold">{grade.name.charAt(0)}</span>
                                                </div>
                                                <div>
                                                    <h3 className="text-lg font-semibold text-gray-900">{grade.name}</h3>
                                                </div>
                                            </div>
                                            <Checkbox
                                                checked={selectedGrades.includes(grade.id)}
                                                onChange={() => handleSelectGrade(grade.id)}
                                                onClick={(e) => e.stopPropagation()}
                                            />
                                        </div>

                                        <div className="mt-4 pt-4 border-t border-gray-200">
                                            <div className="flex items-center justify-end">
                                                <div className="flex gap-2">
                                                    <IconButton
                                                        aria-label="edit"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleOpenModal(grade);
                                                        }}
                                                        size="small"
                                                    >
                                                        <Edit2 size={16} className="text-blue-500" />
                                                    </IconButton>
                                                    <IconButton
                                                        aria-label="delete"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleDelete(grade.id);
                                                        }}
                                                        size="small"
                                                    >
                                                        <Trash2 size={16} className="text-red-500" />
                                                    </IconButton>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </>
            ) : (
                <div>
                    <div className="flex items-center mb-6">
                        <button
                            onClick={handleBackToGrades}
                            className="mr-4 text-gray-600 hover:text-gray-800"
                        >
                            ←
                        </button>
                        <h2 className="text-xl font-bold">
                            Boundaries for {selectedGrade?.name}
                        </h2>
                    </div>

                    <div className="rounded-lg  p-6">
                        {boundaries.length === 0 ? (
                            <div className="text-center py-8">
                                <p className="text-xl font-semibold mb-4">No boundaries found for this grade.</p>
                                <p className="text-gray-600">Click the "+" button to create a new boundary.</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="bg-gray-50">
                                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Grade Label
                                            </th>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Base Percentage
                                            </th>
                                            <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {boundaries.map((boundary) => (
                                            <tr key={boundary.grade_label} className="hover:bg-gray-50">
                                                <td className="px-4 py-3">
                                                    <span className="font-medium">{boundary.grade_label}</span>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <span className="px-2 py-1 text-sm bg-blue-100 text-blue-800 rounded-full">
                                                        {boundary.base_percentage}%
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3 text-center">
                                                    <div className="flex justify-center gap-2">
                                                        <IconButton
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleEditBoundary(boundary);
                                                            }}
                                                        >
                                                            <Edit2 size={18} className="text-blue-500" />
                                                        </IconButton>
                                                        <IconButton
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleDeleteBoundary(boundary.id);
                                                            }}
                                                        >
                                                            <Trash2 size={18} className="text-red-500" />
                                                        </IconButton>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            )}

            <div className="fixed bottom-10 right-16 flex items-center space-x-2">
                <button
                    className="bg-green-500 text-white p-2 rounded-full shadow-lg relative group hover:bg-green-600"
                    onClick={() => handleOpenModal(null)}
                >
                    <PlusCircle size={34} />
                    <span className="absolute left-[-140px] top-1/2 transform -translate-y-1/2 bg-white text-black text-sm py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow">
                        Create New Grade
                    </span>
                </button>
            </div>

            <Modal
                open={openModal}
                onClose={handleCloseModal}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 400,
                    bgcolor: 'background.paper',
                    boxShadow: 24,
                    p: 3,
                    borderRadius: 2,
                }}>
                    {selectedGrade ? (
                        <CreateBoundary
                            gradeId={selectedGrade.id}
                            initialData={editingBoundary || undefined}
                            onSave={handleSaveBoundary}
                            onCancel={handleCloseModal}
                        />
                    ) : (
                        <CreateGrade
                            initialData={editingGrade ? { name: editingGrade.name } : undefined}
                            onSave={handleSave}
                            onCancel={handleCloseModal}
                        />
                    )}
                </Box>
            </Modal>

            <SnackbarComponent
                open={snackbar.open}
                message={snackbar.message}
                severity={snackbar.severity}
                position={snackbar.position}
                onClose={handleCloseSnackbar}
            />
        </div>
    );
};

export default ListGrades; 