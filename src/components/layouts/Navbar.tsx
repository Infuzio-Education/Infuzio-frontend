import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import Breadcrumbs from '../Breadcrumbs';

const Navbar: React.FC = () => {
    const location = useLocation();
    const isSchoolsPage = location.pathname.startsWith('/superAdmin/schools');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

    return (
        <>
            <nav className="bg-[#308369]">
                <div className="flex flex-wrap justify-between items-center mx-auto p-4">
                    <div className='flex flex-row space-x-8'>
                        <Link to="/superAdmin" className="flex items-center space-x-3 rtl:space-x-reverse">
                            <img src="/infuzio-logo.png" className="h-8" alt="School Admin Logo" />
                        </Link>

                        <div className="flex items-center">
                            <ul className="flex flex-row mt-0 space-x-8 text-sm">
                                {isSchoolsPage && (
                                    <li className="relative">
                                        <button
                                            onClick={toggleDropdown}
                                            className="text-gray-900 dark:text-white focus:outline-none"
                                        >
                                            Configurations
                                        </button>
                                        {isDropdownOpen && (
                                            <ul className="absolute left-0 mt-2 w-64 bg-white shadow-lg z-10">
                                                <li className="px-4 py-2 bg-gray-100 font-semibold">Header 1</li>
                                                <li>
                                                    <Link to="/superAdmin/configurations/option1" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                                        Option 1
                                                    </Link>
                                                </li>
                                                <li>
                                                    <Link to="/superAdmin/configurations/option2" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                                        Option 2
                                                    </Link>
                                                </li>
                                                <li className="px-4 py-2 bg-gray-100 font-semibold">Header 2</li>
                                                <li>
                                                    <Link to="/superAdmin/configurations/option3" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                                        Option 3
                                                    </Link>
                                                </li>
                                                <li>
                                                    <Link to="/superAdmin/configurations/option4" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                                        Option 4
                                                    </Link>
                                                </li>
                                            </ul>
                                        )}
                                    </li>
                                )}
                            </ul>
                        </div>
                    </div>

                    <div className="flex flex-row items-center space-x-3 px-3 rtl:space-x-reverse">
                        <span className="text-black">Profile Name</span>
                        <img src="/account.png" className="h-8" alt="Profile Icon" />
                    </div>
                </div>
            </nav>

            <Breadcrumbs />

            <main>
                <Outlet />
            </main>
        </>
    );
};

export default Navbar;
