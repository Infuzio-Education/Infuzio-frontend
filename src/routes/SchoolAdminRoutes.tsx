import { Routes, Route } from "react-router-dom";
import Sidebar from "../components/layouts/sidebar";
import ListSections from "../pages/superAdmin/ListSections";
import ListSubjects from "../pages/superAdmin/ListSubjects";
import ListStaffs from "../pages/superAdmin/ListStaffs";
import ListStandards from "../pages/superAdmin/ListStandards";
import ListMediums from "../pages/superAdmin/ListMediums";
import ListSyllabus from "../pages/superAdmin/ListSyllabus";
import ListGroups from "../pages/superAdmin/ListGroups";
import ListClasses from "../pages/superAdmin/ListClasses";
import ListStudents from "../pages/superAdmin/ListStudents";
import ListParents from "../pages/superAdmin/ListParents";
import ListWorkingDays from "../pages/superAdmin/ListWorkingDays";
import ManageStaffRoles from '../pages/superAdmin/ManageStaffRoles';
import ListGrades from '../pages/superAdmin/ListGrades';
import ManageSchool from "../pages/superAdmin/ManageSchool";
import ListAcademicYears from "../pages/superAdmin/ListAcademicYears";
import SubjectAllocation from "../pages/superAdmin/subjectAllocation";
import SchoolProfiles from "../pages/superAdmin/SchoolProfiles";
import ListReligions from "../pages/superAdmin/ListReligions";
import ListCastes from "../pages/superAdmin/ListCastes";
import Navbar from "../components/layouts/Navbar";
import ListTermExams from "../pages/superAdmin/ListTermExams";
import ListTimetable from "../pages/superAdmin/ListTimetable";
const SchoolAdminRoutes = () => {
    return (
        <Routes>
            <Route element={<Sidebar />}>
                <Route element={
                    <div className="flex-1">
                        <Navbar />
                    </div>
                }>
                    <Route path=":schoolCode" element={<SchoolProfiles />} />
                    <Route path=":schoolCode/sections" element={<ListSections />} />
                    <Route path=":schoolCode/subjects" element={<ListSubjects />} />
                    <Route path=":schoolCode/staffs" element={<ListStaffs />} />
                    <Route path=":schoolCode/standards" element={<ListStandards />} />
                    <Route path=":schoolCode/mediums" element={<ListMediums />} />
                    <Route path=":schoolCode/syllabus" element={<ListSyllabus />} />
                    <Route path=":schoolCode/groups" element={<ListGroups />} />
                    <Route path=":schoolCode/classes" element={<ListClasses />} />
                    <Route path=":schoolCode/students" element={<ListStudents />} />
                    <Route path=":schoolCode/parents" element={<ListParents />} />
                    <Route path=":schoolCode/workingDays" element={<ListWorkingDays />} />
                    <Route path=":schoolCode/roles" element={<ManageStaffRoles />} />
                    <Route path=":schoolCode/academicYears" element={<ListAcademicYears />} />
                    <Route path=":schoolCode/grades" element={<ListGrades />} />
                    <Route path=":schoolCode/manage" element={<ManageSchool />} />
                    <Route path=":schoolCode/religions" element={<ListReligions />} />
                    <Route path=":schoolCode/castes" element={<ListCastes />} />
                    <Route path=":schoolCode/subjectAllocation" element={<SubjectAllocation />} />
                    <Route path=":schoolCode/termExams" element={<ListTermExams />} />
                    <Route path=":schoolCode/timetables" element={<ListTimetable />} />
                    {/* <Route path=":schoolCode/createTimetables" element={<CreateTimetable />} /> */}
                </Route>
            </Route>
        </Routes>
    )
}

export default SchoolAdminRoutes;     