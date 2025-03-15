import { Route, Routes, Navigate } from "react-router-dom";
import StaffLayout from "../components/layouts/sidebar";
import StaffLogin from "../pages/staffs/StaffLogin";
import StaffHome from "../pages/staffs/StaffHome";
import StudentList from "../pages/staffs/StudentList";
import Announcements from "../pages/staffs/Announcements";
import HomeWorkouts from "../pages/staffs/HomeWorkouts";
import UnitTests from "../pages/staffs/UnitTests";
import Exams from "../pages/staffs/Exams";
import StaffProfile from "../pages/staffs/StaffProfile";
import { StaffProtect, SchoolHeadProtect } from "../components/PrivateRoute";
import StaffAttendance from "../pages/staffs/StaffAttendance";
import AllStudents from "../pages/staffs/schoolHead/AllStudents";
import AllStaffs from "../pages/staffs/schoolHead/AllStaffs";
import SchoolHeadAttendance from "../pages/staffs/schoolHead/SchoolHeadAttendance";

const StaffRoutes = () => {
    return (
        <Routes>
            <Route path="/login" element={<StaffLogin />} />
            <Route element={<StaffProtect />}>
                <Route path="/" element={<StaffLayout />}>
                    <Route index element={<Navigate to="home" replace />} />
                    <Route path="home" element={<StaffHome />} />
                    <Route path="attendance" element={<StaffAttendance />} />
                    <Route path="students" element={<StudentList />} />
                    <Route path="announcements" element={<Announcements />} />
                    <Route path="home-workouts" element={<HomeWorkouts />} />
                    <Route path="unit-tests" element={<UnitTests />} />
                    <Route path="exams" element={<Exams />} />
                    <Route path="profile" element={<StaffProfile />} />
                    <Route element={<SchoolHeadProtect />}>
                        <Route path="all-students" element={<AllStudents />} />
                        <Route path="all-staffs" element={<AllStaffs />} />
                        <Route path="take-attendance" element={<SchoolHeadAttendance />} />
                    </Route>
                </Route>
            </Route>
        </Routes>
    );
};

export default StaffRoutes;
