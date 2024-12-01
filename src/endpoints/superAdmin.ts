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
    classes: '/school/class',
    createParent: 'school/parent',
    listParent: 'school/parent',
    student: 'school/student',
    subjects: 'global/subjects',
    workingDays: 'global/workingDay',

    // School
    listStaff: 'school/staff/list',
    createStaff: 'school/staff/create',
    updateStaff: 'school/staff/update',
    deleteStaff: 'school/staff/delete',
    specialPrivilege: 'school/special-privilege',

    // Manage school
    listSchool: 'manage-school/list',
    createSchool: 'manage-school/create',
    schoolLogo: 'manage-school/logo',

    // Grades
    gradeCategory: 'global/grade/category',
    gradeBoundary: 'global/grade/boundary',
};

export default superAdminEndpoints;