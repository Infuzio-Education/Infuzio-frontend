import * as Yup from 'yup';

export const LoginValidationSchema = Yup.object({
  username: Yup.string()
    .trim()
    .matches(/^\S+$/, 'Student ID is required')
    .required('Student ID is required'),
  password: Yup.string()
    .min(6, 'Must be at least 6 characters')
    .required('Password is required'),
});