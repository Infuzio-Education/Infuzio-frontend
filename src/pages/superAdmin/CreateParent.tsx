import React from 'react';
import { TextField, Button } from '@mui/material';
import { Formik, Form, Field } from 'formik';
import { createParent, updateParent } from '../../api/superAdmin';
import { useSchoolContext } from '../../contexts/SchoolContext';
import * as Yup from 'yup';
import { Parent } from '../../types/Types';

interface CreateParentProps {
    initialData: Parent | null;
    onSave: (values: Parent) => void;
    onCancel: () => void;
}

const validationSchema = Yup.object().shape({
    name: Yup.string()
        .required('Name is required')
        .matches(
            /^[a-zA-Z\s.]+$/,
            'Name can only contain alphabets, spaces, and dots'
        )
        .min(2, 'Name must be at least 2 characters')
        .max(50, 'Name must not exceed 50 characters'),
    phone: Yup.string()
        .required('Phone number is required')
        .matches(
            /^\+[1-9]\d{9,14}$/,
            'Invalid phone number. Must be in E.164 format (e.g., +919876543210)'
        ),
    email: Yup.string()
        .required('Email is required')
        .email('Invalid email format')
        .matches(
            /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
            'Invalid email format'
        )
        .transform(value => value.toLowerCase())
});

const CreateParent: React.FC<CreateParentProps> = ({ initialData, onSave, onCancel }) => {
    const { schoolInfo } = useSchoolContext();

    const handleSubmit = async (values: Parent, { setSubmitting, setFieldError }: any) => {
        try {
            if (!schoolInfo.schoolPrefix) {
                throw new Error("School prefix not found");
            }

            let response;
            if (initialData?.id) {
                response = await updateParent(
                    initialData.id,
                    values,
                    schoolInfo.schoolPrefix
                );
            } else {
                response = await createParent(
                    values,
                    schoolInfo.schoolPrefix
                );
            }

            if (response.status === false) {
                // Handle specific error cases
                if (response.resp_code === "EMAIL_ALREADY_EXIST") {
                    setFieldError('email', 'Email already exists');
                    return;
                }
                if (response.resp_code === "PHONE_ALREADY_EXIST") {
                    setFieldError('phone', 'Phone number already exists');
                    return;
                }

                throw new Error(response.message || 'Failed to create parent');
            }

            onSave(values);
        } catch (error: any) {
            // Handle axios error structure
            if (error.response?.data) {
                const { resp_code } = error.response.data;
                switch (resp_code) {
                    case "EMAIL_ALREADY_EXIST":
                        setFieldError('email', 'Email already exists');
                        break;
                    case "PHONE_ALREADY_EXIST":
                        setFieldError('phone', 'Phone number already exists');
                        break;
                    default:
                        throw error;
                }
            } else {
                throw error;
            }
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="p-4">
            <h2 className="text-xl font-bold mb-4">
                {initialData ? 'Edit Parent' : 'Create Parent'}
            </h2>
            <Formik
                initialValues={initialData || {
                    name: '',
                    phone: '',
                    email: ''
                }}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
            >
                {({ errors, touched, isSubmitting, handleChange, values }) => (
                    <Form className="space-y-4">
                        <Field
                            as={TextField}
                            name="name"
                            label="Name"
                            fullWidth

                            error={touched.name && !!errors.name}
                            helperText={touched.name && errors.name}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                const value = e.target.value;
                                if (/^[a-zA-Z\s.]*$/.test(value)) {
                                    handleChange(e);
                                }
                            }}
                        />
                        <Field
                            as={TextField}
                            name="phone"
                            label="Phone"
                            fullWidth

                            error={touched.phone && !!errors.phone}
                            helperText={(touched.phone && errors.phone) || 'Format: +919876543210'}

                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                const value = e.target.value;
                                if (
                                    value === '' ||
                                    (value === '+' && !values.phone) ||
                                    (/^\+?[0-9]*$/.test(value) && value.length <= 15)
                                ) {
                                    handleChange(e);
                                }
                            }}
                        />
                        <Field
                            as={TextField}
                            name="email"
                            label="Email"
                            type="email"
                            fullWidth
                            required
                            error={touched.email && !!errors.email}
                            helperText={touched.email && errors.email}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                handleChange(e);
                            }}
                        />
                        <div className="flex justify-end space-x-2">
                            <Button
                                onClick={onCancel}
                                variant="outlined"
                                color="error"
                                disabled={isSubmitting}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                variant="contained"
                                color="success"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? 'Saving...' : (initialData ? 'Update Parent' : 'Create Parent')}
                            </Button>
                        </div>
                    </Form>
                )}
            </Formik>
        </div>
    );
};

export default CreateParent;
