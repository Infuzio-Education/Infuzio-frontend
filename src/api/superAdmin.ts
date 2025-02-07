import Api from './axiosConfig';
import superAdminEndpoints from '../endpoints/superAdmin';
import axios from 'axios';
import { CreateStaffPayload, SubjectAllocationResponse, SubjectAllocationRequest } from '../types/Types';
import { SyllabusData } from '../types/Types';

interface SuperAdminInfo {
    token: string;
}


Api.interceptors.request.use(
    (config) => {
        const superAdminInfoString = localStorage.getItem('superAdminInfo');

        if (superAdminInfoString) {
            try {
                const superAdminInfo = JSON.parse(superAdminInfoString) as SuperAdminInfo;

                if (superAdminInfo && superAdminInfo.token) {
                    config.headers['Authorization'] = `${superAdminInfo.token}`;
                }
            } catch (e) {
                console.error('Error parsing superAdminInfo from localStorage:', e);
            }
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);




export const superLogin = async (body: { username: string, password: string }) => {
    try {
        const response = await Api.post(superAdminEndpoints.login, body);

        return response;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            return error.response;
        } else {
            console.error('Unexpected error:', error);
            throw error;
        }
    }
}

export const getSyllabus = async (): Promise<SyllabusData> => {
    try {
        const response = await Api.get(superAdminEndpoints.syllabus);
        if (response.data && response.data.status === true) {
            return response.data.data;
        }
        return { global: [], custom: null };
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error('Error fetching syllabus:', error.response);
            throw error;
        } else {
            console.error('Unexpected error:', error);
            throw error;
        }
    }
};

export const createSyllabus = async (name: string) => {
    try {
        const response = await Api.post(superAdminEndpoints.syllabus, { name: name });
        return response;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error('Error creating syllabus:', error.response);
            throw error;
        } else {
            console.error('Unexpected error:', error);
            throw error;
        }
    }
};

export const getSchools = async (includeDeleted: boolean = false) => {
    try {
        const endpoint = includeDeleted
            ? `${superAdminEndpoints.school}?includeDeleted=true`
            : `${superAdminEndpoints.school}?includeInactive=true`;

        const response = await Api.get(endpoint);
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error('Error fetching schools:', error.response);
            throw error;
        } else {
            console.error('Unexpected error:', error);
            throw error;
        }
    }
}

export const createSchool = async (body: FormData) => {
    try {
        console.log('FormData Contents:');
        for (let pair of body.entries()) {
            console.log(pair[0], pair[1]);
        }

        const response = await Api.post(superAdminEndpoints.school, body, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        return response;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            if (error.response) {
                return error.response;
            } else {
                console.error('No response received from server:', error.message);
                return {
                    status: 500,
                    data: { message: 'No response received from server' },
                };
            }
        } else {
            console.error('Unexpected error:', error);
            throw error;
        }
    }
};


export const createMediums = async (name: string) => {
    try {
        const response = await Api.post(superAdminEndpoints.mediums, { name: name });
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error('Error fetching syllabus:', error.response);
            throw error;
        } else {
            console.error('Unexpected error:', error);
            throw error;
        }
    }
}

export const getMediums = async () => {
    try {
        const response = await Api.get(superAdminEndpoints.mediums);
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error('Error fetching syllabus:', error.response);
            throw error;
        } else {
            console.error('Unexpected error:', error);
            throw error;
        }
    }
}

export const updateMediums = async (id: number, name: string) => {
    try {
        const response = await Api.put(superAdminEndpoints.mediums, { ID: id, Name: name });
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error('Error fetching syllabus:', error.response);
            throw error;
        } else {
            console.error('Unexpected error:', error);
            throw error;
        }
    }
}

export const createReligion = async (name: string) => {
    try {
        const response = await Api.post(superAdminEndpoints.religion, { name: name });
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error('Error fetching syllabus:', error.response);
            throw error;
        } else {
            console.error('Unexpected error:', error);
            throw error;
        }
    }
}

export const getReligions = async () => {
    try {
        const response = await Api.get(superAdminEndpoints.religion);
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error('Error fetching syllabus:', error.response);
            throw error;
        } else {
            console.error('Unexpected error:', error);
            throw error;
        }
    }
}


