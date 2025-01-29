const staffEndpoints = {
    login: "/login/staff",
    getClasses: "/staff/class/list-for-attendance",
    getAttendanceByClass: "/staff/attendance/class",
    getStudentsByClass: "/staff/class/students",
    postAttendance: "/staff/attendance",
    getTimeTable: "/public/tt/byClass",
    getStudentsDetails: "/school/student",
    getStaffAttendance: "/staff/myAttendance/monthly",
    Announcements: "/staff/announcement",
    getSubjectsOfStaff: "/staff/subjects/my-subjects",
    getStudentAttendance: "/staff/attendance/student",
    getSections: "/school/sections",
    getClassesGeneral: "/staff/class/list",
    createUnitTest: "/staff/exam/unitExam",
    getAllUnitTests: "/staff/exam/unitExam",
    updateUnitTest: "/staff/exam/unitExam/update",
    cancelUnitTest: "/school/exam/unitExam/cancel",
    completeUnitTest: "/staff/exam/unitExam/completed",
    postponeUnitTest: "/staff/exam/unitExam/postponed/indefinitely",
    publishUnitTestMark: "/staff/exam/unitExam/mark",
    getTeacherHomework: "/staff/homework/teacher",
    manageHomework: "/staff/homework",
    getProfileInfo: "/staff/profile",
    updateProfilePic: "/staff/profile-pic",
    getMyClasses: "/staff/class/list",


    getAllClasses: "/public/classSimpleList",
    getAllStandards: "/public/standardSimpleList",
    getAllGroups: "/public/groupsSimpleList",
    getAllMediums: "/public/mediumSimpleList",
    getAllSections: "/public/sectionsWithCode"
};

export default staffEndpoints;
