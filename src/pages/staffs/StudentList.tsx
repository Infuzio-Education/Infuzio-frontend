import { useEffect, useState } from "react";
import {
    Search,
    Filter,
    ArrowLeft,
    Phone,
    Mail,
    User,
    AlertCircle,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import StudentDetails from "./StudentDetails";
import { Student } from "../../types/Types";
import { getStudentsDetails } from "../../api/staffs";
import { CircularProgress } from "@mui/material";

const StudentList = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const fromClass = location.state?.fromClass;
    const returnTab = location.state?.returnTab;
    const [selectedStudent, setSelectedStudent] = useState<Student | null>(
        null
    );
    const [
        ,
        // isEditing
        setIsEditing,
    ] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [students, setStudents] = useState<Student[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchStudents();
    }, [fromClass?.id]);

    const fetchStudents = async () => {
        try {
            const students = await getStudentsDetails(fromClass?.id);
            setStudents(students);
            setLoading(false);
        } catch (error) {
            setError("Error fetching students, Try refreshing the page");
            setLoading(false);
        }
    };

    const handleEdit = (student: Student) => {
        setSelectedStudent(student);
        setIsEditing(true);
    };

    const handleDelete = (id: number) => {
        if (window.confirm("Are you sure you want to delete this student?")) {
            console.log("Delete student:", id);
            // Add API call here
        }
    };

    const handleBack = () => {
        if (selectedStudent) {
            setSelectedStudent(null);
        } else {
            navigate("/staffs/home", {
                state: {
                    activeTab: returnTab,
                    selectedClass: fromClass,
                },
            });
        }
    };

    if (selectedStudent) {
        return (
            <StudentDetails
                student={selectedStudent}
                onBack={handleBack}
                onEdit={handleEdit}
                onDelete={handleDelete}
            />
        );
    }

    return (
        <div className="space-y-6">
            {/* List Header with Back Button */}
            <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow-sm">
                <div className="flex items-center gap-4">
                    <button
                        onClick={handleBack}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <h1 className="text-xl font-bold text-gray-800">
                        Students
                    </h1>
                </div>
                <div className="flex items-center gap-4">
                    <div className="relative">
                        <Search
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                            size={20}
                        />
                        <input
                            type="text"
                            placeholder="Search students..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                    </div>
                    <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                        <Filter size={20} className="text-gray-600" />
                    </button>
                </div>
            </div>

            {/* Student Cards Grid */}
            {loading ? (
                <div className="flex justify-center items-center h-[200px]">
                    <CircularProgress />
                </div>
            ) : error ? (
                <div className="flex justify-center gap-2 items-center h-[200px]">
                    <AlertCircle size={20} className="text-red-500" />
                    <p className="text-red-500">{error}</p>
                </div>
            ) : students.length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                    {students
                        .filter(
                            (student) =>
                                student.name
                                    .toLowerCase()
                                    .includes(searchQuery.toLowerCase()) ||
                                (student.admissionNumber &&
                                    student.admissionNumber.includes(
                                        searchQuery
                                    ))
                        )
                        .map((student) => (
                            <div
                                key={student.id}
                                className="bg-white rounded-lg p-6 hover:shadow-lg transition-all duration-200 
                            border border-gray-100 hover:border-emerald-100 cursor-pointer"
                                onClick={() => setSelectedStudent(student)}
                            >
                                <div className="flex items-start gap-4">
                                    <div className="w-16 h-16 bg-gray-200 rounded-full flex-shrink-0">
                                        {student.profilePic ? (
                                            <img
                                                src={student.profilePic}
                                                alt={student.name}
                                                className="w-full h-full rounded-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full rounded-full flex items-center justify-center bg-emerald-100">
                                                <User
                                                    size={24}
                                                    className="text-emerald-600"
                                                />
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-800">
                                            {student.name}
                                        </h3>
                                        <p className="text-sm text-gray-500">
                                            {student.className}
                                        </p>
                                        <div className="mt-2 space-y-1">
                                            <p className="text-sm text-gray-600 flex items-center gap-2">
                                                <Phone size={14} />
                                                {student.phone}
                                            </p>
                                            <p className="text-sm text-gray-600 flex items-center gap-2">
                                                <Mail size={14} />
                                                {student.email}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                </div>
            ) : (
                <div className="flex justify-center gap-2 items-center h-[200px]">
                    <AlertCircle size={20} className="text-red-500" />
                    <p className="text-red-500">No students found</p>
                </div>
            )}
        </div>
    );
};

export default StudentList;