export const createStandard = async (values: { name: string, hasGroup: boolean, sectionId: number, sequenceNumber: number }) => {
    try {
        const response = await Api.post(superAdminEndpoints.standards, values);
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error('Error fetching syllabus:', error.response);
            throw error;
        } else {
            console.error('Unexpected error:', error);
            throw error;
        }
    }
}

export const getStandards = async () => {
    try {
        const response = await Api.get(superAdminEndpoints.standards);
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error('Error fetching syllabus:', error.response);
            throw error;
        } else {
            console.error('Unexpected error:', error);
            throw error;
        }
    }
}

export const createGroup = async (name: string) => {
    try {
        const response = await Api.post(superAdminEndpoints.groups, { name });
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error('Error fetching syllabus:', error.response);
            throw error;
        } else {
            console.error('Unexpected error:', error);
            throw error;
        }
    }
}

export const getGroups = async () => {
    try {
        const response = await Api.get(superAdminEndpoints.groups);
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error('Error fetching syllabus:', error.response);
            throw error;
        } else {
            console.error('Unexpected error:', error);
            throw error;
        }
    }
}


export const getSections = async () => {
    try {
        const response = await Api.get(superAdminEndpoints.sections);
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error('Error fetching syllabus:', error.response);
            throw error;
        } else {
            console.error('Unexpected error:', error);
            throw error;
        }
    }
}

export const createSections = async (data: { sectionName: string; sectionCode: string }) => {
    try {
        console.log('data', data);
        const response = await Api.post(superAdminEndpoints.sections, {
            sectionName: data.sectionName,
            sectionCode: data.sectionCode
        });
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error('Error creating section:', error.response?.data || error.message);
            throw error;
        } else {
            console.error('Unexpected error:', error);
            throw error;
        }
    }
};


export const createCaste = async (data: { Name: string, ReligionID: number }) => {
    try {

        const response = await Api.post(superAdminEndpoints.castes, {
            name: data.Name,
            religion_id: data.ReligionID

        });
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error('Error creating caste:', error.response?.data || error.message);
            throw error;
        } else {
            console.error('Unexpected error:', error);
            throw error;
        }
    }
};

export const getCastes = async () => {
    try {
        const response = await Api.get(superAdminEndpoints.castes);
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error('Error fetching castes:', error.response);
            throw error;
        } else {
            console.error('Unexpected error:', error);
            throw error;
        }
    }
};

export const updateReligion = async (id: number, name: string) => {
    try {
        console.log("id", id);
        console.log("name", name);
        const response = await Api.put(superAdminEndpoints.religion, { id, name });
        console.log("response", response);
        return response.data;

    } catch (error) {
        console.error('Error updating religion:', error);
        throw error;
    }
};

