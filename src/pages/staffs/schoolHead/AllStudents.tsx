/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
// import { Checkbox } from "@mui/material";
import { Mail, Phone, UserCircle2 } from "lucide-react";
import Togglebar from "../../../components/Togglebar";
import { Student } from "../../../types/Types";
import { useSchoolContext } from "../../../contexts/SchoolContext";
import { getAllStudentsInSchool } from "../../../api/staffs"; // Adjust API calls
import SnackbarComponent from "../../../components/SnackbarComponent";
import InfiniteScroll from "react-infinite-scroll-component";

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

    const { schoolInfo } = useSchoolContext();

    const fetchStudents = async (page: number) => {
        setLoading(true);
        setError(null);
        try {
            if (!schoolInfo.schoolPrefix) {
                throw new Error("School prefix not found");
            }
            const response = await getAllStudentsInSchool(
                schoolInfo.schoolPrefix,
                page,
                20 // limit
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
    }, [schoolInfo.schoolPrefix, page]);

    const fetchMoreData = () => {
        setPage((prevPage) => prevPage + 1);
    };

    const handleCloseSnackbar = () => {
        setSnackbar((prev) => ({ ...prev, open: false }));
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
                                        <tr key={student.id} className="cursor-pointer">
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

export default AllStudents;
