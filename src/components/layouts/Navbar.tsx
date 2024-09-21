import { Outlet, Link } from 'react-router-dom';

const Navbar = () => {
    return (
        <>
            <nav className="bg-[#308369]">
                <div className="flex flex-wrap justify-between items-center mx-auto p-4">

                    <div className='flex flex-row space-x-8'>
                        <Link to="/superAdmin" className="flex items-center space-x-3 rtl:space-x-reverse">
                            <img src="/infuzio-logo.png" className="h-8" alt="School Admin Logo" />
                        </Link>

                        <div className="flex items-center">
                            <ul className="flex flex-row  mt-0 space-x-8 text-sm">
                                <li>
                                    <Link to="/superAdmin" className="text-gray-900 dark:text-white" >
                                        Schools
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/superAdmin" className="text-gray-900 dark:text-white">
                                        Teachers
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/superAdmin" className="text-gray-900 dark:text-white">
                                        Students
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div className="flex flex-row items-center space-x-3 px-3 rtl:space-x-reverse">
                        <span className="text-black">Profile Name</span>
                        <img src="/account.png" className="h-8" alt="Profile Icon" />
                    </div>
                </div>
            </nav>


            <nav className="bg-white">
                <div className="max-w-screen-l px-3 py-1 mx-auto">
                    <div className="flex items-center">
                        <ul className="flex flex-row font-medium mt-0 space-x-2 rtl:space-x-reverse text-sm text-black">
                            <li>
                                <Link to="/superAdmin" className="text-black" aria-current="page">
                                    Schools
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>

            <main>
                <Outlet />
            </main>
        </>
    );
};

export default Navbar;
