import { useEffect, useState } from 'react';
import { CircularProgress, Paper, Modal, Box, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { PlusCircle, Calendar, Trash2 } from 'lucide-react';
import { deleteTimetable, getTimetable, getTimetableByClass } from '../../api/superAdmin';
import EmptyState from '../../components/EmptyState';
import { Button, message } from 'antd';
import { Timetable } from '../../types/Types';
import Togglebar from '../../components/Togglebar';
import CreateTimetable from './CreateTimetable';
import { DAYS_MAP } from '../../utils/dayConstant';

const ListTimetable = () => {
    const [timetables, setTimetables] = useState<Timetable[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [openModal, setOpenModal] = useState<boolean>(false);
    const [, setEditingTimetable] = useState<Timetable | null>(null);
    const [selectedTimetableData, setSelectedTimetableData] = useState<any>(null);
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
    const [timetableToDelete, setTimetableToDelete] = useState<Timetable | null>(null);

    useEffect(() => {
        fetchTimetables();
    }, []);

    const fetchTimetables = async () => {
        try {
            const response = await getTimetable();
            if (response?.data?.timetables) {
                setTimetables(response.data.timetables);
            }
        } catch (error) {
            setError('Failed to load timetables');
            message.error('Failed to fetch timetables');
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (timetable: Timetable | null) => {
        setEditingTimetable(timetable);
        setOpenModal(true);
        if (!timetable) {
            setSelectedTimetableData(null);
        }
    };

    const handleCloseModal = () => {
        setEditingTimetable(null);
        setOpenModal(false);
    };

    const handleSaveTimetable = async () => {
        try {
            await fetchTimetables();
            handleCloseModal();
        } catch (error) {
            message.error('Failed to save timetable');
        }
    };

    const handleTimetableClick = async (timetable: Timetable) => {
        try {
            const response = await getTimetableByClass(timetable.classId);
            if (response.status === true) {
                // Calculate max period index from all days
                let maxPeriodIndex = 0;
                response.data.timetable.timetableDays.forEach((day: any) => {
                    day.periods.forEach((period: any) => {
                        if (period.periodIndex > maxPeriodIndex) {
                            maxPeriodIndex = period.periodIndex;
                        }
                    });
                });

                const timetableData: { [key: string]: string[] } = {};

                // Initialize arrays with correct number of periods
                response.data.timetable.timetableDays.forEach((day: any) => {
                    const dayName = DAYS_MAP[day.weekDay];
                    timetableData[dayName] = Array(maxPeriodIndex).fill('');
                });

                // Fill in the period data
                response.data.timetable.timetableDays.forEach((day: any) => {
                    const dayName = DAYS_MAP[day.weekDay];
                    day.periods.forEach((period: any) => {
                        timetableData[dayName][period.periodIndex - 1] =
                            `${period.subjectName}/${period.staffName}`;
                    });
                });

                const formattedData = {
                    ...response.data.timetable,
                    classId: timetable.classId,
                    className: timetable.className,
                    workingDays: response.data.timetable.timetableDays.length,
                    totalPeriods: maxPeriodIndex,
                    timetableData: timetableData
                };

                setSelectedTimetableData(formattedData);
                handleOpenModal(timetable);
            }
        } catch (error) {
            console.error('Error fetching timetable:', error);
            message.error('Failed to fetch timetable details');
        }
    };

    const handleDeleteClick = (event: React.MouseEvent, timetable: Timetable) => {
        event.stopPropagation();
        setTimetableToDelete(timetable);
        setDeleteConfirmOpen(true);
    };

    const handleDeleteConfirm = async () => {
        if (!timetableToDelete) return;

        try {
            const response = await deleteTimetable(timetableToDelete.id);

            // Check for RECORD_IN_USE error
            if (response?.resp_code === 'RECORD_IN_USE') {
                message.error('Cannot delete timetable as it is currently in use');
            } else {
                message.success('Timetable deleted successfully');
                fetchTimetables();
            }
        } catch (error: any) {
            console.error('Error deleting timetable:', error);

            // Check if it's a RECORD_IN_USE error from the API
            if (error.response?.data?.resp_code === 'RECORD_IN_USE') {
                message.error('Cannot delete timetable as it is currently in use');
            } else {
                message.error('Failed to delete timetable');
            }
        } finally {
            setDeleteConfirmOpen(false);
            setTimetableToDelete(null);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <CircularProgress />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center h-screen text-red-500">
                {error}
            </div>
        );
    }

    return (
        <div className="p-6">
            <Togglebar
                searchTerm={''}
                setSearchTerm={() => { }}
                viewMode={'list'}
                setViewMode={() => { }}
                itemCount={timetables.length}
            />

            {timetables.length === 0 ? (
                <EmptyState
                    icon={<Calendar size={48} className="text-gray-400" />}
                    title="No Timetables Found"
                    message="Get started by creating a new timetable"
                />
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {timetables.map((timetable) => (
                        <Paper
                            key={timetable.id}
                            className="p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow relative group"
                            onClick={() => handleTimetableClick(timetable)}
                        >
                            <div className="flex flex-col justify-between h-full">
                                <div>
                                    <div className="flex items-center gap-2 mb-4">
                                        <Calendar className="text-[#95B1A9]" size={24} />
                                        <h3 className="text-lg font-semibold text-gray-800">
                                            {timetable.className}
                                        </h3>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between mt-4">
                                    <span className={`px-2 py-1 rounded-full text-xs ${timetable.isActive
                                        ? 'bg-green-100 text-green-800'
                                        : 'bg-gray-100 text-gray-800'
                                        }`}>
                                        {timetable.isActive ? 'Active' : 'Inactive'}
                                    </span>
                                    <div className="flex items-center gap-2">
                                        <Trash2
                                            size={20}
                                            className="text-red-500 cursor-pointer "
                                            onClick={(e) => handleDeleteClick(e, timetable)}
                                        />
                                    </div>
                                </div>
                            </div>
                        </Paper>
                    ))}
                </div>
            )}
            <div className="fixed bottom-10 right-16 flex items-center space-x-2">
                <button
                    className="bg-green-500 text-white p-2 rounded-full shadow-lg relative group hover:bg-green-600"
                    onClick={() => handleOpenModal(null)}
                >
                    <PlusCircle size={34} />
                    <span className="absolute left-[-140px] top-1/2 transform -translate-y-1/2 bg-white text-black text-sm py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow">
                        Create New Timetable
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
                    width: '80%',
                    maxWidth: '1200px',
                    maxHeight: '90vh',
                    overflow: 'auto',
                    bgcolor: 'background.paper',
                    boxShadow: 24,
                    p: 3,
                    borderRadius: 2,
                }}>
                    <CreateTimetable
                        initialData={selectedTimetableData}
                        timetables={timetables}
                        onSave={handleSaveTimetable}
                        onCancel={handleCloseModal}
                    />
                </Box>
            </Modal>
            <Dialog
                open={deleteConfirmOpen}
                onClose={() => setDeleteConfirmOpen(false)}
            >
                <DialogTitle>Delete Timetable</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete the timetable for {timetableToDelete?.className}? This action cannot be undone.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={() => setDeleteConfirmOpen(false)}
                        variant="outlined"
                        color="primary"
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleDeleteConfirm}
                        variant="solid"
                        color="red"
                    >
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default ListTimetable
