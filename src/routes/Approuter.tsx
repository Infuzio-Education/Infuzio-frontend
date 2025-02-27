import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import SuperAdminRoutes from './SuperAdminRoutes';
import StaffRoutes from './StaffRoutes';
import SchoolAdminRoutes from './SchoolAdminRoutes';
import { SchoolProvider } from '../contexts/SchoolContext';
import Error404 from '../components/Error404';

const AppRouter: React.FC = () => {
  return (
    <SchoolProvider>
      <Routes>
        <Route path="/" element={<Navigate to="/staffs" replace />} />
        <Route path="/infuzAdmin/*" element={<SuperAdminRoutes />} />
        <Route path="/schoolAdmin/*" element={<SchoolAdminRoutes />} />
        <Route path='/staffs/*' element={<StaffRoutes />} />
        <Route path="*" element={<Error404 />} />
      </Routes>
    </SchoolProvider>
  );
};

export default AppRouter;