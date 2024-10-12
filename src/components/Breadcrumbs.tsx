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

    return (
        <nav className="bg-white fixed top-16 left-0 w-full z-40">
            <div className="max-w-screen-l px-3 py-2 mx-auto">
                <div className="flex items-center">
                    <ul className="flex flex-row font-medium mt-0 space-x-1 rtl:space-x-reverse text-sm text-black">
                        <li>
                            <Link to="/superAdmin" className={location.pathname === '/superAdmin' ? 'text-green-600' : 'text-black'}>Home</Link>
                        </li>

                        {pathSegments.map((segment, index) => {
                            const isSchoolId = pathSegments[index - 1] === 'schools' && !isNaN(Number(segment));
                            const currentPath = getPath(index);
                            const isCurrentSegment = location.pathname === currentPath;

                            return (
                                <li key={index}>
                                    <span className="mx-1">/</span>
                                    {isSchoolId && schoolInfo.name ? (
                                        <Link
                                            to={currentPath}
                                            className={isCurrentSegment ? 'text-green-600' : ''}
                                        >
                                            {schoolInfo.name}
                                        </Link>
                                    ) : (
                                        <Link
                                            to={currentPath}
                                            className={isCurrentSegment ? 'text-green-600' : ''}
                                        >
                                            {segment}
                                        </Link>
                                    )}
                                </li>
                            );
                        })}
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default Breadcrumbs;