import Api from "./axiosConfig";
import staffEndpoints from "../endpoints/staffs";
import axios from "axios";
import { TestMark, UnitTest } from "../types/Types";

interface StaffInfo {
    token: string;
}

Api.interceptors.request.use(
    (config) => {
        const staffInfoString = localStorage.getItem("staffInfo");

        if (staffInfoString) {
            try {
                const staffInfo = JSON.parse(staffInfoString) as StaffInfo;

                if (staffInfo && staffInfo.token) {
                    config.headers["Authorization"] = `${staffInfo.token}`;
                }
            } catch (e) {
                console.error("Error parsing staffInfo from localStorage:", e);
            }
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export const staffLogin = async (body: {
    username: string;
    password: string;
}) => {
    try {
        const response = await Api.post(staffEndpoints.login, body);
        return response;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            return error?.response;
        } else {
            console.error("Unexpected error:", error);
            throw error;
        }
    }
};

export const getClasses = async (params: {
    criteria: "all" | "all-in-my-sections" | "my-classes";
}) => {
    try {
        const response = await Api.get(staffEndpoints.getClasses, {
            params,
        });
        if (response?.data && response?.data?.status === true) {
            return response?.data?.data;
        }
        return [];
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error("Error fetching classes:", error.response);
            throw error;
        } else {
            console.error("Unexpected error:", error);
            throw error;
        }
    }
};

export const getAttendanceByClass = async (params: {
    classId: string;
    date: string;
}) => {
    try {
        const response = await Api.get(staffEndpoints.getAttendanceByClass, {
            params,
        });
        if (response?.data && response?.data?.status === true) {
            return response?.data?.data?.Attendance?.map(
                (attendance: {
                    StudentID: string;
                    Status: "a" | "f" | "m" | "e" | null;
                }) => ({
                    student_id: attendance.StudentID,
                    status: attendance.Status,
                })
            );
        }
        return [];
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error("No attendance found:", error.response);
            throw error;
        } else {
            console.error("Unexpected error:", error);
            throw error;
        }
    }
};

export const takeAttendance = async (body: {
    class_id: string;
    attendance_date: string;
    attendance: {
        student_id: string;
        status: "f" | "a" | "m" | "e";
    }[];
}) => {
    try {
        const response = await Api.post(staffEndpoints.postAttendance, body);
        return response;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            return error?.response;
        } else {
            console.error("Unexpected error:", error);
            throw error;
        }
    }
};

export const getStudentsByClass = async (classId: string) => {
    try {
        const response = await Api.get(
            staffEndpoints.getStudentsByClass + `/${classId}`
        );

        if (response?.data && response?.data?.status === true) {
            return response?.data?.data?.students;
        }
        return [];
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error("Error fetching attendance:", error.response);
            throw error;
        } else {
            console.error("Unexpected error:", error);
            throw error;
        }
    }
};

export const getTimeTable = async (classId: string) => {
    try {
        const response = await Api.get(
            staffEndpoints.getTimeTable + `/${classId}`
        );
        if (response?.data && response?.data?.status === true) {
            return response?.data?.data?.timetable;
        }
        return null;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error("Error fetching attendance:", error.response);
            throw error;
        } else {
            console.error("Unexpected error:", error);
            throw error;
        }
    }
};

export const getStudentsDetails = async (classId: string) => {
    try {
        const response = await Api.get(staffEndpoints.getStudentsDetails, {
            params: {
                classID: classId,
            },
        });
        if (response?.data && response?.data?.status === true) {
            return response?.data?.data?.students;
        }
        return [];
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error("Error fetching attendance:", error.response);
            throw error;
        } else {
            console.error("Unexpected error:", error);
            throw error;
        }
    }
};

export const getStudentDetails = async (studentId: string) => {
    try {
        const response = await Api.get(
            staffEndpoints.getStudentsDetails + `/${studentId}`
        );
        if (response?.data && response?.data?.status === true) {
            return response?.data?.data;
        }
        return null;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            return error?.response;
        } else {
            console.error("Unexpected error:", error);
            throw error;
        }
    }
};

export const getStaffAttendanceByMonth = async (params: {
    year: string;
    month: string;
}) => {
    try {
        const response = await Api.get(staffEndpoints.getStaffAttendance, {
            params,
        });
        return response?.data?.data || null;
    } catch (error) {
        console.log(error);
    }
};

export const getAnnouncements = async () => {
    try {
        const response = await Api.get(staffEndpoints.getAnnouncements);
        if (response?.data && response?.data?.status === true) {
            return response?.data?.data;
        }
        return [];
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error("Error fetching announcements:", error.response);
            throw error;
        } else {
            console.error("Unexpected error:", error);
            throw error;
        }
    }
};

