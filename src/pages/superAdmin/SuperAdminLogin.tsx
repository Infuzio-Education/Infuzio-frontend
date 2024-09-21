import { ArrowRight } from 'lucide-react';
import { useFormik } from "formik";
import { useDispatch } from 'react-redux';
import { setSuperAdminInfo } from '../../redux/slices/superAdminSlice/superAdminSlice';
import { LoginValidationSchema } from '../../validations/LoginValidationSchema';


const SuperAdminLogin = () => {

   let dummyData = {
    id:'1212121',
    name:'Rithas Ahamed',
    profileUrl:''
   } 

  const dispatch = useDispatch();

  const { handleSubmit, handleChange, handleBlur, values, errors, touched } =
  useFormik({
    initialValues: {
      studentId: "",
      password: "",
    },
    validationSchema: LoginValidationSchema,
    onSubmit: async (values) => {
      console.log("Form submitted", values);
      // Add your login logic here
      dispatch(setSuperAdminInfo({
        id:dummyData.id,
        name:dummyData.name,
        profileUrl:dummyData.profileUrl
      }))
    },
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md relative">
        <div className="absolute inset-0 bg-[#A6CEAC] transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
        <div className="relative bg-white shadow-lg rounded-3xl p-10">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="studentId" className="block text-sm font-medium text-gray-700 mb-1">
                USERNAME*
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <input
                  type="text"
                  id="studentId"
                  name="studentId"
                  className={`block w-full pr-10 sm:text-sm rounded-md focus:ring-green-500 focus:border-green-500 h-14 px-4 ${errors.studentId && touched.studentId ? 'border-red-500' : 'border-gray-300'
                    }`}
                  value={values.studentId}
                  placeholder='Enter your username'
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                {errors.studentId && touched.studentId && (
                  <div className="text-red-500 text-sm mt-1">{errors.studentId}</div>
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
    </div>
  );
};

export default SuperAdminLogin;