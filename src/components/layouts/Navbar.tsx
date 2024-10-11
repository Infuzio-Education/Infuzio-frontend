import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import Breadcrumbs from '../Breadcrumbs';

const Navbar: React.FC = () => {
    const location = useLocation();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isSchoolDropdownOpen, setIsSchoolDropdownOpen] = useState(false);
    const [isSchoolSelected, setIsSchoolSelected] = useState(false);
    const [schoolId, setSchoolId] = useState<string | null>(null);

    const toggleDropdown = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsDropdownOpen(!isDropdownOpen);
        if (!isDropdownOpen) {
            setIsSchoolDropdownOpen(false);
        }
    };

    const toggleSchoolDropdown = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsSchoolDropdownOpen(!isSchoolDropdownOpen);

        if (!isSchoolDropdownOpen) {
            setIsDropdownOpen(false);
        }
    };

    useEffect(() => {
        const closeDropdown = () => {
            if (isDropdownOpen) {
                setIsDropdownOpen(false);
            }
            if (isSchoolDropdownOpen) {
                setIsSchoolDropdownOpen(false);
            }
        };

        document.addEventListener('click', closeDropdown);
        return () => {
            document.removeEventListener('click', closeDropdown);
        };
    }, [isDropdownOpen, isSchoolDropdownOpen]);

    useEffect(() => {
        setIsDropdownOpen(false);
        setIsSchoolDropdownOpen(false);
    }, [location]);

    useEffect(() => {
        const pathParts = location.pathname.split('/');
        const isValidSchoolPath = pathParts[1] === 'superAdmin' && pathParts[2] === 'schools' && !isNaN(Number(pathParts[3]));

        setIsSchoolSelected(isValidSchoolPath);
        setSchoolId(isValidSchoolPath ? pathParts[3] : null);
    }, [location.pathname]);

    return (
        <>
            <nav className="bg-[#308369] fixed top-0 left-0 w-full z-50">
                <div className="flex flex-wrap justify-between items-center mx-auto p-4">
                    <div className="flex flex-row space-x-8">
                        <Link to="/superAdmin" className="flex items-center space-x-3 rtl:space-x-reverse">
                            <img src="/infuzio-logo.png" className="h-8 w-auto" alt="School Admin Logo" />
                        </Link>

                        <div className="flex items-center">
                            <ul className="flex flex-row mt-0 space-x-8 text-sm">
                                {isSchoolSelected && schoolId && (
                                    <li className="relative">
                                        <button
                                            onClick={toggleSchoolDropdown}
                                            className="text-gray-900 dark:text-white focus:outline-none"
                                        >
                                            Schools
                                        </button>
                                        {isSchoolDropdownOpen && (
                                            <ul className="absolute left-0 mt-2 w-64 bg-white shadow-md z-10 shadow-gray-400" onClick={(e) => e.stopPropagation()}>
                                                <li className="px-4 py-1 bg-gray-100 font-semibold text-sm text-gray-400">Admissions</li>
                                                <li>
                                                    <Link to="/superAdmin/configurations/option2" className="block px-4 py-1 text-sm text-gray-700 hover:bg-gray-100 ml-2">
                                                        Admission register
                                                    </Link>
                                                </li>
                                                <li className="px-4 py-1 bg-gray-100 font-semibold text-sm text-gray-400">Profiles</li>
                                                <li>
                                                    <Link to="/superAdmin/configurations/option3" className="block px-4 py-1 text-sm text-gray-700 hover:bg-gray-100 ml-2">
                                                        Students
                                                    </Link>
                                                </li>
                                                <li>
                                                    <Link to="/superAdmin/configurations/option4" className="block px-4 py-1 text-sm text-gray-700 hover:bg-gray-100 ml-2">
                                                        Parents
                                                    </Link>
                                                </li>
                                                <li>
                                                    <Link to={`/superAdmin/schools/${schoolId}/staffs`} className="block px-4 py-1 text-sm text-gray-700 hover:bg-gray-100 ml-2">
                                                        Staffs
                                                    </Link>
                                                </li>
                                                <li className="px-4 py-1 bg-gray-100 font-semibold text-sm text-gray-400">Manage school</li>
                                                <li>
                                                    <Link to="/superAdmin/subjects" className="block px-4 py-1 text-sm text-gray-700 hover:bg-gray-100 ml-2">
                                                        Classes
                                                    </Link>
                                                </li>
                                                <li>
                                                    <Link to="/superAdmin/configurations/option3" className="block px-4 py-1 text-sm text-gray-700 hover:bg-gray-100 ml-2">
                                                        Syllabus
                                                    </Link>
                                                </li>
                                                <li>
                                                    <Link to="/superAdmin/configurations/option3" className="block px-4 py-1 text-sm text-gray-700 hover:bg-gray-100 ml-2">
                                                        School
                                                    </Link>
                                                </li>
                                                <li>
                                                    <Link to="/superAdmin/sections" className="block px-4 py-1 text-sm text-gray-700 hover:bg-gray-100 ml-2">
                                                        Set principle                                                    </Link>
                                                </li>
                                                <li>
                                                    <Link to="/superAdmin/sections" className="block px-4 py-1 text-sm text-gray-700 hover:bg-gray-100 ml-2">
                                                        Set admins                                                    </Link>
                                                </li>
                                            </ul>
                                        )}
                                    </li>
                                )}

                                <li className="relative">
                                    <button
                                        onClick={toggleDropdown}
                                        className="text-gray-900 dark:text-white focus:outline-none"
                                    >
                                        Configurations
                                    </button>
                                    {isDropdownOpen && (
                                        <ul className="absolute left-0 mt-2 w-64 bg-white shadow-md z-10 shadow-gray-400" onClick={(e) => e.stopPropagation()}>
                                            <li className="px-4 py-1 bg-gray-100 font-semibold text-sm text-gray-400">Standards</li>
                                            <li>
                                                <Link to="/superAdmin/standards " className="block px-4 py-1 text-sm text-gray-700 hover:bg-gray-100 ml-2">
                                                    Standards
                                                </Link>
                                            </li>
                                            <li>
                                                <Link to="/superAdmin/configurations/option3" className="block px-4 py-1 text-sm text-gray-700 hover:bg-gray-100 ml-2">
                                                    Groups (HSS)
                                                </Link>
                                            </li>
                                            <li>
                                                <Link to="/superAdmin/mediums" className="block px-4 py-1 text-sm text-gray-700 hover:bg-gray-100 ml-2">
                                                    Mediums
                                                </Link>
                                            </li>
                                            <li className="px-4 py-1 bg-gray-100 font-semibold text-sm text-gray-400">Academic years</li>
                                            <li>
                                                <Link to="/superAdmin/configurations/option3" className="block px-4 py-1 text-sm text-gray-700 hover:bg-gray-100 ml-2">
                                                    Years
                                                </Link>
                                            </li>
                                            <li className="px-4 py-1 bg-gray-100 font-semibold text-sm text-gray-400">Subjects</li>
                                            <li>
                                                <Link to="/superAdmin/subjects" className="block px-4 py-1 text-sm text-gray-700 hover:bg-gray-100 ml-2">
                                                    Subjects
                                                </Link>
                                            </li>
                                            <li className="px-4 py-1 bg-gray-100 font-semibold text-sm text-gray-400">School configuration</li>
                                            <li>
                                                <Link to="/superAdmin/configurations/option3" className="block px-4 py-1 text-sm text-gray-700 hover:bg-gray-100 ml-2">
                                                    Grade
                                                </Link>
                                            </li>
                                            <li>
                                                <Link to="/superAdmin/configurations/option3" className="block px-4 py-1 text-sm text-gray-700 hover:bg-gray-100 ml-2">
                                                    Religion / Caste
                                                </Link>
                                            </li>
                                            <li>
                                                <Link to="/superAdmin/sections" className="block px-4 py-1 text-sm text-gray-700 hover:bg-gray-100 ml-2">
                                                    Sections
                                                </Link>
                                            </li>
                                        </ul>
                                    )}
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </nav>

            <Breadcrumbs />

            <main className="pt-24">
                <Outlet />
            </main>
        </>
    );
};

export default Navbar;
