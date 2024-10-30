import React, { useState, useEffect } from 'react';
import { ArrowRight, PlusCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Checkbox from '@mui/material/Checkbox';
import ListControls from '../../components/ListControls';
import { useSchoolContext } from '../../contexts/SchoolContext';
import { getSchools } from '../../api/superAdmin';
import { School } from '../../types/Types';

const ListSchools: React.FC = () => {
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedSchools, setSelectedSchools] = useState<number[]>([]);
    const [schools, setSchools] = useState<School[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { setSchoolInfo } = useSchoolContext();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchSchools = async () => {
            try {
                setIsLoading(true);
                const response = await getSchools();
                setSchools(response.data || []); // Ensure schools is always an array
            } catch (error) {
                console.error('Failed to fetch schools:', error);
                setSchools([]); // Set schools to an empty array if there's an error
            } finally {
                setIsLoading(false);
            }
        };
        fetchSchools();
    }, []);

    const filteredSchools = schools ? schools.filter(school =>
        school.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        school.school_code.toLowerCase().includes(searchTerm.toLowerCase())
    ) : [];

    const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.checked) {
            setSelectedSchools(schools.map(school => school.id));
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
        setSchoolInfo({ id: school.id, name: school.name });
        navigate(`/superAdmin/schools/${school.id}`, { state: { school } });
    };

    if (isLoading) {
        return <div className="min-h-screen bg-gray-200 p-8 flex items-center justify-center">
            <p className="text-xl font-semibold">Loading schools...</p>
        </div>;
    }

    return (
        <div className="min-h-screen bg-gray-200 p-8 relative">
            <ListControls
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                viewMode={viewMode}
                setViewMode={setViewMode}
                itemCount={schools.length}
            />

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
                            key={school.id}
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
                                    <p className="text-sm text-gray-600">CBSE</p>
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
                                    key={school.id}
                                    className="cursor-pointer"
                                    onClick={() => handleSchoolClick(school)}
                                >
                                    <td className="p-2 whitespace-nowrap">
                                        <Checkbox
                                            checked={selectedSchools.includes(school.id)}
                                            onChange={() => handleSelectSchool(school.id)}
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
