import React, { useEffect, useState } from 'react';
import { Users, GraduationCap, UserPlus, BookOpen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSchoolContext } from '../../contexts/SchoolContext';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store/store';
import { listStudents, listStaff, listParents, getClasses } from '../../api/superAdmin';
import CountUp from 'react-countup';

const SchoolProfiles: React.FC = () => {
    const navigate = useNavigate();
    const { schoolInfo } = useSchoolContext();
    const staffInfo = useSelector((state: RootState) => state.staffInfo.staffInfo);
    const hasSchoolAdminPrivilege = staffInfo?.specialPrivileges?.some(
        (privilege) => privilege.privilege === "schoolAdmin"
    );

    const [stats, setStats] = useState({
        totalStudents: 0,
        totalClasses: 0,
        totalParents: 0,
        totalStaffs: 0
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (schoolInfo?.schoolPrefix) {
                    const [studentsResponse, classesResponse, staffResponse, parentsResponse] = await Promise.allSettled([
                        listStudents(schoolInfo.schoolPrefix),
                        getClasses(schoolInfo.schoolPrefix),
                        listStaff(schoolInfo.schoolPrefix),
                        listParents(schoolInfo.schoolPrefix)
                    ]);

                    setStats(prev => ({
                        totalStudents: studentsResponse.status === 'fulfilled'
                            ? studentsResponse.value.data?.students?.length ?? prev.totalStudents
                            : prev.totalStudents,
                        totalClasses: classesResponse.status === 'fulfilled'
                            ? classesResponse.value.data?.length ?? prev.totalClasses
                            : prev.totalClasses,
                        totalParents: parentsResponse.status === 'fulfilled'
                            ? parentsResponse.value.data?.parents?.length ?? prev.totalParents
                            : prev.totalParents,
                        totalStaffs: staffResponse.status === 'fulfilled'
                            ? staffResponse.value.data?.length ?? prev.totalStaffs
                            : prev.totalStaffs
                    }));
                }
            } catch (error) {
                console.error('Error fetching statistics:', error);
            }
        };

        fetchData();
    }, [schoolInfo?.schoolPrefix]);

    const getNavigationPath = (route: string) => {
        if (hasSchoolAdminPrivilege) {
            return `/schoolAdmin/${schoolInfo.schoolPrefix}/${route}`;
        }
        return `/infuzAdmin/schools/${schoolInfo.schoolPrefix}/${route}`;
    };

    const cards = [
        {
            title: 'Students',
            count: stats.totalStudents,
            icon: <Users className="text-blue-600" size={24} />,
            bgColor: 'bg-blue-100',
            textColor: 'text-blue-600',
            onClick: () => navigate(getNavigationPath('students'))
        },
        {
            title: 'Classes',
            count: stats.totalClasses,
            icon: <BookOpen className="text-green-600" size={24} />,
            bgColor: 'bg-green-100',
            textColor: 'text-green-600',
            onClick: () => navigate(getNavigationPath('classes'))
        },
        {
            title: 'Parents',
            count: stats.totalParents,
            icon: <UserPlus className="text-purple-600" size={24} />,
            bgColor: 'bg-purple-100',
            textColor: 'text-purple-600',
            onClick: () => navigate(getNavigationPath('parents'))
        },
        {
            title: 'Staffs',
            count: stats.totalStaffs,
            icon: <GraduationCap className="text-yellow-600" size={24} />,
            bgColor: 'bg-yellow-100',
            textColor: 'text-yellow-600',
            onClick: () => navigate(getNavigationPath('staffs'))
        }
    ];

    const recentActivities = [
        {
            type: 'Staff',
            name: 'John Doe',
            role: 'Teaching Staff',
            time: '2 hours ago',
            action: 'Marked attendance'
        },
        {
            type: 'Student',
            name: 'Alice Smith',
            class: 'Class X-A',
            time: '3 hours ago',
            action: 'Submitted assignment'
        },
        {
            type: 'Parent',
            name: 'Robert Johnson',
            student: 'Mike Johnson',
            time: '5 hours ago',
            action: 'Attended meeting'
        }
    ];

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            {/* Stats Cards */}
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
                                    <CountUp
                                        end={card.count}
                                        duration={2.5}
                                        separator=","
                                    />
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
                    {recentActivities.map((activity, index) => (
                        <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                            <div className="flex items-center space-x-4">
                                <div className={`p-2 rounded-full ${activity.type === 'Staff' ? 'bg-yellow-100' :
                                    activity.type === 'Student' ? 'bg-blue-100' : 'bg-purple-100'
                                    }`}>
                                    {activity.type === 'Staff' && <GraduationCap size={20} className="text-yellow-600" />}
                                    {activity.type === 'Student' && <Users size={20} className="text-blue-600" />}
                                    {activity.type === 'Parent' && <UserPlus size={20} className="text-purple-600" />}
                                </div>
                                <div>
                                    <p className="font-medium">{activity.name}</p>
                                    <p className="text-sm text-gray-500">{activity.action}</p>
                                </div>
                            </div>
                            <span className="text-sm text-gray-500">{activity.time}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default SchoolProfiles; 