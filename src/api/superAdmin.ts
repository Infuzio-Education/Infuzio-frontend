import Api from './axiosConfig';
import superAdminEndpoints from '../endpoints/superAdmin';
import axios from 'axios';


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
            return response.data.data;
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


export const createStandard = async (name: string, hasGroup: boolean, sequence: number) => {
    try {
        const response = await Api.post(superAdminEndpoints.stadards, { name, hasGroup, sequence });
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


