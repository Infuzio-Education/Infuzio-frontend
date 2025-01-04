import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Tab,
    Tabs,
    Paper,
    Typography,
    CircularProgress
} from '@mui/material';
import { X } from 'lucide-react';
import SnackbarComponent from '../../components/SnackbarComponent';
import { getSyllabus, getSchoolDetails, updateSchoolDetails, updateSchoolLogo, deleteSchoolLogo, connectSchoolSyllabus, disconnectSchoolSyllabus, updateSchoolLimits, deactivateSchool, activateSchool } from '../../api/superAdmin';
import { AlertTriangle } from 'lucide-react';
import { useFormik } from 'formik';
import { schoolUpdationFormValidationSchema } from '../../validations/schoolUpdationFormValidationSchema';

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
    logo: string;
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
    isDeleted: boolean;
    isBlocked: boolean;
}

const ManageSchool: React.FC = () => {
    const { prefix } = useParams();
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
        logo: '',
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
        isDeleted: false,
        isBlocked: false
    });
    const [confirmationType, setConfirmationType] = useState<'activate' | 'deactivate' | 'block' | 'unblock' | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const formik = useFormik({
        initialValues: schoolDetails,
        validationSchema: schoolUpdationFormValidationSchema,
        enableReinitialize: true,
        validateOnChange: true,
        validateOnMount: true,
        onSubmit: async (values) => {
            if (!prefix) return;

            try {
                const formData = new FormData();

                // Add basic fields
                formData.append('name', values.name);
                formData.append('phone', values.phone);
                formData.append('email', values.email);
                formData.append('googleMapsLink', values.googleMapsLink || '');

                // Add address fields in the required format
                formData.append('address[street1]', values.address.street1);
                formData.append('address[street2]', values.address.street2 || '');
                formData.append('address[city]', values.address.city);
                formData.append('address[state]', values.address.state);
                formData.append('address[pincode]', values.address.pincode);
                formData.append('address[country]', values.address.country);

                // Make the API call
                await updateSchoolDetails(prefix, formData);

                setSnackbar({
                    open: true,
                    message: 'School updated successfully!',
                    severity: 'success',
                    position: { vertical: 'top', horizontal: 'right' }
                });
            } catch (error) {
                console.error('Error updating school:', error);
                setSnackbar({
                    open: true,
                    message: 'Failed to update school',
                    severity: 'error',
                    position: { vertical: 'top', horizontal: 'right' }
                });
            }
        }
    });

    useEffect(() => {
        const fetchData = async () => {
            if (!prefix) return;

            try {
                setIsLoading(true);
                const [schoolResponse, syllabusResponse] = await Promise.all([
                    getSchoolDetails(prefix),
                    getSyllabus()
                ]);

                console.log(schoolResponse);

                if (schoolResponse?.data) {
                    const schoolData = schoolResponse.data;
                    setSchoolDetails({
                        name: schoolData.name,
                        schoolCode: schoolData.code,
                        address: {
                            street1: schoolData.street1,
                            street2: schoolData.street2,
                            city: schoolData.city,
                            state: schoolData.state,
                            pincode: schoolData.pin_code,
                            country: schoolData.country
                        },
                        logo: schoolData.logo,
                        googleMapsLink: schoolData.googleMapsLink || '',
                        phone: schoolData.phone,
                        email: schoolData.email,
                        syllabus: schoolData.syllabuses ? schoolData.syllabuses.map((s: any) => s.name) : []
                    });

                    setLimits({
                        studentLimit: schoolData.studentLimit
                    });

                    setSchoolStatus({
                        isDeleted: schoolData.isDeleted,
                        isBlocked: !schoolData.isActive
                    });

                    // Set logo preview if available
                    if (schoolData.logo) {
                        setPreviewLogo(schoolData.logo);
                    }
                }

                if (syllabusResponse?.global && Array.isArray(syllabusResponse.global)) {
                    setSyllabusList(syllabusResponse.global);
                }
            } catch (error) {
                console.error('Error fetching school details:', error);
                setSnackbar({
                    open: true,
                    message: 'Failed to load school details',
                    severity: 'error',
                    position: { vertical: 'top', horizontal: 'right' }
                });
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [prefix]);

    const handleLogoClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handleLogoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file && prefix) {
            try {
                setLogoFile(file);
                setPreviewLogo(URL.createObjectURL(file));

                // Upload logo immediately
                await updateSchoolLogo(prefix, file);

                setSnackbar({
                    open: true,
                    message: 'Logo updated successfully!',
                    severity: 'success',
                    position: { vertical: 'top', horizontal: 'right' }
                });
            } catch (error) {
                console.error('Error uploading logo:', error);
                // Reset logo state on error
                setLogoFile(null);
                setPreviewLogo(null);
                if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                }

                setSnackbar({
                    open: true,
                    message: 'Failed to update logo',
                    severity: 'error',
                    position: { vertical: 'top', horizontal: 'right' }
                });
            }
        }
    };

    const handleLogoRemove = async (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!prefix) return;

        try {
            await deleteSchoolLogo(prefix);

            // Clear logo states
            setLogoFile(null);
            setPreviewLogo(null);
            setSchoolDetails(prev => ({
                ...prev,
                logo: ''
            }));

            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }

            setSnackbar({
                open: true,
                message: 'Logo removed successfully!',
                severity: 'success',
                position: { vertical: 'top', horizontal: 'right' }
            });
        } catch (error) {
            console.error('Error removing logo:', error);
            setSnackbar({
                open: true,
                message: 'Failed to remove logo',
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
        if (!prefix) return;

        try {
            await updateSchoolLimits(prefix, limits.studentLimit);

            setSnackbar({
                open: true,
                message: 'School limits updated successfully!',
                severity: 'success',
                position: { vertical: 'top', horizontal: 'right' }
            });
        } catch (error) {
            console.error('Error updating limits:', error);
            setSnackbar({
                open: true,
                message: 'Failed to update school limits',
                severity: 'error',
                position: { vertical: 'top', horizontal: 'right' }
            });
        }
    };

    const handleStatusChange = async () => {
        if (!prefix || !confirmationType) return;

        try {
            let response;
            switch (confirmationType) {
                case 'block':
                    response = await deactivateSchool(prefix);
                    if (response.resp_code === 'SUCCESS') {
                        setSchoolStatus(prev => ({ ...prev, isBlocked: true }));
                        setSnackbar({
                            open: true,
                            message: 'School operations blocked successfully!',
                            severity: 'success',
                            position: { vertical: 'top', horizontal: 'right' }
                        });
                    } else {
                        throw new Error('Failed to block school operations');
                    }
                    break;
                case 'unblock':
                    response = await activateSchool(prefix);
                    if (response.resp_code === 'SUCCESS') {
                        setSchoolStatus(prev => ({ ...prev, isBlocked: false }));
                        setSnackbar({
                            open: true,
                            message: 'School operations allowed successfully!',
                            severity: 'success',
                            position: { vertical: 'top', horizontal: 'right' }
                        });
                    } else {
                        throw new Error('Failed to allow school operations');
                    }
                    break;
            }
        } catch (error) {
            console.error(`Error ${confirmationType}ing school:`, error);
            setSnackbar({
                open: true,
                message: `Failed to ${confirmationType} school operations`,
                severity: 'error',
                position: { vertical: 'top', horizontal: 'right' }
            });
        } finally {
            setConfirmationType(null);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-200 p-8 flex items-center justify-center">
                <CircularProgress />
            </div>
        );
    }

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
                        <form onSubmit={formik.handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <TextField
                                    fullWidth
                                    label="School Name"
                                    name="name"
                                    value={formik.values.name}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.name && Boolean(formik.errors.name)}
                                    helperText={formik.touched.name && formik.errors.name}
                                />
                                <TextField
                                    fullWidth
                                    label="School Code"
                                    name="schoolCode"
                                    disabled
                                    value={formik.values.schoolCode}
                                />
                            </div>

                            <TextField
                                fullWidth
                                label="Address Line 1"
                                name="address.street1"
                                value={formik.values.address.street1}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.address?.street1 && Boolean(formik.errors.address?.street1)}
                                helperText={formik.touched.address?.street1 && formik.errors.address?.street1}
                            />
                            <TextField
                                fullWidth
                                label="Address Line 2"
                                name="address.street2"
                                value={formik.values.address.street2}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.address?.street2 && Boolean(formik.errors.address?.street2)}
                                helperText={formik.touched.address?.street2 && formik.errors.address?.street2}
                            />

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <TextField
                                    fullWidth
                                    label="City"
                                    name="address.city"
                                    value={formik.values.address.city}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.address?.city && Boolean(formik.errors.address?.city)}
                                    helperText={formik.touched.address?.city && formik.errors.address?.city}
                                />
                                <TextField
                                    fullWidth
                                    label="State"
                                    name="address.state"
                                    value={formik.values.address.state}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.address?.state && Boolean(formik.errors.address?.state)}
                                    helperText={formik.touched.address?.state && formik.errors.address?.state}
                                />
                                <TextField
                                    fullWidth
                                    label="Country"
                                    name="address.country"
                                    value={formik.values.address.country}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.address?.country && Boolean(formik.errors.address?.country)}
                                    helperText={formik.touched.address?.country && formik.errors.address?.country}
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <TextField
                                    fullWidth
                                    label="Pin Code"
                                    name="address.pincode"
                                    value={formik.values.address.pincode}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.address?.pincode && Boolean(formik.errors.address?.pincode)}
                                    helperText={formik.touched.address?.pincode && formik.errors.address?.pincode}
                                />
                                <TextField
                                    fullWidth
                                    label="Google Maps Link"
                                    name="googleMapsLink"
                                    value={formik.values.googleMapsLink}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.googleMapsLink && Boolean(formik.errors.googleMapsLink)}
                                    helperText={formik.touched.googleMapsLink && formik.errors.googleMapsLink}
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <TextField
                                    fullWidth
                                    label="Phone"
                                    name="phone"
                                    value={formik.values.phone}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.phone && Boolean(formik.errors.phone)}
                                    helperText={formik.touched.phone && formik.errors.phone}
                                />
                                <TextField
                                    fullWidth
                                    label="Email"
                                    name="email"
                                    value={formik.values.email}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.email && Boolean(formik.errors.email)}
                                    helperText={formik.touched.email && formik.errors.email}
                                />
                            </div>

                            <Box display="flex" justifyContent="flex-end" mt={2}>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    type="submit"
                                    disabled={formik.isSubmitting}
                                >
                                    Save Changes
                                </Button>
                            </Box>
                        </form>
                    </TabPanel>

                    <TabPanel value={tabValue} index={1}>
                        <div className="flex flex-col items-center gap-4">
                            <div
                                className="relative flex items-center justify-center bg-gray-50 border border-dashed border-gray-400 h-36 w-36 cursor-pointer"
                                onClick={handleLogoClick}
                            >
                                {logoFile || schoolDetails.logo ? (
                                    <img
                                        src={previewLogo || schoolDetails.logo || ''}
                                        alt="School logo"
                                        className="w-full h-full object-contain"
                                    />
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

                            {(logoFile || schoolDetails.logo) && (
                                <Button
                                    variant="outlined"
                                    color="error"
                                    onClick={handleLogoRemove}
                                    startIcon={<X size={20} />}
                                >
                                    Remove Logo
                                </Button>
                            )}
                        </div>
                    </TabPanel>

                    <TabPanel value={tabValue} index={2}>
                        <div className="space-y-4">
                            <FormControl fullWidth>
                                <InputLabel id="syllabus-label">Add Syllabus</InputLabel>
                                <Select
                                    labelId="syllabus-label"
                                    id="syllabusIDs"
                                    value=""
                                    input={<OutlinedInput label="Add Syllabus" />}
                                >
                                    {syllabusList.length === 0 ? (
                                        <MenuItem disabled>No syllabuses available</MenuItem>
                                    ) : (
                                        syllabusList.map((syllabus) => {
                                            const isSelected = schoolDetails.syllabus.includes(syllabus.name);
                                            return (
                                                <MenuItem
                                                    key={syllabus.id}
                                                    value={syllabus.id}
                                                    disabled={isSelected}
                                                    sx={{
                                                        display: 'flex',
                                                        justifyContent: 'space-between',
                                                        alignItems: 'center'
                                                    }}
                                                >
                                                    <span>{syllabus.name}</span>
                                                    {!isSelected && (
                                                        <Button
                                                            variant="outlined"
                                                            size="small"
                                                            onClick={async (e) => {
                                                                e.stopPropagation();
                                                                if (!prefix) return;

                                                                try {
                                                                    await connectSchoolSyllabus(prefix, syllabus.id);

                                                                    // Update local state
                                                                    setSchoolDetails(prev => ({
                                                                        ...prev,
                                                                        syllabus: [...prev.syllabus, syllabus.name]
                                                                    }));

                                                                    setSnackbar({
                                                                        open: true,
                                                                        message: 'Syllabus added successfully!',
                                                                        severity: 'success',
                                                                        position: { vertical: 'top', horizontal: 'right' }
                                                                    });
                                                                } catch (error) {
                                                                    console.error('Error adding syllabus:', error);
                                                                    setSnackbar({
                                                                        open: true,
                                                                        message: 'Failed to add syllabus',
                                                                        severity: 'error',
                                                                        position: { vertical: 'top', horizontal: 'right' }
                                                                    });
                                                                }
                                                            }}
                                                            sx={{ minWidth: 'auto', p: '4px 8px' }}
                                                        >
                                                            <span>Add</span>
                                                        </Button>
                                                    )}
                                                </MenuItem>
                                            );
                                        })
                                    )}
                                </Select>
                            </FormControl>

                            {/* Display selected syllabuses in rows */}
                            <div className="mt-4 space-y-2">
                                {schoolDetails.syllabus.map((syllabusName) => {
                                    // Find the syllabus ID from syllabusList
                                    const syllabus = syllabusList.find(s => s.name === syllabusName);

                                    return (
                                        <div
                                            key={syllabusName}
                                            className="flex items-center justify-between p-3 bg-gray-50 rounded-md border border-gray-200"
                                        >
                                            <span>{syllabusName}</span>
                                            <Button
                                                variant="text"
                                                color="error"
                                                onClick={async () => {
                                                    if (!prefix || !syllabus) return;

                                                    try {
                                                        await disconnectSchoolSyllabus(prefix, syllabus.id);

                                                        // Update local state
                                                        setSchoolDetails(prev => ({
                                                            ...prev,
                                                            syllabus: prev.syllabus.filter(s => s !== syllabusName)
                                                        }));

                                                        setSnackbar({
                                                            open: true,
                                                            message: 'Syllabus removed successfully!',
                                                            severity: 'success',
                                                            position: { vertical: 'top', horizontal: 'right' }
                                                        });
                                                    } catch (error) {
                                                        console.error('Error removing syllabus:', error);
                                                        setSnackbar({
                                                            open: true,
                                                            message: 'Failed to remove syllabus',
                                                            severity: 'error',
                                                            position: { vertical: 'top', horizontal: 'right' }
                                                        });
                                                    }
                                                }}
                                                startIcon={<X size={20} />}
                                            >
                                                Remove
                                            </Button>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
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
                                Critical Actions
                            </Typography>
                            <Typography variant="body2" sx={{ mb: 3, color: 'text.secondary' }}>
                                Please read carefully before taking any action. These changes will significantly affect how users can access and use the school system.
                            </Typography>
                        </Box>

                        {/* School Status Section */}
                        <Box sx={{
                            p: 3,
                            borderRadius: 1,
                            mb: 3,
                            transition: 'all 0.3s ease',
                            bgcolor: !schoolStatus.isDeleted
                                ? 'rgba(211, 47, 47, 0.04)'
                                : 'rgba(48, 131, 105, 0.04)',
                            '&:hover': {
                                bgcolor: !schoolStatus.isDeleted
                                    ? 'rgba(211, 47, 47, 0.08)'
                                    : 'rgba(48, 131, 105, 0.08)'
                            }
                        }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Box>
                                    <Typography variant="subtitle1" sx={{ fontWeight: 'medium' }}>
                                        {!schoolStatus.isDeleted ? 'Remove School from System' : 'Restore School Access'}
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: 'text.secondary', mt: 1 }}>
                                        {!schoolStatus.isDeleted
                                            ? "What will happen:\n• School will disappear from the system\n• All users (staff, students, parents) will lose access\n• No one can log in or view school data\n• School won't appear in any lists or searches"
                                            : "What will happen:\n• School will be visible in the system again\n• All users can log in normally\n• All previous data will be accessible\n• School operations can resume as normal"}
                                    </Typography>
                                </Box>
                                <Button
                                    variant="outlined"
                                    color={!schoolStatus.isDeleted ? "error" : "success"}
                                    onClick={() => setConfirmationType(!schoolStatus.isDeleted ? 'deactivate' : 'activate')}
                                    sx={schoolStatus.isDeleted ? {
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
                                    {!schoolStatus.isDeleted ? 'Deactivate' : 'Activate'}
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
                                        {schoolStatus.isBlocked ? 'Allow Operations' : 'Block Operations'}
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: 'text.secondary', mt: 1 }}>
                                        {schoolStatus.isBlocked
                                            ? "What will happen:\n• Users can add and update information again\n• Normal operations can resume\n• All features will be fully functional"
                                            : "What will happen:\n• Users can only view existing information\n• No one can add or update any data\n• Useful during audits or system maintenance\n• School data remains visible but unchangeable"}
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
                                    {schoolStatus.isBlocked ? 'ALLOW' : 'BLOCK'}
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

