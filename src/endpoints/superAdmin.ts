
const superAdminEndpoints = {
    // Auth
    login: 'login/infuzAdmin',

    // Global   
    syllabus: 'global/syllabus',
    mediums: 'global/medium',
    religion: 'global/religion',
    standards: 'global/standard',
    groups: 'global/groups',
    sections: 'global/sections',
    castes: 'global/caste',
    subjects: 'global/subjects',
    workingDays: 'global/workingDay',
    gradeBoundary: 'global/grade/boundary',
    gradeCategory: 'global/grade/category',

    // School
    schoolMediums: 'school/medium',
    schoolStandards: 'school/standards',
    schoolSections: 'school/section',
    schoolCastes: 'school/caste',
    schoolSubjects: 'school/subjects',
    schoolReligions: 'school/religion',
    schoolGroups: 'school/groups',
    schoolWorkingDays: 'school/workingDay',
    schoolSyllabus: 'school/syllabus',
    schoolGradeCategory: 'school/grade/category',
    schoolGradeBoundary: 'school/grade/boundary',
    staff: 'school/staff',
    student: 'school/student',
    parent: 'school/parent',
    classes: 'school/class',
    specialPrivilege: 'school/special-privilege',
    subjectAllocation: 'school/subjectallocation',
    academicYear: 'school/academic-year',
    simpleStaffList: 'school/staff/simple-list',

    // Manage school
    school: 'manage-school',
    schoolLogo: 'manage-school/logo',
    schoolStatus: 'manage-school/status',
    studentLimit: 'manage-school/student-limit',
    syllabusConnection: 'manage-school/syllabus-connection',


    // School Admin
    termExams: 'school-admin/term/exam',
    timetable: 'school-admin/tt',
    getTimetableByClass: 'public/tt/byClass',


};

export default superAdminEndpoints;