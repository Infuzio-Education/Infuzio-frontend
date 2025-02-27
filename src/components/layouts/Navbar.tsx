import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../redux/slices/superAdminSlice/superAdminSlice';
import Breadcrumbs from '../Breadcrumbs';
import { useSchoolContext } from '../../contexts/SchoolContext';



const Navbar: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { superAdminInfo } = useSelector((state: any) => state.superAdminInfo);
    const { schoolInfo } = useSchoolContext();

    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isSchoolDropdownOpen, setIsSchoolDropdownOpen] = useState(false);
    const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
    const [schoolId, setSchoolId] = useState<string | null>(null);
    const { staffInfo } = useSelector((state: any) => state.staffInfo);

    const toggleDropdown = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsDropdownOpen(!isDropdownOpen);
        if (!isDropdownOpen) {
            setIsSchoolDropdownOpen(false);
        }
    };

    const hasSchoolAdminPrivilege = staffInfo?.specialPrivileges?.some(
        (privilege: any) => privilege.privilege === "schoolAdmin"
    );

    const toggleSchoolDropdown = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsSchoolDropdownOpen(!isSchoolDropdownOpen);

        if (!isSchoolDropdownOpen) {
            setIsDropdownOpen(false);
        }
    };

    const toggleUserDropdown = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsUserDropdownOpen(!isUserDropdownOpen);
    };

    const handleLogout = () => {
        dispatch(logout());
        navigate('/infuzAdmin');
    };

    useEffect(() => {
        const closeDropdowns = () => {
            setIsDropdownOpen(false);
            setIsSchoolDropdownOpen(false);
            setIsUserDropdownOpen(false);
        };

        document.addEventListener('click', closeDropdowns);
        return () => {
            document.removeEventListener('click', closeDropdowns);
        };
    }, []);

    useEffect(() => {
        const pathParts = location.pathname.split('/');
        const isValidSchoolPath = pathParts[1] === 'infuzAdmin' && pathParts[2] === 'schools' && pathParts[3];

        setSchoolId(isValidSchoolPath ? pathParts[3] : null);
    }, [location.pathname]);

    const closeAllDropdowns = () => {
        setIsDropdownOpen(false);
        setIsSchoolDropdownOpen(false);
        setIsUserDropdownOpen(false);
    };

    const handleLinkClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        closeAllDropdowns();
    };

    // Check if we're in a school context by checking the URL
    const isInSchoolContext = location.pathname.includes('/schools/') &&
        location.pathname.split('/').length > 3;

    // Update the condition to show Schools nav for both school admin and super admin
    const shouldShowSchoolsNav = isInSchoolContext || hasSchoolAdminPrivilege;

    return (
        <>
            <nav className="bg-[#308369] sticky top-0 left-0 w-full z-50">
                <div className="flex flex-wrap justify-between items-center mx-auto p-4">
                    <div className="flex flex-row space-x-8">
                        {!hasSchoolAdminPrivilege && (
                            <Link to="/infuzAdmin" className="flex items-center space-x-3 rtl:space-x-reverse">
                                <img src="/infuzio-logo.png" className="h-8 w-auto" alt="School Admin Logo" />
                            </Link>
                        )}

                        <div className="flex items-center">
                            <ul className="flex flex-row mt-0 space-x-8 text-sm">
                                {/* Show Schools nav for both school admin and super admin */}
                                {shouldShowSchoolsNav && (
                                    <li className="relative">
                                        <button
                                            onClick={toggleSchoolDropdown}
                                            className="text-white hover:text-gray-200 focus:outline-none"
                                        >
                                            Schools
                                        </button>
                                        {isSchoolDropdownOpen && (
                                            <ul className="absolute left-0 mt-2 w-64 bg-white shadow-md z-10 shadow-gray-400">
                                                <li className="px-4 py-1 bg-gray-100 font-semibold text-sm text-gray-400">Profiles</li>
                                                <li>
                                                    <Link
                                                        to={hasSchoolAdminPrivilege
                                                            ? `/schoolAdmin/${staffInfo?.schoolCode}/students`
                                                            : `/infuzAdmin/schools/${schoolInfo.schoolPrefix}/students`}
                                                        className="block px-4 py-1 text-sm text-gray-700 hover:bg-gray-100 ml-2"
                                                        onClick={handleLinkClick}
                                                    >
                                                        Students
                                                    </Link>
                                                </li>
                                                <li>
                                                    <Link
                                                        to={hasSchoolAdminPrivilege
                                                            ? `/schoolAdmin/${staffInfo?.schoolCode}/parents`
                                                            : `/infuzAdmin/schools/${schoolId}/parents`}
                                                        className="block px-4 py-1 text-sm text-gray-700 hover:bg-gray-100 ml-2"
                                                        onClick={handleLinkClick}
                                                    >
                                                        Parents
                                                    </Link>
                                                </li>
                                                <li>
                                                    <Link
                                                        to={hasSchoolAdminPrivilege
                                                            ? `/schoolAdmin/${staffInfo?.schoolCode}/staffs`
                                                            : `/infuzAdmin/schools/${schoolId}/staffs`}
                                                        className="block px-4 py-1 text-sm text-gray-700 hover:bg-gray-100 ml-2"
                                                        onClick={handleLinkClick}
                                                    >
                                                        Staffs
                                                    </Link>
                                                </li>
                                                <li className="px-4 py-1 bg-gray-100 font-semibold text-sm text-gray-400">Manage school</li>
                                                <li>
                                                    <Link
                                                        to={hasSchoolAdminPrivilege
                                                            ? `/schoolAdmin/${staffInfo?.schoolCode}/classes`
                                                            : `/infuzAdmin/schools/${schoolId}/classes`}
                                                        className="block px-4 py-1 text-sm text-gray-700 hover:bg-gray-100 ml-2"
                                                    >
                                                        Classes
                                                    </Link>
                                                </li>
                                                <li>
                                                    <Link
                                                        to={hasSchoolAdminPrivilege
                                                            ? `/schoolAdmin/${staffInfo?.schoolCode}/roles`
                                                            : `/infuzAdmin/schools/${schoolInfo.schoolPrefix}/roles`}
                                                        className="block px-4 py-1 text-sm text-gray-700 hover:bg-gray-100 ml-2"
                                                        onClick={handleLinkClick}
                                                    >
                                                        Roles
                                                    </Link>
                                                </li>
                                                {!superAdminInfo && (
                                                    <>
                                                        <li>
                                                            <Link
                                                                to={hasSchoolAdminPrivilege
                                                                    ? `/schoolAdmin/${staffInfo?.schoolCode}/termExams`
                                                                    : `/infuzAdmin/schools/${schoolInfo.schoolPrefix}/termExams`}
                                                                className="block px-4 py-1 text-sm text-gray-700 hover:bg-gray-100 ml-2"
                                                                onClick={handleLinkClick}
                                                            >
                                                                Term exams
                                                            </Link>
                                                        </li>
                                                        <li>
                                                            <Link
                                                                to={hasSchoolAdminPrivilege
                                                                    ? `/schoolAdmin/${staffInfo?.schoolCode}/timetables`
                                                                    : `/infuzAdmin/schools/${schoolInfo.schoolPrefix}/timetables`}
                                                                className="block px-4 py-1 text-sm text-gray-700 hover:bg-gray-100 ml-2"
                                                                onClick={handleLinkClick}
                                                            >
                                                                Time tables
                                                            </Link>
                                                        </li>
                                                    </>
                                                )}
                                                <li>
                                                    <Link
                                                        to={hasSchoolAdminPrivilege
                                                            ? `/schoolAdmin/${staffInfo?.schoolCode}/subjectAllocation`
                                                            : `/infuzAdmin/schools/${schoolId}/subjectAllocation`}
                                                        className="block px-4 py-1 text-sm text-gray-700 hover:bg-gray-100 ml-2"
                                                    >
                                                        Subject allocation
                                                    </Link>
                                                </li>
                                                <li>
                                                    <Link
                                                        to={hasSchoolAdminPrivilege
                                                            ? `/schoolAdmin/${staffInfo?.schoolCode}/academicYears`
                                                            : `/infuzAdmin/schools/${schoolInfo.schoolPrefix}/academicYears`}
                                                        className="block px-4 py-1 text-sm text-gray-700 hover:bg-gray-100 ml-2"
                                                        onClick={handleLinkClick}
                                                    >
                                                        Academic years
                                                    </Link>
                                                </li>
                                                {superAdminInfo && (
                                                    <li>
                                                        <Link to={`/infuzAdmin/schools/${schoolInfo.schoolPrefix}/manage`} className="block px-4 py-1 text-sm text-gray-700 hover:bg-gray-100 ml-2">
                                                            School settings</Link>
                                                    </li>
                                                )}
                                            </ul>
                                        )}
                                    </li>
                                )}

                                <li className="relative">
                                    <button
                                        onClick={toggleDropdown}
                                        className="text-white hover:text-gray-200 focus:outline-none"
                                    >
                                        {hasSchoolAdminPrivilege ? "Configurations" : "Global configurations"}
                                    </button>
                                    {isDropdownOpen && (
                                        <ul className="absolute left-0 mt-2 w-64 bg-white shadow-md z-10 shadow-gray-400" onClick={(e) => e.stopPropagation()}>
                                            <li className="px-4 py-1 bg-gray-100 font-semibold text-sm text-gray-400">Standards</li>
                                            <li>
                                                <Link
                                                    to={hasSchoolAdminPrivilege
                                                        ? `/schoolAdmin/${staffInfo?.schoolCode}/standards`
                                                        : `/infuzAdmin/standards`}
                                                    className="block px-4 py-1 text-sm text-gray-700 hover:bg-gray-100 ml-2"
                                                    onClick={handleLinkClick}
                                                >
                                                    Standards
                                                </Link>
                                            </li>
                                            <li>
                                                <Link
                                                    to={hasSchoolAdminPrivilege
                                                        ? `/schoolAdmin/${staffInfo?.schoolCode}/groups`
                                                        : `/infuzAdmin/groups`}
                                                    className="block px-4 py-1 text-sm text-gray-700 hover:bg-gray-100 ml-2"
                                                    onClick={handleLinkClick}
                                                >
                                                    Groups (HSS)
                                                </Link>
                                            </li>
                                            <li>
                                                <Link
                                                    to={hasSchoolAdminPrivilege
                                                        ? `/schoolAdmin/${staffInfo?.schoolCode}/mediums`
                                                        : `/infuzAdmin/mediums`}
                                                    className="block px-4 py-1 text-sm text-gray-700 hover:bg-gray-100 ml-2"
                                                    onClick={handleLinkClick}
                                                >
                                                    Mediums
                                                </Link>
                                            </li>
                                            <li className="px-4 py-1 bg-gray-100 font-semibold text-sm text-gray-400">Subjects</li>
                                            <li>
                                                <Link
                                                    to={hasSchoolAdminPrivilege
                                                        ? `/schoolAdmin/${staffInfo?.schoolCode}/subjects`
                                                        : `/infuzAdmin/subjects`}
                                                    className="block px-4 py-1 text-sm text-gray-700 hover:bg-gray-100 ml-2"
                                                    onClick={handleLinkClick}
                                                >
                                                    Subjects
                                                </Link>
                                            </li>
                                            <li className="px-4 py-1 bg-gray-100 font-semibold text-sm text-gray-400">School configuration</li>
                                            <li>
                                                <Link
                                                    to={hasSchoolAdminPrivilege
                                                        ? `/schoolAdmin/${staffInfo?.schoolCode}/grades`
                                                        : `/infuzAdmin/grades`}
                                                    className="block px-4 py-1 text-sm text-gray-700 hover:bg-gray-100 ml-2"
                                                    onClick={handleLinkClick}
                                                >
                                                    Grades
                                                </Link>
                                            </li>
                                            <li>
                                                <Link
                                                    to={hasSchoolAdminPrivilege
                                                        ? `/schoolAdmin/${staffInfo?.schoolCode}/workingDays`
                                                        : `/infuzAdmin/workingDays`}
                                                    className="block px-4 py-1 text-sm text-gray-700 hover:bg-gray-100 ml-2"
                                                    onClick={handleLinkClick}
                                                >
                                                    Working days
                                                </Link>
                                            </li>
                                            <li>
                                                <Link
                                                    to={hasSchoolAdminPrivilege
                                                        ? `/schoolAdmin/${staffInfo?.schoolCode}/religions`
                                                        : `/infuzAdmin/religions`}
                                                    className="block px-4 py-1 text-sm text-gray-700 hover:bg-gray-100 ml-2"
                                                    onClick={handleLinkClick}
                                                >
                                                    Religions
                                                </Link>
                                            </li>
                                            <li>
                                                <Link
                                                    to={hasSchoolAdminPrivilege
                                                        ? `/schoolAdmin/${staffInfo?.schoolCode}/castes`
                                                        : `/infuzAdmin/castes`}
                                                    className="block px-4 py-1 text-sm text-gray-700 hover:bg-gray-100 ml-2"
                                                    onClick={handleLinkClick}
                                                >
                                                    Castes
                                                </Link>
                                            </li>
                                            <li>
                                                <Link
                                                    to={hasSchoolAdminPrivilege
                                                        ? `/schoolAdmin/${staffInfo?.schoolCode}/sections`
                                                        : `/infuzAdmin/sections`}
                                                    className="block px-4 py-1 text-sm text-gray-700 hover:bg-gray-100 ml-2"
                                                    onClick={handleLinkClick}
                                                >
                                                    Sections
                                                </Link>
                                            </li>
                                            <li>
                                                <Link
                                                    to={hasSchoolAdminPrivilege
                                                        ? `/schoolAdmin/${staffInfo?.schoolCode}/syllabus`
                                                        : `/infuzAdmin/syllabus`}
                                                    className="block px-4 py-1 text-sm text-gray-700 hover:bg-gray-100 ml-2"
                                                    onClick={handleLinkClick}
                                                >
                                                    Syllabuses
                                                </Link>
                                            </li>
                                        </ul>
                                    )}
                                </li>
                            </ul>
                        </div>
                    </div>

                    {superAdminInfo && superAdminInfo.username && (
                        <div className="relative">
                            <button
                                onClick={toggleUserDropdown}
                                className="flex items-center space-x-2 text-white hover:text-gray-200 focus:outline-none"
                            >
                                <div className="flex items-center space-x-2">
                                    {/* User Avatar Circle */}
                                    <span className="font-medium">{superAdminInfo.username}</span>
                                    <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                                        <span className="text-[#308369] font-semibold text-lg">
                                            {superAdminInfo.username?.charAt(0).toUpperCase() || ''}
                                        </span>

                                    </div>
                                    <svg
                                        className={`w-4 h-4 transition-transform ${isUserDropdownOpen ? 'rotate-180' : ''}`}
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M19 9l-7 7-7-7"
                                        />
                                    </svg>
                                </div>
                            </button>

                            {isUserDropdownOpen && (
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-50">
                                    <button
                                        onClick={handleLogout}
                                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-150 shadow-[0_0_10px_rgba(0,0,0,0.1)]"
                                    >
                                        <svg
                                            className="w-4 h-4 mr-2"
                                            fill="none"
                                            stroke="red"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                                            />
                                        </svg>
                                        Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </nav >

            {!hasSchoolAdminPrivilege && (
                <Breadcrumbs />
            )}

            <main className="flex-1">
                <Outlet />
            </main>
        </>
    );
};

export default Navbar;
