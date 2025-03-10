import React, { useState, useEffect } from "react";
import { Mail, Phone, UserCircle2 } from "lucide-react";
import Togglebar from "../../../components/Togglebar";
import { Student } from "../../../types/Types";
import { useSchoolContext } from "../../../contexts/SchoolContext";
import { getAllStudentsInSchool } from "../../../api/staffs";
import SnackbarComponent from "../../../components/SnackbarComponent";
import InfiniteScroll from "react-infinite-scroll-component";
import { useSelector } from "react-redux";
import { Modal, Box } from "@mui/material";
import { getStudentById } from "../../../api/superAdmin";
import {
    User,
    Calendar,
    Droplet,
    Accessibility,
    Church,
    Users,
    Home,
    Building2,
    Building,
    MapPin,
    Globe,
    GraduationCap,
    Users2,
    CalendarDays,
    Flag,
    BookOpen
} from "lucide-react";

const AllStudents: React.FC = () => {
    const [students, setStudents] = useState<Student[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: "",
        severity: "success" as "success" | "error",
        position: { vertical: "top" as const, horizontal: "center" as const },
    });
    const [page, setPage] = useState<number>(1);
    const [hasMore, setHasMore] = useState<boolean>(true);
    const [openModal, setOpenModal] = useState<boolean>(false);
    const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

    const { staffInfo } = useSelector((state: any) => state.staffInfo);
    const { schoolInfo } = useSchoolContext();
    const schoolPrefix = schoolInfo.schoolPrefix || staffInfo.schoolCode;

    const fetchStudents = async (page: number) => {
        setLoading(true);
        setError(null);
        try {
            if (!schoolPrefix) {
                throw new Error("School prefix not found");
            }
            const response = await getAllStudentsInSchool(
                schoolPrefix,
                page,
                20
            );

            if (response.length < 20) {
                setHasMore(false);
            }

            setStudents((prevStudents) => [...prevStudents, ...response]);
        } catch (err: any) {
            setError(
                err.response?.data?.message ||
                "An error occurred while fetching student data"
            );
            setStudents([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStudents(page);
    }, [schoolPrefix, page]);

    const fetchMoreData = () => {
        setPage((prevPage) => prevPage + 1);
    };

    const handleCloseSnackbar = () => {
        setSnackbar((prev) => ({ ...prev, open: false }));
    };

    const handleOpenModal = async (student: Student) => {
        try {
            setSelectedStudent(null);
            setOpenModal(true);

            if (student.id && schoolPrefix) {
                const response = await getStudentById(student.id, schoolPrefix);

                if (response.status && response.resp_code === "SUCCESS") {
                    setSelectedStudent(response.data);
                } else {
                    throw new Error("Failed to fetch student details");
                }
            }
        } catch (error: any) {
            console.error('Error fetching student details:', error);
            setSnackbar({
                open: true,
                message: error.response?.data?.message || 'Failed to fetch student details',
                severity: 'error',
                position: { vertical: 'top', horizontal: 'center' }
            });
            handleCloseModal();
        }
    };

    const handleCloseModal = () => {
        setSelectedStudent(null);
        setOpenModal(false);
    };

    const filteredStudents = Array.isArray(students)
        ? students.filter(
            (student) =>
                student?.name
                    ?.toLowerCase()
                    .includes(searchTerm.toLowerCase()) || false
        )
        : [];

    return (
        <div className="min-h-screen bg-gray-200 p-8 pt-5 relative">
            <Togglebar
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                viewMode={viewMode}
                setViewMode={setViewMode}
                itemCount={Array.isArray(students) ? students.length : 0}
            />

            {loading && students.length === 0 ? (
                <div className="rounded-lg p-8 text-center">
                    <p className="text-xl font-semibold">Loading students...</p>
                </div>
            ) : error ? (
                <div className="rounded-lg p-8 text-center">
                    <p className="text-xl font-semibold text-red-500">
                        {error}
                    </p>
                </div>
            ) : !Array.isArray(students) || students.length === 0 ? (
                <div className=" rounded-lg p-8 text-center">
                    <p className="text-xl font-semibold mb-4">
                        No students found.
                    </p>
                </div>
            ) : filteredStudents.length === 0 && searchTerm ? (
                <div className=" rounded-lg p-8 text-center">
                    <p className="text-lg font-semibold">
                        No students match your search criteria.
                    </p>
                </div>
            ) : (
                <InfiniteScroll
                    dataLength={students.length}
                    next={fetchMoreData}
                    hasMore={hasMore}
                    loader={<h4>Loading...</h4>}
                    endMessage={
                        <p style={{ textAlign: "center" }}>
                            <b>Yay! You have seen it all</b>
                        </p>
                    }
                >
                    {viewMode === "grid" ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {filteredStudents.map((student) => (
                                <div
                                    key={student.id}
                                    className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer transform transition duration-300 hover:scale-105 hover:shadow-xl"
                                    onClick={() => handleOpenModal(student)}
                                >
                                    <div className="p-6">
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="flex items-center space-x-3">
                                                <div className="bg-[#308369] rounded-full p-2">
                                                    <UserCircle2
                                                        size={24}
                                                        className="text-white"
                                                    />
                                                </div>
                                                <div>
                                                    <h3 className="text-lg font-semibold text-gray-900">
                                                        {student.name}
                                                    </h3>
                                                    <span className="text-sm text-gray-500">
                                                        ID: {student.idCardNumber}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <div className="flex items-center text-gray-600">
                                                <Mail size={16} className="mr-2" />
                                                <span className="text-sm truncate">
                                                    {student.email}
                                                </span>
                                            </div>
                                            <div className="flex items-center text-gray-600">
                                                <Phone size={16} className="mr-2" />
                                                <span className="text-sm">
                                                    {student.phone}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="mt-4 pt-4 border-t border-gray-200">
                                            <div className="flex items-center justify-between">
                                                <span className="px-3 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                                                    Class {student.className}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="bg-white shadow-md rounded-lg overflow-hidden">
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-gray-300">
                                        <th className="text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-1/12 py-3">
                                            Sl.No
                                        </th>
                                        <th className="text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-2/12 py-3">
                                            Name
                                        </th>
                                        <th className="text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-2/12 py-3">
                                            ID Number
                                        </th>
                                        <th className="text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-2/12 py-3">
                                            Class
                                        </th>
                                        <th className="text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-2/12 py-3">
                                            Contact
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {filteredStudents.map((student, index) => (
                                        <tr key={student.id} className="cursor-pointer" onClick={() => handleOpenModal(student)}>
                                            <td className="text-center py-3">
                                                <div className="text-sm font-medium text-gray-900">
                                                    {index + 1}
                                                </div>
                                            </td>
                                            <td className="text-center py-3">
                                                <div className="text-sm font-medium text-gray-900">
                                                    {student.name}
                                                </div>
                                            </td>
                                            <td className="text-center py-3">
                                                <div className="text-sm font-medium text-gray-900">
                                                    {student.idCardNumber}
                                                </div>
                                            </td>
                                            <td className="text-center py-3">
                                                <div className="text-sm font-medium text-gray-900">
                                                    Class {student.className}
                                                </div>
                                            </td>
                                            <td className="text-center py-3">
                                                <div className="text-sm font-medium text-gray-900">
                                                    {student.phone}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </InfiniteScroll>
            )}

            <Modal
                open={openModal}
                onClose={handleCloseModal}
                aria-labelledby="student-detail-modal"
            >
                <Box sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 800,
                    bgcolor: 'background.paper',
                    boxShadow: 24,
                    borderRadius: 2,
                    maxHeight: '90vh',
                    overflowY: 'auto'
                }}>
                    {selectedStudent ? (
                        <div>
                            <div className="bg-gray-50 p-6 border-b">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center space-x-4">
                                        <div className="w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center text-white text-2xl font-bold">
                                            {selectedStudent.name.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <h2 className="text-2xl font-bold text-gray-900">{selectedStudent.name}</h2>
                                            <p className="text-sm text-gray-500">Admission No: {selectedStudent.admissionNumber}</p>
                                        </div>
                                    </div>
                                    <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                                        Class {selectedStudent.className || 'Not Assigned'}
                                    </div>
                                </div>
                            </div>

                            <div className="p-6">
                                <div className="mb-8">
                                    <h3 className="text-lg font-semibold mb-4 text-gray-900 border-b pb-2">Academic Information</h3>
                                    <div className="grid grid-cols-2 gap-6">
                                        <DetailItem icon={GraduationCap} label="Class" value={selectedStudent.className || 'Not Assigned'} />
                                        <DetailItem icon={BookOpen} label="Roll Number" value={selectedStudent.rollNumber || 'Not Assigned'} />
                                        <DetailItem icon={CalendarDays} label="Date of Admission" value={new Date(selectedStudent.dateOfAdmission).toLocaleDateString()} />
                                        <DetailItem icon={Flag} label="Nationality" value={selectedStudent.nationality} />
                                    </div>
                                </div>

                                <div className="mb-8">
                                    <h3 className="text-lg font-semibold mb-4 text-gray-900 border-b pb-2">Contact Information</h3>
                                    <div className="grid grid-cols-2 gap-6">
                                        <DetailItem icon={Phone} label="Mobile" value={selectedStudent.phone} />
                                        <DetailItem icon={Mail} label="Email" value={selectedStudent.email} />
                                    </div>
                                </div>

                                <div className="mb-8">
                                    <h3 className="text-lg font-semibold mb-4 text-gray-900 border-b pb-2">Personal Information</h3>
                                    <div className="grid grid-cols-2 gap-6">
                                        <DetailItem icon={User} label="Gender" value={selectedStudent.gender} />
                                        <DetailItem icon={Calendar} label="Date of Birth" value={new Date(selectedStudent.dob).toLocaleDateString()} />
                                        <DetailItem icon={Droplet} label="Blood Group" value={selectedStudent.bloodGroup || 'Not Available'} />
                                        <DetailItem icon={Accessibility} label="PWD Status" value={selectedStudent.isPwd ? 'Yes' : 'No'} />
                                        <DetailItem icon={Church} label="Religion" value={selectedStudent.religion} />
                                        <DetailItem icon={Users} label="Caste" value={selectedStudent.caste} />
                                        <DetailItem icon={Users2} label="Reservation Category" value={selectedStudent.reservationCategory} />
                                    </div>
                                </div>

                                <div className="mb-8">
                                    <h3 className="text-lg font-semibold mb-4 text-gray-900 border-b pb-2">Address Information</h3>
                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="col-span-2">
                                            <DetailItem
                                                icon={Home}
                                                label="Address"
                                                value={`${selectedStudent.house || ''}, ${selectedStudent.street1 || ''}, ${selectedStudent.street2 || ''}`}
                                            />
                                        </div>
                                        <DetailItem icon={Building2} label="City" value={selectedStudent.city} />
                                        <DetailItem icon={Building} label="State" value={selectedStudent.state} />
                                        <DetailItem icon={MapPin} label="Pincode" value={selectedStudent.pincode} />
                                        <DetailItem icon={Globe} label="Country" value={selectedStudent.country} />
                                    </div>
                                </div>
                            </div>

                            <div className="bg-gray-50 px-6 py-4 border-t flex justify-end">
                                <button
                                    onClick={handleCloseModal}
                                    className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="p-8 text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
                            <p className="text-lg font-semibold text-gray-700">Loading student details...</p>
                        </div>
                    )}
                </Box>
            </Modal>

            <SnackbarComponent
                open={snackbar.open}
                message={snackbar.message}
                severity={snackbar.severity}
                position={snackbar.position}
                onClose={handleCloseSnackbar}
            />
        </div>
    );
};

const DetailItem = ({ icon: Icon, label, value }: { icon?: React.ElementType; label: string; value: string | number }) => (
    <div className="space-y-1">
        <div className="flex items-center space-x-2">
            {Icon && <Icon size={16} className="text-gray-500" />}
            <span className="text-sm font-medium text-gray-500">{label}</span>
        </div>
        <p className="text-sm text-gray-900 pl-6">{value || 'N/A'}</p>
    </div>
);

export default AllStudents;
