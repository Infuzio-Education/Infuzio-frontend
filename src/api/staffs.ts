import Api from "./axiosConfig";
import staffEndpoints from "../endpoints/staffs";
import axios from "axios";
import { Homework, TestMark, UnitTest } from "../types/Types";

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
        console.error(error);
    }
};

export const getAnnouncements = async () => {
    try {
        const response = await Api.get(staffEndpoints.Announcements);
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
    page?: number;
    limit?: number;
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

export const postUnitTestmark = async (markPayload: TestMark[]) => {
    try {
        const response = await Api.post(
            staffEndpoints.unitTestMark,
            markPayload?.map((item) => ({ ...item, IsAbsent: item?.isAbsent }))
        );
        return response.data;
    } catch (error) {
        console.error("Error postponing unit test:", error);
        throw error;
    }
};

export const getUnitTestMark = async (unit_test_id: number) => {
    try {
        const response = await Api.get(staffEndpoints?.getUnitTestMark, {
            params: { unit_test_id },
        });

        if (response?.data && response?.data?.status === true) {
            return response?.data?.data;
        }
        return [];
    } catch (error) {
        console.error("Error getting unit test mark:", error);
        throw error;
    }
};

export const publishUnitTestMark = async (unit_test_id: number) => {
    try {
        const response = await Api.patch(staffEndpoints?.publishUnitTestMark, {
            unit_test_id,
        });
        if (response?.data && response?.data?.status === true) {
            return response?.data?.data;
        }
        throw new Error("Cannot publish unit test mark");
    } catch (error) {
        console.error("Error getting profile info:", error);
        throw error;
    }
};

export const updateUnitTestMark = async (data: TestMark[]) => {
    try {
        const payload = [...data]?.map(
            ({ unit_test_mark_id, mark, isAbsent }) => ({
                unit_test_mark_id,
                mark,
                is_absent: isAbsent,
            })
        );
        const response = await Api.patch(staffEndpoints?.unitTestMark, payload);
        if (response?.data && response?.data?.status === true) {
            return response?.data?.data;
        }
        throw new Error("Cannot publish unit test mark");
    } catch (error) {
        console.error("Error getting profile info:", error);
        throw error;
    }
};

export const getHomeworkTeacher = async () => {
    try {
        const response = await Api.get(staffEndpoints?.getTeacherHomework);
        if (response?.data && response?.data?.status === true) {
            return response?.data?.data;
        }
        return [];
    } catch (error) {
        console.error("Error getting homework:", error);
        throw error;
    }
};

export const getMyClasses = async () => {
    try {
        const response = await Api.get(staffEndpoints.getMyClasses, {
            params: {
                criteria: "my-classes",
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching my classes:", error);
        throw error;
    }
};

export const createHomework = async (data: Partial<Homework>) => {
    try {
        const response = await Api.post(staffEndpoints?.manageHomework, data);
        if (response?.data && response?.data?.status === true) {
            return response?.data;
        }
    } catch (error) {
        console.error("Error creating homework:", error);
        throw error;
    }
};

// Create New Announcement
export const createAnnouncement = async (announcementData: {
    selectedCategory: string;
    categoryIDs: number[];
    title: string;
    body: string;
    files: File[];
    authorRole: string;
}) => {
    const formData = new FormData();
    formData.append("selectedCategory", announcementData.selectedCategory);
    announcementData.categoryIDs.forEach((id) =>
        formData.append("categoryIDs", id.toString())
    );
    formData.append("title", announcementData.title);
    formData.append("body", announcementData.body);
    formData.append("authorRole", announcementData.authorRole);
    announcementData.files.forEach((file) => formData.append("files", file));

    try {
        const response = await Api.post(
            staffEndpoints.Announcements,
            formData,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            }
        );
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error("Error creating announcement:", error.response);
            throw error;
        } else {
            console.error("Unexpected error:", error);
            throw error;
        }
    }
};

export const getAllClassesInSchool = async (schoolPrefix: string) => {
    try {
        const response = await Api.get(
            `${staffEndpoints.getAllClasses}?school_prefix=${schoolPrefix}`
        );
        console.log("response1", response);
        return response;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error("Error fetching privileges:", error.response);
            throw error;
        }
        throw error;
    }
};

export const updateHomework = async (data: Homework) => {
    try {
        const response = await Api.put(staffEndpoints?.manageHomework, data);
        if (response?.data && response?.data?.status === true) {
            return response?.data;
        }
    } catch (error) {
        console.error("Error updating homework:", error);
        throw error;
    }
};

export const getAllStandardsInSchool = async (schoolPrefix: string) => {
    try {
        const response = await Api.get(
            `${staffEndpoints.getAllStandards}?school_prefix=${schoolPrefix}`
        );
        return response;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error("Error fetching privileges:", error.response);
            throw error;
        }
        throw error;
    }
};

export const deleteHomework = async (id: number) => {
    try {
        const response = await Api.delete(
            staffEndpoints?.manageHomework + `/${id}`
        );
        if (response?.data && response?.data?.status === true) {
            return response?.data;
        }
    } catch (error) {
        console.error("Error deleting homework:", error);
        throw error;
    }
};

export const getAllGroupsInSchool = async (schoolPrefix: string) => {
    try {
        const response = await Api.get(
            `${staffEndpoints.getAllGroups}?school_prefix=${schoolPrefix}`
        );
        return response;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error("Error fetching privileges:", error.response);
            throw error;
        }
        throw error;
    }
};