export const deleteReligion = async (id: number) => {
    try {
        const response = await Api.delete(`${superAdminEndpoints.religion}/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting religion:', error);
        throw error;
    }
};


export const createStaff = async (values: CreateStaffPayload, schoolPrefix: string) => {
    try {
        // Create FormData and append only the values from the payload
        const formData = new FormData();
        Object.entries(values).forEach(([key, value]) => {
            if (value !== null && value !== undefined) {
                formData.append(key, String(value));
            }
        });

        // Log FormData for debugging
        console.log('FormData Contents:');
        for (let pair of formData.entries()) {
            console.log(pair[0], pair[1]);
        }

        const response = await Api.post(
            `${superAdminEndpoints.staff}?school_prefix=${schoolPrefix}`,
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }
        );
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error('Error creating staff:', error.response);
            throw error;
        }
        console.error('Unexpected error:', error);
        throw error;
    }
};

export const listStaff = async (schoolPrefix: string) => {
    try {
        const response = await Api.get(`${superAdminEndpoints.staff}?school_prefix=${schoolPrefix}`);
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error('Error listing staff:', error.response);
            throw error;
        }
        console.error('Unexpected error:', error);
        throw error;
    }
};

export const updateStaff = async (staffId: number, values: Partial<CreateStaffPayload>, schoolPrefix: string) => {
    try {
        const formData = new FormData();

        Object.entries(values).forEach(([key, value]) => {
            if (key === 'subjects' && Array.isArray(value)) {
                formData.append(key, JSON.stringify(value));
            } else if (key === 'profile_pic' && value instanceof File) {
                formData.append(key, value);
            } else if (value !== undefined) {
                formData.append(key, String(value));
            }
        });

        const response = await Api.patch(
            `/school/staff/${staffId}?school_prefix=${schoolPrefix}`,
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }
        );
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error('Error updating staff:', error.response);
            throw error;
        }
        console.error('Unexpected error:', error);
        throw error;
    }
};

export const deleteStaff = async (staffId: number, schoolPrefix: string) => {
    try {
        const response = await Api.delete(`/school/staff/${staffId}?school_prefix=${schoolPrefix}`);
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error('Error deleting staff:', error.response);
            throw error;
        }
        throw error;
    }
};

export const updateGroup = async (id: number, name: string) => {
    try {
        const response = await Api.put(superAdminEndpoints.groups, {
            id: id,
            name: name
        });
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error('Error updating group:', error.response);
            throw error;
        }
        console.error('Unexpected error:', error);
        throw error;
    }
}

export const updateCaste = async (id: number, name: string, religion_id: number) => {
    try {
        const response = await Api.put(superAdminEndpoints.castes, {
            id,
            name,
            religion_id
        });
        return response.data;
    } catch (error) {
        console.error('Error updating caste:', error);
        throw error;
    }
};

export const deleteGroup = async (id: number) => {
    try {
        const response = await Api.delete(`global/groups/${id}`);
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error('Error deleting group:', error.response);
            throw error;
        }
        console.error('Unexpected error:', error);
        throw error;
    }
};

export const getClasses = async (schoolPrefix: string) => {
    try {
        const response = await Api.get(`${superAdminEndpoints.classes}?school_prefix=${schoolPrefix}`);
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error('Error fetching classes:', error.response);
            throw error;
        }
        console.error('Unexpected error:', error);
        throw error;
    }
};

export const createClass = async (classData: any, schoolPrefix: string) => {
    try {
        console.log("classData", classData);
        const response = await Api.post(`${superAdminEndpoints.classes}?school_prefix=${schoolPrefix}`, classData);
        return response;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error('Error creating class:', error.response?.data);
            return error.response?.data || {
                status: false,
                error: "Failed to create class",
                resp_code: "ERROR"
            };
        }
        console.error('Unexpected error:', error);
        return {
            status: false,
            error: "An unexpected error occurred",
            resp_code: "ERROR"
        };
    }
};

export const updateClass = async (classData: any, schoolPrefix: string) => {
    try {
        const response = await Api.put(`${superAdminEndpoints.classes}?school_prefix=${schoolPrefix}`, classData);
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error('Error updating class:', error.response);
            throw error;
        }
        console.error('Unexpected error:', error);
        throw error;
    }
};


export const deleteClass = async (classId: number, schoolPrefix: string) => {
    try {
        const response = await Api.delete(`${superAdminEndpoints.classes}/${classId}?school_prefix=${schoolPrefix}`);
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error('Error updating class:', error.response);
            throw error;
        }
        console.error('Unexpected error:', error);
        throw error;
    }
}

export const updateSection = async (id: number, data: { sectionName: string; sectionCode: string }) => {
    try {
        const response = await Api.put(superAdminEndpoints.sections, {
            id,
            sectionName: data.sectionName,
            sectionCode: data.sectionCode
        });
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error('Error updating section:', error.response?.data || error.message);
            throw error;
        } else {
            console.error('Unexpected error:', error);
            throw error;
        }
    }
};

export const deleteSection = async (id: number) => {
    try {
        const response = await Api.delete(`${superAdminEndpoints.sections}/${id}`);
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error('Error deleting section:', error.response?.data || error.message);
            throw error;
        } else {
            console.error('Unexpected error:', error);
            throw error;
        }
    }
};

export const deleteCaste = async (id: number) => {
    try {
        const response = await Api.delete(`${superAdminEndpoints.castes}/${id}`);
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error('Error deleting caste:', error.response?.data || error.message);
            throw error;
        } else {
            console.error('Unexpected error:', error);
            throw error;
        }
    }
};

export const deleteStandard = async (id: number, schoolPrefix?: string) => {
    console.log("schoolPrefix", schoolPrefix);
    try {
        let url = `${superAdminEndpoints.standards}/${id}?school_prefix=${schoolPrefix}`;
        if (schoolPrefix) {
            url = `${superAdminEndpoints.schoolStandards}/${id}`;
        }
        const response = await Api.delete(url);
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error('Error deleting standard:', error.response);
            throw error;
        }
        console.error('Unexpected error:', error);
        throw error;
    }
};

export const deleteMedium = async (id: number) => {
    try {
        const response = await Api.delete(`${superAdminEndpoints.mediums}/${id}`);
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error('Error deleting medium:', error.response);
            throw error;
        }
        console.error('Unexpected error:', error);
        throw error;
    }
};

export const deleteSchool = async (id: number) => {
    try {
        const response = await Api.delete(`${superAdminEndpoints.school}/${id}`);
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error('Error deleting school:', error.response);
            throw error;
        }
        console.error('Unexpected error:', error);
        throw error;
    }
};

export const deleteSyllabus = async (id: number) => {
    try {
        const response = await Api.delete(`${superAdminEndpoints.syllabus}/${id}`);
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error('Error deleting syllabus:', error.response);
            throw error;
        }
        console.error('Unexpected error:', error);
        throw error;
    }
};

export const updateSyllabus = async (id: number, name: string) => {
    try {
        const response = await Api.put(superAdminEndpoints.syllabus, {
            id,
            name
        });
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error('Error updating syllabus:', error.response);
            throw error;
        }
        console.error('Unexpected error:', error);
        throw error;
    }
};

// Parent APIs
export const createParent = async (parentData: any, schoolPrefix: string) => {
    try {
        console.log("parentData", parentData);
        const response = await Api.post(`${superAdminEndpoints.parent}?school_prefix=${schoolPrefix}`, parentData);
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error('Error creating parent:', error.response);
            throw error;
        }
        throw error;
    }
};

export const listParents = async (schoolPrefix: string) => {
    try {
        const response = await Api.get(`${superAdminEndpoints.parent}?school_prefix=${schoolPrefix}`);
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error('Error listing parents:', error.response);
            throw error;
        }
        throw error;
    }
};

export const createStudent = async (studentData: FormData, schoolPrefix: string) => {
    try {
        const response = await Api.post(
            `${superAdminEndpoints.student}?school_prefix=${schoolPrefix}`,
            studentData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }
        );
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error('Error creating student:', error.response);
            throw error;
        }
        throw error;
    }
};

export const listStudents = async (schoolPrefix: string) => {
    try {
        const response = await Api.get(`${superAdminEndpoints.student}?school_prefix=${schoolPrefix}`);
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error('Error listing students:', error.response);
            throw error;
        }
        throw error;
    }
};

export const createSubject = async (name: string, code: string) => {
    try {
        const response = await Api.post(`${superAdminEndpoints.subjects}`, {
            name,
            code
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};


export const getSubjects = async () => {
    try {
        const response = await Api.get(superAdminEndpoints.subjects);
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error('Error fetching subjects:', error.response);
            throw error;
        } else {
            console.error('Unexpected error:', error);
            throw error;
        }
    }
};

export const updateSubject = async (id: number, name: string, code: string) => {
    try {
        const response = await Api.put(superAdminEndpoints.subjects, {
            id,
            name,
            code
        });
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error('Error updating subject:', error.response);
            throw error;
        } else {
            console.error('Unexpected error:', error);
            throw error;
        }
    }
};

export const deleteSubject = async (id: number) => {
    try {
        const response = await Api.delete(`${superAdminEndpoints.subjects}/${id}`);
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error('Error deleting subject:', error.response);
            throw error;
        }
        console.error('Unexpected error:', error);
        throw error;
    }
};

export const createWorkingDays = async (data: { group_name: string; days: number[] }) => {
    try {
        const response = await Api.post(superAdminEndpoints.workingDays, data);
        console.log("response", response);
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error('Error creating working days:', error.response);
            throw error;
        }
        throw error;
    }
};

export const getWorkingDays = async () => {
    try {
        const response = await Api.get(superAdminEndpoints.workingDays);
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error('Error fetching working days:', error.response);
            throw error;
        }
        throw error;
    }
};

export const updateWorkingDays = async (id: number, data: { group_name: string; days: number[] }) => {
    try {
        const response = await Api.patch(superAdminEndpoints.workingDays, {
            id: id,
            group_name: data.group_name,
            days: data.days
        });
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error('Error updating working days:', error.response);
            throw error;
        }
        throw error;
    }
};

export const deleteWorkingDays = async (id: number) => {
    try {
        const response = await Api.delete(`${superAdminEndpoints.workingDays}/${id}`);
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error('Error deleting working days:', error.response);
            throw error;
        }
        throw error;
    }
};

export const updateStaffRole = async (data: {
    staffID: number;
    specialPrivileges: string[];
    school_prefix: string;
}) => {
    try {
        const response = await Api.put(
            `${superAdminEndpoints.specialPrivilege}?school_prefix=${data.school_prefix}`,
            {
                staffID: data.staffID,
                specialPrivileges: data.specialPrivileges
            }
        );
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error('Error updating staff role:', error.response);
            throw error;
        }
        throw error;
    }
};

export const removeStaffRole = async (data: {
    staffID: number;
    specialPrivileges: string[];
    school_prefix: string;
}) => {
    try {
        const response = await Api.delete(
            `${superAdminEndpoints.specialPrivilege}/${data.staffID}/${data.specialPrivileges.join(',')}/?school_prefix=${data.school_prefix}`
        );
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error('Error removing staff role:', error.response);
            throw error;
        }
        throw error;
    }
};

// Add this function to fetch privileged staff list
export const getPrivilegedStaff = async (schoolPrefix: string) => {
    try {
        const response = await Api.get(`${superAdminEndpoints.specialPrivilege}?school_prefix=${schoolPrefix}`);
        if (response.data && response.data.resp_code === "SUCCESS") {
            // Check if data exists and is not null/undefined
            if (response.data.data && Array.isArray(response.data.data)) {
                return {
                    status: true,
                    data: response.data.data.map((staff: any) => ({
                        staffId: staff.staffId,
                        name: staff.name,
                        idCardNumber: staff.idCardNumber,
                        mobile: staff.mobile,
                        specialPrivileges: staff.specialPrivileges
                    }))
                };
            } else {
                // Return empty array if no data
                return {
                    status: true,
                    data: []
                };
            }
        }
        throw new Error('Failed to fetch privileged staff');
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error('Error fetching privileged staff:', error.response);
            throw error;
        }
        throw error;
    }
};


// Add these functions
export const createGradeCategory = async (name: string, schoolPrefix: string) => {
    try {
        const response = await Api.post(`${superAdminEndpoints.gradeCategory}?school_prefix=${schoolPrefix}`, { name });
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error('Error creating grade category:', error.response);
            throw error;
        }
        throw error;
    }
};

export const getGradeCategories = async () => {
    try {
        const response = await Api.get(superAdminEndpoints.gradeCategory);
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error('Error fetching grade categories:', error.response);
            throw error;
        }
        throw error;
    }
};

export const createGradeBoundary = async (boundaryData: {
    category_id: number;
    base_percentage: number;
    grade_label: string;
}, schoolPrefix: string) => {
    try {
        const response = await Api.post(`${superAdminEndpoints.gradeBoundary}?school_prefix=${schoolPrefix}`, boundaryData);
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error('Error creating grade boundary:', error.response);
            throw error;
        }
        throw error;
    }
};

export const getGradeBoundaries = async (categoryId: number) => {
    try {
        const response = await Api.get(`${superAdminEndpoints.gradeBoundary}?id=${categoryId}`);
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error('Error fetching grade boundaries:', error.response);
            throw error;
        }
        throw error;
    }
};

export const deleteGradeCategory = async (id: number, schoolPrefix: string) => {
    try {
        const response = await Api.delete(`${superAdminEndpoints.gradeCategory}?school_prefix=${schoolPrefix}&id=${id}`);
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error('Error deleting grade category:', error.response);
            throw error;
        }
        throw error;
    }
};

export const updateGradeCategory = async (id: number, name: string, schoolPrefix: string) => {
    try {
        const response = await Api.put(
            `${superAdminEndpoints.gradeCategory}?school_prefix=${schoolPrefix}&id=${id}`,
            {
                id,
                name
            }
        );
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error('Error updating grade category:', error.response);
            throw error;
        }
        throw error;
    }
};

export const deleteGradeBoundary = async (id: number) => {
    try {
        const response = await Api.delete(`${superAdminEndpoints.gradeBoundary}?id=${id}`);
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error('Error deleting grade boundary:', error.response);
            throw error;
        }
        throw error;
    }
};

export const updateGradeBoundary = async (data: {
    id: number;
    category_id: number;
    base_percentage: number;
    grade_label: string;
    is_failed: boolean;
}) => {
    try {
        console.log("Data", data);
        const response = await Api.put(`${superAdminEndpoints.gradeBoundary}`, {
            id: data.id,
            category_id: data.category_id,
            base_percentage: data.base_percentage,
            grade_label: data.grade_label
        });
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error('Error updating grade boundary:', error.response);
            throw error;
        }
        throw error;
    }
};

export const deleteStudent = async (studentId: number, schoolPrefix: string) => {
    try {
        const response = await Api.delete(
            `${superAdminEndpoints.student}/${studentId}?school_prefix=${schoolPrefix}`
        );
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error('Error deleting student:', error.response);
            throw error;
        }
        console.error('Unexpected error:', error);
        throw error;
    }
};

export const updateStudent = async (studentId: number, studentData: FormData, schoolPrefix: string) => {
    try {
        const response = await Api.patch(
            `${superAdminEndpoints.student}/${studentId}?school_prefix=${schoolPrefix}`,
            studentData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }
        );
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error('Error updating student:', error.response);
            throw error;
        }
        console.error('Unexpected error:', error);
        throw error;
    }
};

export const deleteParent = async (parentId: number, schoolPrefix: string) => {
    try {
        const response = await Api.delete(`${superAdminEndpoints.parent}/${parentId}?school_prefix=${schoolPrefix}`);
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error('Error deleting parent:', error.response);
            throw error;
        }
        throw error;
    }
};

export const updateParent = async (parentId: number, data: any, schoolPrefix: string) => {
    try {
        const response = await Api.patch(
            `${superAdminEndpoints.parent}/${parentId}?school_prefix=${schoolPrefix}`,
            data
        );
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error('Error updating parent:', error.response);
            throw error;
        }
        throw error;
    }
};

export const fetchCastesByReligion = async (religionId: string | number, schoolPrefix: string) => {
    try {
        if (!religionId) {
            return { status: true, data: [] };
        }
        const response = await Api.get(`/school/caste?religionId=${religionId}&school_prefix=${schoolPrefix}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching castes:', error);
        return { status: false, data: [] };
    }
};

// Add this function to fetch specific staff details
export const getStaffById = async (staffId: number, schoolPrefix: string) => {
    try {
        const response = await Api.get(`${superAdminEndpoints.staff}/${staffId}?school_prefix=${schoolPrefix}`);
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error('Error fetching staff details:', error.response);
            throw error;
        }
        throw error;
    }
};

