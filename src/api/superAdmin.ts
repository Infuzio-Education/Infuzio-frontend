import Api from './axiosConfig';
import superAdminEndpoints from '../endpoints/superAdmin';
import axios from 'axios';
import { CreateStaffPayload } from '../types/Types';


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

export const getSyllabus = async () => {
    try {
        const response = await Api.get(superAdminEndpoints.syllabus);
        if (response.data && response.data.status === true) {
            console.log('response', response.data);
            return response.data;
        } else {
            throw new Error('Unexpected response format');
        }
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
        console.log('FormData Structure:', JSON.stringify(body, null, 2));
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


export const createStandard = async (values:{name: string, hasGroup: boolean,sectionId:number, sequenceNumber: number}) => {
    try {
        const response = await Api.post(superAdminEndpoints.stadards, values);
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
        const response = await Api.get(superAdminEndpoints.stadards);
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
        return response.data; // Ensure this returns the correct data type
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
        return response.data; // Ensure this returns the correct data type
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
        return response.data; // Ensure this returns the correct data type
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
