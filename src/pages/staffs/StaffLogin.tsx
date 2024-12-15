import { useEffect, useState } from "react";
import { Eye, EyeOff, LogIn } from "lucide-react";
import { useFormik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store/store";
import { useNavigate } from "react-router-dom";
import { setStaffInfo } from "../../redux/slices/staffSlice/staffSlice";
import { LoginValidationSchema } from "../../validations/LoginValidationSchema";
import { staffLogin } from "../../api/staffs";
import { Alert, AlertColor, Snackbar } from "@mui/material";

const StaffLogin = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const { staffInfo } = useSelector((state: RootState) => state.staffInfo);
    const [state, setState] = useState({
        showPassword: false,
        openSnackbar: false,
        snackbarMessage: "",
        snackbarSeverity: "success" as AlertColor,
    });

    const updateState = (updates: Partial<typeof state>) => {
        setState((prevState) => ({
            ...prevState,
            ...updates,
        }));
    };
    useEffect(() => {
        if (staffInfo) {
            navigate("/staffs/home");
        }
    }, []);

    const { handleSubmit, handleChange, handleBlur, values, errors, touched } =
        useFormik({
            initialValues: {
                username: "",
                password: "",
            },
            validationSchema: LoginValidationSchema,
            onSubmit: async (values) => {
                try {
                    const response = await staffLogin(values);

                    if (response?.status === 200) {
                        dispatch(
                            setStaffInfo({
                                username: values.username,
                                token: response.data.data.token,
                            })
                        );

                        updateState({
                            snackbarMessage: "Login successful!",
                            snackbarSeverity: "success",
                            openSnackbar: true,
                        });

                        setTimeout(() => {
                            navigate("/staffs/home");
                        }, 1000);
                    } else if (response?.status === 401) {
                        throw new Error("Invalid username or password!");
                    } else {
                        throw new Error(
                            "Unknown Error, Please Try again Later!"
                        );
                    }
                } catch (error) {
                    if (error instanceof Error) {
                        console.error(error.message);
                        updateState({
                            snackbarMessage: error.message || "Login failed!",
                            snackbarSeverity: "error",
                            openSnackbar: true,
                        });
                    }
                }
            },
        });

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-cyan-50 flex items-center justify-center p-4">
            <div className="max-w-md w-full">
                {/* Logo and Title */}
                <div className="text-center mb-8">
                    <div className="bg-emerald-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                        <LogIn className="w-8 h-8 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800">
                        Welcome Back!
                    </h2>
                    <p className="text-gray-600 mt-1">
                        Please sign in to continue
                    </p>
                </div>

                {/* Login Form */}
                <div className="bg-white rounded-2xl shadow-xl p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Email Field */}
                        <div>
                            <label
                                htmlFor="email"
                                className="block text-sm font-medium text-gray-700 mb-1"
                            >
                                Username
                            </label>
                            <input
                                type="text"
                                id="email"
                                name="username"
                                value={values.username}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors text-gray-800"
                                placeholder="Enter your email"
                                required
                            />
                            {errors.username && touched.username && (
                                <div className="text-red-500 text-sm mt-1">
                                    {errors.username}
                                </div>
                            )}
                        </div>

                        {/* Password Field */}
                        <div>
                            <label
                                htmlFor="password"
                                className="block text-sm font-medium text-gray-700 mb-1"
                            >
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    type={
                                        state.showPassword ? "text" : "password"
                                    }
                                    id="password"
                                    name="password"
                                    value={values.password}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors text-gray-800"
                                    placeholder="Enter your password"
                                    required
                                />
                                {errors.password && touched.password && (
                                    <div className="text-red-500 text-sm mt-1">
                                        {errors.password}
                                    </div>
                                )}
                                <button
                                    type="button"
                                    onClick={() =>
                                        updateState({
                                            showPassword: !state.showPassword,
                                        })
                                    }
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                >
                                    {state.showPassword ? (
                                        <EyeOff size={20} />
                                    ) : (
                                        <Eye size={20} />
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Remember Me & Forgot Password */}
                        <div className="flex items-center justify-between">
                            <label className="flex items-center">
                                <input
                                    type="checkbox"
                                    className="w-4 h-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                                />
                                <span className="ml-2 text-sm text-gray-600">
                                    Remember me
                                </span>
                            </label>
                            <button
                                type="button"
                                className="text-sm text-emerald-600 hover:text-emerald-700 font-medium"
                            >
                                Forgot Password?
                            </button>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            className="w-full bg-emerald-600 text-white py-2.5 rounded-lg hover:bg-emerald-700 
                            transition-colors duration-200 font-medium shadow-sm hover:shadow flex items-center 
                            justify-center gap-2"
                        >
                            <LogIn size={20} />
                            Sign In
                        </button>
                    </form>

                    {/* Additional Info */}
                    <div className="mt-6 text-center">
                        <p className="text-sm text-gray-600">
                            Having trouble signing in?{" "}
                            <a
                                href="#"
                                className="text-emerald-600 hover:text-emerald-700 font-medium"
                            >
                                Contact Support
                            </a>
                        </p>
                    </div>
                </div>

                {/* Footer */}
                <div className="mt-8 text-center">
                    <p className="text-sm text-gray-500">
                        © 2024 School Management System. All rights reserved.
                    </p>
                </div>
            </div>

            {/* Snackbar for success/failure messages */}
            <Snackbar
                open={state.openSnackbar}
                autoHideDuration={6000}
                onClose={() => updateState({ openSnackbar: false })}
                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            >
                <Alert
                    onClose={() => updateState({ openSnackbar: false })}
                    severity={state.snackbarSeverity as AlertColor}
                    sx={{ width: "100%" }}
                >
                    {state.snackbarMessage}
                </Alert>
            </Snackbar>
        </div>
    );
};

export default StaffLogin;
