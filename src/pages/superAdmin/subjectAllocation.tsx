import { useState, useEffect } from 'react';
import { getSubjectAllocation, getSchoolStandards, getSchoolGroups, getSchoolSubjects, getSchoolSyllabus, saveSubjectAllocations, removeSubjectAllocation, updateSubjectAllocation } from '../../api/superAdmin';
import { useSchoolContext } from '../../contexts/SchoolContext';
import { Modal, Box, Switch, TextField } from '@mui/material';
import { X, PlusCircle } from 'lucide-react';
import { SubjectAllocationResponse, Standard as SchoolStandard } from '../../types/Types';
import SnackbarComponent from '../../components/SnackbarComponent';

interface AllocationStandard {
    id: number;
    name: string;
    groups: Group[];
}

interface Subject {
    id: number;
    name: string;
    defaultMaxMarks: number;
    hasTermExam: boolean;
}

interface Group {
    id: number | null;
    name: string | null;
    subjects: Subject[];
}

interface Syllabus {
    id: number;
    name: string;
    standards: AllocationStandard[];
}

// Add this interface for school groups
interface SchoolGroup {
    ID: number;
    Name: string;
}

// Update the SchoolSubject interface to match the API response
interface SchoolSubject {
    id: number;
    name: string;
    code: string;
}

interface SubjectAllocationRequest {
    syllabusId: number;
    standardId: number;
    groupId: number | null;
    subjectAllocations: {
        subjectId: number;
        isElective: boolean;
        hasTermExam: boolean;
        defaultMaxMarks: number;
    }[];
}


