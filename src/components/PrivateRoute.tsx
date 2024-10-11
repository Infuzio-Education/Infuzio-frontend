import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

export const superAdminProtect = () => {
    const {superAdminInfo} = useSelector((state:any)=> state.superAdminInfo);

  return superAdminInfo ? <Outlet /> : <Navigate to='/' replace />
}