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
    schoolSyllabus: 'school/syllabus',
    staff: 'school/staff',
    student: 'school/student',
    parent: 'school/parent',
    classes: 'school/class',
    specialPrivilege: 'school/special-privilege',
    // gradeCategory: 'school/grade/category',

    // Manage school
    school: 'manage-school',
    schoolLogo: 'manage-school/logo',

    academicYear: 'school/academic-year',
};

export default superAdminEndpoints;