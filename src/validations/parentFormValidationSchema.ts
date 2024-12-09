import * as Yup from 'yup';

export const parentValidationSchema = Yup.object().shape({
    name: Yup.string()
        .required('Name is required')
        .min(3, 'Name must be at least 3 characters')
        .max(50, 'Name must not exceed 50 characters'),
    phone: Yup.string()
        .required('Phone number is required')
        .matches(/^\+[1-9]\d{1,14}$/, 'Phone must be in international format (e.g., +919876543210)'),
}); 