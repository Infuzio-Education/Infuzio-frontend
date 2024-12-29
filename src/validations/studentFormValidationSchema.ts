import * as Yup from 'yup';
import { addressValidationSchema } from './addressValidationSchema';

// Validation patterns
const PATTERNS = {
    ALPHA_SPACE_DOT: /^[A-Za-z\s.]+$/,
    E164: /^\+[1-9]\d{1,14}$/, // E.164 phone format
    DATE_DD_MM_YYYY: /^\d{2}-\d{2}-\d{4}$/,
    ALPHA: /^[A-Za-z]+$/ // Letters only
};

// Constants
const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

export const studentValidationSchema = Yup.object().shape({
    name: Yup.string()
        .required('Name is required')
        .min(2, 'Name must be at least 2 characters')
        .max(50, 'Name must not exceed 50 characters'),

    idCardNumber: Yup.string()
        .nullable(),

    admissionNumber: Yup.string()
        .nullable(),

    dateOfAdmission: Yup.string()
        .required('Date of Admission is required')
        .test('is-date', 'Invalid date format', (value) => {
            if (!value) return false;
            const date = new Date(value);
            return date instanceof Date && !isNaN(date.getTime());
        }),

    gender: Yup.string()
        .required('Gender is required'),

    dob: Yup.string()
        .required('Date of Birth is required')
        .test('is-date', 'Invalid date format', (value) => {
            if (!value) return false;
            const date = new Date(value);
            return date instanceof Date && !isNaN(date.getTime());
        }),

    phone: Yup.string()
        .required('Phone number is required')
        .matches(/^[+]?[0-9]{10,15}$/, 'Invalid phone number format'),

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