const SubjectAllocation = () => {
    const [syllabuses, setSyllabuses] = useState<Syllabus[]>([]);
    const [selectedSyllabus, setSelectedSyllabus] = useState<Syllabus | null>(null);
    const [selectedStandard, setSelectedStandard] = useState<AllocationStandard | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [openModal, setOpenModal] = useState(false);
    const { schoolInfo } = useSchoolContext();
    const [editedSubjects, setEditedSubjects] = useState<{
        [key: number]: { defaultMaxMarks: number; hasTermExam: boolean }
    }>({});
    const [, setHasChanges] = useState(false);
    const [editingSubjectId, setEditingSubjectId] = useState<number | null>(null);
    const [showStandardDropdown, setShowStandardDropdown] = useState(false);
    const [standards, setStandards] = useState<SchoolStandard[]>([]);
    const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
    const [schoolGroups, setSchoolGroups] = useState<SchoolGroup[]>([]);
    const [schoolSubjects, setSchoolSubjects] = useState<SchoolSubject[]>([]);

    const [subjectSelectionModalOpen, setSubjectSelectionModalOpen] = useState(false);
    const [selectedSubjects, setSelectedSubjects] = useState<Subject[]>([]);
    const [snackbarState, setSnackbarState] = useState({
        open: false,
        message: '',
        type: '' as 'success' | 'error'
    });

    const [groupModalOpen, setGroupModalOpen] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                if (!schoolInfo?.schoolPrefix) {
                    throw new Error('School prefix not found');
                }

                // Fetch syllabuses first
                const syllabusResponse = await getSchoolSyllabus(schoolInfo.schoolPrefix);
                if (syllabusResponse.status === true && syllabusResponse.data?.global) {
                    // Map the syllabus data to match our interface
                    const mappedSyllabuses: Syllabus[] = syllabusResponse.data.global.map((syllabus: any) => ({
                        id: syllabus.id,
                        name: syllabus.name,
                        standards: [] // Initialize with empty standards
                    }));
                    setSyllabuses(mappedSyllabuses);
                }

                // Fetch subject allocations
                const allocationResponse: SubjectAllocationResponse = await getSubjectAllocation(schoolInfo.schoolPrefix);
                if (allocationResponse.data?.syllabuses) {
                    // Update the syllabuses with allocation data
                    setSyllabuses(prev => {
                        const updatedSyllabuses = [...prev];
                        allocationResponse.data.syllabuses.forEach(allocation => {
                            const syllabusIndex = updatedSyllabuses.findIndex(s => s.id === allocation.id);
                            if (syllabusIndex !== -1) {
                                updatedSyllabuses[syllabusIndex] = {
                                    ...updatedSyllabuses[syllabusIndex],
                                    standards: allocation.standards.map(standard => ({
                                        id: standard.id,
                                        name: standard.name,
                                        groups: standard.groups.map(group => ({
                                            id: group.id,
                                            name: group.name,
                                            subjects: group.subjects.map(subject => ({
                                                id: subject.id,
                                                name: subject.name,
                                                defaultMaxMarks: subject.defaultMaxMarks,
                                                hasTermExam: subject.hasTermExam
                                            }))
                                        }))
                                    }))
                                };
                            }
                        });
                        return updatedSyllabuses;
                    });
                }
            } catch (error) {
                console.error('Error fetching data:', error);
                setError('Failed to load subject allocation data');
            } finally {
                setLoading(false);
            }
        };

        if (schoolInfo?.schoolPrefix) {
            fetchData();
        }
    }, [schoolInfo]);

    useEffect(() => {
        const fetchSchoolStandards = async () => {
            try {
                if (!schoolInfo?.schoolPrefix) {
                    throw new Error('School prefix not found');
                }
                const response = await getSchoolStandards(schoolInfo.schoolPrefix);
                if (response.status === true) {
                    setStandards(response.data);
                }
            } catch (error) {
                console.error('Error fetching school standards:', error);
            }
        };

        if (schoolInfo?.schoolPrefix) {
            fetchSchoolStandards();
        }
    }, [schoolInfo?.schoolPrefix]);

    useEffect(() => {
        const fetchSchoolGroups = async () => {
            try {
                if (!schoolInfo?.schoolPrefix) {
                    throw new Error('School prefix not found');
                }
                const response = await getSchoolGroups(schoolInfo.schoolPrefix);
                if (response.status === true) {
                    setSchoolGroups(response.data);
                }
            } catch (error) {
                console.error('Error fetching school groups:', error);
            }
        };

        if (selectedStandard && standards.find(s => s.ID === selectedStandard.id)?.HasGroup) {
            fetchSchoolGroups();
        }
    }, [selectedStandard, schoolInfo?.schoolPrefix, standards]);

    useEffect(() => {
        const fetchSchoolSubjects = async () => {
            try {
                if (!schoolInfo?.schoolPrefix) {
                    throw new Error('School prefix not found');
                }
                const response = await getSchoolSubjects(schoolInfo.schoolPrefix);
                console.log("RES", response);
                if (response.status === true) {
                    setSchoolSubjects(response.data);
                }
            } catch (error) {
                console.error('Error fetching school subjects:', error);
            }
        };

        if (openModal) {
            fetchSchoolSubjects();
        }
    }, [openModal, schoolInfo?.schoolPrefix]);



    const handleTermExamChange = (subjectId: number, checked: boolean) => {
        setEditedSubjects(prev => ({
            ...prev,
            [subjectId]: {
                ...prev[subjectId],
                hasTermExam: checked
            }
        }));
        setHasChanges(true);
    };

    const handleEditClick = async (subjectId: number) => {
        try {
            const editedSubject = editedSubjects[subjectId];
            if (!editedSubject) return;

            // API call will be implemented here
            console.log('Saving changes for subject:', subjectId, editedSubject);

            // Reset editing state after successful save
            setEditingSubjectId(null);
            setEditedSubjects(prev => {
                const newState = { ...prev };
                delete newState[subjectId];
                return newState;
            });
        } catch (error) {
            console.error('Error saving subject changes:', error);
        }
    };

    const handleRemoveAllocation = async (subject: Subject) => {
        try {
            if (!schoolInfo?.schoolPrefix || !selectedSyllabus || !selectedStandard) {
                setSnackbarState({
                    open: true,
                    message: 'Missing required information',
                    type: 'error'
                });
                return;
            }

            const response = await removeSubjectAllocation(
                schoolInfo.schoolPrefix,
                {
                    subjectId: subject.id,
                    standardId: selectedStandard.id,
                    syllabusId: selectedSyllabus.id,
                    groupId: selectedGroup?.id || null
                }
            );

            if (response.status === true) {
                // Update the local state to reflect the removal
                setSyllabuses(prevSyllabuses => {
                    return prevSyllabuses.map(syllabus => {
                        if (syllabus.id === selectedSyllabus.id) {
                            return {
                                ...syllabus,
                                standards: syllabus.standards.map(standard => {
                                    if (standard.id === selectedStandard.id) {
                                        return {
                                            ...standard,
                                            groups: standard.groups.map(group => ({
                                                ...group,
                                                subjects: group.subjects.filter(s => s.id !== subject.id)
                                            }))
                                        };
                                    }
                                    return standard;
                                })
                            };
                        }
                        return syllabus;
                    });
                });

                // Update selectedStandard to reflect the removal
                setSelectedStandard(prevStandard => {
                    if (!prevStandard) return null;
                    return {
                        ...prevStandard,
                        groups: prevStandard.groups.map(group => ({
                            ...group,
                            subjects: group.subjects.filter(s => s.id !== subject.id)
                        }))
                    };
                });

                // Check if there are any subjects left in the current group
                const remainingSubjects = getCurrentGroupSubjects().filter(s => s.id !== subject.id);
                if (remainingSubjects.length === 0) {
                    setOpenModal(false);
                    setShowStandardDropdown(false);
                    setSelectedStandard(null);
                    setSelectedGroup(null);
                }

                setSnackbarState({
                    open: true,
                    message: 'Subject allocation removed successfully',
                    type: 'success'
                });

                return false;
            }
        } catch (error) {
            console.error('Error removing allocation:', error);
            setSnackbarState({
                open: true,
                message: 'Failed to remove subject allocation',
                type: 'error'
            });
        }
    };

    const handleAddNewSubject = () => {
        setShowStandardDropdown(true);
        setOpenModal(true);
    };

    // Helper function to convert SchoolStandard to AllocationStandard
    const convertToAllocationStandard = (standard: SchoolStandard): AllocationStandard => ({
        id: standard.ID,
        name: standard.Name,
        groups: standard.HasGroup
            ? [] // Empty array for group-enabled standards, will be populated when group is selected
            : [{ // Default group for standards without groups
                id: null,
                name: null,
                subjects: []
            }]
    });

    // Update the findStandardAllocation function
    const findStandardAllocation = (standardId: number): AllocationStandard | null => {
        for (const syllabus of syllabuses) {
            const standard = syllabus.standards.find(s => s.id === standardId);
            if (standard) return standard;
        }
        return null;
    };

    // Update the handleStandardClick function
    const handleStandardClick = (standard: AllocationStandard) => {
        setSelectedStandard(standard);

        // If standard has groups, select the first non-null group or create a default group
        if (standards.find(s => s.ID === standard.id)?.HasGroup) {
            const nonNullGroups = standard.groups.filter(g => g.id !== null);
            if (nonNullGroups.length > 0) {
                setSelectedGroup(nonNullGroups[0]);
            } else {
                // If no groups exist, open the group selection modal
                setGroupModalOpen(true);
            }
        } else {
            // For standards without groups, select the default group
            const defaultGroup = standard.groups.find(g => g.id === null);
            setSelectedGroup(defaultGroup || null);
        }

        setOpenModal(true);
    };

    // Update the handleStandardChange function
    const handleStandardChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const standardId = Number(e.target.value);
        const schoolStandard = standards?.find(s => s.ID === standardId);
        if (schoolStandard) {
            const existingAllocation = findStandardAllocation(standardId);
            if (existingAllocation) {
                setSelectedStandard(existingAllocation);

                // If standard has groups, select the first non-null group or open group selection
                if (schoolStandard.HasGroup) {
                    const nonNullGroups = existingAllocation.groups.filter(g => g.id !== null);
                    if (nonNullGroups.length > 0) {
                        setSelectedGroup(nonNullGroups[0]);
                    } else {
                        setGroupModalOpen(true);
                    }
                } else {
                    // For standards without groups, select the default group
                    const defaultGroup = existingAllocation.groups.find(g => g.id === null);
                    setSelectedGroup(defaultGroup || null);
                }
            } else {
                const newStandard = convertToAllocationStandard(schoolStandard);
                setSelectedStandard(newStandard);

                // For new standards with groups, open group selection
                if (schoolStandard.HasGroup) {
                    setGroupModalOpen(true);
                } else {
                    // For standards without groups, set the default group
                    setSelectedGroup(newStandard.groups[0]);
                }
            }
        }
    };

    const handleSaveAllocations = async () => {
        try {
            // Validate syllabus and standard selection
            if (!selectedSyllabus || !selectedStandard) {
                setSnackbarState({
                    open: true,
                    message: 'Please select syllabus and standard',
                    type: 'error'
                });
                return;
            }

            // Validate group selection for standards with groups
            if (standards.find(s => s.ID === selectedStandard.id)?.HasGroup && !selectedGroup?.id) {
                setSnackbarState({
                    open: true,
                    message: 'Please select a group',
                    type: 'error'
                });
                return;
            }

            // Get existing subjects from the current group
            const existingSubjects = getCurrentGroupSubjects();

            // Combine existing and newly selected subjects, removing duplicates
            const allSubjects = [
                ...existingSubjects,
                ...selectedSubjects.filter(newSubject =>
                    !existingSubjects.some(existingSubject =>
                        existingSubject.id === newSubject.id
                    )
                )
            ];

            // Validate that there are subjects to allocate
            if (allSubjects.length === 0) {
                setSnackbarState({
                    open: true,
                    message: 'Please add at least one subject',
                    type: 'error'
                });
                return;
            }

            if (!schoolInfo?.schoolPrefix) {
                throw new Error('School prefix not found');
            }

            const requestBody: SubjectAllocationRequest = {
                syllabusId: selectedSyllabus.id,
                standardId: selectedStandard.id,
                groupId: selectedGroup?.id || null,
                subjectAllocations: allSubjects.map(subject => ({
                    subjectId: subject.id,
                    isElective: false,
                    hasTermExam: editedSubjects[subject.id]?.hasTermExam ?? subject.hasTermExam,
                    defaultMaxMarks: editedSubjects[subject.id]?.defaultMaxMarks ?? subject.defaultMaxMarks
                }))
            };

            // Use updateSubjectAllocation when editing (not showing standard dropdown)
            // Use saveSubjectAllocations when adding new (showing standard dropdown)
            const response = !showStandardDropdown
                ? await updateSubjectAllocation(schoolInfo.schoolPrefix, requestBody)
                : await saveSubjectAllocations(schoolInfo.schoolPrefix, requestBody);

            if (response.status === true) {
                // Refresh the data first
                const updatedResponse = await getSubjectAllocation(schoolInfo.schoolPrefix);
                if (updatedResponse.data?.syllabuses) {
                    setSyllabuses(updatedResponse.data.syllabuses);

                    // Update the selected syllabus and standard with new data
                    const updatedSyllabus = updatedResponse.data.syllabuses.find(s => s.id === selectedSyllabus.id);
                    if (updatedSyllabus) {
                        setSelectedSyllabus(updatedSyllabus);
                        const updatedStandard = updatedSyllabus.standards.find(s => s.id === selectedStandard.id);
                        if (updatedStandard) {
                            setSelectedStandard(updatedStandard);
                        }
                    }
                }

                setSnackbarState({
                    open: true,
                    message: `Subject allocation ${!showStandardDropdown ? 'updated' : 'saved'} successfully`,
                    type: 'success'
                });

                // Reset other states
                setSelectedSubjects([]);
                setOpenModal(false);
                setShowStandardDropdown(false);
                setSelectedGroup(null);
                setEditedSubjects({});
            }
        } catch (error) {
            console.error('Error saving subject allocations:', error);
            setSnackbarState({
                open: true,
                message: `Failed to ${!showStandardDropdown ? 'update' : 'save'} subject allocation`,
                type: 'error'
            });
        }
    };

    // Update the getCurrentGroupSubjects function to properly combine subjects
    const getCurrentGroupSubjects = (): Subject[] => {
        if (!selectedStandard) return [];

        // Get existing subjects from the current group
        let existingSubjects: Subject[] = [];

        // If standard has groups enabled
        if (standards.find(s => s.ID === selectedStandard.id)?.HasGroup) {
            // Get subjects only for selected group
            const group = selectedStandard.groups.find(g => g.id === selectedGroup?.id);
            existingSubjects = group?.subjects || [];
        } else {
            // If standard doesn't have groups, get subjects from the default group
            const defaultGroup = selectedStandard.groups.find(g => g.id === null);
            existingSubjects = defaultGroup?.subjects || [];
        }

        // Return combined subjects without duplicates using a Map
        const subjectsMap = new Map();

        // Add existing subjects to map
        existingSubjects.forEach(subject => {
            subjectsMap.set(subject.id, subject);
        });

        // Add selected subjects to map (will override if already exists)
        selectedSubjects.forEach(subject => {
            if (!subjectsMap.has(subject.id)) {
                subjectsMap.set(subject.id, subject);
            }
        });

        return Array.from(subjectsMap.values());
    };

    const SubjectsModal = () => {
        return (
            <Modal
                open={openModal}
                onClose={() => {
                    setOpenModal(false);
                    setShowStandardDropdown(false);
                    setSelectedStandard(null);
                    setSelectedSyllabus(null);
                }}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 1000,
                    maxWidth: '90%',
                    height: 900,
                    maxHeight: '90%',
                    bgcolor: 'background.paper',
                    boxShadow: 24,
                    p: 4,
                    borderRadius: 2,
                }}>
                    <div className="h-full flex flex-col">
                        {/* Header */}
                        <div className="mb-6">
                            <h2 className="text-2xl font-bold">
                                {showStandardDropdown ? 'Add Subject Allocation' : `Edit Subject Allocation`}
                            </h2>
                            <p className="text-gray-600 mt-1">
                                {selectedStandard ? `Standard: ${selectedStandard.name}` : 'Select a standard to continue'}
                            </p>
                        </div>

                        {/* Content */}
                        <div className="flex-grow overflow-auto">
                            <form className="space-y-6">
                                {/* Syllabus Selection */}
                                <div className="bg-gray-50 p-4 rounded-lg space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Syllabus
                                        </label>
                                        <select
                                            className="w-full p-2 border rounded-md"
                                            value={selectedSyllabus?.id || ''}
                                            onChange={(e) => {
                                                const syllabus = syllabuses.find(s => s.id === Number(e.target.value));
                                                setSelectedSyllabus(syllabus || null);
                                                setSelectedStandard(null);
                                            }}
                                        >
                                            <option value="">Select Syllabus</option>
                                            {syllabuses.map((syllabus) => (
                                                <option key={syllabus.id} value={syllabus.id}>
                                                    {syllabus.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Standard Selection - Only show if syllabus is selected */}
                                    {selectedSyllabus && (
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Standard
                                            </label>
                                            <select
                                                className="w-full p-2 border rounded-md"
                                                value={selectedStandard?.id || ''}
                                                onChange={handleStandardChange}
                                            >
                                                <option value="">Select Standard</option>
                                                {standards?.map((standard) => (
                                                    <option key={standard.ID} value={standard.ID}>
                                                        {standard.Name}
                                                        {findStandardAllocation(standard.ID) ? ' (Allocated)' : ''}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    )}

                                    {/* Group Selection - Only show if selected standard has groups */}
                                    {selectedStandard && standards.find(s => s.ID === selectedStandard.id)?.HasGroup && (
                                        <div className="mt-6">
                                            <div className="flex justify-between items-center mb-3">
                                                <label className="block text-sm font-medium text-gray-700">
                                                    Select Group
                                                </label>
                                                <button
                                                    onClick={() => setGroupModalOpen(true)}
                                                    className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800"
                                                >
                                                    <PlusCircle size={16} />
                                                    <span>Add New Group</span>
                                                </button>
                                            </div>
                                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                                                {selectedStandard.groups
                                                    .filter(group => group.id !== null) // Filter out dummy groups
                                                    .map((group) => (
                                                        <button
                                                            key={group.id}
                                                            onClick={() => setSelectedGroup(group)}
                                                            className={`
                                                                p-4 rounded-lg text-left transition-all
                                                                ${selectedGroup?.id === group.id
                                                                    ? 'bg-blue-50 border-2 border-blue-500 shadow-sm'
                                                                    : 'bg-white border border-gray-200 hover:border-blue-300 hover:shadow-md'
                                                                }
                                                            `}
                                                        >
                                                            <div className="font-medium text-gray-900">
                                                                {group.name}
                                                            </div>
                                                            <div className="text-sm text-gray-500 mt-1">
                                                                {selectedGroup?.id === group.id && (
                                                                    <span className="text-blue-600">Selected</span>
                                                                )}
                                                            </div>
                                                        </button>
                                                    ))}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Subjects Table */}
                                {selectedStandard && (
                                    <div className="bg-white rounded-lg shadow">
                                        <table className="min-w-full">
                                            <thead className="bg-gray-50">
                                                <tr>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                                        Subject Name
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                                        Group
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                                        Maximum Marks
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                                        Term Exam
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                                        Actions
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-200">
                                                {getCurrentGroupSubjects().map((subject) => {
                                                    const isEditing = editingSubjectId === subject.id;
                                                    const editedSubject = editedSubjects[subject.id] || subject;
                                                    return (
                                                        <tr key={subject.id}>
                                                            <td className="px-6 py-4 whitespace-nowrap">
                                                                {subject.name}
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap">
                                                                {selectedGroup?.name || 'General'}
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap">
                                                                <TextField
                                                                    type="number"
                                                                    size="small"
                                                                    value={editedSubject.defaultMaxMarks}
                                                                    onChange={(e) => {
                                                                        const value = e.target.value;
                                                                        setEditedSubjects(prev => ({
                                                                            ...prev,
                                                                            [subject.id]: {
                                                                                ...prev[subject.id] || subject,
                                                                                defaultMaxMarks: value === '' ? 0 : parseInt(value)
                                                                            }
                                                                        }));
                                                                    }}
                                                                    onFocus={(e) => e.target.select()}
                                                                    sx={{
                                                                        width: '100px',
                                                                        '& .MuiOutlinedInput-root': {
                                                                            '& fieldset': {
                                                                                borderColor: 'rgba(0, 0, 0, 0.23)',
                                                                            },
                                                                        },
                                                                    }}
                                                                    inputProps={{
                                                                        min: 0,
                                                                        style: { textAlign: 'right', paddingRight: '8px' }
                                                                    }}
                                                                />
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap">
                                                                <Switch
                                                                    checked={editedSubject.hasTermExam}
                                                                    onChange={(e) => {
                                                                        handleTermExamChange(subject.id, e.target.checked);
                                                                        setEditingSubjectId(subject.id);
                                                                    }}
                                                                    color="primary"
                                                                />
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap">
                                                                <div className="flex space-x-2">
                                                                    {isEditing ? (
                                                                        <button
                                                                            onClick={() => handleEditClick(subject.id)}
                                                                            className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                                                                        >
                                                                            Save
                                                                        </button>
                                                                    ) : (
                                                                        <button
                                                                            onClick={(e) => {
                                                                                e.preventDefault();
                                                                                e.stopPropagation();
                                                                                handleRemoveAllocation(subject);
                                                                            }}
                                                                            className="p-1 hover:bg-red-100 rounded-full transition-colors"
                                                                            title="Remove Allocation"
                                                                        >
                                                                            <X size={20} className="text-red-500" />
                                                                        </button>
                                                                    )}
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    );
                                                })}

                                                {/* Add Subject button */}
                                                <tr className="hover:bg-gray-50">
                                                    <td colSpan={5} className="px-6 py-2 border-t">
                                                        <button
                                                            className="text-sm text-blue-600 hover:text-blue-800"
                                                            onClick={() => setSubjectSelectionModalOpen(true)}
                                                        >
                                                            + Add Subject
                                                        </button>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </form>
                        </div>

                        {/* Footer */}
                        <div className="mt-6 flex justify-end space-x-3 pt-4 border-t">
                            <button
                                className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors"
                                onClick={() => {
                                    setOpenModal(false);
                                    setShowStandardDropdown(false);
                                    setSelectedStandard(null);
                                    setSelectedSyllabus(null);
                                }}
                            >
                                Cancel
                            </button>
                            <button
                                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                                onClick={handleSaveAllocations}
                            >
                                Save
                            </button>
                        </div>
                    </div>
                </Box>
            </Modal>
        );
    };

    const SubjectSelectionModal = () => {
        // Get all existing allocated subjects
        const getAllocatedSubjects = () => {
            const allocated: Subject[] = [];
            selectedStandard?.groups.forEach(group => {
                allocated.push(...group.subjects);
            });
            return allocated;
        };

        // Filter out both selected and allocated subjects
        const availableSubjects = schoolSubjects.filter(subject => {
            const isAlreadySelected = selectedSubjects.some(s => s.id === subject.id);
            const isAlreadyAllocated = getAllocatedSubjects().some(s => s.id === subject.id);
            return !isAlreadySelected && !isAlreadyAllocated;
        });

        return (
            <Modal
                open={subjectSelectionModalOpen}
                onClose={() => setSubjectSelectionModalOpen(false)}
                aria-labelledby="subject-selection-modal"
                BackdropProps={{
                    style: { backgroundColor: 'transparent' }
                }}
                disableAutoFocus
            >
                <Box sx={{
                    position: 'absolute',
                    top: '70%',
                    left: '30%',
                    transform: 'translate(-50%, -50%)',
                    width: 300,
                    bgcolor: 'background.paper',
                    border: '1px solid #e0e0e0',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                    overflow: 'auto',
                    p: 2,
                    borderRadius: 1,
                    maxHeight: '30vh',
                    '&:focus': {
                        outline: 'none'
                    }
                }}>
                    <div className="flex flex-col">
                        <div className="overflow-auto">
                            {availableSubjects.length > 0 ? (
                                availableSubjects.map((subject) => (
                                    <button
                                        key={subject.id}
                                        className="w-full text-left px-2 py-1.5 text-sm hover:bg-gray-50 border-b border-gray-100 last:border-0"
                                        onClick={() => {
                                            const newSubject: Subject = {
                                                id: subject.id,
                                                name: subject.name,
                                                defaultMaxMarks: 100,
                                                hasTermExam: true
                                            };

                                            // Only update selectedSubjects, remove the syllabuses update
                                            setSelectedSubjects(prev => [...prev, newSubject]);
                                            setSubjectSelectionModalOpen(false);
                                        }}
                                    >
                                        {subject.name} <span className="text-gray-400 text-xs">({subject.code})</span>
                                    </button>
                                ))
                            ) : (
                                <div className="text-center py-2 text-gray-500 text-sm">
                                    No subjects available
                                </div>
                            )}
                        </div>
                    </div>
                </Box>
            </Modal>
        );
    };

    const GroupSelectionModal = () => {
        // Filter out already allocated groups
        const unallocatedGroups = schoolGroups.filter(group => {
            if (!group.ID) return false;
            // Only show groups that aren't already allocated to this standard
            return !selectedStandard?.groups.some(
                allocatedGroup => allocatedGroup.id === group.ID
            );
        });

        return (
            <Modal
                open={groupModalOpen}
                onClose={() => setGroupModalOpen(false)}
                aria-labelledby="group-selection-modal"
                BackdropProps={{
                    style: { backgroundColor: 'transparent' }
                }}
                disableAutoFocus
            >
                <Box sx={{
                    position: 'absolute',
                    top: '45%',
                    left: '75%',
                    transform: 'translate(-50%, -50%)',
                    width: 300,
                    bgcolor: 'background.paper',
                    border: '1px solid #e0e0e0',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                    overflow: 'auto',
                    p: 2,
                    borderRadius: 1,
                    maxHeight: '30vh',
                    '&:focus': {
                        outline: 'none'
                    }
                }}>
                    <div className="flex flex-col">
                        <div className="overflow-auto">
                            {unallocatedGroups.length > 0 ? (
                                unallocatedGroups.map((group) => (
                                    <button
                                        key={group.ID}
                                        className="w-full text-left px-2 py-1.5 text-sm hover:bg-gray-50 border-b border-gray-100 last:border-0"
                                        onClick={() => {
                                            const newGroup = {
                                                id: group.ID,
                                                name: group.Name,
                                                subjects: []
                                            };

                                            // Update selectedGroup
                                            setSelectedGroup(newGroup);

                                            // Update the syllabuses state to show the new group immediately
                                            setSyllabuses(prevSyllabuses => {
                                                return prevSyllabuses.map(syllabus => {
                                                    if (syllabus.id === selectedSyllabus?.id) {
                                                        return {
                                                            ...syllabus,
                                                            standards: syllabus.standards.map(standard => {
                                                                if (standard.id === selectedStandard?.id) {
                                                                    return {
                                                                        ...standard,
                                                                        groups: [...standard.groups, newGroup]
                                                                    };
                                                                }
                                                                return standard;
                                                            })
                                                        };
                                                    }
                                                    return syllabus;
                                                });
                                            });

                                            // Update the selectedStandard to include the new group
                                            if (selectedStandard) {
                                                setSelectedStandard({
                                                    ...selectedStandard,
                                                    groups: [...selectedStandard.groups, newGroup]
                                                });
                                            }

                                            setGroupModalOpen(false);
                                        }}
                                    >
                                        {group.Name}
                                    </button>
                                ))
                            ) : (
                                <div className="text-center py-2 text-gray-500 text-sm">
                                    No groups available
                                </div>
                            )}
                        </div>
                    </div>
                </Box>
            </Modal>
        );
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-100 p-8">
                <div className="text-center">Loading...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-100 p-8">
                <div className="text-center text-red-500">{error}</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <h1 className="text-2xl font-bold mb-6">Subject Allocation</h1>

            {/* No Data State */}
            {syllabuses.length === 0 ? (
                <div className="rounded-lg p-8 text-center shadow-md">
                    <p className="text-xl font-semibold mb-4">No subject allocations found.</p>
                    <p className="text-gray-600">Click the "+" button to create a new subject allocation.</p>
                </div>
            ) : (
                <>

                    {/* Syllabus Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                        {syllabuses.map(syllabus => (
                            <div
                                key={syllabus.id}
                                className={`bg-white rounded-lg p-4 shadow-md cursor-pointer transition-all
                                    ${selectedSyllabus?.id === syllabus.id ? 'ring-2 ring-blue-500' : 'hover:shadow-lg'}`}
                                onClick={() => setSelectedSyllabus(selectedSyllabus?.id === syllabus.id ? null : syllabus)}
                            >
                                <h2 className="text-xl font-semibold text-gray-800">{syllabus.name}</h2>
                                <p className="text-sm text-gray-600 mt-1">
                                    {syllabus.standards.length} Standards
                                </p>
                            </div>
                        ))}
                    </div>

                    {/* Standards List */}
                    {selectedSyllabus && (
                        <div className="mb-8">
                            <h2 className="text-xl font-semibold mb-4">Standards - {selectedSyllabus.name}</h2>
                            {selectedSyllabus.standards.length === 0 ? (
                                <div className="rounded-lg shadow-md p-4 text-center">
                                    <p className="text-lg font-semibold">No standards found for this syllabus.</p>
                                </div>
                            ) : (
                                <div className="bg-white rounded-lg shadow">
                                    <table className="min-w-full">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Standard Name
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Total Subjects
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Groups
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Actions
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {selectedSyllabus.standards.map(standard => (
                                                <tr
                                                    key={standard.id}
                                                    className="hover:bg-gray-50 cursor-pointer"
                                                    onClick={() => handleStandardClick(standard)}
                                                >
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm font-medium text-gray-900">
                                                            {standard.name}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm text-gray-500">
                                                            {standard.groups.reduce((total, group) => total + group.subjects.length, 0)}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm text-gray-500">
                                                            {standard.groups
                                                                .filter(group => group.name)
                                                                .map(group => group.name)
                                                                .join(', ') || 'No Groups'}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        <button
                                                            className="text-blue-600 hover:text-blue-800"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setSelectedStandard(standard);
                                                                setOpenModal(true);
                                                            }}
                                                        >
                                                            View Subjects
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    )}
                </>
            )}

            <div className="fixed bottom-10 right-16 flex items-center space-x-2">
                <button
                    className="bg-green-500 text-white p-2 rounded-full shadow-lg relative group hover:bg-green-600"
                    onClick={handleAddNewSubject}
                >
                    <PlusCircle size={34} />
                    <span className="absolute left-[-180px] top-1/2 transform -translate-y-1/2 bg-white text-black text-sm py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow">
                        Add Subject Allocation
                    </span>
                </button>
            </div>

            {/* Render only one modal */}
            <SubjectsModal />
            <SubjectSelectionModal />
            <GroupSelectionModal />
            <SnackbarComponent
                open={snackbarState.open}
                message={snackbarState.message}
                severity={snackbarState.type}
                position={{ vertical: 'top', horizontal: 'center' }}
                onClose={() => setSnackbarState(prev => ({ ...prev, open: false }))}
            />
        </div>
    );
};

export default SubjectAllocation;