export const getStudentAttendanceByMonth = async (params: {
    studentId: string;
    month: string;
    year: string;
}) => {
    try {
        const response = await Api.get(staffEndpoints.getStudentAttendance, {
            params,
        });
        if (response?.data && response?.data?.status === true) {
            return response?.data?.data;
        }
        return null;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error("Error fetching student attendance:", error.response);
            throw error;
        } else {
            console.error("Unexpected error:", error);
            throw error;
        }
    }
};

export const getSections = async () => {
    try {
        const response = await Api.get(staffEndpoints.getSections);
        console.log(response);

        if (response?.data && response?.data?.status === true) {
            return response?.data?.data;
        }
        return [];
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error("Error fetching sections:", error.response);
            throw error;
        } else {
            console.error("Unexpected error:", error);
            throw error;
        }
    }
};

export const getSubjectsOfStaff = async () => {
    try {
        const response = await Api.get(staffEndpoints.getSubjectsOfStaff);
        console.log(response);

        if (response?.data && response?.data?.status === true) {
            return response?.data?.data;
        }
        return [];
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error("Error fetching subjects of staff:", error.response);
            throw error;
        } else {
            console.error("Unexpected error:", error);
            throw error;
        }
    }
};

export const getClassesGeneral = async (params: {
    criteria: "all" | "all-in-my-sections" | "my-classes";
}) => {
    try {
        const response = await Api.get(staffEndpoints.getClassesGeneral, {
            params,
        });
        if (response?.data && response?.data?.status === true) {
            return response?.data?.data;
        }
        return [];
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error("Error fetching classes:", error.response);
            throw error;
        } else {
            console.error("Unexpected error:", error);
            throw error;
        }
    }
};

export const createUnitTest = async (unitTestData: {
    subject_id: number;
    class_id: number;
    portion_desc: string;
    created_staff_id: number;
    date: string;
    max_mark: number;
    pass_mark: number;
}) => {
    try {
        const response = await Api.post(
            staffEndpoints.createUnitTest,
            unitTestData
        );
        if (response?.data && response?.data?.status === true) {
            return response?.data?.data;
        }
        return null;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error("Error creating unit test:", error.response);
            throw error;
        } else {
            console.error("Unexpected error:", error);
            throw error;
        }
    }
};

export const getUnitTest = async (params: {
    staff_unit_test?: boolean;
    page?: number;
    limit?: number;
}) => {
    const { staff_unit_test = true, page = 1, limit = 2 } = params;
    try {
        const response = await Api.get(staffEndpoints.getAllUnitTests, {
            params: { staff_unit_test, page, limit },
        });
        if (response?.data && response?.data?.status === true) {
            return response?.data?.data;
        }
        return [];
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error("Error fetching classes:", error.response);
            throw error;
        } else {
            console.error("Unexpected error:", error);
            throw error;
        }
    }
};

export const updateUnitTest = async (unitTestData: Partial<UnitTest>) => {
    try {
        const response = await Api.put(
            staffEndpoints.updateUnitTest,
            unitTestData
        );
        return response.data;
    } catch (error) {
        console.error("Error updating unit test:", error);
        throw error;
    }
};

export const cancelUnitTest = async (unit_test_id: number) => {
    try {
        const response = await Api.patch(staffEndpoints.cancelUnitTest, {
            unit_test_id: unit_test_id,
        });
        return response.data;
    } catch (error) {
        console.error("Error cancelling unit test:", error);
        throw error;
    }
};

export const completeUnitTest = async (unit_test_id: number) => {
    try {
        const response = await Api.patch(staffEndpoints.completeUnitTest, {
            unit_test_id: unit_test_id,
        });
        return response.data;
    } catch (error) {
        console.error("Error completing unit test:", error);
        throw error;
    }
};

export const postponeUnitTest = async (unit_test_id: number) => {
    try {
        const response = await Api.patch(staffEndpoints.postponeUnitTest, {
            unit_test_id: unit_test_id,
        });
        return response.data;
    } catch (error) {
        console.error("Error postponing unit test:", error);
        throw error;
    }
};

export const publishUnitTestmark = async (markPayload: TestMark[]) => {
    try {
        const response = await Api.post(
            staffEndpoints.publishUnitTestMark,
            markPayload?.map((item) => ({ ...item, IsAbsent: item?.isAbsent }))
        );
        return response.data;
    } catch (error) {
        console.error("Error postponing unit test:", error);
        throw error;
    }
};
