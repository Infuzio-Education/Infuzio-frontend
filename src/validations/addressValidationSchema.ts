import * as Yup from 'yup';

const PATTERNS = {
    PINCODE: /^\d{6}$/, // 6 digits
};

export const addressValidationSchema = Yup.object().shape({
    house: Yup.string()
        .transform((value) => value === '' ? undefined : value)
        .optional(),

    street1: Yup.string()
        .required('Street address is required')
        .trim(),

    street2: Yup.string()
        .transform((value) => value === '' ? undefined : value)
        .optional()
        .trim(),

    city: Yup.string()
        .required('City is required')
        .trim(),

    state: Yup.string()
        .required('State is required')
        .trim(),

    pincode: Yup.string()
        .required('Pincode is required')
        .matches(PATTERNS.PINCODE, 'Invalid pincode format')
        .trim(),

    country: Yup.string()
        .required('Country is required')
        .trim()
}); 