export const getProfileInfo = async () => {
    try {
        const response = await Api.get(staffEndpoints?.getProfileInfo);
        if (response?.data && response?.data?.status === true) {
            return response?.data?.data;
        }
        return null;
    } catch (error) {
        console.error("Error getting profile info:", error);
        throw error;
    }
};

export const getAllMediumsInSchool = async (schoolPrefix: string) => {
    try {
        const response = await Api.get(
            `${staffEndpoints.getAllMediums}?school_prefix=${schoolPrefix}`
        );
        return response;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error("Error fetching privileges:", error.response);
            throw error;
        }
        throw error;
    }
};

export const getAllSectionsInSchool = async (schoolPrefix: string) => {
    try {
        const response = await Api.get(
            `${staffEndpoints.getAllSections}?school_prefix=${schoolPrefix}`
        );
        return response;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error("Error fetching privileges:", error.response);
            throw error;
        }
        throw error;
    }
};

export const deleteAnnouncement = async (
    announcementId: number,
    schoolPrefix: string
) => {
    try {
        const response = await Api.delete(
            `${staffEndpoints.Announcements}/${announcementId}?school_prefix=${schoolPrefix}`
        );
        return response.data;
    } catch (error) {
        console.error("Error deleting announcement:", error);
        throw error;
    }
};

export const getTermExam = async (page: number = 1, limit: number = 20) => {
    try {
        const response = await Api.get(staffEndpoints?.getTermExams, {
            params: {
                page,
                limit,
            },
        });

        if (response?.data?.status) {
            return response?.data?.data || [];
        }
        return [];
    } catch (error) {
        console.log("Error fetching term exam", error);
        throw error;
    }
};

export const getSubjects = async (params: {
    staffID: number;
    classID: number;
    termExamSubjectsOnly?: boolean;
    page?: number;
    limit?: number;
}) => {
    try {
        const response = await Api.get(staffEndpoints?.getSubjects, {
            params: {
                ...params,
                page: params?.page || 1,
                limit: params?.limit || 20,
            },
        });

        if (response?.data?.status) {
            return response?.data?.data || [];
        }
        return [];
    } catch (error) {
        console.log("Error fetching subjects", error);
        throw error;
    }
};

export const getTermExamMarksForClassTeacher = async (
    term_exam_id: number,
    class_id: number
) => {
    try {
        const response = await Api.get(
            staffEndpoints?.getTermExamMarksForClassTeacher,
            {
                params: { term_exam_id, class_id },
            }
        );

        if (response?.data?.status) {
            return response.data.data;
        }
        return null;
    } catch (error) {
        console.log("Error fetching subjects", error);
        throw error;
    }
};

export const getTermExamMarkClasswise = async (
    term_exam_id: number,
    class_id: number,
    subject_id: number
) => {
    try {
        const response = await Api.get(
            staffEndpoints?.getClasswiseTermExamMark,
            {
                params: {
                    term_exam_id,
                    class_id,
                    subject_id,
                },
            }
        );

        if (response?.data?.status) {
            console.log(response?.data);

            return response?.data?.data || [];
        }
        return [];
    } catch (error) {
        console.log("Error fetching subjects", error);
        throw error;
    }
};

export const postTermExamMark = async (
    payload: {
        student_id: number;
        term_exam_subject_id: number;
        obtained_mark: number;
        is_absent: boolean;
    }[]
) => {
    try {
        const response = await Api.put(
            staffEndpoints?.postTermExamMark,
            payload
        );

        if (response?.data?.status) {
            console.log(response?.data);

            return response?.data?.data || [];
        }
        return [];
    } catch (error) {
        console.log("Error fetching subjects", error);
        throw error;
    }
};
