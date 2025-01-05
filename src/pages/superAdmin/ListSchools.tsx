import React, { useState, useEffect } from 'react';
import { ArrowRight, PlusCircle, X, RotateCcw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Checkbox from '@mui/material/Checkbox';
import Togglebar from '../../components/Togglebar';
import { useSchoolContext } from '../../contexts/SchoolContext';
import { getSchools, undoDeleteSchool } from '../../api/superAdmin';
import { School } from '../../types/Types';
import { Dialog, DialogTitle, DialogContent } from '@mui/material';

const ListSchools: React.FC = () => {
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedSchools, setSelectedSchools] = useState<number[]>([]);
    const [schools, setSchools] = useState<School[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { setSchoolInfo } = useSchoolContext();
    const navigate = useNavigate();
    const [showDeletedModal, setShowDeletedModal] = useState(false);
    const [deletedSchools, setDeletedSchools] = useState<School[]>([]);

    console.log(schools, selectedSchools);

    useEffect(() => {
        const fetchSchools = async () => {
            try {
                setIsLoading(true);
                const response = await getSchools();
                console.log("Response", response);
                setSchools(response.data || []);
            } catch (error) {
                console.error('Failed to fetch schools:', error);
                setSchools([]);
            } finally {
                setIsLoading(false);
            }
        };
        fetchSchools();
    }, []);

    const filteredSchools = schools ? schools.filter(school =>
        school.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        school.code.toLowerCase().includes(searchTerm.toLowerCase())
    ) : [];

    const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.checked) {
            setSelectedSchools(schools.map(school => school.ID));
        } else {
            setSelectedSchools([]);
        }
    };

    const handleSelectSchool = (schoolId: number) => {
        setSelectedSchools(prev =>
            prev.includes(schoolId)
                ? prev.filter(id => id !== schoolId)
                : [...prev, schoolId]
        );
    };

    const handleSchoolClick = (school: School) => {
        console.log("Clicked School:", school);

        setSchoolInfo({
            id: parseInt(school.code),
            name: school.name,
            schoolPrefix: school.code
        });

        navigate(`/superAdmin/schools/${school.code}`);
    };

    const fetchDeletedSchools = async () => {
        try {
            const response = await getSchools(true);
            if (response.status && response.resp_code === "SUCCESS") {
                const deletedSchoolsList = response.data.filter((school: School) => school.isDeleted);
                setDeletedSchools(deletedSchoolsList);
            }
        } catch (error) {
            console.error('Error fetching deleted schools:', error);
            console.error('Failed to fetch deleted schools');
        }
    };

    const handleRevertDeletion = async (schoolCode: string) => {
        try {
            const response = await undoDeleteSchool(schoolCode);
            if (response.resp_code === "SUCCESS") {
                // Refresh the deleted schools list
                await fetchDeletedSchools();
                // Refresh the main schools list
                const schoolsResponse = await getSchools();
                setSchools(schoolsResponse.data || []);

            }
        } catch (error) {
            console.error('Error reverting school deletion:', error);
        }
    };

    if (isLoading) {
        return <div className="min-h-screen bg-gray-200 p-8 flex items-center justify-center">
            <p className="text-xl font-semibold">Loading schools...</p>
        </div>;
    }

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <Togglebar
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                viewMode={viewMode}
                setViewMode={setViewMode}
                showDeleted={false}
                setShowDeleted={() => {
                    fetchDeletedSchools();
                    setShowDeletedModal(true);
                }}
                selectedCount={selectedSchools.length}
                itemCount={schools.length}
            />

            <Dialog
                open={showDeletedModal}
                onClose={() => setShowDeletedModal(false)}
                maxWidth="md"
                fullWidth
            >
                <DialogTitle className="flex justify-between items-center">
                    <span>Deleted Schools</span>
                    <button
                        onClick={() => setShowDeletedModal(false)}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        <X size={20} />
                    </button>
                </DialogTitle>
                <DialogContent>
                    {deletedSchools.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                            No deleted schools found
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-4 mt-4">
                            {deletedSchools.map((school) => (
                                <div
                                    key={school.ID}
                                    className="border rounded-lg p-4 bg-white shadow-sm"
                                >
                                    <div className="flex items-start space-x-4">
                                        <div className="flex-shrink-0">
                                            {school.logo ? (
                                                <img
                                                    src={school.logo}
                                                    alt={`${school.name} logo`}
                                                    className="w-16 h-16 rounded-lg object-cover"
                                                />
                                            ) : (
                                                <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                                                    <span className="text-gray-400 text-xs font-medium">No Logo</span>
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex-grow">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h3 className="text-lg font-semibold">{school.name}</h3>
                                                    <p className="text-sm text-gray-600">{school.code}</p>
                                                    <div className="mt-2 flex items-center gap-2">
                                                        <span className="text-sm text-gray-500">Syllabus:</span>
                                                        <div className="flex gap-2">
                                                            {Array.isArray(school.syllabus) ? (
                                                                school.syllabus.map((syl, index) => (
                                                                    <span
                                                                        key={index}
                                                                        className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full"
                                                                    >
                                                                        {syl}
                                                                    </span>
                                                                ))
                                                            ) : (
                                                                <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                                                                    {school.syllabus}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <p className="text-sm text-gray-500 mt-2">
                                                        <span className="font-medium">Location:</span> {school.city}
                                                    </p>
                                                </div>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleRevertDeletion(school.code);
                                                    }}
                                                    className="flex items-center gap-1.5 px-3 py-1.5 bg-green-50 text-green-600 rounded-md hover:bg-green-100 transition-colors"
                                                >
                                                    <RotateCcw size={16} />
                                                    <span className="text-sm font-medium">Restore</span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            {schools.length === 0 ? (
                <div className=" rounded-lg p-8 text-center">
                    <p className="text-xl font-semibold mb-4">No schools found.</p>
                    <p className="text-gray-600">Click the "+" button to create a new school.</p>
                </div>
            ) : filteredSchools.length === 0 ? (
                <div className="bg-white rounded-lg shadow-md p-4 text-center">
                    <p className="text-lg font-semibold">No schools match your search criteria.</p>
                </div>
            ) : viewMode === 'grid' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
                    {filteredSchools.map((school) => (
                        <div
                            key={school.ID}
                            className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col cursor-pointer transform transition duration-300 hover:scale-105 hover:shadow-xl"
                            onClick={() => handleSchoolClick(school)}
                        >
                            {school.logo ? (
                                <img
                                    src={school.logo}
                                    alt={`${school.name} logo`}
                                    className="w-full h-40 object-cover transition duration-300 group-hover:opacity-75"
                                />
                            ) : (
                                <div className="w-full h-40 bg-white flex items-center justify-center transition duration-300 group-hover:bg-gray-100">
                                    <span className="text-3xl font-bold text-gray-400">No Logo</span>
                                </div>
                            )}
                            <div className="p-2 bg-gray-300 flex-grow flex flex-row items-center transition duration-300 group-hover:bg-gray-400">
                                <div className="flex-grow min-w-0 mr-2">
                                    <h2 className="text-lg font-semibold break-words">{school.name}</h2>
                                    <p className="text-sm text-gray-600">
                                        {Array.isArray(school.syllabus) ? school.syllabus.join(', ') : school.syllabus}
                                    </p>
                                </div>
                                <ArrowRight className="text-gray-600 flex-shrink-0 transition duration-300 group-hover:translate-x-1" size={20} />
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="bg-white shadow-md rounded-lg overflow-hidden">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-gray-300">
                                <th className="p-2 text-left">
                                    <Checkbox
                                        checked={selectedSchools.length === schools.length}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleSelectAll(e)}
                                    />
                                </th>
                                <th className="p-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Logo</th>
                                <th className="p-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">School Name</th>
                                <th className="p-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Syllabus</th>
                                <th className="p-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                                <th className="p-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {schools.map((school) => (
                                <tr
                                    key={school.ID}
                                    className="cursor-pointer"
                                    onClick={() => handleSchoolClick(school)}
                                >
                                    <td className="p-2 whitespace-nowrap">
                                        <Checkbox
                                            checked={selectedSchools.includes(school.ID)}
                                            onChange={() => handleSelectSchool(school.ID)}
                                            onClick={(e) => e.stopPropagation()}
                                        />
                                    </td>
                                    <td className="p-2 whitespace-nowrap">
                                        <img src={school.logo} alt={`${school.name} logo`} className="h-10 w-10 rounded-full" />
                                    </td>
                                    <td className="p-2 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900">{school.name}</div>
                                    </td>
                                    <td className="p-2 whitespace-nowrap">
                                        <div className="text-sm text-gray-500">CBSE</div>
                                    </td>
                                    <td className="p-2 whitespace-nowrap">
                                        <div className="text-sm text-gray-500">Kerala</div>
                                    </td>
                                    <td className="p-2 whitespace-nowrap text-right text-sm font-medium">
                                        <ArrowRight className="text-gray-600 inline" size={20} />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
            <div className="fixed bottom-10 right-16 flex items-center space-x-2">
                <button className="bg-green-500 text-white p-2 rounded-full shadow-lg relative group hover:bg-green-600"
                    onClick={() => navigate('/superAdmin/schools/create')}
                >
                    <PlusCircle size={34} />
                    <span className="absolute left-[-140px] top-1/2 transform -translate-y-1/2 bg-white text-black text-sm py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow">
                        Create New School
                    </span>
                </button>
            </div>
        </div>
    );
};

export default ListSchools;
