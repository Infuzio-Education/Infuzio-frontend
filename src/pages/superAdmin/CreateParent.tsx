import React from 'react';
import { TextField, Button } from '@mui/material';
import { Formik, Form, Field } from 'formik';
import { createParent } from '../../api/superAdmin';
import { useSchoolContext } from '../../contexts/SchoolContext';
import { parentValidationSchema } from '../../validations/parentFormValidationSchema';
import { Parent } from '../../types/Types';

interface CreateParentProps {
    initialData: Parent | null;
    onSave: (values: Parent) => void;
    onCancel: () => void;
}

const CreateParent: React.FC<CreateParentProps> = ({ initialData, onSave, onCancel }) => {
    const { schoolInfo } = useSchoolContext();

    const handleSubmit = async (values: Parent, { setSubmitting, setFieldError }: any) => {
        try {
            if (!schoolInfo.schoolPrefix) {
                throw new Error("School prefix not found");
            }
            const response = await createParent(values, schoolInfo.schoolPrefix);

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
                validationSchema={parentValidationSchema}
                onSubmit={handleSubmit}
            >
                {({ errors, touched, isSubmitting }) => (
                    <Form className="space-y-4">
                        <Field
                            as={TextField}
                            name="name"
                            label="Name"
                            fullWidth
                            required
                            error={touched.name && !!errors.name}
                            helperText={touched.name && errors.name}
                        />
                        <Field
                            as={TextField}
                            name="phone"
                            label="Phone"
                            fullWidth
                            required
                            error={touched.phone && !!errors.phone}
                            helperText={touched.phone && errors.phone}
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
