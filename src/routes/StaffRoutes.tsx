import { Route, Routes, Navigate } from "react-router-dom";
import StaffLayout from "../components/layouts/sidebar";
import StaffLogin from "../pages/staffs/StaffLogin";
import StaffHome from "../pages/staffs/StaffHome";

const StaffRoutes = () => {
    return (
        <Routes>
            <Route path='/login' element={<StaffLogin />} />
            <Route path="/" element={<StaffLayout />}>
                <Route index element={<Navigate to="home" replace />} />
                <Route path="home" element={<StaffHome />} />
                {/* Add other routes here */}
            </Route>
        </Routes>
    );
};

export default StaffRoutes;
