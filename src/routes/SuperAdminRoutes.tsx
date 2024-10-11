import { Route, Routes } from "react-router-dom";
import SuperAdminLogin from "../pages/superAdmin/SuperAdminLogin";
import Navbar from "../components/layouts/Navbar";
import ListSchools from "../pages/superAdmin/ListSchools";
import CreateSchool from "../pages/superAdmin/CreateSchool";
import SchoolProfiles from "../pages/superAdmin/SchoolProfiles";
import ListSections from "../pages/superAdmin/ListSections";
import ListSubjects from "../pages/superAdmin/ListSubjects";
import ListStaffs from "../pages/superAdmin/ListStaffs";
import ListStandards from "../pages/superAdmin/ListStandards";
import ListMediums from "../pages/superAdmin/ListMediums";
import { superAdminProtect as ProtectedRoute } from "../components/PrivateRoute";

const SuperAdminRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<SuperAdminLogin />} />
            
            {/* Protected Routes */}
            <Route element={<ProtectedRoute />}>
                <Route element={<Navbar />}>
                    <Route path="schools" element={<ListSchools />} />
                    <Route path="schools/create" element={<CreateSchool />} />
                    <Route path="schools/:id" element={<SchoolProfiles />} />
                    <Route path="sections" element={<ListSections />} />
                    <Route path="subjects" element={<ListSubjects />} />
                    <Route path="schools/:id/staffs" element={<ListStaffs />} />
                    <Route path="standards" element={<ListStandards />} />
                    <Route path="mediums" element={<ListMediums />} />
                </Route>
            </Route>
        </Routes>
    )
}

export default SuperAdminRoutes;