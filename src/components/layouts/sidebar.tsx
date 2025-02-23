import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate, Outlet } from "react-router-dom";
import {
    Home,
    FileText,
    Menu,
    X,
    LogOut,
    BookOpenCheck,
    ListTodo,
    Megaphone,
    User,
    ShieldCheck,
    Calendar,
    Users,
    GraduationCap,
    Table,
} from "lucide-react";
import { logout } from "../../redux/slices/staffSlice/staffSlice";
import { updateStaffInfo } from "../../redux/slices/staffSlice/staffSlice";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store/store";
import { getProfileInfo } from "../../api/staffs";
import { message } from "antd";

interface SidebarProps {
    children?: React.ReactNode;
}

const Sidebar: React.FC<SidebarProps> = () => {
    const location = useLocation();
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const staffInfo = useSelector(
        (state: RootState) => state.staffInfo.staffInfo
    );
    const [collapsed, setCollapsed] = useState(false);

    useEffect(() => {
        if (staffInfo) {
            const { regNumber, name } = staffInfo;
            if (!regNumber && !name) {
                fetchStaffInfo();
            }
        }
    }, [staffInfo]);

    const fetchStaffInfo = async () => {
        try {
            const data = await getProfileInfo();
            dispatch(
                updateStaffInfo({
                    name: data?.name,
                    idCardNumber: data?.idCardNumber,
                    profilePicLink: data?.profilePicLink,
                })
            );
        } catch (error) {
            message?.error("Unable to fetch staff info");
            console.log(error);
        }
    };

    const toggleCollapse = () => {
        setCollapsed(!collapsed);
    };

    const isActiveLink = (path: string) => {
        if (path === "/staffs/home") {
            return (
                location.pathname === path ||
                location.pathname === "/staffs/students"
            );
        }
        return location.pathname === path;
    };

    const handleLogout = () => {
        dispatch(logout());
        navigate("/staffs/login");
    };

    const hasSchoolAdminPrivilege = staffInfo?.specialPrivileges?.some(
        (privilege) => privilege.privilege === "schoolAdmin"
    );

    const isTeachingStaff = staffInfo?.specialPrivileges?.some(
        (privilege) => privilege.privilege === "teachingStaff"
    );

    const isSchoolHead = staffInfo?.specialPrivileges?.some(
        (privilege) => privilege.privilege === "schoolHead"
    );

    return (
        <div className="flex">
            {/* Sidebar */}
            <div
                className={`h-screen bg-white shadow-lg fixed left-0 top-0 overflow-y-auto transition-all duration-300 
                ${collapsed ? "w-20" : "w-64"}`}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b">
                    {!collapsed && (
                        <h1 className="text-xl font-bold text-gray-800">
                            Staff Portal
                        </h1>
                    )}
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
                        className={`flex items-center mx-3 px-4 py-2.5 rounded-full transition-all duration-200 ${
                            isActiveLink("/staffs/home")
                                ? "bg-emerald-700 text-white shadow-lg shadow-emerald-200"
                                : "text-gray-700 hover:bg-gray-100"
                        }`}
                    >
                        <span className="inline-flex items-center justify-center w-6">
                            <Home size={20} />
                        </span>
                        {!collapsed && (
                            <span className="ml-3 text-sm font-medium">
                                Home
                            </span>
                        )}
                    </Link>
                    <Link
                        to="/staffs/announcements"
                        className={`flex items-center mx-3 px-4 py-2.5 rounded-full transition-all duration-200 mt-1 ${
                            isActiveLink("/staffs/announcements")
                                ? "bg-emerald-700 text-white shadow-lg shadow-emerald-200"
                                : "text-gray-700 hover:bg-gray-100"
                        }`}
                    >
                        <span className="inline-flex items-center justify-center w-6">
                            <Megaphone size={20} />
                        </span>
                        {!collapsed && (
                            <span className="ml-3 text-sm font-medium">
                                Announcements
                            </span>
                        )}
                    </Link>
                    {isTeachingStaff && (
                        <>
                            <Link
                                to="/staffs/exams"
                                className={`flex items-center mx-3 px-4 py-2.5 rounded-full transition-all duration-200 mt-1 ${
                                    isActiveLink("/staffs/exams")
                                        ? "bg-emerald-700 text-white shadow-lg shadow-emerald-200"
                                        : "text-gray-700 hover:bg-gray-100"
                                }`}
                            >
                                <span className="inline-flex items-center justify-center w-6">
                                    <BookOpenCheck size={20} />
                                </span>
                                {!collapsed && (
                                    <span className="ml-3 text-sm font-medium">
                                        Exams
                                    </span>
                                )}
                            </Link>
                            <Link
                                to="/staffs/unit-tests"
                                className={`flex items-center mx-3 px-4 py-2.5 rounded-full transition-all duration-200 mt-1 ${
                                    isActiveLink("/staffs/unit-tests")
                                        ? "bg-emerald-700 text-white shadow-lg shadow-emerald-200"
                                        : "text-gray-700 hover:bg-gray-100"
                                }`}
                            >
                                <span className="inline-flex items-center justify-center w-6">
                                    <FileText size={20} />
                                </span>
                                {!collapsed && (
                                    <span className="ml-3 text-sm font-medium">
                                        Unit Tests
                                    </span>
                                )}
                            </Link>
                            <Link
                                to="/staffs/home-workouts"
                                className={`flex items-center mx-3 px-4 py-2.5 rounded-full transition-all duration-200 mt-1 ${
                                    isActiveLink("/staffs/home-workouts")
                                        ? "bg-emerald-700 text-white shadow-lg shadow-emerald-200"
                                        : "text-gray-700 hover:bg-gray-100"
                                }`}
                            >
                                <span className="inline-flex items-center justify-center w-6">
                                    <ListTodo size={20} />
                                </span>
                                {!collapsed && (
                                    <span className="ml-3 text-sm font-medium">
                                        Home Workouts
                                    </span>
                                )}
                            </Link>
                        </>
                    )}
                    <Link
                        to="/staffs/attendance"
                        className={`flex items-center mx-3 px-4 py-2.5 rounded-full transition-all duration-200 mt-1 ${
                            location.pathname === "/staffs/attendance"
                                ? "bg-emerald-700 text-white shadow-lg shadow-emerald-200"
                                : "text-gray-700 hover:bg-gray-100"
                        }`}
                    >
                        <span className="inline-flex items-center justify-center w-6">
                            <Calendar size={20} />
                        </span>
                        {!collapsed && (
                            <span className="ml-3 text-sm font-medium">
                                My Attendance
                            </span>
                        )}
                    </Link>

                    {hasSchoolAdminPrivilege && (
                        <Link
                            to={`/schoolAdmin/${staffInfo?.schoolCode}`}
                            className={`flex items-center mx-3 px-4 py-2.5 rounded-full transition-all duration-200 mt-1 ${
                                location.pathname.startsWith("/schoolAdmin/")
                                    ? "bg-emerald-700 text-white shadow-lg shadow-emerald-200"
                                    : "text-gray-700 hover:bg-gray-100"
                            }`}
                        >
                            <span className="inline-flex items-center justify-center w-6">
                                <ShieldCheck size={20} />
                            </span>
                            {!collapsed && (
                                <span className="ml-3">School Admin View</span>
                            )}
                        </Link>
                    )}

                    {isSchoolHead && (
                        <>
                            <Link
                                to="/staffs/all-students"
                                className={`flex items-center mx-3 px-4 py-2.5 rounded-full transition-all duration-200 mt-1 ${
                                    isActiveLink("/staffs/all-students")
                                        ? "bg-emerald-700 text-white shadow-lg shadow-emerald-200"
                                        : "text-gray-700 hover:bg-gray-100"
                                }`}
                            >
                                <span className="inline-flex items-center justify-center w-6">
                                    <Users size={20} />
                                </span>
                                {!collapsed && (
                                    <span className="ml-3 text-sm font-medium">
                                        All Students
                                    </span>
                                )}
                            </Link>
                            <Link
                                to="/staffs/all-staffs"
                                className={`flex items-center mx-3 px-4 py-2.5 rounded-full transition-all duration-200 mt-1 ${
                                    isActiveLink("/staffs/all-staffs")
                                        ? "bg-emerald-700 text-white shadow-lg shadow-emerald-200"
                                        : "text-gray-700 hover:bg-gray-100"
                                }`}
                            >
                                <span className="inline-flex items-center justify-center w-6">
                                    <GraduationCap size={20} />
                                </span>
                                {!collapsed && (
                                    <span className="ml-3 text-sm font-medium">
                                        All Staffs
                                    </span>
                                )}
                            </Link>
                            <Link
                                to="/staffs/take-attendance"
                                className={`flex items-center mx-3 px-4 py-2.5 rounded-full transition-all duration-200 mt-1 ${
                                    isActiveLink("/staffs/take-attendance")
                                        ? "bg-emerald-700 text-white shadow-lg shadow-emerald-200"
                                        : "text-gray-700 hover:bg-gray-100"
                                }`}
                            >
                                <span className="inline-flex items-center justify-center w-6">
                                    <Table size={20} />
                                </span>
                                {!collapsed && (
                                    <span className="ml-3 text-sm font-medium">
                                        Staff Attendance
                                    </span>
                                )}
                            </Link>
                        </>
                    )}
                </nav>

                {/* Footer */}
                <div className="absolute bottom-0 left-0 right-0 border-t bg-white">
                    <div
                        className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                            collapsed ? "flex justify-center" : ""
                        }`}
                    >
                        <Link to="/staffs/profile">
                            <div className="flex items-center space-x-3">
                                <div
                                    className={`${
                                        collapsed ? "w-8 h-8" : "w-8 h-8"
                                    } rounded-full bg-gray-200 flex items-center justify-center`}
                                >
                                    {staffInfo?.profilePicLink ? (
                                        <img
                                            src={staffInfo.profilePicLink}
                                            alt={staffInfo.name}
                                            className="w-full h-full rounded-full object-cover"
                                        />
                                    ) : (
                                        <User
                                            size={16}
                                            className="text-gray-400"
                                        />
                                    )}
                                </div>
                                {!collapsed && (
                                    <div>
                                        <p className="text-sm font-medium text-gray-700">
                                            {staffInfo?.name || "Staff Name"}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            REG NO:{" "}
                                            {staffInfo?.regNumber || "#12345"}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </Link>
                    </div>
                    <button
                        className={`w-full p-4 flex items-center text-red-500 hover:bg-gray-100 transition-colors ${
                            collapsed ? "justify-center" : ""
                        }`}
                        onClick={handleLogout}
                    >
                        <LogOut size={20} />
                        {!collapsed && <span className="ml-3">Logout</span>}
                    </button>
                </div>
            </div>

            {/* Main content area */}
            <div
                className={`flex-1 ${collapsed ? "ml-20" : "ml-64"} 
                min-h-screen flex flex-col transition-all duration-300`}
            >
                <div className="flex-1 p-4 md:p-6 bg-[#E7E7E7] overflow-auto">
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
