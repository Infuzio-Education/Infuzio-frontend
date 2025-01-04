import * as Yup from 'yup';

const PATTERNS = {
    PHONE: /^\+[1-9]\d{6,14}$/,
    PINCODE: /^\d{6}$/, // 6 digits
};

export const schoolUpdationFormValidationSchema = Yup.object({
    name: Yup.string()
        .min(3, 'School name must be at least 3 characters')
        .required('School name is required')
        .trim(),

    address: Yup.object({
        street1: Yup.string()
            .required('Address line 1 is required')
            .trim(),

        street2: Yup.string()
            .optional()
            .trim(),

        city: Yup.string()
            .required('City is required')
            .trim(),

        state: Yup.string()
            .required('State is required')
            .trim(),

        pincode: Yup.string()
            .matches(PATTERNS.PINCODE, 'Invalid PIN code format')
            .required('PIN code is required')
            .trim(),

        country: Yup.string()
            .required('Country is required')
            .trim(),
    }),

    googleMapsLink: Yup.string()
        .url('Must be a valid URL')
        .optional()
        .trim(),

    phone: Yup.string()
        .matches(PATTERNS.PHONE, 'Phone number must be in international format (e.g., +91XXXXXXXX)')
        .required('Phone number is required')
        .trim(),

    email: Yup.string()
        .email('Invalid email address')
        .required('Email is required')
        .trim(),
}); 