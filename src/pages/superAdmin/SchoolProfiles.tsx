import React, { useState, useEffect } from 'react';
import { Users, GraduationCap, UserPlus, BookOpen } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSchoolContext } from '../../contexts/SchoolContext';
import { listStaff } from '../../api/superAdmin';
import { Staff, Student } from '../../types/Types';
import { SchoolStats } from '../../types/Types';

const SchoolProfiles: React.FC = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { schoolInfo } = useSchoolContext();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [staffs, setStaffs] = useState<Staff[]>([]);
    const [students, setStudents] = useState<Student[]>([]);
    const [classes, setClasses] = useState<any[]>([]);

    const [stats, setStats] = useState<SchoolStats>({
        totalStudents: 0,
        totalClasses: 0,
        totalParents: 0,
        totalStaffs: 0
    });

    useEffect(() => {
        const fetchData = async () => {
            if (!schoolInfo.schoolPrefix) {
                setError("School prefix not found");
                return;
            }

            setLoading(true);
            setError(null);

            try {
                // Fetch staffs
                const staffResponse = await listStaff(schoolInfo.schoolPrefix);
                if (staffResponse.status && staffResponse.resp_code === "SUCCESS") {
                    setStaffs(staffResponse.data);
                }

                // Fetch students (assuming you have a similar API)
                // const studentResponse = await listStudents(schoolInfo.schoolPrefix);
                // setStudents(studentResponse.data);

                // Fetch classes (assuming you have a similar API)
                // const classResponse = await listClasses(schoolInfo.schoolPrefix);
                // setClasses(classResponse.data);

                // Update stats
                setStats({
                    totalStaffs: staffResponse.data.length,
                    totalStudents: students.length, // This will be dynamic once API is connected
                    totalClasses: classes.length,   // This will be dynamic once API is connected
                    totalParents: students.length   // Assuming one parent per student for now
                });

            } catch (err: any) {
                setError(err.message || 'Failed to fetch school data');
                console.error('Error fetching school data:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [schoolInfo.schoolPrefix]);

    const cards = [
        {
            title: 'Students',
            count: stats.totalStudents,
            icon: <Users className="text-blue-600" size={24} />,
            bgColor: 'bg-blue-100',
            textColor: 'text-blue-600',
            onClick: () => navigate(`/superAdmin/schools/${id}/students`)
        },
        {
            title: 'Classes',
            count: stats.totalClasses,
            icon: <BookOpen className="text-green-600" size={24} />,
            bgColor: 'bg-green-100',
            textColor: 'text-green-600',
            onClick: () => navigate(`/superAdmin/schools/${id}/classes`)
        },
        {
            title: 'Parents',
            count: stats.totalParents,
            icon: <UserPlus className="text-purple-600" size={24} />,
            bgColor: 'bg-purple-100',
            textColor: 'text-purple-600',
            onClick: () => navigate(`/superAdmin/schools/${id}/parents`)
        },
        {
            title: 'Staffs',
            count: stats.totalStaffs,
            icon: <GraduationCap className="text-yellow-600" size={24} />,
            bgColor: 'bg-yellow-100',
            textColor: 'text-yellow-600',
            onClick: () => navigate(`/superAdmin/schools/${id}/staffs`)
        }
    ];

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
                    <p className="mt-4 text-gray-700">Loading school statistics...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <div className="text-center text-red-600">
                    <p className="text-xl font-semibold mb-2">Error</p>
                    <p>{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {cards.map((card, index) => (
                    <div
                        key={index}
                        className="bg-white rounded-lg shadow-md p-6 cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-lg"
                        onClick={card.onClick}
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-700">{card.title}</h3>
                                <p className={`text-3xl font-bold ${card.textColor}`}>
                                    {card.count}
                                </p>
                            </div>
                            <div className={`${card.bgColor} p-4 rounded-full`}>
                                {card.icon}
                            </div>
                        </div>
                        <div className="mt-4">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-500">View Details</span>
                                <span className={`${card.textColor}`}>→</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Recent Activity Section */}
            <div className="mt-8 bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
                <div className="space-y-4">
                    {staffs.slice(0, 3).map((staff, index) => (
                        <div key={staff.ID} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                            <div className="flex items-center space-x-4">
                                <div className="bg-yellow-100 p-2 rounded-full">
                                    <GraduationCap size={20} className="text-yellow-600" />
                                </div>
                                <div>
                                    <p className="font-medium">Staff Member</p>
                                    <p className="text-sm text-gray-500">{staff.name} - {staff.is_teaching_staff ? 'Teaching Staff' : 'Non-Teaching Staff'}</p>
                                </div>
                            </div>
                            <span className="text-sm text-gray-500">Active</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default SchoolProfiles;