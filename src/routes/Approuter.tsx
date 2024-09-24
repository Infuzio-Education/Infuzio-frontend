import { Route, Routes, Navigate } from "react-router-dom";
import SuperAdminLogin from "../pages/superAdmin/SuperAdminLogin";
import Schools from "../pages/superAdmin/Schools";
import Navbar from "../components/layouts/Navbar";
import CreateSchool from "../pages/superAdmin/createSchool";

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/superAdmin" replace />} />
      <Route path="/superAdmin" element={< SuperAdminLogin />} />
      <Route element={<Navbar />}>
        <Route path="/superAdmin/schools" element={<Schools />} />
        <Route path="/superAdmin/createSchool" element={<CreateSchool />} />
      </Route>
    </Routes>
  );
}

export default AppRouter;
