import React, { useState, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { useSchoolContext } from '../../contexts/SchoolContext';
import {
    Button,
    Box,
    TextField,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    OutlinedInput,
    Checkbox,
    ListItemText,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Tab,
    Tabs,
    Paper,
    Typography
} from '@mui/material';
import { X } from 'lucide-react';
import SnackbarComponent from '../../components/SnackbarComponent';
import { getSyllabus } from '../../api/superAdmin';
import { AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface SchoolAddress {
    street1: string;
    street2: string;
    city: string;
    state: string;
    pincode: string;
    country: string;
}

interface SchoolDetails {
    name: string;
    address: SchoolAddress;
    googleMapsLink: string;
    phone: string;
    email: string;
    syllabus: string[];
    schoolCode: string;
}

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;
    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    {children}
                </Box>
            )}
        </div>
    );
}

interface GlobalSyllabus {
    id: number;
    name: string;
    isCustomSyllabus: boolean;
    creatorSchoolCode: string | null;
}

interface SchoolLimits {
    studentLimit: number;
}

interface SchoolStatus {
    isActive: boolean;
    isBlocked: boolean;
}

const ManageSchool: React.FC = () => {
    // const { prefix } = useParams();
    const navigate = useNavigate();
    // const { schoolInfo } = useSchoolContext();
    const [tabValue, setTabValue] = useState(0);
    const [logoFile, setLogoFile] = useState<File | null>(null);
    const [previewLogo, setPreviewLogo] = useState<string | null>(null);
    // const [isActive, setIsActive] = useState(true);
    // const [showConfirmation, setShowConfirmation] = useState(false);
    const fileInputRef = React.useRef<HTMLInputElement>(null);
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success' as 'success' | 'error',
        position: { vertical: 'top', horizontal: 'right' }
    });

    const [schoolDetails, setSchoolDetails] = useState<SchoolDetails>({
        name: '',
        schoolCode: '',
        address: {
            street1: '',
            street2: '',
            city: '',
            state: '',
            pincode: '',
            country: ''
        },
        googleMapsLink: '',
        phone: '',
        email: '',
        syllabus: []
    });

    const [syllabusList, setSyllabusList] = useState<GlobalSyllabus[]>([]);

    const [limits, setLimits] = useState<SchoolLimits>({
        studentLimit: 0
    });

    const [schoolStatus, setSchoolStatus] = useState<SchoolStatus>({
        isActive: true,
        isBlocked: false
    });
    const [confirmationType, setConfirmationType] = useState<'activate' | 'deactivate' | 'block' | 'unblock' | null>(null);

    useEffect(() => {
        const fetchSyllabus = async () => {
            try {
                const response = await getSyllabus();
                if (response?.global && Array.isArray(response.global)) {
                    setSyllabusList(response.global);
                }
            } catch (error) {
                console.error('Failed to fetch syllabus:', error);
                setSyllabusList([]);
            }
        };

        fetchSyllabus();
    }, []);

    const handleLogoClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setLogoFile(file);
            setPreviewLogo(URL.createObjectURL(file));
        }
    };

    const handleLogoRemove = (e: React.MouseEvent) => {
        e.stopPropagation();
        setLogoFile(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleUpdateSchool = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            // API call here
            setSnackbar({
                open: true,
                message: 'School updated successfully!',
                severity: 'success',
                position: { vertical: 'top', horizontal: 'right' }
            });
        } catch (error) {
            setSnackbar({
                open: true,
                message: 'Failed to update school',
                severity: 'error',
                position: { vertical: 'top', horizontal: 'right' }
            });
        }
    };

    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    const handleUpdateLimits = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            // API call to update limits
            // await updateSchoolLimits(prefix, limits);
            setSnackbar({
                open: true,
                message: 'School limits updated successfully!',
                severity: 'success',
                position: { vertical: 'top', horizontal: 'right' }
            });
        } catch (error) {
            setSnackbar({
                open: true,
                message: 'Failed to update school limits',
                severity: 'error',
                position: { vertical: 'top', horizontal: 'right' }
            });
        }
    };

    const handleStatusChange = async () => {
        try {
            if (confirmationType) {
                // API call based on confirmation type
                switch (confirmationType) {
                    case 'activate':
                        // await activateSchool(prefix);
                        setSchoolStatus({ ...schoolStatus, isActive: true });
                        break;
                    case 'deactivate':
                        // await deactivateSchool(prefix);
                        setSchoolStatus({ ...schoolStatus, isActive: false });
                        break;
                    case 'block':
                        // await blockSchool(prefix);
                        setSchoolStatus({ ...schoolStatus, isBlocked: true });
                        break;
                    case 'unblock':
                        // await unblockSchool(prefix);
                        setSchoolStatus({ ...schoolStatus, isBlocked: false });
                        break;
                }

                setSnackbar({
                    open: true,
                    message: `School ${confirmationType}d successfully!`,
                    severity: 'success',
                    position: { vertical: 'top', horizontal: 'right' }
                });
            }
        } catch (error) {
            setSnackbar({
                open: true,
                message: `Failed to ${confirmationType} school`,
                severity: 'error',
                position: { vertical: 'top', horizontal: 'right' }
            });
        } finally {
            setConfirmationType(null);
        }
    };

    return (
        <div className="min-h-screen bg-gray-200 p-8">
            <Box sx={{ maxWidth: 1200, margin: '0 auto' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Typography variant="h5">School Settings</Typography>
                    <Button variant="outlined" onClick={() => navigate(-1)}>
                        Back
                    </Button>
                </Box>

                <Paper>
                    <Tabs
                        value={tabValue}
                        onChange={(_, newValue) => setTabValue(newValue)}
                        sx={{ borderBottom: 1, borderColor: 'divider' }}
                    >
                        <Tab label="Details" />
                        <Tab label="Branding" />
                        <Tab label="Syllabus" />
                        <Tab label="Limits" />
                        <Tab label="Danger Zone" />
                    </Tabs>

                    <TabPanel value={tabValue} index={0}>
                        <form onSubmit={handleUpdateSchool} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <TextField
                                    fullWidth
                                    label="School Name"
                                    value={schoolDetails.name}
                                    onChange={(e) => setSchoolDetails({ ...schoolDetails, name: e.target.value })}
                                />
                                <TextField
                                    fullWidth
                                    label="School Code"
                                    value={schoolDetails.schoolCode}
                                    onChange={(e) => setSchoolDetails({ ...schoolDetails, schoolCode: e.target.value })}
                                />
                            </div>

                            <TextField
                                fullWidth
                                label="Address Line 1"
                                value={schoolDetails.address.street1}
                                onChange={(e) => setSchoolDetails({
                                    ...schoolDetails,
                                    address: { ...schoolDetails.address, street1: e.target.value }
                                })}
                            />
                            <TextField
                                fullWidth
                                label="Address Line 2"
                                value={schoolDetails.address.street2}
                                onChange={(e) => setSchoolDetails({
                                    ...schoolDetails,
                                    address: { ...schoolDetails.address, street2: e.target.value }
                                })}
                            />

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <TextField
                                    fullWidth
                                    label="City"
                                    value={schoolDetails.address.city}
                                    onChange={(e) => setSchoolDetails({
                                        ...schoolDetails,
                                        address: { ...schoolDetails.address, city: e.target.value }
                                    })}
                                />
                                <TextField
                                    fullWidth
                                    label="State"
                                    value={schoolDetails.address.state}
                                    onChange={(e) => setSchoolDetails({
                                        ...schoolDetails,
                                        address: { ...schoolDetails.address, state: e.target.value }
                                    })}
                                />
                                <TextField
                                    fullWidth
                                    label="Country"
                                    value={schoolDetails.address.country}
                                    onChange={(e) => setSchoolDetails({
                                        ...schoolDetails,
                                        address: { ...schoolDetails.address, country: e.target.value }
                                    })}
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <TextField
                                    fullWidth
                                    label="Pin Code"
                                    value={schoolDetails.address.pincode}
                                    onChange={(e) => setSchoolDetails({
                                        ...schoolDetails,
                                        address: { ...schoolDetails.address, pincode: e.target.value }
                                    })}
                                />
                                <TextField
                                    fullWidth
                                    label="Google Maps Link"
                                    value={schoolDetails.googleMapsLink}
                                    onChange={(e) => setSchoolDetails({ ...schoolDetails, googleMapsLink: e.target.value })}
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <TextField
                                    fullWidth
                                    label="Phone"
                                    value={schoolDetails.phone}
                                    onChange={(e) => setSchoolDetails({ ...schoolDetails, phone: e.target.value })}
                                />
                                <TextField
                                    fullWidth
                                    label="Email"
                                    value={schoolDetails.email}
                                    onChange={(e) => setSchoolDetails({ ...schoolDetails, email: e.target.value })}
                                />
                            </div>

                            <Box display="flex" justifyContent="flex-end" mt={2}>
                                <Button variant="contained" color="primary" type="submit">
                                    Save Changes
                                </Button>
                            </Box>
                        </form>
                    </TabPanel>

                    <TabPanel value={tabValue} index={1}>
                        <div
                            className="relative flex items-center justify-center bg-gray-50 border border-dashed border-gray-400 h-36 w-36 cursor-pointer mx-auto"
                            onClick={handleLogoClick}
                        >
                            {logoFile ? (
                                <>
                                    <img
                                        src={previewLogo || ''}
                                        alt="School logo"
                                        className="w-full h-full object-contain"
                                    />
                                    <button
                                        onClick={handleLogoRemove}
                                        className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md hover:bg-gray-100"
                                    >
                                        <X size={20} color="gray" />
                                    </button>
                                </>
                            ) : (
                                <div className="text-center">
                                    <p className="text-sm text-gray-500">Click to upload logo</p>
                                </div>
                            )}
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                onChange={handleLogoUpload}
                                className="hidden"
                            />
                        </div>
                    </TabPanel>

                    <TabPanel value={tabValue} index={2}>
                        <form className="space-y-4">
                            <FormControl fullWidth>
                                <InputLabel id="syllabus-label">Syllabus</InputLabel>
                                <Select
                                    labelId="syllabus-label"
                                    id="syllabusIDs"
                                    multiple
                                    value={schoolDetails.syllabus}
                                    onChange={(e) => setSchoolDetails({
                                        ...schoolDetails,
                                        syllabus: e.target.value as string[]
                                    })}
                                    input={<OutlinedInput label="Syllabus" />}
                                    renderValue={(selected) => selected.join(', ')}
                                >
                                    {syllabusList.length === 0 ? (
                                        <MenuItem disabled>No syllabuses available</MenuItem>
                                    ) : (
                                        syllabusList.map((syllabus) => (
                                            <MenuItem key={syllabus.id} value={syllabus.name}>
                                                <Checkbox
                                                    checked={schoolDetails.syllabus.indexOf(syllabus.name) > -1}
                                                />
                                                <ListItemText primary={syllabus.name} />
                                            </MenuItem>
                                        ))
                                    )}
                                </Select>
                            </FormControl>

                            <Box display="flex" justifyContent="flex-end" mt={2}>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={handleUpdateSchool}
                                >
                                    Update Syllabus
                                </Button>
                            </Box>
                        </form>
                    </TabPanel>

                    <TabPanel value={tabValue} index={3}>
                        <form onSubmit={handleUpdateLimits} className="space-y-4">
                            <div className="flex flex-col p-3">
                                <Typography variant="h6" gutterBottom>
                                    School Limits
                                </Typography>
                                <Box sx={{ maxWidth: 400 }}>
                                    <TextField
                                        fullWidth
                                        label="Maximum Students"
                                        type="number"
                                        value={limits.studentLimit}
                                        onChange={(e) => setLimits({
                                            ...limits,
                                            studentLimit: parseInt(e.target.value) || 0
                                        })}
                                        InputProps={{
                                            inputProps: { min: 0 }
                                        }}
                                        helperText="Set the maximum number of students allowed"
                                        sx={{
                                            bgcolor: 'white',
                                            '& .MuiOutlinedInput-root': {
                                                '& fieldset': {
                                                    borderColor: 'rgba(0, 0, 0, 0.23)',
                                                },
                                                '&:hover fieldset': {
                                                    borderColor: '#308369',
                                                },
                                                '&.Mui-focused fieldset': {
                                                    borderColor: '#308369',
                                                },
                                            },
                                        }}
                                    />
                                </Box>

                                <Box sx={{ mt: 3 }}>
                                    <Button
                                        type="submit"
                                        variant="contained"
                                        sx={{
                                            bgcolor: '#308369',
                                            '&:hover': {
                                                bgcolor: '#2a725c'
                                            }
                                        }}
                                    >
                                        Update Limits
                                    </Button>
                                </Box>
                            </div>
                        </form>
                    </TabPanel>

                    <TabPanel value={tabValue} index={4}>

                        <Box sx={{ mb: 4 }}>
                            <Typography
                                variant="h6"
                                sx={{
                                    color: 'error.main',
                                    mb: 2,
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 1
                                }}
                            >
                                <AlertTriangle size={20} />
                                Danger Zone
                            </Typography>
                            <Typography variant="body2" sx={{ mb: 3, color: 'text.secondary' }}>
                                These actions are destructive and should be used with caution
                            </Typography>
                        </Box>

                        {/* School Status Section */}
                        <Box sx={{
                            p: 3,
                            borderRadius: 1,
                            mb: 3,
                            transition: 'all 0.3s ease',
                            bgcolor: schoolStatus.isActive
                                ? 'rgba(211, 47, 47, 0.04)'
                                : 'rgba(48, 131, 105, 0.04)',
                            '&:hover': {
                                bgcolor: schoolStatus.isActive
                                    ? 'rgba(211, 47, 47, 0.08)'
                                    : 'rgba(48, 131, 105, 0.08)'
                            }
                        }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Box>
                                    <Typography variant="subtitle1" sx={{ fontWeight: 'medium' }}>
                                        {schoolStatus.isActive ? 'Deactivate School' : 'Activate School'}
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                        {schoolStatus.isActive
                                            ? "Temporarily disable access to this school"
                                            : "Re-enable access to this school"}
                                    </Typography>
                                </Box>
                                <Button
                                    variant="outlined"
                                    color={schoolStatus.isActive ? "error" : "success"}
                                    onClick={() => setConfirmationType(schoolStatus.isActive ? 'deactivate' : 'activate')}
                                    sx={!schoolStatus.isActive ? {
                                        borderColor: '#308369',
                                        color: '#308369',
                                        bgcolor: 'rgba(48, 131, 105, 0.12)',
                                        '&:hover': {
                                            borderColor: '#2a725c',
                                            bgcolor: 'rgba(48, 131, 105, 0.16)'
                                        }
                                    } : {
                                        bgcolor: 'rgba(211, 47, 47, 0.12)',
                                        '&:hover': {
                                            bgcolor: 'rgba(211, 47, 47, 0.16)'
                                        }
                                    }}
                                >
                                    {schoolStatus.isActive ? 'Deactivate' : 'Activate'}
                                </Button>
                            </Box>
                        </Box>

                        {/* Block Operations Section */}
                        <Box sx={{
                            p: 3,
                            borderRadius: 1,
                            transition: 'all 0.3s ease',
                            bgcolor: schoolStatus.isBlocked
                                ? 'rgba(48, 131, 105, 0.04)'
                                : 'rgba(211, 47, 47, 0.04)',
                            '&:hover': {
                                bgcolor: schoolStatus.isBlocked
                                    ? 'rgba(48, 131, 105, 0.08)'
                                    : 'rgba(211, 47, 47, 0.08)'
                            }
                        }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Box>
                                    <Typography variant="subtitle1" sx={{ fontWeight: 'medium' }}>
                                        {schoolStatus.isBlocked ? 'Unblock Operations' : 'Block Operations'}
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                        {schoolStatus.isBlocked
                                            ? "Resume all operations for this school"
                                            : "Prevent all operations for this school"}
                                    </Typography>
                                </Box>
                                <Button
                                    variant="contained"
                                    color={schoolStatus.isBlocked ? "success" : "error"}
                                    onClick={() => setConfirmationType(schoolStatus.isBlocked ? 'unblock' : 'block')}
                                    sx={schoolStatus.isBlocked ? {
                                        bgcolor: '#308369',
                                        '&:hover': {
                                            bgcolor: '#2a725c'
                                        }
                                    } : {
                                        bgcolor: '#d32f2f',
                                        '&:hover': {
                                            bgcolor: '#c62828'
                                        }
                                    }}
                                >
                                    {schoolStatus.isBlocked ? 'Unblock' : 'Block'}
                                </Button>
                            </Box>
                        </Box>

                    </TabPanel>
                </Paper>
            </Box>

            <Dialog
                open={!!confirmationType}
                onClose={() => setConfirmationType(null)}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle sx={{
                    bgcolor: confirmationType === 'activate' || confirmationType === 'unblock'
                        ? '#308369'
                        : 'error.light',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1
                }}>
                    <AlertTriangle size={24} />
                    {confirmationType === 'activate' && 'Activate School'}
                    {confirmationType === 'deactivate' && 'Deactivate School'}
                    {confirmationType === 'block' && 'Block School Operations'}
                    {confirmationType === 'unblock' && 'Unblock School Operations'}
                </DialogTitle>
                <DialogContent sx={{ mt: 2 }}>
                    <Typography variant="body1" sx={{ mb: 2 }}>
                        Are you sure you want to proceed with this action?
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        {confirmationType === 'activate' && 'This will re-enable access to the school for all users.'}
                        {confirmationType === 'deactivate' && 'This will temporarily prevent all users from accessing the school.'}
                        {confirmationType === 'block' && 'This will prevent all operations in the school until unblocked.'}
                        {confirmationType === 'unblock' && 'This will resume all operations in the school.'}
                    </Typography>
                </DialogContent>
                <DialogActions sx={{ p: 2, bgcolor: 'grey.50' }}>
                    <Button
                        onClick={() => setConfirmationType(null)}
                        variant="outlined"
                        color="inherit"
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleStatusChange}
                        variant="contained"
                        color={confirmationType === 'activate' || confirmationType === 'unblock' ? "success" : "error"}
                        sx={confirmationType === 'activate' || confirmationType === 'unblock' ? {
                            bgcolor: '#308369',
                            '&:hover': {
                                bgcolor: '#2a725c'
                            }
                        } : {}}
                        autoFocus
                    >
                        {confirmationType === 'activate' && 'Yes, Activate'}
                        {confirmationType === 'deactivate' && 'Yes, Deactivate'}
                        {confirmationType === 'block' && 'Yes, Block'}
                        {confirmationType === 'unblock' && 'Yes, Unblock'}
                    </Button>
                </DialogActions>
            </Dialog>

            <SnackbarComponent
                open={snackbar.open}
                message={snackbar.message}
                severity={snackbar.severity}
                position={{
                    vertical: snackbar.position.vertical as "top" | "bottom",
                    horizontal: snackbar.position.horizontal as "right" | "left" | "center"
                }}
                onClose={handleCloseSnackbar}
            />
        </div>
    );
};

export default ManageSchool;

