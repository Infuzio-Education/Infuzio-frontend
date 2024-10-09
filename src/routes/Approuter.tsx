import { Route, Routes, Navigate } from "react-router-dom";
import SuperAdminLogin from "../pages/superAdmin/SuperAdminLogin";
import ListSchools from "../pages/superAdmin/ListSchools";
import Navbar from "../components/layouts/Navbar";
import CreateSchool from "../pages/superAdmin/CreateSchool";
import SchoolProfiles from "../pages/superAdmin/SchoolProfiles";
import '../index.css'
import ListSections from "../pages/superAdmin/ListSections";
import ListSubjects from "../pages/superAdmin/ListSubjects";


const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/superAdmin" replace />} />
      <Route path="/superAdmin" element={< SuperAdminLogin />} />
      <Route element={<Navbar />}>
        <Route path="/superAdmin/schools" element={<ListSchools />} />
        <Route path="/superAdmin/schools/create" element={<CreateSchool />} />
        <Route path="/superAdmin/schools/:id" element={<SchoolProfiles />} />
        <Route path="/superAdmin/sections" element={<ListSections />} />
        <Route path="/superAdmin/subjects" element={<ListSubjects />} />
      </Route>
    </Routes>
  )
}

export default AppRouter;