// Add this function to get academic years
export const getAcademicYears = async (schoolPrefix: string) => {
    try {
        const response = await Api.get(`${superAdminEndpoints.academicYear}?school_prefix=${schoolPrefix}`);
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error('Error fetching academic years:', error.response);
            throw error;
        }
        throw error;
    }
};

// Add these functions for academic year operations
export const createAcademicYear = async (data: { name: string, isCurrent: boolean }, schoolPrefix: string) => {
    try {
        const response = await Api.post(`${superAdminEndpoints.academicYear}?school_prefix=${schoolPrefix}`, data);
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error('Error creating academic year:', error.response);
            throw error;
        }
        throw error;
    }
};

export const updateAcademicYear = async (id: number, data: { name: string, isCurrent: boolean }, schoolPrefix: string) => {
    try {
        const response = await Api.put(`${superAdminEndpoints.academicYear}/${id}?school_prefix=${schoolPrefix}`, data);
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error('Error updating academic year:', error.response);
            throw error;
        }
        throw error;
    }
};

export const deleteAcademicYear = async (id: number, schoolPrefix: string) => {
    try {
        const response = await Api.delete(`${superAdminEndpoints.academicYear}/${id}?school_prefix=${schoolPrefix}`);
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error('Error deleting academic year:', error.response);
            throw error;
        }
        throw error;
    }
};

