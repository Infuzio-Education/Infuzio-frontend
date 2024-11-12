import * as Yup from 'yup';

// Custom error messages
const VALIDATION_MESSAGES = {
    SCHOOL_CODE: {
        LETTERS_ONLY: 'School code must contain only letters',
        MIN_LENGTH: 'School code must be at least 2 characters',
        MAX_LENGTH: 'School code must not exceed 6 characters',
        REQUIRED: 'School code is required'
    },
    PHONE: {
        FORMAT: 'Phone number must be in international format (e.g., +91XXXXXXXX)',
        REQUIRED: 'Phone number is required'
    },
    FILE: {
        SIZE: 'File too large (Max 5MB)',
        FORMAT: 'Unsupported Format. Only JPG, JPEG, GIF, and PNG are allowed'
    }
};

// Validation patterns
const PATTERNS = {
    PHONE: /^\+[1-9]\d{6,14}$/,
    SCHOOL_CODE: /^[a-zA-Z]+$/,
    PINCODE: /^[1-9][0-9]{5}$/
};

// Allowed file types
const ALLOWED_FILE_TYPES = ['image/jpg', 'image/jpeg', 'image/gif', 'image/png'];
const MAX_FILE_SIZE = 5000000; // 5MB in bytes

export const validationSchema = Yup.object({
    name: Yup.string()
        .min(3, 'School name must be at least 3 characters')
        .required('School name is required')
        .trim(),

    schoolCode: Yup.string()
        .matches(PATTERNS.SCHOOL_CODE, VALIDATION_MESSAGES.SCHOOL_CODE.LETTERS_ONLY)
        .min(2, VALIDATION_MESSAGES.SCHOOL_CODE.MIN_LENGTH)
        .max(6, VALIDATION_MESSAGES.SCHOOL_CODE.MAX_LENGTH)
        .required(VALIDATION_MESSAGES.SCHOOL_CODE.REQUIRED)
        .trim(),

    syllabusIDs: Yup.array()
        .of(Yup.number().required('Invalid syllabus ID'))
        .min(1, 'At least one syllabus must be selected')
        .required('Syllabus selection is required'),

    address: Yup.object({
        street1: Yup.string()
            .required('Street 1 is required')
            .trim(),
        street2: Yup.string()
            .notRequired()
            .trim(),
        city: Yup.string()
            .required('City is required')
            .trim(),
        state: Yup.string()
            .required('State is required')
            .trim(),
        pincode: Yup.string()
            .matches(PATTERNS.PINCODE, 'Invalid pincode')
            .required('Pincode is required')
            .trim(),
        country: Yup.string()
            .required('Country is required')
            .trim(),
    }),

    googleMapsLink: Yup.string()
        .url('Must be a valid URL')
        .notRequired()
        .trim(),

    phone: Yup.string()
        .matches(PATTERNS.PHONE, VALIDATION_MESSAGES.PHONE.FORMAT)
        .required(VALIDATION_MESSAGES.PHONE.REQUIRED)
        .trim(),

    email: Yup.string()
        .email('Invalid email address')
        .required('Email is required')
        .trim(),

    schoolLogo: Yup.mixed()
        .test('fileSize', VALIDATION_MESSAGES.FILE.SIZE, (value) => {
            if (!value) return true;
            return value instanceof File && value.size <= MAX_FILE_SIZE;
        })
        .test('fileFormat', VALIDATION_MESSAGES.FILE.FORMAT, (value) => {
            if (!value) return true;
            return value instanceof File && ALLOWED_FILE_TYPES.includes(value.type);
        })
        .test('backendValidation', 'Backend validation failed', function () {
            // This test can be used to handle backend-specific validation errors
            return true;
        })
        .notRequired(),
});

// Type for backend validation errors
export interface BackendValidationError {
    field: string;
    tag: string;
    value: string;
}

// Helper function to format backend validation errors
export const formatBackendErrors = (errors: BackendValidationError[]): string => {
    return errors.map((err) => {
        switch (err.field) {
            case 'SchoolCode':
                return VALIDATION_MESSAGES.SCHOOL_CODE.LETTERS_ONLY;
            case 'Phone':
                return VALIDATION_MESSAGES.PHONE.FORMAT;
            default:
                return `${err.field}: ${err.tag}`;
        }
    }).join('; ');
};
