import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { SchoolProvider } from '../contexts/SchoolContext'; 
import SuperAdminRoutes from './SuperAdminRoutes';

const AppRouter: React.FC = () => {
  return (
    <SchoolProvider>
      <Routes>
        <Route path="/" element={<Navigate to="/superAdmin" replace />} />
        <Route path='/superAdmin/*' element={<SuperAdminRoutes/>} />
      </Routes>
    </SchoolProvider>
  );
};

export default AppRouter;