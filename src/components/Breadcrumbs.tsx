import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSchoolContext } from '../contexts/SchoolContext';

const Breadcrumbs: React.FC = () => {
    const location = useLocation();
    const { schoolInfo } = useSchoolContext();

    const pathSegments: string[] = location.pathname
        .split('/')
        .filter(segment => segment && segment !== 'superAdmin');

    const getPath = (index: number): string => '/superAdmin/' + pathSegments.slice(0, index + 1).join('/');

    const formatSegment = (segment: string, index: number): string => {
        if (pathSegments[index - 1] === 'schools' && schoolInfo?.name) {
            return schoolInfo.name;
        }

        return segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' ');
    };

    return (
        <nav className="bg-white sticky top-16 left-0 w-full z-40">
            <div className="max-w-screen-l px-3 py-2 mx-auto">
                <div className="flex items-center">
                    <ul className="flex flex-row font-medium mt-0 space-x-1 rtl:space-x-reverse text-sm">
                        <li>
                            <Link
                                to="/superAdmin"
                                className={location.pathname === '/superAdmin' ? 'text-emerald-600' : 'text-gray-700'}
                            >
                                Home
                            </Link>
                        </li>

                        {pathSegments.map((segment, index) => (
                            <li key={index} className="flex items-center">
                                <span className="mx-1 text-gray-500">/</span>
                                <Link
                                    to={getPath(index)}
                                    className={location.pathname === getPath(index) ? 'text-emerald-600' : 'text-gray-700'}
                                >
                                    {formatSegment(segment, index)}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default Breadcrumbs;