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
import { SchoolProvider } from "../contexts/SchoolContext";
import ListSyllabus from "../pages/superAdmin/ListSyllabus";
import ListReligions from "../pages/superAdmin/ListReligions";
import ListGroups from "../pages/superAdmin/ListGroups";
import ListClass from "../pages/superAdmin/ListClass";
import ListStudents from "../pages/superAdmin/ListStudents";

const SuperAdminRoutes = () => {
    return (
        <SchoolProvider>
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
                        <Route path="syllabus" element={<ListSyllabus />} />
                        <Route path="religions" element={<ListReligions />} />
                        <Route path="groups" element={<ListGroups />} />
                        <Route path="staffs" element={<ListStaffs />} />
                        <Route path="classes" element={<ListClass/>} />
                        <Route path="students" element={<ListStudents/>} />
                    </Route>
                </Route>
            </Routes>
        </SchoolProvider>
    )
}

export default SuperAdminRoutes;