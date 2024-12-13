import * as Yup from 'yup';

export const LoginValidationSchema = Yup.object({
  username: Yup.string()
    .trim()
    .matches(/^\S+$/, 'Username cannot contain whitespace')
    .required('Username is required'),
  password: Yup.string()
    .min(6, 'Must be at least 6 characters')
    .required('Password is required'),
});