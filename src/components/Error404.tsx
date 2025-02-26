import { NavLink } from 'react-router-dom';
import { BookOpen, GraduationCap, Compass, School } from 'lucide-react';

const Error404 = () => {
    return (
        <div className="h-screen bg-gradient-to-br from-gray-50 to-emerald-50 flex items-center justify-center p-4 overflow-hidden">
            <div className="max-w-4xl w-full text-center px-4 py-8">
                {/* Animated 404 Number */}
                <div className="relative inline-block mb-4">
                    <span className="text-[8rem] font-bold text-emerald-600 opacity-20">404</span>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                            <h1 className="text-4xl font-bold text-gray-800 mb-2">Oops!</h1>
                            <p className="text-xl  text-gray-600">Class Dismissed <span className='text-red-600'>!</span></p>
                        </div>
                    </div>
                </div>

                {/* School-themed Illustration */}
                <div className="relative mb-8 h-64">
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-48 h-48 bg-emerald-100 rounded-full opacity-20 animate-pulse"></div>
                    </div>
                    <svg
                        className="mx-auto h-full"
                        viewBox="0 0 500 500"
                        preserveAspectRatio="xMidYMid meet"
                    >
                        <path d="M250 50L450 150V350L250 450L50 350V150L250 50Z" fill="#A6CEAC" stroke="#2F855A" strokeWidth="4" />
                        <path d="M200 200H300V300H200V200Z" fill="#F0FFF4" />
                        <path d="M220 220H280V280H220V220Z" fill="#C6F6D5" />
                        <circle cx="250" cy="150" r="30" fill="#2F855A" />
                        <path d="M150 350L200 300L250 350L300 300L350 350" stroke="#2F855A" strokeWidth="4" fill="none" />
                        <path d="M180 250L220 220L260 250L300 220" stroke="#2F855A" strokeWidth="2" fill="none" />
                    </svg>
                </div>

                {/* Message */}
                <div className="mb-6">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-3">
                        Page Not Found
                    </h2>
                    <p className="text-base text-gray-600 mb-4">
                        Looks like you've wandered off campus. Let's get you back to class!
                    </p>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-center gap-4">
                    <NavLink
                        to="/"
                        className="flex items-center px-6 py-3 bg-emerald-600 text-white rounded-lg 
                      hover:bg-emerald-700 transition-colors shadow-lg hover:shadow-emerald-200"
                    >
                        <Compass className="mr-2" size={20} />
                        Back to Home
                    </NavLink>
                </div>

                {/* School Elements Grid */}
                <div className="mt-8 grid grid-cols-3 gap-4 opacity-50">
                    <div className="flex flex-col items-center">
                        <School className="text-emerald-600 mb-2" size={24} />
                        <div className="h-1 w-8 bg-emerald-600 rounded-full"></div>
                    </div>
                    <div className="flex flex-col items-center">
                        <GraduationCap className="text-emerald-600 mb-2" size={24} />
                        <div className="h-1 w-8 bg-emerald-600 rounded-full"></div>
                    </div>
                    <div className="flex flex-col items-center">
                        <BookOpen className="text-emerald-600 mb-2" size={24} />
                        <div className="h-1 w-8 bg-emerald-600 rounded-full"></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Error404; 