// Add this function to get teaching staff
export const getTeachingStaff = async (schoolPrefix: string) => {
    try {
        const response = await Api.get(`${superAdminEndpoints.staff}?isTeachingStaff=true&school_prefix=${schoolPrefix}`);
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error('Error fetching teaching staff:', error.response);
            throw error;
        }
        throw error;
    }
};

// Add this function to update a standard
export const updateStandard = async (data: {
    id: number,
    name: string,
    hasGroup: boolean,
    sectionId: number,
    sequenceNumber: number
}) => {
    try {
        const response = await Api.put(`${superAdminEndpoints.standards}`, data);
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error('Error updating standard:', error.response);
            throw error;
        }
        throw error;
    }
};

// Update these functions to use school endpoints
export const getSchoolMediums = async (schoolPrefix: string) => {
    try {
        const response = await Api.get(`${superAdminEndpoints.schoolMediums}?school_prefix=${schoolPrefix}`);
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error('Error fetching school mediums:', error.response);
            throw error;
        }
        throw error;
    }
};

export const getSchoolStandards = async (schoolPrefix: string) => {
    try {
        const response = await Api.get(`${superAdminEndpoints.schoolStandards}?school_prefix=${schoolPrefix}`);
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error('Error fetching school standards:', error.response);
            throw error;
        }
        throw error;
    }
};

