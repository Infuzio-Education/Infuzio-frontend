import { useEffect, useState } from 'react';
import { Snackbar, Alert, AlertColor } from '@mui/material';
import { ArrowRight } from 'lucide-react';
import { useFormik } from "formik";
import { useDispatch, useSelector } from 'react-redux';
import { setSuperAdminInfo } from '../../redux/slices/superAdminSlice/superAdminSlice';
import { LoginValidationSchema } from '../../validations/LoginValidationSchema';
import { useNavigate } from 'react-router-dom';
import { superLogin } from '../../api/superAdmin';

const SuperAdminLogin = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { superAdminInfo } = useSelector((state: any) => state.superAdminInfo);
  useEffect(() => {
    if (superAdminInfo) {
      navigate("/superAdmin/schools");
    }
  }, []);

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  const handleSnackbarClose = () => {
    setOpenSnackbar(false);
  };

  const { handleSubmit, handleChange, handleBlur, values, errors, touched } =
    useFormik({
      initialValues: {
        username: "superadmin",
        password: "adminpwsuper",
      },
      validationSchema: LoginValidationSchema,
      onSubmit: async (values) => {
        try {
          const response = await superLogin(values);

          if (response?.status === 200) {
            dispatch(setSuperAdminInfo({
              username: values.username,
              token: response.data.data.token
            }));

            setSnackbarMessage('Login successful!');
            setSnackbarSeverity('success');
            setOpenSnackbar(true);

            setTimeout(() => {
              navigate('/superAdmin/schools');
            }, 1000);

          } else if (response?.status === 401) {
            throw new Error("Invalid username or password!");
          } else {
            throw new Error("Unknown Error, Please Try again Later!");
          }
        } catch (error) {
          if (error instanceof Error) {
            console.error(error.message);
            setSnackbarMessage(error.message || 'Login failed!');
            setSnackbarSeverity('error');
            setOpenSnackbar(true);
          }
        }
      },
    });

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md relative">
        <div className="absolute inset-0 bg-[#A6CEAC] transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
        <div className="relative bg-white shadow-lg rounded-3xl p-10">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                USERNAME*
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <input
                  type="text"
                  id="username"
                  name="username"
                  className={`block w-full pr-10 sm:text-sm rounded-md focus:ring-green-500 focus:border-green-500 h-14 px-4 ${errors.username && touched.username ? 'border-red-500' : 'border-gray-300'
                    }`}
                  value={values.username}
                  placeholder='Enter your username'
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                {errors.username && touched.username && (
                  <div className="text-red-500 text-sm mt-1">{errors.username}</div>
                )}
              </div>
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                PASSWORD*
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <input
                  type="password"
                  id="password"
                  name="password"
                  className={`block w-full pr-10 sm:text-sm rounded-md focus:ring-green-500 focus:border-green-500 h-14 px-4 ${errors.password && touched.password ? 'border-red-500' : 'border-gray-300'
                    }`}
                  value={values.password}
                  placeholder='Enter your password'
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                {errors.password && touched.password && (
                  <div className="text-red-500 text-sm mt-1">{errors.password}</div>
                )}
              </div>
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                className="inline-flex items-center p-3 border border-transparent rounded-full shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                <ArrowRight className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Snackbar for success/failure messages */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity as AlertColor} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default SuperAdminLogin;
