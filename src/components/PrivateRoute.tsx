import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import { RootState } from "../redux/store/store";

export const SuperAdminProtect = () => {
    const { superAdminInfo } = useSelector(
        (state: RootState) => state.superAdminInfo
    );

    return superAdminInfo ? <Outlet /> : <Navigate to="/" replace />;
};

export const StaffProtect = () => {
    const { staffInfo } = useSelector((state: RootState) => state.staffInfo);

    return staffInfo ? <Outlet /> : <Navigate to="/staffs/login" replace />;
};
