import Api from "./axiosConfig";
import staffEndpoints from "../endpoints/staffs";
import axios from "axios";

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
    } catch (error: any) {
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
    } catch (error: any) {
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
    } catch (error: any) {
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
        const response = await Api.get(staffEndpoints.getTimeTable + `/${classId}`);
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
}