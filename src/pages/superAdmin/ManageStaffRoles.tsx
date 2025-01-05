import React, { useState, useEffect } from 'react';
import { useSchoolContext } from '../../contexts/SchoolContext';
import { Radio, RadioGroup, FormControlLabel, Button, Modal, Box, TextField, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import SnackbarComponent from '../../components/SnackbarComponent';
import { PlusCircle, Check } from 'lucide-react';
import { listStaff, updateStaffRole, getPrivilegedStaff, removeStaffRole } from '../../api/superAdmin';
import GridView from '../../components/GridView';

interface PrivilegedStaffResponse {
    staffId: number;
    name: string;
    idCardNumber: string;
    mobile: string;
    privilegeType: string;
}

interface Staff {
    id: number;
    name: string;
    id_card_number: string | null;
    gender: string;
    dob: string;
    mobile: string;
    email: string;
    blood_group: string;
    religion: string;
    caste: string;
    pwd: boolean;
    is_teaching_staff: boolean;
    remarks: string;
    street1: string;
    street2: string;
    city: string;
    state: string;
    pincode: string;
    country: string;
    house: string;
    profile_pic_link: string;
    current_role?: string;
}


const ManageStaffRoles: React.FC = () => {
    const { schoolInfo } = useSchoolContext();
    const [privilegedStaffList, setPrivilegedStaffList] = useState<PrivilegedStaffResponse[]>([]);
    const [allStaffList, setAllStaffList] = useState<Staff[]>([]);
    const [loading, setLoading] = useState(true);
    const [openModal, setOpenModal] = useState(false);
    const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);
    const [selectedRole, setSelectedRole] = useState<string>('');
    const [searchTerm, setSearchTerm] = useState('');
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success' as 'success' | 'error',
        position: { vertical: 'top' as const, horizontal: 'center' as const }
    });
    const [confirmDialog, setConfirmDialog] = useState({
        open: false,
        staffId: null as number | null,
        staffName: '',
        role: ''
    });

    useEffect(() => {
        fetchPrivilegedStaff();
    }, []);

    const fetchPrivilegedStaff = async () => {
        try {
            setLoading(true);
            if (!schoolInfo?.schoolPrefix) {
                throw new Error('School prefix not found');
            }

            const response = await getPrivilegedStaff(schoolInfo.schoolPrefix);

            if (response.status === true) {
                const privilegedStaffList = response.data.map((staff: any) => ({
                    staffId: staff.staffId,
                    name: staff.name,
                    idCardNumber: staff.idCardNumber,
                    mobile: staff.mobile,
                    privilegeType: staff.privilegeType
                }));

                setPrivilegedStaffList(privilegedStaffList);
            }
        } catch (error) {
            console.error('Error fetching privileged staff:', error);
            setSnackbar({
                open: true,
                message: 'Failed to fetch privileged staff',
                severity: 'error',
                position: { vertical: 'top', horizontal: 'center' }
            });
        } finally {
            setLoading(false);
        }
    };

    const fetchAllStaff = async () => {
        try {
            if (!schoolInfo?.schoolPrefix) {
                throw new Error('School prefix not found');
            }

            const response = await listStaff(schoolInfo.schoolPrefix);
            if (response.status === true) {
                setAllStaffList(response.data);
            }
        } catch (error) {
            console.error('Error fetching staff list:', error);
            setSnackbar({
                open: true,
                message: 'Failed to fetch staff list',
                severity: 'error',
                position: { vertical: 'top', horizontal: 'center' }
            });
        }
    };

    const handleOpenModal = async () => {
        setLoading(true);
        await fetchAllStaff();
        setLoading(false);
        setOpenModal(true);
    };


    const filteredStaff = allStaffList.filter(staff =>
        !privilegedStaffList.find(p => p.staffId === staff.id) && // Only show non-privileged staff
        (staff.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (staff.id_card_number && staff.id_card_number.toLowerCase().includes(searchTerm.toLowerCase())))
    );

    const handleAssignRole = async () => {
        try {
            if (!selectedStaff || !selectedRole || !schoolInfo?.schoolPrefix) {
                throw new Error('Missing required information');
            }

            const response = await updateStaffRole({
                staffID: selectedStaff.id,
                privilegeType: selectedRole,
                school_prefix: schoolInfo.schoolPrefix
            });

            if (response.status === true) {
                await fetchPrivilegedStaff();
                setSnackbar({
                    open: true,
                    message: 'Role assigned successfully',
                    severity: 'success',
                    position: { vertical: 'top', horizontal: 'center' }
                });
                handleCloseModal();
            }
        } catch (error: any) {
            console.error('Error assigning role:', error);
            setSnackbar({
                open: true,
                message: error.response?.data?.error || 'Failed to assign role',
                severity: 'error',
                position: { vertical: 'top', horizontal: 'center' }
            });
        }
    };

    const handleCloseModal = () => {
        setOpenModal(false);
        setSelectedStaff(null);
        setSelectedRole('');
        setSearchTerm('');
    };

    const getRoleLabel = (role: string) => {
        switch (role) {
            case 'schoolAdmin':
                return 'School Admin';
            case 'schoolHead':
                return 'School Head';
            case 'schoolDeputyHead':
                return 'Deputy Head';
            default:
                return role;
        }
    };

    const handleRemoveRole = async (staffId: number) => {
        const staff = privilegedStaffList.find(s => s.staffId === staffId);
        if (staff) {
            setConfirmDialog({
                open: true,
                staffId: staffId,
                staffName: staff.name,
                role: getRoleLabel(staff.privilegeType || '')
            });
        }
    };

    const handleConfirmRemove = async () => {
        try {
            if (!confirmDialog.staffId || !schoolInfo?.schoolPrefix) {
                throw new Error('Missing required information');
            }

            const staff = privilegedStaffList.find(s => s.staffId === confirmDialog.staffId);
            if (!staff) {
                throw new Error('Staff not found');
            }

            const response = await removeStaffRole({
                staffID: confirmDialog.staffId,
                privilegeType: staff.privilegeType,
                school_prefix: schoolInfo.schoolPrefix
            });

            if (response.status === true) {
                await fetchPrivilegedStaff();
                setSnackbar({
                    open: true,
                    message: 'Role removed successfully',
                    severity: 'success',
                    position: { vertical: 'top', horizontal: 'center' }
                });
            }
        } catch (error) {
            console.error('Error removing role:', error);
            setSnackbar({
                open: true,
                message: 'Failed to remove role',
                severity: 'error',
                position: { vertical: 'top', horizontal: 'center' }
            });
        } finally {
            setConfirmDialog(prev => ({ ...prev, open: false }));
        }
    };

    const getStaffContent = (staff: PrivilegedStaffResponse) => ({
        title: staff.name,
        subtitle: staff.idCardNumber || '',
        email: staff.mobile || '',
        status: {
            label: getRoleLabel(staff.privilegeType || ''),
            color: getStatusColor(staff.privilegeType || '')
        },
        avatar: {
            letter: staff.name.charAt(0).toUpperCase()
        },
        action: {
            label: 'Remove Role',
            onClick: () => handleRemoveRole(staff.staffId),
            color: 'text-red-600 hover:text-red-700 active:text-red-800'
        }
    });

    const getStatusColor = (role: string) => {
        switch (role) {
            case 'schoolAdmin':
                return 'bg-blue-100 text-blue-800';
            case 'schoolHead':
                return 'bg-emerald-100 text-emerald-800';
            case 'schoolDeputyHead':
                return 'bg-purple-100 text-purple-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    if (loading) {
        return <div className="min-h-screen bg-gray-200 p-8 flex items-center justify-center">Loading...</div>;
    }

    return (
        <div className="min-h-screen bg-gray-200 p-8">
            {privilegedStaffList.length === 0 ? (
                <div className="text-center py-8">
                    <p className="text-gray-500">No privileged staff found</p>
                </div>
            ) : (
                <GridView
                    items={privilegedStaffList}
                    selectedItems={[]}
                    onSelect={() => { }}
                    onDelete={() => { }}
                    onItemClick={() => { }}
                    getItemContent={getStaffContent}
                    showDeleteIcon={false}
                />
            )}

            {/* Add Role Button */}
            <div className="fixed bottom-10 right-16 flex items-center space-x-2">
                <button
                    className="bg-green-500 text-white p-2 rounded-full shadow-lg relative group hover:bg-green-600"
                    onClick={handleOpenModal}
                >
                    <PlusCircle size={34} />
                    <span className="absolute left-[-140px] top-1/2 transform -translate-y-1/2 bg-white text-black text-sm py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow">
                        Add New Role
                    </span>
                </button>
            </div>

            {/* Staff Selection Modal */}
            <Modal open={openModal} onClose={handleCloseModal}>
                <Box sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 600,
                    maxHeight: '90vh',
                    bgcolor: 'background.paper',
                    boxShadow: 24,
                    p: 4,
                    borderRadius: 2,
                    overflow: 'auto'
                }}>
                    <h2 className="text-xl font-bold mb-4">Assign Role to Staff</h2>

                    <div className="mb-6">
                        <h3 className="text-sm font-medium text-gray-700 mb-2">Select Staff</h3>
                        <TextField
                            placeholder="Search staff by name or ID..."
                            variant="outlined"
                            fullWidth
                            size="small"
                            className="mb-3"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <div className="max-h-60 overflow-y-auto border rounded-lg divide-y">
                            {loading ? (
                                <div className="p-4 text-center text-gray-500">Loading staff...</div>
                            ) : filteredStaff.length === 0 ? (
                                <div className="p-4 text-center text-gray-500">No staff found</div>
                            ) : (
                                filteredStaff.map((staff) => (
                                    <div
                                        key={staff.id}
                                        className={`p-3 cursor-pointer hover:bg-gray-50 transition-colors
                                            ${selectedStaff?.id === staff.id ? 'bg-emerald-50' : ''}
                                        `}
                                        onClick={() => setSelectedStaff(staff)}
                                    >
                                        <div className="flex justify-between items-center">
                                            <div>
                                                <p className="font-medium text-gray-900">{staff.name}</p>
                                                {staff.id_card_number && (
                                                    <p className="text-sm text-gray-500">
                                                        {staff.id_card_number}
                                                    </p>
                                                )}
                                            </div>
                                            {selectedStaff?.id === staff.id && (
                                                <div className="text-emerald-500">
                                                    <Check size={20} />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {selectedStaff && (
                        <div className="mb-4">
                            <h3 className="text-sm font-medium text-gray-700 mb-2">Select Role for {selectedStaff.name}</h3>
                            <RadioGroup
                                value={selectedRole}
                                onChange={(e) => setSelectedRole(e.target.value)}
                            >
                                <FormControlLabel
                                    value="schoolAdmin"
                                    control={<Radio />}
                                    label="School Admin"
                                />
                                <FormControlLabel
                                    value="schoolHead"
                                    control={<Radio />}
                                    label="School Head"
                                />
                                <FormControlLabel
                                    value="schoolDeputyHead"
                                    control={<Radio />}
                                    label="Deputy Head"
                                />
                            </RadioGroup>
                        </div>
                    )}

                    <div className="flex justify-end space-x-2 mt-6">
                        <Button onClick={handleCloseModal} variant="outlined" color="inherit">
                            Cancel
                        </Button>
                        <Button
                            onClick={handleAssignRole}
                            variant="contained"
                            color="success"
                            disabled={!selectedStaff || !selectedRole}
                        >
                            Assign Role
                        </Button>
                    </div>
                </Box>
            </Modal>

            {/* Confirmation Dialog */}
            <Dialog
                open={confirmDialog.open}
                onClose={() => setConfirmDialog(prev => ({ ...prev, open: false }))}
            >
                <DialogTitle>Remove Role</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to remove the role of <strong>{confirmDialog.role}</strong> from <strong>{confirmDialog.staffName}</strong>?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={() => setConfirmDialog(prev => ({ ...prev, open: false }))}
                        color="inherit"
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleConfirmRemove}
                        color="error"
                        variant="contained"
                    >
                        Remove Role
                    </Button>
                </DialogActions>
            </Dialog>

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

export default ManageStaffRoles; 