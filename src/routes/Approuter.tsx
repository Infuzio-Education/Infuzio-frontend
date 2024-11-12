import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import SuperAdminRoutes from './SuperAdminRoutes';
import StaffRoutes from './StaffRoutes';

const AppRouter: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/superAdmin" replace />} />
      <Route path='/superAdmin/*' element={<SuperAdminRoutes />} />
      <Route path='/staffs/*' element={<StaffRoutes />} />
    </Routes>
  );
};

export default AppRouter;