import { useState } from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import {
    Home,
    FileText,
    Menu,
    X,
    LogOut,
    BookOpenCheck,
    ListTodo,
    Megaphone
} from 'lucide-react';

const Sidebar = () => {
    const location = useLocation();
    const [collapsed, setCollapsed] = useState(false);

    const toggleCollapse = () => {
        setCollapsed(!collapsed);
    };

    const isActiveLink = (path: string) => {
        if (path === '/staffs/home') {
            return location.pathname === path || location.pathname === '/staffs/students';
        }
        return location.pathname === path;
    };

    return (
        <div className="flex h-screen w-full bg-[#f5f6fa]">
            <div
                className={`h-full bg-white shadow-lg transition-all duration-300 relative ${collapsed ? 'w-20' : 'w-64'
                    }`}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b">
                    {!collapsed && <h1 className="text-xl font-bold text-gray-800">Staff Portal</h1>}
                    <button
                        onClick={toggleCollapse}
                        className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-600"
                    >
                        {collapsed ? <Menu size={20} /> : <X size={20} />}
                    </button>
                </div>

                {/* Navigation */}
                <nav className="flex flex-col py-4">
                    <Link
                        to="/staffs/home"
                        className={`flex items-center mx-3 px-4 py-2.5 rounded-full transition-all duration-200 ${isActiveLink('/staffs/home')
                            ? 'bg-emerald-700 text-white shadow-lg shadow-emerald-200'
                            : 'text-gray-700 hover:bg-gray-100'
                            }`}
                    >
                        <span className="inline-flex items-center justify-center w-6">
                            <Home size={20} />
                        </span>
                        {!collapsed && (
                            <span className="ml-3 text-sm font-medium">Home</span>
                        )}
                    </Link>
                    <Link
                        to="/staffs/announcements"
                        className={`flex items-center mx-3 px-4 py-2.5 rounded-full transition-all duration-200 mt-1 ${isActiveLink('/staffs/announcements')
                            ? 'bg-emerald-700 text-white shadow-lg shadow-emerald-200'
                            : 'text-gray-700 hover:bg-gray-100'
                            }`}
                    >
                        <span className="inline-flex items-center justify-center w-6">
                            <Megaphone size={20} />
                        </span>
                        {!collapsed && (
                            <span className="ml-3 text-sm font-medium">Announcements</span>
                        )}
                    </Link>
                    <Link
                        to="/staffs/exams"
                        className={`flex items-center mx-3 px-4 py-2.5 rounded-full transition-all duration-200 mt-1 ${isActiveLink('/staffs/exams')
                            ? 'bg-emerald-700 text-white shadow-lg shadow-emerald-200'
                            : 'text-gray-700 hover:bg-gray-100'
                            }`}
                    >
                        <span className="inline-flex items-center justify-center w-6">
                            <BookOpenCheck size={20} />
                        </span>
                        {!collapsed && (
                            <span className="ml-3 text-sm font-medium">Exams</span>
                        )}
                    </Link>
                    <Link
                        to="/staffs/unit-tests"
                        className={`flex items-center mx-3 px-4 py-2.5 rounded-full transition-all duration-200 mt-1 ${isActiveLink('/staffs/unit-tests')
                            ? 'bg-emerald-700 text-white shadow-lg shadow-emerald-200'
                            : 'text-gray-700 hover:bg-gray-100'
                            }`}
                    >
                        <span className="inline-flex items-center justify-center w-6">
                            <FileText size={20} />
                        </span>
                        {!collapsed && (
                            <span className="ml-3 text-sm font-medium">Unit Tests</span>
                        )}
                    </Link>
                    <Link
                        to="/staffs/home-workouts"
                        className={`flex items-center mx-3 px-4 py-2.5 rounded-full transition-all duration-200 mt-1 ${isActiveLink('/staffs/home-workouts')
                            ? 'bg-emerald-700 text-white shadow-lg shadow-emerald-200'
                            : 'text-gray-700 hover:bg-gray-100'
                            }`}
                    >
                        <span className="inline-flex items-center justify-center w-6">
                            <ListTodo size={20} />
                        </span>
                        {!collapsed && (
                            <span className="ml-3 text-sm font-medium">Home Workouts</span>
                        )}
                    </Link>
                </nav>


                {/* Footer */}
                <div className="absolute bottom-0 left-0 right-0 border-t bg-white">
                    {!collapsed && (
                        <div className="p-4">
                            <div className="flex items-center space-x-3">
                                <div className="w-8 h-8 rounded-full bg-gray-200"></div>
                                <div>
                                    <p className="text-sm font-medium text-gray-700">Staff Name</p>
                                    <p className="text-xs text-gray-500">Staff ID: #12345</p>
                                </div>
                            </div>
                        </div>
                    )}
                    <button
                        className={`w-full p-4 flex items-center text-red-500 hover:bg-gray-100 transition-colors ${collapsed ? 'justify-center' : ''
                            }`}
                    >
                        <LogOut size={20} />
                        {!collapsed && <span className="ml-3">Logout</span>}
                    </button>
                </div>
            </div>

            <div className="flex-1 p-6 bg-[#E7E7E7] overflow-auto">
                <Outlet />
            </div>
        </div>
    );
};

export default Sidebar;
