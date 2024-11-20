import Api from './axiosConfig';
import superAdminEndpoints from '../endpoints/superAdmin';
import axios from 'axios';
import { CreateStaffPayload } from '../types/Types';
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

export const getSchools = async () => {
    try {
        const response = await Api.get(superAdminEndpoints.listSchool);
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

export const createSchool = async (body: FormData) => {
    try {
        console.log('FormData Contents:');
        for (let pair of body.entries()) {
            console.log(pair[0], pair[1]);
        }

        const response = await Api.post(superAdminEndpoints.createSchool, body, {
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
        const formData = new FormData();
        console.log('hey');

        Object.entries(values).forEach(([key, value]) => {
            if (key === 'subjects' && Array.isArray(value)) {
                formData.append(key, JSON.stringify(value));
            } else if (key === 'profile_pic' && value instanceof File) {
                formData.append(key, value);
            } else {
                formData.append(key, String(value));
            }
        });

        const response = await Api.post(
            `${superAdminEndpoints.createStaff}?school_prefix=${schoolPrefix}`,
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
        const response = await Api.get(`${superAdminEndpoints.listStaff}?school_prefix=${schoolPrefix}`);
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

        const response = await Api.put(
            `${superAdminEndpoints.updateStaff}/${staffId}?school_prefix=${schoolPrefix}`,
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
        const response = await Api.delete(
            `${superAdminEndpoints.deleteStaff}/${staffId}?school_prefix=${schoolPrefix}`
        );
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error('Error deleting staff:', error.response);
            throw error;
        }
        console.error('Unexpected error:', error);
        throw error;
    }
};

export const updateGroup = async (id: number, name: string) => {
    try {
        // console.log(id,name);

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
        const response = await Api.post(`${superAdminEndpoints.classes}?school_prefix=${schoolPrefix}`, classData);
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error('Error creating class:', error.response);
            throw error;
        }
        console.error('Unexpected error:', error);
        throw error;
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

export const deleteStandard = async (id: number) => {
    try {
        const response = await Api.delete(`global/standard/${id}`);
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
        const response = await Api.delete(`${superAdminEndpoints.listSchool}/${id}`);
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
        const response = await Api.post(`${superAdminEndpoints.createParent}?school_prefix=${schoolPrefix}`, parentData);
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
        const response = await Api.get(`${superAdminEndpoints.listParent}?school_prefix=${schoolPrefix}`);
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error('Error listing parents:', error.response);
            throw error;
        }
        throw error;
    }
};

export const createStudent = async (studentData: any, schoolPrefix: string) => {
    try {
        const response = await Api.post(`${superAdminEndpoints.createStudent}?school_prefix=${schoolPrefix}`, studentData);
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
        const response = await Api.get(`${superAdminEndpoints.listStudent}?school_prefix=${schoolPrefix}`);
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error('Error listing students:', error.response);
            throw error;
        }
        throw error;
    }
};

export const createSubject = async (name: string) => {
    try {
        const response = await Api.post(superAdminEndpoints.subjects, { name });
        if (response.data) {
            return response.data;
        }
        throw new Error('No response data');
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error('Error creating subject:', error.response);
            throw error;
        } else {
            console.error('Unexpected error:', error);
            throw error;
        }
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

export const updateSubject = async (id: number, name: string) => {
    try {
        const response = await Api.put(superAdminEndpoints.subjects, {
            id,
            name
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


