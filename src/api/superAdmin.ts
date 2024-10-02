import Api from './axiosConfig';
import superAdminEndpoints from '../endpoints/superAdmin';
import axios from 'axios';


export const superLogin = async (body: string) => {
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

