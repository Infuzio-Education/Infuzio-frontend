import * as Yup from 'yup';

const phoneRegExp = /^\+[1-9]\d{1,14}$/;  // E.164 format for phone numbers

export const validationSchema = Yup.object({
    name: Yup.string()
        .min(3, 'School name must be at least 3 characters')
        .required('School name is required'),
    schoolCode: Yup.string()
        .min(2, 'School code must be at least 2 characters')
        .max(6, 'School code must not exceed 6 characters')
        .required('School code is required'),
    syllabusIDs: Yup.array()
        .of(Yup.number().required('Invalid syllabus ID'))
        .min(1, 'At least one syllabus must be selected')
        .required('Syllabus selection is required'),
    address: Yup.object({
        street1: Yup.string()
            .required('Street 1 is required'),
        street2: Yup.string()
            .notRequired(),
        city: Yup.string()
            .required('City is required'),
        state: Yup.string()
            .required('State is required'),
        pincode: Yup.string()
            .matches(/^[1-9][0-9]{5}$/, 'Invalid pincode')
            .required('Pincode is required'),
        country: Yup.string()
            .required('Country is required'),
    }),
    googleMapsLink: Yup.string()
        .url('Must be a valid URL')
        .notRequired(),
    phone: Yup.string()
        .matches(phoneRegExp, 'Phone number must be in E.164 format (e.g. +1234567890)')
        .required('Phone number is required'),
    email: Yup.string()
        .email('Invalid email address')
        .required('Email is required'),
    schoolLogo: Yup.mixed()
        .test('fileSize', 'File too large (Max 5MB)', (value) => {
            if (!value) return true;
            return value instanceof File && value.size <= 5000000; // 5MB limit
        })
        .test('fileFormat', 'Unsupported Format', function (value) {
            if (!value) return true;
            const fileType = (value as File)?.type;
            return ['image/jpg', 'image/jpeg', 'image/gif', 'image/png'].includes(fileType);
        })
        .notRequired(),
});