// Add this new function to get school-specific syllabus
export const getSchoolSyllabus = async (schoolPrefix: string) => {
    try {
        const response = await Api.get(`${superAdminEndpoints.schoolSyllabus}?school_prefix=${schoolPrefix}`);
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error('Error fetching school syllabus:', error.response);
            throw error;
        }
        console.error('Unexpected error:', error);
        throw error;
    }
};

// Add this new function to get school-specific religions
export const getSchoolReligions = async (schoolPrefix: string) => {
    try {
        const response = await Api.get(`${superAdminEndpoints.schoolReligions}?school_prefix=${schoolPrefix}`);
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error('Error fetching school religions:', error.response);
            throw error;
        }
        console.error('Unexpected error:', error);
        throw error;
    }
};

// Add new school-specific functions
export const getSchoolSections = async (schoolPrefix: string) => {
    try {
        const response = await Api.get(`${superAdminEndpoints.schoolSections}?school_prefix=${schoolPrefix}`);
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error('Error fetching school sections:', error.response);
            throw error;
        }
        console.error('Unexpected error:', error);
        throw error;
    }
};

export const getSchoolSubjects = async (schoolPrefix: string) => {
    try {
        const response = await Api.get(`${superAdminEndpoints.schoolSubjects}?school_prefix=${schoolPrefix}`);
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error('Error fetching school subjects:', error.response);
            throw error;
        }
        console.error('Unexpected error:', error);
        throw error;
    }
};

