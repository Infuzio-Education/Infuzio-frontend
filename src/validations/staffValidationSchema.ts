import * as Yup from 'yup';
import { addressValidationSchema } from './addressValidationSchema';

const PATTERNS = {
    E164: /^\+?[1-9]\d{1,14}$/,
    ALPHA_SPACE_DOT: /^[a-zA-Z\s.]+$/,
    DATE_DD_MM_YYYY: /^\d{2}-\d{2}-\d{4}$/,
};

export const staffValidationSchema = Yup.object().shape({
    id_card_number: Yup.string().nullable(),
    regNumber: Yup.number()
        .required('Registration Number is required')
        .positive('Registration Number must be positive'),
    name: Yup.string()
        .required('Name is required')
        .matches(PATTERNS.ALPHA_SPACE_DOT, 'Name can only contain alphabets, spaces, and dots'),
    gender: Yup.string()
        .required('Gender is required')
        .oneOf(['male', 'female', 'other'], 'Invalid gender'),
    dob: Yup.string()
        .required('Date of Birth is required')
        .matches(PATTERNS.DATE_DD_MM_YYYY, 'Date of Birth must be in DD-MM-YYYY format'),
    email: Yup.string()
        .required('Email is required')
        .email('Invalid email format'),
    mobile: Yup.string()
        .required('Mobile number is required')
        .matches(PATTERNS.E164, 'Invalid mobile number format'),
    blood_group: Yup.string()
        .oneOf(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'], 'Invalid blood group')
        .nullable(),
    remarks: Yup.string()
        .max(500, 'Remarks cannot exceed 500 characters')
        .nullable(),
    religion: Yup.string()
        .matches(/^[a-zA-Z]*$/, 'Religion can only contain alphabets')
        .nullable(),
    caste: Yup.string()
        .matches(/^[a-zA-Z]*$/, 'Caste can only contain alphabets')
        .nullable(),
    pwd: Yup.boolean(),
    is_teaching_staff: Yup.boolean(),
    subject_ids: Yup.array().of(Yup.number().integer('Subject ID must be a number')),
    section_ids: Yup.array().of(Yup.number().integer('Section ID must be a number')),
    // Use the address validation schema
    ...addressValidationSchema.fields,
}); 