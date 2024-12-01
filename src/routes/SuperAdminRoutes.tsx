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
import ListClasses from "../pages/superAdmin/ListClasses";
import ListStudents from "../pages/superAdmin/ListStudents";
import ListCastes from "../pages/superAdmin/ListCastes";
import ListParents from "../pages/superAdmin/ListParents";
import ListWorkingDays from "../pages/superAdmin/ListWorkingDays";
import ManageStaffRoles from '../pages/superAdmin/ManageStaffRoles';
import ListGrades from '../pages/superAdmin/ListGrades';

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
                        <Route path="schools/:prefix" element={<SchoolProfiles />} />
                        <Route path="sections" element={<ListSections />} />
                        <Route path="subjects" element={<ListSubjects />} />
                        <Route path="schools/:prefix/staffs" element={<ListStaffs />} />
                        <Route path="standards" element={<ListStandards />} />
                        <Route path="mediums" element={<ListMediums />} />
                        <Route path="syllabus" element={<ListSyllabus />} />
                        <Route path="religions" element={<ListReligions />} />
                        <Route path="groups" element={<ListGroups />} />
                        <Route path="staffs" element={<ListStaffs />} />
                        <Route path="schools/:prefix/classes" element={<ListClasses />} />
                        <Route path="schools/:prefix/students" element={<ListStudents />} />
                        <Route path="schools/:prefix/parents" element={<ListParents />} />
                        <Route path="castes" element={<ListCastes />} />
                        <Route path="workingDays" element={<ListWorkingDays />} />
                        <Route path="schools/:prefix/roles" element={<ManageStaffRoles />} />
                        <Route path="grades" element={<ListGrades />} />

                    </Route>
                </Route>
            </Routes>
        </SchoolProvider>
    )
}

export default SuperAdminRoutes;