// Add this function to fetch student details
export const getStudentById = async (studentId: number, schoolPrefix: string) => {
    try {
        const response = await Api.get(`${superAdminEndpoints.student}/${studentId}?school_prefix=${schoolPrefix}`);
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error('Error fetching student details:', error.response);
            throw error;
        }
        console.error('Unexpected error:', error);
        throw error;
    }
};

// Add this new function
export const getSchoolDetails = async (schoolPrefix: string) => {
    try {
        const response = await Api.get(`${superAdminEndpoints.school}?school_prefix=${schoolPrefix}`);
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error('Error fetching school details:', error.response);
            throw error;
        }
        throw error;
    }
};

// Add this function to update school details
export const updateSchoolDetails = async (schoolPrefix: string, formData: FormData) => {
    try {
        const response = await Api.patch(
            `${superAdminEndpoints.school}?school_prefix=${schoolPrefix}`,
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            }
        );
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error('Error updating school details:', error.response);
            throw error;
        }
        throw error;
    }
};

// Add this function to handle logo upload
export const updateSchoolLogo = async (schoolPrefix: string, logoFile: File) => {
    try {
        const formData = new FormData();
        formData.append('schoolLogo', logoFile);

        const response = await Api.put(
            `${superAdminEndpoints.schoolLogo}?school_prefix=${schoolPrefix}`,
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            }
        );
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error('Error updating school logo:', error.response);
            throw error;
        }
        throw error;
    }
};

// Add this function to handle logo deletion
export const deleteSchoolLogo = async (schoolPrefix: string) => {
    try {
        const response = await Api.delete(
            `${superAdminEndpoints.schoolLogo}?school_prefix=${schoolPrefix}`
        );
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error('Error deleting school logo:', error.response);
            throw error;
        }
        throw error;
    }
};

// Add this function to connect syllabus to school
export const connectSchoolSyllabus = async (schoolPrefix: string, syllabusID: number) => {
    try {
        const response = await Api.post(
            `${superAdminEndpoints.syllabusConnection}?school_prefix=${schoolPrefix}`,
            { syllabusID }
        );
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error('Error connecting syllabus:', error.response);
            throw error;
        }
        throw error;
    }
};

// Add this function to disconnect syllabus from school
export const disconnectSchoolSyllabus = async (schoolPrefix: string, syllabusID: number) => {
    try {
        const response = await Api.delete(
            `${superAdminEndpoints.syllabusConnection}/${syllabusID}?school_prefix=${schoolPrefix}`
        );
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error('Error disconnecting syllabus:', error.response);
            throw error;
        }
        throw error;
    }
};

