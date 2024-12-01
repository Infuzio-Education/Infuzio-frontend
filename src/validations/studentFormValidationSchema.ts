import * as Yup from 'yup';
import { addressValidationSchema } from './addressValidationSchema';

// Validation patterns
const PATTERNS = {
    ALPHA_SPACE_DOT: /^[A-Za-z\s.]+$/,
    E164: /^\+[1-9]\d{1,14}$/, // E.164 phone format
    DATE: /^\d{2}-\d{2}-\d{4}$/, // DD-MM-YYYY
    ALPHA: /^[A-Za-z]+$/ // Letters only
};

// Constants
const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
const GENDERS = ['male', 'female', 'other'];

export const studentValidationSchema = Yup.object().shape({
    name: Yup.string()
        .required('Name is required')
        .min(3, 'Name must be at least 3 characters')
        .max(50, 'Name must not exceed 50 characters')
        .matches(PATTERNS.ALPHA_SPACE_DOT, 'Name can only contain letters, spaces, and dots'),

    idCardNumber: Yup.string()
        .nullable(),

    admissionNumber: Yup.string()
        .nullable(),

    dateOfAdmission: Yup.string()
        .required('Date of admission is required'),

    gender: Yup.string()
        .required('Gender is required')
        .oneOf(GENDERS, 'Invalid gender selection'),

    dob: Yup.string()
        .required('Date of birth is required')
        .matches(PATTERNS.DATE, 'Date of birth must be in DD-MM-YYYY format'),

    phone: Yup.string()
        .required('Phone number is required')
        .matches(PATTERNS.E164, 'Phone must be in international format (e.g., +919876543210)'),

    email: Yup.string()
        .required('Email is required')
        .email('Invalid email format'),

    parentsInfo: Yup.array().of(
        Yup.object().shape({
            parentId: Yup.number(),
            relationshipWithStudent: Yup.string()
        })
    ).default([]),

    // Include address validation
    ...addressValidationSchema.fields,

    // Optional fields
    bloodGroup: Yup.string()
        .nullable()
        .oneOf([...BLOOD_GROUPS, null], 'Invalid blood group'),

    remarks: Yup.string()
        .optional()
        .max(300, 'Remarks must not exceed 300 characters'),

    religion: Yup.string()
        .optional(),

    caste: Yup.string()
        .optional(),

    reservationCategory: Yup.string()
        .optional(),

    isPWD: Yup.boolean()
        .default(false),

    nationality: Yup.string()
        .optional()
        .matches(PATTERNS.ALPHA, 'Nationality can only contain letters'),

    classID: Yup.number()
        .required('Class is required')
        .positive('Invalid class ID')
});

// Type for backend validation errors
// export interface BackendValidationError {
//     field: string;
//     tag: string;
//     value: string;
// }

// Simple error formatter that matches Go validation tags
// export const formatBackendErrors = (errors: BackendValidationError[]): string => {
//     return errors.map(err => `${err.field}: ${err.tag}`).join('; ');
// }; 