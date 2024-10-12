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
        const response = await Api.post(superAdminEndpoints.createSyllabus, { name: name });
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

