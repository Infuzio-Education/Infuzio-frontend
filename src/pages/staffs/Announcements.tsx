import { useState, useEffect, useRef } from "react";
import { Plus, Image as ImageIcon, File, Send, X, MoreVertical, Play } from "lucide-react";
import { CircularProgress, Box, Chip, Avatar, Typography, IconButton, Menu, MenuItem } from "@mui/material";
import { getAnnouncements, getMyClasses, createAnnouncement, getAllClassesInSchool, getAllStandardsInSchool, getAllGroupsInSchool, getAllMediumsInSchool, getAllSectionsInSchool, deleteAnnouncement } from "../../api/staffs";
import { AnnouncementData, ClassItem } from "../../types/Types";
import { format, isToday, isYesterday } from 'date-fns';
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store/store";
import SnackbarComponent from '../../components/SnackbarComponent';


function groupAnnouncementsByDate(announcements: AnnouncementData[]) {
    const groups: { [key: string]: AnnouncementData[] } = {};

    announcements.forEach(announcement => {
        const date = new Date(announcement.created_at);

        if (isNaN(date.getTime())) {
            console.error("Invalid date:", announcement.created_at);
            return;
        }

        let dateString;

        if (isToday(date)) {
            dateString = "Today";
        } else if (isYesterday(date)) {
            dateString = "Yesterday";
        } else {
            dateString = format(date, 'MMMM d, yyyy');
        }

        if (!groups[dateString]) {
            groups[dateString] = [];
        }
        groups[dateString].push(announcement);
    });

    return groups;
}

const maxAnnouncementFileSize = 5 * 1024 * 1024; // 5 MB in bytes
const allowedAnnouncementFileExtensions = new Set([
    ".jpg", ".jpeg", ".png", ".pdf", ".doc", ".docx", ".xls", ".xlsx",
    ".ppt", ".pptx", ".txt", ".mp4", ".avi", ".mov", ".flv", ".wmv",
    ".mp3", ".wav", ".ogg"
]);