// Add this function to update school student limits
export const updateSchoolLimits = async (schoolPrefix: string, studentLimit: number) => {
    try {
        const response = await Api.put(
            `${superAdminEndpoints.studentLimit}?school_prefix=${schoolPrefix}`,
            { studentLimit }
        );
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error('Error updating school limits:', error.response);
            throw error;
        }
        throw error;
    }
};

// Add these functions for block/allow operations
export const deactivateSchool = async (schoolPrefix: string) => {
    try {
        const response = await Api.patch(
            `${superAdminEndpoints.school}/deactivate?school_prefix=${schoolPrefix}`
        );
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error('Error deactivating school:', error.response);
            throw error;
        }
        throw error;
    }
};

export const activateSchool = async (schoolPrefix: string) => {
    try {
        const response = await Api.patch(
            `${superAdminEndpoints.school}/activate?school_prefix=${schoolPrefix}`
        );
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error('Error activating school:', error.response);
            throw error;
        }
        throw error;
    }
};

// Add this new function for permanent school deletion
export const DeleteSchool = async (schoolPrefix: string) => {
    try {
        const response = await Api.delete(`${superAdminEndpoints.school}?school_prefix=${schoolPrefix}`);
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error('Error permanently deleting school:', error.response);
            throw error;
        }
        throw error;
    }
};

export const undoDeleteSchool = async (schoolPrefix: string) => {
    try {
        const response = await Api.patch(`${superAdminEndpoints.school}/undo-delete?school_prefix=${schoolPrefix}`);
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error('Error reverting school deletion:', error.response);
            throw error;
        }
        throw error;
    }
};

export const getSubjectAllocation = async (schoolPrefix: string) => {
    try {
        const response = await Api.get<SubjectAllocationResponse>(
            `${superAdminEndpoints.subjectAllocation}?school_prefix=${schoolPrefix}`
        );
        console.log("Response", response);
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error('Error fetching subject allocation:', error.response);
            throw error;
        }
        console.error('Unexpected error:', error);
        throw error;
    }
};

interface RemoveSubjectAllocationParams {
    subjectId: number;
    standardId: number;
    syllabusId: number;
    groupId: number | null;
}

export const removeSubjectAllocation = async (
    schoolPrefix: string,
    params: RemoveSubjectAllocationParams
) => {
    try {
        const queryParams = new URLSearchParams({
            school_prefix: schoolPrefix,
            subjectId: params.subjectId.toString(),
            standardId: params.standardId.toString(),
            syllabusId: params.syllabusId.toString(),
            ...(params.groupId && { groupId: params.groupId.toString() })
        });

        const response = await Api.delete(
            `${superAdminEndpoints.subjectAllocation}?${queryParams.toString()}`
        );
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error('Error removing subject allocation:', error.response);
            throw error;
        }
        console.error('Unexpected error:', error);
        throw error;
    }
};

export const getSchoolGroups = async (schoolPrefix: string) => {
    try {
        const response = await Api.get(`${superAdminEndpoints.schoolGroups}?school_prefix=${schoolPrefix}`);
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error('Error fetching school groups:', error.response);
            throw error;
        }
        throw error;
    }
};

export const saveSubjectAllocations = async (schoolPrefix: string, data: any) => {
    try {
        const response = await Api.post(
            `${superAdminEndpoints.subjectAllocation}/multiple?school_prefix=${schoolPrefix}`,
            data
        );
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error('Error saving subject allocations:', error.response);
            throw error;
        }
        throw error;
    }
};



export const updateSubjectAllocation = async (schoolPrefix: string, data: SubjectAllocationRequest) => {
    try {
        const response = await Api.put(
            `${superAdminEndpoints.subjectAllocation}/multiple?school_prefix=${schoolPrefix}`,
            data
        );
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error('Error updating subject allocation:', error.response);
            throw error;
        }
        console.error('Unexpected error:', error);
        throw error;
    }
};


export const getPrivileges = async (schoolPrefix: string) => {
    try {
        const response = await Api.get(`${superAdminEndpoints.specialPrivilege}/privileges?school_prefix=${schoolPrefix}`);
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error('Error fetching privileges:', error.response);
            throw error;
        }
        throw error;
    }
};





