import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import SuperAdminRoutes from './SuperAdminRoutes';
import StaffRoutes from './StaffRoutes';
import SchoolAdminRoutes from './SchoolAdminRoutes';
import { SchoolProvider } from '../contexts/SchoolContext';

const AppRouter: React.FC = () => {
  return (
    <SchoolProvider>
      <Routes>
        <Route path="/" element={<Navigate to="/superAdmin" replace />} />
        <Route path="/superAdmin/*" element={<SuperAdminRoutes />} />
        <Route path="/schoolAdmin/*" element={<SchoolAdminRoutes />} />
        <Route path='/staffs/*' element={<StaffRoutes />} />
      </Routes>
    </SchoolProvider>
  );
};

export default AppRouter;