const Announcements = () => {
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [announcements, setAnnouncements] = useState<AnnouncementData[]>([]);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [anchorEl, setAnchorEl] = useState<{ [key: number]: HTMLElement | null }>({});
    const [myClasses, setMyClasses] = useState<ClassItem[]>([]);
    const [title, setTitle] = useState('');
    const [body, setBody] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>('');
    const [categoryOptions, setCategoryOptions] = useState<{ value: string; label: string }[]>([]);
    const [categoryIDs, setCategoryIDs] = useState<number[]>([]);
    const [files, setFiles] = useState<File[]>([]);
    const [fileErrors, setFileErrors] = useState<string[]>([]);
    const [, setSelectedClassId] = useState<string>("");
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error' | 'warning' | 'info'>('info');
    const [titleError, setTitleError] = useState<string | null>(null);
    const [bodyError, setBodyError] = useState<string | null>(null);
    const [classError, setClassError] = useState<string | null>(null);
    const [selectedRole, setSelectedRole] = useState<string>("");
    const [roleError, setRoleError] = useState<string | null>(null);
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
    const [announcementToDelete, setAnnouncementToDelete] = useState<number | null>(null);
    const [selectedOptions, setSelectedOptions] = useState<{ value: string; label: string }[]>([]);
    const [selectedClasses, setSelectedClasses] = useState<{ value: string; label: string }[]>([]);

    console.log("Roles", selectedRole);


    const { staffInfo } = useSelector((state: RootState) => state.staffInfo);
    useEffect(() => {
        if (staffInfo?.specialPrivileges?.length === 1) {
            setSelectedRole(staffInfo.specialPrivileges[0].privilege);
        }
    }, [staffInfo]);

    useEffect(() => {
        const fetchAnnouncements = async () => {
            try {
                setLoading(true);
                setError(null);
                const data = await getAnnouncements();
                setAnnouncements(data);
            } catch (error) {
                setError(
                    "Failed to fetch announcements. Please try again later."
                );
                console.error("Error fetching announcements:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchAnnouncements();
    }, []);

    // useEffect(() => {
    //     getSections();
    // }, []);

    useEffect(() => {
        const fetchMyClasses = async () => {
            try {
                const response = await getMyClasses();
                const classesData = response.data ? response.data : response;
                setMyClasses(Array.isArray(classesData) ? classesData : []);
            } catch (error) {
                console.error("Error fetching classes:", error);
                setMyClasses([]);
            }
        };

        fetchMyClasses();
    }, []);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [announcements]);

    const groupedAnnouncements = groupAnnouncementsByDate(announcements);

    const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, announcementId: number) => {
        setAnchorEl(prev => ({
            ...prev,
            [announcementId]: event.currentTarget
        }));
    };

    const handleMenuClose = (announcementId: number) => {
        setAnchorEl(prev => ({
            ...prev,
            [announcementId]: null
        }));
    };

    const handleDelete = async (announcementId: number) => {
        try {
            handleMenuClose(announcementId);
            setAnnouncementToDelete(announcementId);
            setShowDeleteConfirmation(true);
        } catch (error) {
            console.error("Error in delete handler:", error);
            setSnackbarMessage("Error initiating delete. Please try again.");
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
        }
    };

    const confirmDelete = async () => {
        if (!announcementToDelete) return;

        try {
            await deleteAnnouncement(announcementToDelete, staffInfo?.schoolCode || '');

            // Update the announcements list
            setAnnouncements(prevAnnouncements =>
                prevAnnouncements.filter(announcement => announcement.id !== announcementToDelete)
            );

            setSnackbarMessage("Announcement deleted successfully!");
            setSnackbarSeverity('success');
            setSnackbarOpen(true);
        } catch (error) {
            console.error("Error deleting announcement:", error);
            setSnackbarMessage("Error deleting announcement. Please try again.");
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
        } finally {
            setShowDeleteConfirmation(false);
            setAnnouncementToDelete(null);
        }
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newFiles = event.target.files ? Array.from(event.target.files) : [];
        const validFiles: File[] = [];
        const errors: string[] = [];

        newFiles.forEach(file => {
            const fileExtension = file.name.slice(file.name.lastIndexOf('.')).toLowerCase();
            if (!allowedAnnouncementFileExtensions.has(fileExtension)) {
                errors.push(`File type not allowed: ${file.name}`);
            } else if (file.size > maxAnnouncementFileSize) {
                const maxSizeMB = maxAnnouncementFileSize / (1024 * 1024);
                errors.push(`File too large: ${file.name}. Maximum allowed size is ${maxSizeMB} MB.`);
            } else {
                validFiles.push(file);
            }
        });

        // Append new valid files to the existing list of files
        setFiles(prevFiles => [...prevFiles, ...validFiles]);
        setFileErrors(errors);
    };

    const handleRemoveFile = (index: number) => {
        setFiles(prevFiles => prevFiles.filter((_, i) => i !== index));
    };

    const handleClassChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const value = event.target.value;
        const selectedLabel = event.target.options[event.target.selectedIndex].text;

        if (value === "all") {
            // If "All Classes" is selected
            const allClassIds = myClasses.map(cls => cls.id);
            setCategoryIDs(allClassIds.map(id => parseInt(id)));
            setSelectedCategory("cls");
            // Clear any previously selected individual classes
            setSelectedClasses([]);
        } else if (value !== "") {
            // Check if class is already selected
            if (!selectedClasses.some(cls => cls.value === value)) {
                const newClass = { value, label: selectedLabel };
                setSelectedClasses([...selectedClasses, newClass]);
                setSelectedCategory("cls");
                setCategoryIDs([...categoryIDs, parseInt(value)]);
            }
        }
    };

    const handleRemoveClass = (valueToRemove: string) => {
        setSelectedClasses(selectedClasses.filter(cls => cls.value !== valueToRemove));
        setCategoryIDs(categoryIDs.filter(id => id !== parseInt(valueToRemove)));
    };

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    const handleSubmit = async () => {
        let hasError = false;

        // Title validation
        if (!title.trim()) {
            setTitleError("Title is required.");
            hasError = true;
        } else {
            setTitleError(null);
        }

        // Body validation
        if (!body.trim()) {
            setBodyError("Content is required.");
            hasError = true;
        } else {
            setBodyError(null);
        }

        // Role validation (if multiple privileges exist)
        if (staffInfo?.specialPrivileges && staffInfo.specialPrivileges.length > 1 && !selectedRole) {
            setRoleError('Please select a role');
            hasError = true;
        } else {
            setRoleError(null);
        }

        // Category validation
        if (['schoolHead', 'schoolAdmin', 'schoolDeputyHead'].includes(selectedRole)) {
            if (!selectedCategory) {
                setClassError("Please select a category.");
                hasError = true;
            } else if (selectedCategory !== 'all' && selectedOptions.length === 0) {
                setClassError(`Please select at least one ${selectedCategory === 'cls' ? 'class' :
                    selectedCategory === 'std' ? 'standard' :
                        selectedCategory === 'grp' ? 'group' :
                            selectedCategory === 'med' ? 'medium' : 'section'}`);
                hasError = true;
            } else {
                setClassError(null);
            }
        } else {
            // Regular class validation for other roles
            if (selectedClasses.length === 0) {
                setClassError("Please select at least one class.");
                hasError = true;
            } else {
                setClassError(null);
            }
        }

        if (hasError) {
            return;
        }

        if (fileErrors.length > 0) {
            console.error("Cannot submit due to file errors:", fileErrors);
            setSnackbarMessage("Cannot submit due to file errors.");
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
            return;
        }

        try {
            // Create the announcement
            await createAnnouncement({
                selectedCategory,
                categoryIDs,
                title,
                body,
                files,
                authorRole: staffInfo?.specialPrivileges?.length === 1
                    ? staffInfo.specialPrivileges[0].alias
                    : staffInfo?.specialPrivileges?.find(role => role.privilege === selectedRole)?.alias || selectedRole,
            });

            // Show success message
            setSnackbarMessage("Announcement created successfully!");
            setSnackbarSeverity('success');
            setSnackbarOpen(true);

            // Close the modal
            setShowCreateModal(false);

            // Refetch announcements to update the list
            const updatedAnnouncements = await getAnnouncements();
            setAnnouncements(updatedAnnouncements);

            // Reset form fields
            setTitle('');
            setBody('');
            setFiles([]);
            setCategoryIDs([]);
            setSelectedClassId('');
            setSelectedRole('');
            setTitleError(null);
            setBodyError(null);
            setClassError(null);
            setRoleError(null);
            setSelectedOptions([]);
            setSelectedClasses([]);
        } catch (error) {
            console.error("Error creating announcement:", error);
            setSnackbarMessage("Error creating announcement. Please try again.");
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
        }
    };

    const fetchCategoryOptions = async (category: string) => {
        try {
            let response;
            switch (category) {
                case 'cls':
                    response = await getAllClassesInSchool(staffInfo?.schoolCode || '');
                    break;
                case 'std':
                    response = await getAllStandardsInSchool(staffInfo?.schoolCode || '');
                    break;
                case 'grp':
                    response = await getAllGroupsInSchool(staffInfo?.schoolCode || '');
                    break;
                case 'med':
                    response = await getAllMediumsInSchool(staffInfo?.schoolCode || '');
                    break;
                case 'sec':
                    response = await getAllSectionsInSchool(staffInfo?.schoolCode || '');
                    break;
                default:
                    return [];
            }

            // Access the data correctly from the API response
            const data = response.data?.data; // Adjusted to match the response structure
            console.log("Fetched category data:", data);

            if (!Array.isArray(data)) {
                console.error("Invalid data format received from API");
                return [];
            }

            return data.map((item: { id: number; name: string }) => ({
                value: item.id.toString(),
                label: item.name
            }));
        } catch (error) {
            console.error('Error fetching category options:', error);
            return [];
        }
    };

    const handleCategoryChange = async (event: React.ChangeEvent<HTMLSelectElement>) => {
        const category = event.target.value;
        setSelectedCategory(category);

        if (category === 'all') {
            setCategoryIDs([]);
            setCategoryOptions([]);
        } else {
            const options = await fetchCategoryOptions(category);
            setCategoryOptions(options);
            console.log("options", options);
        }
    };

    const handleCategoryIdChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedValue = event.target.value;
        const selectedLabel = event.target.options[event.target.selectedIndex].text;

        // Check if option is already selected
        if (!selectedOptions.some(option => option.value === selectedValue)) {
            const newOption = { value: selectedValue, label: selectedLabel };
            setSelectedOptions([...selectedOptions, newOption]);
            setCategoryIDs([...categoryIDs, parseInt(selectedValue)]);
        }
    };

    const handleRemoveOption = (valueToRemove: string) => {
        setSelectedOptions(selectedOptions.filter(option => option.value !== valueToRemove));
        setCategoryIDs(categoryIDs.filter(id => id !== parseInt(valueToRemove)));
    };

    if (loading) {
        return (
            <div className="h-[calc(100vh-2rem)] flex items-center justify-center">
                <CircularProgress />
            </div>
        );
    }

    if (error) {
        return (
            <div className="h-[calc(100vh-2rem)] flex items-center justify-center text-red-500">
                {error}
            </div>
        );
    }

    return (
        <Box sx={{
            height: 'calc(100vh - 64px)',
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            p: 2,

        }}>
            {/* Header Section */}
            <Box sx={{
                backgroundColor: 'white',
                p: 3,
                borderRadius: 2,
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            }}>
                <Box sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                }}>
                    <Typography variant="h5" sx={{ fontWeight: 600, color: '#1a2b4b' }}>
                        Announcements
                    </Typography>
                    <button
                        onClick={() => setShowCreateModal(true)}
                        className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 
                        transition-colors flex items-center gap-2"
                    >
                        <Plus size={20} />
                        Create Announcement
                    </button>
                </Box>
            </Box>

            {/* Messages Section */}
            <Box sx={{
                flexGrow: 1,
                overflowY: 'auto',
                display: 'flex',
                flexDirection: 'column-reverse',
                borderRadius: 2,
                p: 2,
                gap: 2,
                height: 'calc(100vh - 100px)',
                position: 'relative',
            }}>
                <div ref={messagesEndRef} />
                <Box sx={{ display: 'flex', flexDirection: 'column-reverse' }}>
                    {Object.entries(groupedAnnouncements).map(([date, dateAnnouncements]) => (
                        <Box key={date} sx={{ mb: 4, position: 'relative' }}>
                            <Box
                                sx={{
                                    textAlign: 'center',
                                    position: 'sticky',
                                    top: 10,
                                    zIndex: 2,
                                    pt: 1.8,
                                    width: '100%',
                                }}
                            >
                                <Chip
                                    label={date}
                                    sx={{
                                        backgroundColor: 'antiquewhite',
                                        fontSize: '0.8rem',
                                        fontWeight: 500,
                                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                                        py: 0.5,
                                    }}
                                />
                            </Box>
                            {/* Announcements for this date */}
                            <Box sx={{ mt: 2 }}>
                                {dateAnnouncements.slice().reverse().map((announcement) => (
                                    <Box
                                        key={announcement.id}
                                        sx={{
                                            mb: 2.5,
                                            p: 0,
                                            borderRadius: 3,
                                            transition: 'transform 0.2s ease-in-out',
                                            '&:hover': {
                                                transform: 'translateY(-2px)',
                                            },
                                            ml: announcement.authorID === staffInfo?.staffID ? 'auto' : 0,
                                            // width: 'fit-content',
                                            maxWidth: '80%',
                                        }}
                                    >
                                        <Box sx={{
                                            backgroundColor: announcement.authorID === staffInfo?.staffID ? '#ecffec' : 'white',
                                            borderRadius: 3,
                                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                                            overflow: 'hidden',
                                        }}>
                                            {/* Header Section with gradient background */}
                                            <Box sx={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                p: 2,
                                                backgroundColor: announcement.authorID === staffInfo?.staffID ? '#ecffec' : 'white',
                                                borderBottom: '1px solid rgba(0,0,0,0.05)',
                                            }}>
                                                <Avatar
                                                    src={announcement.author_profile_pic}
                                                    sx={{
                                                        mr: 1.5,
                                                        width: 48,
                                                        height: 48,
                                                        border: '2px solid white',
                                                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                                                        bgcolor: 'green',
                                                    }}
                                                >
                                                    {announcement.author[0]}
                                                </Avatar>
                                                <Box sx={{ flexGrow: 1 }}>
                                                    <Typography variant="subtitle1" sx={{
                                                        fontWeight: 600,
                                                        color: '#1a2b4b',
                                                        lineHeight: 1.2,
                                                    }}>
                                                        {announcement.author}
                                                    </Typography>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                        <Typography variant="caption" sx={{
                                                            color: '#64748b',
                                                            fontWeight: 500,
                                                        }}>
                                                            {announcement.authorRole}
                                                        </Typography>
                                                        <Typography variant="caption" sx={{
                                                            color: '#94a3b8',
                                                        }}>
                                                            • {format(new Date(announcement.created_at), 'h:mm a')}
                                                        </Typography>
                                                    </Box>
                                                </Box>

                                                {/* Audience Category Names */}
                                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mr: 2 }}>
                                                    {announcement.audienceCategoryNames?.map((name, index) => (
                                                        <Chip
                                                            key={index}
                                                            label={name}
                                                            size="small"
                                                            sx={{
                                                                backgroundColor: '#e2e8f0',
                                                                color: '#475569',
                                                                fontSize: '0.75rem',
                                                                fontWeight: 500,
                                                                borderRadius: 1,
                                                                '&:hover': {
                                                                    backgroundColor: '#cbd5e1',
                                                                },
                                                            }}
                                                        />
                                                    ))}
                                                </Box>

                                                {/* Add the 3-dot menu only for user's own announcements */}
                                                {announcement.authorID === staffInfo?.staffID && (
                                                    <>
                                                        <IconButton
                                                            onClick={(e) => handleMenuOpen(e, announcement.id)}
                                                            sx={{
                                                                '&:hover': {
                                                                    backgroundColor: 'rgba(0,0,0,0.04)',
                                                                },
                                                            }}
                                                        >
                                                            <MoreVertical size={20} color="#64748b" />
                                                        </IconButton>

                                                        {/* Menu component */}
                                                        <Menu
                                                            anchorEl={anchorEl[announcement.id]}
                                                            open={Boolean(anchorEl[announcement.id])}
                                                            onClose={() => handleMenuClose(announcement.id)}
                                                            PaperProps={{
                                                                sx: {
                                                                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                                                                    borderRadius: 2,
                                                                    minWidth: 120,
                                                                },
                                                            }}
                                                        >
                                                            <MenuItem
                                                                onClick={() => handleDelete(announcement.id)}
                                                                sx={{
                                                                    color: '#ef4444',
                                                                    '&:hover': {
                                                                        backgroundColor: 'rgba(239, 68, 68, 0.04)',
                                                                    },
                                                                    fontSize: '0.875rem',
                                                                    py: 1,
                                                                    borderTop: '1px solid rgba(0,0,0,0.05)',
                                                                }}
                                                            >
                                                                Delete
                                                            </MenuItem>
                                                        </Menu>
                                                    </>
                                                )}
                                            </Box>

                                            {/* Content Section */}
                                            <Box sx={{ p: 2.5 }}>
                                                <Typography variant="h6" sx={{
                                                    mb: 1.5,
                                                    color: '#1e293b',
                                                    fontSize: '1.1rem',
                                                    fontWeight: 600,
                                                }}>
                                                    {announcement.title}
                                                </Typography>
                                                <Typography variant="body1" sx={{
                                                    mb: 2,
                                                    color: '#475569',
                                                    lineHeight: 1.6,
                                                }}>
                                                    {announcement.body}
                                                </Typography>

                                                {/* Attachments Section */}
                                                {announcement.fileLinks && announcement.fileLinks.length > 0 && (
                                                    <Box sx={{
                                                        display: 'flex',
                                                        flexDirection: 'column',
                                                        gap: 2,
                                                        mt: 2,
                                                        pt: 2,
                                                        borderTop: '1px solid rgba(0,0,0,0.05)',
                                                    }}>
                                                        {/* Images Grid */}
                                                        {announcement.fileLinks.some(file => file.fileType === "Image") && (
                                                            <Box sx={{
                                                                display: 'grid',
                                                                gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                                                                gap: 2,
                                                                width: '100%'
                                                            }}>
                                                                {announcement.fileLinks
                                                                    .filter(file => file.fileType === "Image")
                                                                    .map((file, index) => (
                                                                        <Box
                                                                            key={index}
                                                                            sx={{
                                                                                position: 'relative',
                                                                                paddingTop: '75%',
                                                                                borderRadius: 2,
                                                                                overflow: 'hidden',
                                                                                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                                                                                '&:hover': {
                                                                                    '& .overlay': {
                                                                                        opacity: 1,
                                                                                    }
                                                                                }
                                                                            }}
                                                                        >
                                                                            <img
                                                                                src={file.link}
                                                                                alt="Attachment"
                                                                                style={{
                                                                                    position: 'absolute',
                                                                                    top: 0,
                                                                                    left: 0,
                                                                                    width: '100%',
                                                                                    height: '100%',
                                                                                    objectFit: 'cover',
                                                                                }}
                                                                            />
                                                                            <Box
                                                                                className="overlay"
                                                                                sx={{
                                                                                    position: 'absolute',
                                                                                    top: 0,
                                                                                    left: 0,
                                                                                    right: 0,
                                                                                    bottom: 0,
                                                                                    bgcolor: 'rgba(0,0,0,0.5)',
                                                                                    display: 'flex',
                                                                                    justifyContent: 'center',
                                                                                    alignItems: 'center',
                                                                                    gap: 1,
                                                                                    opacity: 0,
                                                                                    transition: 'opacity 0.2s ease',
                                                                                }}
                                                                            >
                                                                                <IconButton
                                                                                    component="a"
                                                                                    href={file.link}
                                                                                    target="_blank"
                                                                                    sx={{
                                                                                        bgcolor: 'white',
                                                                                        '&:hover': {
                                                                                            bgcolor: '#f8fafc',
                                                                                        }
                                                                                    }}
                                                                                >
                                                                                    <ImageIcon size={24} color="#64748b" />
                                                                                </IconButton>
                                                                            </Box>
                                                                        </Box>
                                                                    ))}
                                                            </Box>
                                                        )}

                                                        {/* Documents Section */}
                                                        {announcement.fileLinks.some(file => file.fileType === "Document") && (
                                                            <Box sx={{
                                                                display: 'flex',
                                                                flexWrap: 'wrap',
                                                                gap: 1,
                                                            }}>
                                                                {announcement.fileLinks
                                                                    .filter(file => file.fileType === "Document")
                                                                    .map((file, index) => (
                                                                        <Box
                                                                            key={index}
                                                                            sx={{
                                                                                bgcolor: '#f8fafc',
                                                                                borderRadius: 2,
                                                                                border: '1px solid lightgreen',
                                                                                p: 1.5,
                                                                                display: 'flex',
                                                                                alignItems: 'center',
                                                                                gap: 1,
                                                                                transition: 'all 0.2s ease',
                                                                                cursor: 'pointer',
                                                                                '&:hover': {
                                                                                    bgcolor: '#f1f5f9',
                                                                                    transform: 'translateY(-1px)',
                                                                                }
                                                                            }}
                                                                            component="a"
                                                                            href={file.link}
                                                                            target="_blank"
                                                                        >
                                                                            <File size={20} color="#64748b" />
                                                                            <Typography sx={{
                                                                                color: '#475569',
                                                                                fontSize: '0.875rem',
                                                                                fontWeight: 500
                                                                            }}>
                                                                                Document {index + 1}
                                                                            </Typography>
                                                                        </Box>
                                                                    ))}
                                                            </Box>
                                                        )}

                                                        {/* Audio Section */}
                                                        {announcement.fileLinks
                                                            .filter(file => file.fileType === "Audio")
                                                            .map((file, index) => (
                                                                <Box
                                                                    key={index}
                                                                    sx={{
                                                                        width: '100%',
                                                                        bgcolor: '#f8fafc',
                                                                        borderRadius: 2,
                                                                        p: 2,
                                                                        border: '1px solid rgba(0,0,0,0.05)',
                                                                    }}
                                                                >
                                                                    <audio
                                                                        controls
                                                                        src={file.link}
                                                                        style={{
                                                                            width: '100%',
                                                                            height: 40,
                                                                            borderRadius: 8,
                                                                        }}
                                                                    >
                                                                        Your browser does not support the audio element.
                                                                    </audio>
                                                                </Box>
                                                            ))}

                                                        {/* Video Section */}
                                                        {announcement.fileLinks.some(file => file.fileType === "Video") && (
                                                            <Box sx={{
                                                                display: 'grid',
                                                                gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                                                                gap: 2,
                                                                width: '100%'
                                                            }}>
                                                                {announcement.fileLinks
                                                                    .filter(file => file.fileType === "Video")
                                                                    .map((file, index) => (
                                                                        <Box
                                                                            key={index}
                                                                            sx={{
                                                                                position: 'relative',
                                                                                paddingTop: '75%',
                                                                                borderRadius: 2,
                                                                                overflow: 'hidden',
                                                                                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                                                                                '&:hover': {
                                                                                    '& .overlay': {
                                                                                        opacity: 1,
                                                                                    }
                                                                                }
                                                                            }}
                                                                        >
                                                                            <video
                                                                                src={file.link}
                                                                                style={{
                                                                                    position: 'absolute',
                                                                                    top: 0,
                                                                                    left: 0,
                                                                                    width: '100%',
                                                                                    height: '100%',
                                                                                    objectFit: 'cover',
                                                                                }}
                                                                            />
                                                                            <Box
                                                                                className="overlay"
                                                                                sx={{
                                                                                    position: 'absolute',
                                                                                    top: 0,
                                                                                    left: 0,
                                                                                    right: 0,
                                                                                    bottom: 0,
                                                                                    bgcolor: 'rgba(0,0,0,0.5)',
                                                                                    display: 'flex',
                                                                                    justifyContent: 'center',
                                                                                    alignItems: 'center',
                                                                                    gap: 1,
                                                                                    opacity: 0,
                                                                                    transition: 'opacity 0.2s ease',
                                                                                }}
                                                                            >
                                                                                <IconButton
                                                                                    component="a"
                                                                                    href={file.link}
                                                                                    target="_blank"
                                                                                    sx={{
                                                                                        bgcolor: 'white',
                                                                                        '&:hover': {
                                                                                            bgcolor: '#f8fafc',
                                                                                        }
                                                                                    }}
                                                                                >
                                                                                    <Play size={24} color="#64748b" />
                                                                                </IconButton>
                                                                            </Box>
                                                                        </Box>
                                                                    ))}
                                                            </Box>
                                                        )}
                                                    </Box>
                                                )}
                                            </Box>
                                        </Box>
                                    </Box>
                                ))}
                            </Box>
                        </Box>
                    ))}
                </Box>
            </Box>

            {/* Snackbar Component */}
            <SnackbarComponent
                open={snackbarOpen}
                message={snackbarMessage}
                severity={snackbarSeverity}
                position={{
                    vertical: 'top',
                    horizontal: 'center'
                }}
                onClose={handleSnackbarClose}
            />

            {/* Create Announcement Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-xl shadow-xl w-[800px] max-h-[80vh] flex flex-col">
                        {/* Modal Header - Fixed */}
                        <div className="p-6 border-b flex justify-between items-center">
                            <h2 className="text-xl font-semibold text-gray-800">
                                Create New Announcement
                            </h2>
                            <button
                                onClick={() => setShowCreateModal(false)}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Modal Content - Scrollable */}
                        <div className="p-6 space-y-4 overflow-y-auto flex-1">
                            {/* Role Dropdown (only shown if there are two or more privileges) */}
                            {staffInfo?.specialPrivileges && staffInfo.specialPrivileges.length > 1 && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Select Role
                                    </label>
                                    <select
                                        value={selectedRole}
                                        onChange={(e) => {
                                            setSelectedRole(e.target.value);
                                            if (roleError) setRoleError(null);
                                        }}
                                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 
                                        focus:ring-emerald-500 focus:border-emerald-500 outline-none
                                        ${roleError ? 'border-red-500' : 'border-gray-300'}`}
                                        required
                                    >
                                        <option value="">Select Role</option>
                                        {staffInfo?.specialPrivileges?.map((role, index) => (
                                            <option key={index} value={role.privilege}>
                                                {role.alias}
                                            </option>
                                        ))}
                                    </select>
                                    {roleError && <div className="text-red-500 mt-1 text-sm">{roleError}</div>}
                                </div>
                            )}

                            {/* Title Field */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Title
                                </label>
                                <input
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="Enter announcement title"
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 
                                    focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                                />
                                {titleError && <div className="text-red-500 mt-1">{titleError}</div>}
                            </div>

                            {/* Content Field */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Content
                                </label>
                                <textarea
                                    rows={4}
                                    value={body}
                                    onChange={(e) => setBody(e.target.value)}
                                    placeholder="Write your announcement here..."
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 
                                    focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                                />
                                {bodyError && <div className="text-red-500 mt-1">{bodyError}</div>}
                            </div>

                            {/* Category Dropdown */}
                            {['schoolHead', 'schoolAdmin', 'schoolDeputyHead'].includes(selectedRole) ? (
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Select Category
                                        </label>
                                        <select
                                            value={selectedCategory}
                                            onChange={handleCategoryChange}
                                            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 
                                            focus:ring-emerald-500 focus:border-emerald-500 outline-none
                                            ${classError ? 'border-red-500' : 'border-gray-300'}`}
                                            required
                                        >
                                            <option value="">Select Category</option>
                                            <option value="all">Whole School</option>
                                            <option value="cls">Classes</option>
                                            <option value="std">Standards</option>
                                            <option value="grp">Groups</option>
                                            <option value="med">Mediums</option>
                                            <option value="sec">Sections</option>
                                        </select>
                                        {classError && <div className="text-red-500 mt-1 text-sm">{classError}</div>}
                                    </div>

                                    {selectedCategory && selectedCategory !== 'all' && (
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Select {selectedCategory === 'cls' ? 'Classes' :
                                                    selectedCategory === 'std' ? 'Standards' :
                                                        selectedCategory === 'grp' ? 'Groups' :
                                                            selectedCategory === 'med' ? 'Mediums' : 'Sections'}
                                            </label>
                                            <select
                                                value=""
                                                onChange={handleCategoryIdChange}
                                                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 
                                                focus:ring-emerald-500 focus:border-emerald-500 outline-none
                                                ${classError ? 'border-red-500' : 'border-gray-300'}`}
                                                required
                                            >
                                                <option value="">Select Option</option>
                                                {categoryOptions.map(option => (
                                                    <option
                                                        key={option.value}
                                                        value={option.value}
                                                        className="p-2"
                                                    >
                                                        {option.label}
                                                    </option>
                                                ))}
                                            </select>

                                            {/* Display selected options */}
                                            <div className="mt-2 flex flex-wrap gap-2">
                                                {selectedOptions.map((option) => (
                                                    <div
                                                        key={option.value}
                                                        className="bg-emerald-50 px-3 py-1 rounded-full flex items-center gap-2"
                                                    >
                                                        <span className="text-sm text-emerald-800">{option.label}</span>
                                                        <button
                                                            onClick={() => handleRemoveOption(option.value)}
                                                            className="text-emerald-600 hover:text-emerald-800"
                                                        >
                                                            <X size={14} />
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                            {classError && <div className="text-red-500 mt-1 text-sm">{classError}</div>}
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Select Class
                                    </label>
                                    <select
                                        value=""
                                        onChange={handleClassChange}
                                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 
                                        focus:ring-emerald-500 focus:border-emerald-500 outline-none
                                        ${classError ? 'border-red-500' : 'border-gray-300'}`}
                                        required
                                    >
                                        <option value="">Select Class</option>
                                        <option value="all">All Classes</option>
                                        {Array.isArray(myClasses) && myClasses.map((cls) => (
                                            <option
                                                key={cls.id}
                                                value={cls.id.toString()}
                                            >
                                                {cls.name} {cls.section}
                                                {cls.id.toString() === staffInfo?.classTeacherClassID?.toString() ? " (My Class)" : ""}
                                            </option>
                                        ))}
                                    </select>

                                    {/* Display selected classes */}
                                    <div className="mt-2 flex flex-wrap gap-2">
                                        {selectedClasses.map((cls) => (
                                            <div
                                                key={cls.value}
                                                className="bg-emerald-50 px-3 py-1 rounded-full flex items-center gap-2"
                                            >
                                                <span className="text-sm text-emerald-800">{cls.label}</span>
                                                <button
                                                    onClick={() => handleRemoveClass(cls.value)}
                                                    className="text-emerald-600 hover:text-emerald-800"
                                                >
                                                    <X size={14} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                    {classError && <div className="text-red-500 mt-1 text-sm">{classError}</div>}
                                </div>
                            )}

                            {/* Attachments Field */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Attachments
                                </label>
                                <input
                                    type="file"
                                    multiple
                                    onChange={handleFileChange}
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 
                                    focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                                />
                                {fileErrors.length > 0 && (
                                    <div className="text-red-500 mt-2">
                                        {fileErrors.map((error, index) => (
                                            <div key={index}>{error}</div>
                                        ))}
                                    </div>
                                )}
                                <div className="mt-2">
                                    {files.map((file, index) => (
                                        <div key={index} className="flex items-center justify-between bg-gray-100 p-2 rounded-lg mb-1">
                                            <span className="text-gray-700">{file.name}</span>
                                            <button
                                                onClick={() => handleRemoveFile(index)}
                                                className="text-red-500 hover:text-red-700"
                                            >
                                                <X size={16} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Modal Footer - Fixed */}
                        <div className="p-6 border-t bg-gray-50 flex justify-end gap-3 mt-auto">
                            <button
                                onClick={() => setShowCreateModal(false)}
                                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSubmit}
                                className="px-4 py-2 bg-emerald-500 text-white rounded-lg 
                                hover:bg-emerald-600 flex items-center gap-2"
                            >
                                <Send size={20} />
                                Post Announcement
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteConfirmation && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-xl shadow-xl p-6 max-w-md w-full">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">
                            Delete Announcement
                        </h2>
                        <p className="text-gray-600 mb-6">
                            Are you sure you want to delete this announcement? This action cannot be undone.
                        </p>
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => {
                                    setShowDeleteConfirmation(false);
                                    setAnnouncementToDelete(null);
                                }}
                                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmDelete}
                                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </Box>
    );
};

export default Announcements;
