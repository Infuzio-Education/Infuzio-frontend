import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Breadcrumbs: React.FC = () => {
    const location = useLocation();

    const pathSegments: string[] = location.pathname
        .split('/')
        .filter(segment => segment && segment !== 'superAdmin');

    const getPath = (index: number): string => '/superAdmin/' + pathSegments.slice(0, index + 1).join('/');

    return (
        <nav className="bg-white">
            <div className="max-w-screen-l px-3 py-1 mx-auto">
                <div className="flex items-center">
                    <ul className="flex flex-row font-medium mt-0 space-x-1 rtl:space-x-reverse text-sm text-black">
                        <li>
                            <Link to="/superAdmin" className="text-black">Home</Link>
                        </li>

                        {pathSegments.map((segment, index) => (
                            <li key={index}>
                                <span className="mx-1">/</span>
                                {index === pathSegments.length - 1 ? (
                                    <span className="text-green-600">{segment}</span>
                                ) : (
                                    <Link to={getPath(index)} className="text-black">
                                        {segment}
                                    </Link>
                                )}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default Breadcrumbs;