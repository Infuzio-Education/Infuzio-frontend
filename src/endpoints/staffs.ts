const staffEndpoints = {
    login: "/login/staff",
    getClasses: "/staff/class/list-for-attendance",
    getAttendanceByClass: "/staff/attendance/class",
    getStudentsByClass: "/staff/class/students",
    postAttendance: "/staff/attendance",
    getTimeTable: "/public/tt/byClass",
    getStudentsDetails: "/school/student",
    getStaffAttendance: "/staff/myAttendance/monthly",
    getAnnouncements: "/staff/announcement",
    getStudentAttendance: "/staff/attendance/student",
};

export default staffEndpoints;
