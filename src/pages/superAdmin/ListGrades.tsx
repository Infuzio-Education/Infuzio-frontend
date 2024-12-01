import React, { useState, useEffect } from 'react';
import { Modal, Box, IconButton, Checkbox } from '@mui/material';
import { PlusCircle, Trash2, Edit2 } from 'lucide-react';
import ListControls from '../../components/ListControls';
import {
    createGradeCategory,
    getGradeCategories,
    createGradeBoundary,
    getGradeBoundaries,
    deleteGradeCategory,
    updateGradeCategory,
    deleteGradeBoundary,
    updateGradeBoundary
} from '../../api/superAdmin';
import SnackbarComponent from '../../components/SnackbarComponent';

interface GradeCategory {
    id: number;
    name: string;
}

interface GradeBoundary {
    id: number;
    category_id: number;
    base_percentage: number;
    grade_label: string;
}

const ListGrades: React.FC = () => {
    const [categories, setCategories] = useState<GradeCategory[]>([]);
    const [boundaries, setBoundaries] = useState<GradeBoundary[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [selectedItems, setSelectedItems] = useState<number[]>([]);
    const [selectAll, setSelectAll] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
    const [modalType, setModalType] = useState<'category' | 'boundary'>('category');
    const [newCategory, setNewCategory] = useState('');
    const [newBoundary, setNewBoundary] = useState({
        category_id: 0,
        base_percentage: 0,
        grade_label: ''
    });
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success' as 'success' | 'error',
        position: { vertical: 'top' as const, horizontal: 'center' as const }
    });
    const [editingItem, setEditingItem] = useState<{
        type: 'category' | 'boundary';
        id: number;
        data: any;
    } | null>(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [categoriesRes, boundariesRes] = await Promise.all([
                getGradeCategories(),
                getGradeBoundaries()
            ]);
            if (categoriesRes.status) setCategories(categoriesRes.data || []);
            if (boundariesRes.status) setBoundaries(boundariesRes.data || []);
        } catch (error) {
            setSnackbar({
                open: true,
                message: 'Failed to load grades data',
                severity: 'error',
                position: { vertical: 'top', horizontal: 'center' }
            });
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (type: 'category' | 'boundary') => {
        setModalType(type);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setEditingItem(null);
        setNewCategory('');
        setNewBoundary({
            category_id: 0,
            base_percentage: 0,
            grade_label: ''
        });
    };

    const handleSave = async () => {
        try {
            if (modalType === 'category') {
                const response = editingItem
                    ? await updateGradeCategory(editingItem.id, newCategory)
                    : await createGradeCategory(newCategory);

                if (response.status) {
                    setSnackbar({
                        open: true,
                        message: `Grade category ${editingItem ? 'updated' : 'created'} successfully`,
                        severity: 'success',
                        position: { vertical: 'top', horizontal: 'center' }
                    });
                }
            } else {
                const boundaryData = editingItem
                    ? { ...newBoundary, id: editingItem.id }
                    : newBoundary;

                const response = editingItem
                    ? await updateGradeBoundary(boundaryData)
                    : await createGradeBoundary(newBoundary);

                if (response.status) {
                    setSnackbar({
                        open: true,
                        message: `Grade boundary ${editingItem ? 'updated' : 'created'} successfully`,
                        severity: 'success',
                        position: { vertical: 'top', horizontal: 'center' }
                    });
                }
            }
            await fetchData();
            handleCloseModal();
        } catch (error) {
            setSnackbar({
                open: true,
                message: `Failed to ${editingItem ? 'update' : 'create'} grade ${modalType}`,
                severity: 'error',
                position: { vertical: 'top', horizontal: 'center' }
            });
        }
    };

    const handleSelectAll = () => {
        if (selectAll) {
            setSelectedItems([]);
        } else {
            const allIds = [...categories, ...boundaries].map(item => item.id);
            setSelectedItems(allIds);
        }
        setSelectAll(!selectAll);
    };

    const handleSelect = (id: number) => {
        setSelectedItems(prev =>
            prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
        );
    };

    const handleDelete = async (type: 'category' | 'boundary', id: number) => {
        try {
            const response = await (type === 'category'
                ? deleteGradeCategory(id)
                : deleteGradeBoundary(id)
            );

            if (response.status) {
                setSnackbar({
                    open: true,
                    message: `Grade ${type} deleted successfully`,
                    severity: 'success',
                    position: { vertical: 'top', horizontal: 'center' }
                });
                await fetchData();
            }
        } catch (error) {
            setSnackbar({
                open: true,
                message: `Failed to delete grade ${type}`,
                severity: 'error',
                position: { vertical: 'top', horizontal: 'center' }
            });
        }
    };

    const handleEdit = (type: 'category' | 'boundary', id: number, data: any) => {
        setEditingItem({ type, id, data });
        setModalType(type);
        if (type === 'category') {
            setNewCategory(data.name);
        } else {
            setNewBoundary({
                category_id: data.category_id,
                base_percentage: data.base_percentage,
                grade_label: data.grade_label
            });
        }
        setShowModal(true);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-200 p-8 pt-5 flex items-center justify-center">
                <p className="text-xl font-semibold">Loading grades...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-200 p-8 pt-5">
            {/* Header Section */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-800 mb-2">Grade Management</h1>
                <p className="text-gray-600">Manage grade categories and their boundaries</p>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">Total Categories</p>
                            <h3 className="text-2xl font-bold text-gray-800">{categories.length}</h3>
                        </div>
                        <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                            <div className="text-emerald-600">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">Total Boundaries</p>
                            <h3 className="text-2xl font-bold text-gray-800">{boundaries.length}</h3>
                        </div>
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <div className="text-blue-600">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">Average Percentage</p>
                            <h3 className="text-2xl font-bold text-gray-800">
                                {boundaries.length > 0
                                    ? Math.round(boundaries.reduce((acc, curr) => acc + curr.base_percentage, 0) / boundaries.length)
                                    : 0}%
                            </h3>
                        </div>
                        <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                            <div className="text-purple-600">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 14.25v2.25m3-4.5v4.5m3-6.75v6.75m3-9v9M6 20.25h12A2.25 2.25 0 0020.25 18V6A2.25 2.25 0 0018 3.75H6A2.25 2.25 0 003.75 6v12A2.25 2.25 0 006 20.25z" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Categories Section */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold text-gray-800">Grade Categories</h2>
                    <button
                        onClick={() => handleOpenModal('category')}
                        className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 
                        transition-colors flex items-center gap-2"
                    >
                        <PlusCircle size={20} />
                        Add Category
                    </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {categories.map((category) => (
                        <div key={category.id}
                            className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                        >
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="font-medium text-gray-800">{category.name}</h3>
                                    <p className="text-sm text-gray-500 mt-1">
                                        {boundaries.filter(b => b.category_id === category.id).length} boundaries
                                    </p>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleEdit('category', category.id, category)}
                                        className="p-1 hover:bg-gray-100 rounded-full"
                                    >
                                        <Edit2 size={16} className="text-blue-500" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete('category', category.id)}
                                        className="p-1 hover:bg-gray-100 rounded-full"
                                    >
                                        <Trash2 size={16} className="text-red-500" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Boundaries Section */}
            <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold text-gray-800">Grade Boundaries</h2>
                    <button
                        onClick={() => handleOpenModal('boundary')}
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 
                        transition-colors flex items-center gap-2"
                    >
                        <PlusCircle size={20} />
                        Add Boundary
                    </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {boundaries.map((boundary) => (
                        <div key={boundary.id}
                            className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                        >
                            <div className="flex justify-between items-start">
                                <div>
                                    <div className="flex items-center gap-2">
                                        <h3 className="font-medium text-gray-800">Grade {boundary.grade_label}</h3>
                                        <span className="px-2 py-1 bg-blue-50 text-blue-600 text-xs rounded-full">
                                            {boundary.base_percentage}%
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-500 mt-1">
                                        Category: {categories.find(c => c.id === boundary.category_id)?.name}
                                    </p>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleEdit('boundary', boundary.id, boundary)}
                                        className="p-1 hover:bg-gray-100 rounded-full"
                                    >
                                        <Edit2 size={16} className="text-blue-500" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete('boundary', boundary.id)}
                                        className="p-1 hover:bg-gray-100 rounded-full"
                                    >
                                        <Trash2 size={16} className="text-red-500" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Modal */}
            <Modal open={showModal} onClose={handleCloseModal}>
                <Box sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 400,
                    bgcolor: 'background.paper',
                    boxShadow: 24,
                    p: 4,
                    borderRadius: 2
                }}>
                    <h2 className="text-xl font-semibold mb-4">
                        Add New Grade {modalType === 'category' ? 'Category' : 'Boundary'}
                    </h2>
                    {modalType === 'category' ? (
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Category Name
                                </label>
                                <input
                                    type="text"
                                    value={newCategory}
                                    onChange={(e) => setNewCategory(e.target.value)}
                                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 
                                    focus:ring-emerald-500 focus:border-emerald-500"
                                    placeholder="Enter category name"
                                />
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Category
                                </label>
                                <select
                                    value={newBoundary.category_id}
                                    onChange={(e) => setNewBoundary({
                                        ...newBoundary,
                                        category_id: Number(e.target.value)
                                    })}
                                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 
                                    focus:ring-emerald-500 focus:border-emerald-500"
                                >
                                    <option value="">Select Category</option>
                                    {categories.map((category) => (
                                        <option key={category.id} value={category.id}>
                                            {category.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Base Percentage
                                </label>
                                <input
                                    type="number"
                                    value={newBoundary.base_percentage}
                                    onChange={(e) => setNewBoundary({
                                        ...newBoundary,
                                        base_percentage: Number(e.target.value)
                                    })}
                                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 
                                    focus:ring-emerald-500 focus:border-emerald-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Grade Label
                                </label>
                                <input
                                    type="text"
                                    value={newBoundary.grade_label}
                                    onChange={(e) => setNewBoundary({
                                        ...newBoundary,
                                        grade_label: e.target.value
                                    })}
                                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 
                                    focus:ring-emerald-500 focus:border-emerald-500"
                                />
                            </div>
                        </div>
                    )}
                    <div className="mt-6 flex justify-end gap-3">
                        <button
                            onClick={handleCloseModal}
                            className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSave}
                            className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600"
                        >
                            Save
                        </button>
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

export default ListGrades; 