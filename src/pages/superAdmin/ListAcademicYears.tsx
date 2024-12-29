import React, { useEffect, useState } from 'react';
import { Checkbox, IconButton, Modal, Box } from "@mui/material";
import { Trash2, PlusCircle } from "lucide-react";
import Togglebar from '../../components/Togglebar';
import SnackbarComponent from '../../components/SnackbarComponent';
import { getAcademicYears, createAcademicYear, updateAcademicYear, deleteAcademicYear, getTeachingStaff } from '../../api/superAdmin';
import { useSchoolContext } from '../../contexts/SchoolContext';
import CreateAcademicYear from './CreateAcademicYear';

interface AcademicYear {
    id: number;
    name: string;
    isCurrent: boolean;
}

interface TeachingStaff {
    ID: number;
    name: string;
    subject: string;
}

const ListAcademicYears: React.FC = () => {
    const { schoolInfo } = useSchoolContext();
    const [academicYears, setAcademicYears] = useState<AcademicYear[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedYears, setSelectedYears] = useState<number[]>([]);
    const [selectAll, setSelectAll] = useState<boolean>(false);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success' as 'success' | 'error',
        position: { vertical: 'top' as const, horizontal: 'center' as const }
    });
    const [openModal, setOpenModal] = useState<boolean>(false);
    const [editingYear, setEditingYear] = useState<AcademicYear | null>(null);
    const [teachingStaff, setTeachingStaff] = useState<TeachingStaff[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                if (!schoolInfo.schoolPrefix) {
                    throw new Error('School prefix not found');
                }
                const [academicYearsRes, teachingStaffRes] = await Promise.all([
                    getAcademicYears(schoolInfo.schoolPrefix),
                    getTeachingStaff(schoolInfo.schoolPrefix)
                ]);

                if (academicYearsRes.status === true) {
                    setAcademicYears(academicYearsRes.data);
                }

                if (teachingStaffRes.status === true) {
                    setTeachingStaff(teachingStaffRes.data);
                }
            } catch (error) {
                setError('Failed to load data. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [schoolInfo.schoolPrefix]);

    const handleCloseSnackbar = () => {
        setSnackbar(prev => ({ ...prev, open: false }));
    };

    const handleSelectAll = () => {
        setSelectedYears(selectAll ? [] : academicYears.map(year => year.id));
        setSelectAll(!selectAll);
    };

    const handleSelectYear = (id: number) => {
        setSelectedYears(prev =>
            prev.includes(id) ? prev.filter(selectedId => selectedId !== id) : [...prev, id]
        );
    };

    const filteredYears = academicYears.filter(year =>
        year.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleOpenModal = (year: AcademicYear | null) => {
        setEditingYear(year);
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setEditingYear(null);
        setOpenModal(false);
    };

    const handleSave = async (name: string, isCurrent: boolean) => {
        try {
            if (!schoolInfo.schoolPrefix) {
                throw new Error('School prefix not found');
            }

            if (editingYear) {
                const response = await updateAcademicYear(
                    editingYear.id,
                    { name, isCurrent },
                    schoolInfo.schoolPrefix
                );
                if (response.status === true) {
                    setAcademicYears(prevYears => prevYears.map(year => {
                        if (isCurrent) {
                            return year.id === editingYear.id
                                ? { ...year, name, isCurrent: true }
                                : { ...year, isCurrent: false };
                        } else {
                            return year.id === editingYear.id
                                ? { ...year, name, isCurrent }
                                : year;
                        }
                    }));

                    setSnackbar({
                        open: true,
                        message: 'Academic year updated successfully!',
                        severity: 'success',
                        position: { vertical: 'top', horizontal: 'center' }
                    });
                }
            } else {
                const response = await createAcademicYear({ name, isCurrent }, schoolInfo.schoolPrefix);
                if (response.status === true) {
                    const newYear = {
                        id: response.data.id,
                        name,
                        isCurrent
                    };

                    setAcademicYears(prevYears => {
                        if (isCurrent) {
                            return [...prevYears.map(year => ({ ...year, isCurrent: false })), newYear];
                        } else {
                            return [...prevYears, newYear];
                        }
                    });

                    setSnackbar({
                        open: true,
                        message: 'Academic year created successfully!',
                        severity: 'success',
                        position: { vertical: 'top', horizontal: 'center' }
                    });
                }
            }
            handleCloseModal();
        } catch (error: any) {
            let errorMessage = 'Failed to save academic year';

            if (error.response?.data?.resp_code === "DATA ALREADY_EXIST") {
                errorMessage = "This academic year already exists";
            }

            setSnackbar({
                open: true,
                message: errorMessage,
                severity: 'error',
                position: { vertical: 'top', horizontal: 'center' }
            });
        }
    };

    const handleDelete = async (id: number) => {
        try {
            if (!schoolInfo.schoolPrefix) {
                throw new Error('School prefix not found');
            }
            const response = await deleteAcademicYear(id, schoolInfo.schoolPrefix);
            if (response.status === true) {
                setAcademicYears(years => years.filter(year => year.id !== id));
                setSelectedYears(selected => selected.filter(yearId => yearId !== id));
                setSnackbar({
                    open: true,
                    message: 'Academic year deleted successfully!',
                    severity: 'success',
                    position: { vertical: 'top', horizontal: 'center' }
                });
            }
        } catch (error: any) {
            let errorMessage = 'Failed to delete academic year';

            if (error.response?.data?.resp_code === "RECORD_IN_USE") {
                errorMessage = "Cannot delete this academic year as it is being used by classes";
            }

            setSnackbar({
                open: true,
                message: errorMessage,
                severity: 'error',
                position: { vertical: 'top', horizontal: 'center' }
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
                itemCount={academicYears.length}
                onSelectAll={handleSelectAll}
                selectedCount={selectedYears.length}
            />

            {loading ? (
                <div className="rounded-lg p-8 text-center">
                    <p className="text-xl font-semibold">Loading academic years...</p>
                </div>
            ) : error ? (
                <div className="rounded-lg p-8 text-center">
                    <p className="text-xl font-semibold text-red-500">{error}</p>
                </div>
            ) : academicYears.length === 0 ? (
                <div className="rounded-lg p-8 text-center">
                    <p className="text-xl font-semibold mb-4">No academic years found.</p>
                </div>
            ) : filteredYears.length === 0 ? (
                <div className="rounded-lg p-8 text-center">
                    <p className="text-lg font-semibold">No academic years match your search criteria.</p>
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
                                <th className="text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-3/12">Academic Year</th>
                                <th className="text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-1/12">Current</th>
                                <th className="text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-3/12">Teaching Staff</th>
                                <th className="text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-2/12">Subject</th>
                                <th className="text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-1/12">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredYears.map((year, index) => (
                                <tr
                                    key={year.id}
                                    className="cursor-pointer hover:bg-gray-50"
                                    onClick={() => handleOpenModal(year)}
                                >
                                    <td className="text-center">
                                        <Checkbox
                                            checked={selectedYears.includes(year.id)}
                                            onChange={() => handleSelectYear(year.id)}
                                            onClick={(e) => e.stopPropagation()}
                                        />
                                    </td>
                                    <td className="text-center">
                                        <div className="text-sm font-medium text-gray-900">{index + 1}</div>
                                    </td>
                                    <td className="text-center">
                                        <div className="text-sm font-medium text-gray-900">{year.name}</div>
                                    </td>
                                    <td className="text-center">
                                        <div className="text-sm font-medium text-gray-900">
                                            {year.isCurrent ? 'Yes' : 'No'}
                                        </div>
                                    </td>
                                    <td className="text-center">
                                        <div className="text-sm font-medium text-gray-900">
                                            {teachingStaff.map(staff => staff.name).join(', ')}
                                        </div>
                                    </td>
                                    <td className="text-center">
                                        <div className="text-sm font-medium text-gray-900">
                                            {teachingStaff.map(staff => staff.subject).join(', ')}
                                        </div>
                                    </td>
                                    <td className="text-center">
                                        <IconButton
                                            aria-label="delete"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDelete(year.id);
                                            }}
                                        >
                                            <Trash2 size={20} className="text-red-500" />
                                        </IconButton>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            <div className="fixed bottom-10 right-16 flex items-center space-x-2">
                <button
                    className="bg-green-500 text-white p-2 rounded-full shadow-lg relative group hover:bg-green-600"
                    onClick={() => handleOpenModal(null)}
                >
                    <PlusCircle size={34} />
                    <span className="absolute left-[-110px] top-1/2 transform -translate-y-1/2 bg-white text-black text-sm py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow">
                        Create New Academic Year
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
                    <CreateAcademicYear
                        initialData={editingYear || undefined}
                        onSave={handleSave}
                        onCancel={handleCloseModal}
                    />
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

export default ListAcademicYears;
