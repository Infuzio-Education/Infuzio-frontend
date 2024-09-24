import { useState } from 'react';
import { Search, Grid, List, ArrowRight, ChevronLeft, ChevronRight, PlusCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Checkbox from '@mui/material/Checkbox';


const Schools = () => {
    const [viewMode, setViewMode] = useState('grid');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedSchools, setSelectedSchools] = useState<number[]>([]);
    const navigate = useNavigate();

    const schools = [
        { id: 1, name: 'Arts College', syllabus: 'CBSE', logo: 'https://img.freepik.com/premium-vector/education-school-logo-icon-vector-template_644408-645.jpg', location: 'New York' },
        { id: 2, name: 'Tech Institute', syllabus: 'ICSE', logo: 'https://png.pngtree.com/png-vector/20230415/ourmid/pngtree-school-logo-design-template-vector-png-image_6705854.png', location: 'California' },
        { id: 3, name: 'Science Academy', syllabus: 'State Board', logo: 'https://png.pngtree.com/png-clipart/20230330/original/pngtree-school-and-education-logo-design-template-png-image_9012676.png', location: 'Texas' },
        { id: 4, name: 'Commerce School', syllabus: 'CBSE', logo: 'https://i.pinimg.com/474x/35/b1/f3/35b1f31461c3a83ab53c5ee465fae2ce.jpg', location: 'Florida' },
        { id: 5, name: 'International School', syllabus: 'IB', logo: 'https://i.pinimg.com/474x/81/50/35/815035e3fcb3bfb7b5aa4f36ff683a01.jpg', location: 'Washington' },
        { id: 6, name: 'Sports Academy', syllabus: 'CBSE', logo: 'https://i.pinimg.com/600x315/85/f1/75/85f17562a2009da44875fb7c126a1ad9.jpg', location: 'Illinois' },
        { id: 7, name: 'Language Institute', syllabus: 'ICSE', logo: 'https://marketplace.canva.com/EAFhSlq44Ng/1/0/1600w/canva-blue-and-pink-simple-school-logo-FNaMuAoD8S4.jpg', location: 'Massachusetts' },
        { id: 8, name: 'Performing Arts School', syllabus: 'State Board', logo: 'https://marketplace.canva.com/EAGMDQfRTUc/1/0/1600w/canva-blue-and-white-vintage-school-logo-MuwnwiqDNfI.jpg', location: 'Nevada' }
    ];

    const filteredSchools = schools.filter(school =>
        school.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        school.syllabus.toLowerCase().includes(searchTerm.toLowerCase())
    );

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

    return (
        <div className="min-h-screen bg-gray-200 p-8 relative">
            <div className="flex justify-between items-center mb-6">
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Search schools..."
                        className="pl-10 pr-4 py-2 border rounded-lg"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
                </div>
                <div className="flex items-center space-x-4">
                    <span className="text-sm font-medium">
                        {`${1}-${schools.length} / ${schools.length}`}
                    </span>
                    <ChevronLeft className="text-gray-600 cursor-pointer" size={20} />
                    <ChevronRight className="text-gray-600 cursor-pointer" size={20} />
                    <button
                        onClick={() => setViewMode('grid')}
                        className={`p-2 rounded ${viewMode === 'grid' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                    >
                        <Grid size={20} />
                    </button>
                    <button
                        onClick={() => setViewMode('list')}
                        className={`p-2 rounded ${viewMode === 'list' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                    >
                        <List size={20} />
                    </button>
                </div>
            </div>

            {viewMode === 'grid' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
                    {filteredSchools.map((school) => (
                        <div key={school.id} className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col">
                            <img
                                src={school.logo}
                                alt={`${school.name} logo`}
                                className="w-100 h-40 object-cover"
                            />
                            <div className="p-1 bg-gray-300 flex-grow flex flex-row items-center">
                                <div className="flex-grow min-w-0 mr-2">
                                    <h2 className="text-lg font-semibold break-words">{school.name}</h2>
                                    <p className="text-sm text-gray-600">{school.syllabus}</p>
                                </div>
                                <ArrowRight className="text-gray-600 flex-shrink-0" size={20} />
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
                                <tr key={school.id}>
                                    <td className="p-2 whitespace-nowrap">
                                        <Checkbox
                                            checked={selectedSchools.includes(school.id)}
                                            onChange={() => handleSelectSchool(school.id)}
                                        />
                                    </td>
                                    <td className="p-2 whitespace-nowrap">
                                        <img src={school.logo} alt={`${school.name} logo`} className="h-10 w-10 rounded-full" />
                                    </td>
                                    <td className="p-2whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900">{school.name}</div>
                                    </td>
                                    <td className="p-2 whitespace-nowrap">
                                        <div className="text-sm text-gray-500">{school.syllabus}</div>
                                    </td>
                                    <td className="p-2 whitespace-nowrap">
                                        <div className="text-sm text-gray-500">{school.location}</div>
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

export default Schools;
