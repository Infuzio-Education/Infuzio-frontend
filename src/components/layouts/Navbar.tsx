import React, { useState, useEffect, useRef } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import Breadcrumbs from '../Breadcrumbs';

const Navbar: React.FC = () => {
    const location = useLocation();
    const isSchoolsPage = location.pathname.endsWith('/superAdmin/schools') || location.pathname.endsWith('/superAdmin/schools/create');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLUListElement | null>(null);

    const toggleDropdown = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsDropdownOpen(!isDropdownOpen);
    };

    useEffect(() => {
        const closeDropdown = () => {
            if (isDropdownOpen) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener('click', closeDropdown);
        return () => {
            document.removeEventListener('click', closeDropdown);
        };
    }, [isDropdownOpen]);

    // New useEffect to close dropdown on route change
    useEffect(() => {
        setIsDropdownOpen(false);
    }, [location]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

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
                                {!isSchoolsPage && (
                                    <li>
                                        <Link to="/superAdmin/schools" className="text-gray-900 dark:text-white">
                                            Schools
                                        </Link>
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
                                        <ul ref={dropdownRef} className="absolute left-0 mt-2 w-64 bg-white shadow-md z-10 shadow-gray-400">
                                            <li className="px-4 py-1 bg-gray-100 font-semibold text-sm text-gray-400">Standards</li>
                                            <li>
                                                <Link to="/superAdmin/configurations/option1" className="block px-4 py-1 text-sm text-gray-700 hover:bg-gray-100 ml-2">
                                                    Classes
                                                </Link>
                                            </li>
                                            <li>
                                                <Link to="/superAdmin/configurations/option2" className="block px-4 py-1 text-sm text-gray-700 hover:bg-gray-100 ml-2">
                                                    Standards
                                                </Link>
                                            </li>
                                            <li>
                                                <Link to="/superAdmin/configurations/option3" className="block px-4 py-1 text-sm text-gray-700 hover:bg-gray-100 ml-2">
                                                    Divisions
                                                </Link>
                                            </li>
                                            <li>
                                                <Link to="/superAdmin/configurations/option4" className="block px-4 py-1 text-sm text-gray-700 hover:bg-gray-100 ml-2">
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