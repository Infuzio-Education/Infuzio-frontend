import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import SuperAdminRoutes from './SuperAdminRoutes';
import StaffRoutes from './StaffRoutes';
import StaffLogin from '../pages/staffs/StaffLogin';

const AppRouter: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/superAdmin" replace />} />
      <Route path='/superAdmin/*' element={<SuperAdminRoutes />} />
      <Route path='/staffs/login' element={<StaffLogin />} />
      <Route path='/staffs/*' element={<StaffRoutes />} />
    </Routes>
  );
};

export default AppRouter;