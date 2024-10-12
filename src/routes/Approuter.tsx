import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import SuperAdminRoutes from './SuperAdminRoutes';

const AppRouter: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/superAdmin" replace />} />
      <Route path='/superAdmin/*' element={<SuperAdminRoutes />} />
    </Routes>
  );
};

export default AppRouter;