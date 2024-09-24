import * as Yup from 'yup';

export const validationSchema = Yup.object({
    schoolName: Yup.string()
        .min(2, 'School name must be at least 2 characters')
        .required('School name is required'),
    syllabus: Yup.string()
        .required('Syllabus is required'),
    addressLine1: Yup.string()
        .required('Address line 1 is required'),
    city: Yup.string()
        .required('City is required'),
    state: Yup.string()
        .required('State is required'),
    country: Yup.string()
        .required('Country is required'),
    pinCode: Yup.string()
        .matches(/^[0-9]{6}$/, 'Pin code must be exactly 6 digits')
        .required('Pin code is required'),
    mobile: Yup.string()
        .matches(/^[0-9]{10}$/, 'Mobile number must be exactly 10 digits')
        .required('Mobile number is required'),
    email: Yup.string()
        .email('Invalid email address')
        .matches(
            /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
            'Invalid email format'
        )
        .required('Email is required'),
});