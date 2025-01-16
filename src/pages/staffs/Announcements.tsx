import { useState, useEffect } from "react";
import { Plus, Image as ImageIcon, File, Send, X } from "lucide-react";
import { CircularProgress } from "@mui/material";
import { getAnnouncements, getSections } from "../../api/staffs";
import { AnnouncementData } from "../../types/Types";

const Announcements = () => {
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [announcements, setAnnouncements] = useState<AnnouncementData[]>([]);

    const sections = ["LP", "UP", "HS", "HSS"];
    const classes: Record<string, string[]> = {
        LP: ["LKG", "UKG", "1", "2", "3", "4"],
        UP: ["5", "6", "7"],
        HS: ["8", "9", "10"],
        HSS: ["11", "12"],
    };

    useEffect(() => {
        const fetchAnnouncements = async () => {
            try {
                setLoading(true);
                setError(null);
                const data = await getAnnouncements();
                setAnnouncements(data);
            } catch (error) {
                setError(
                    "Failed to fetch announcements. Please try again later."
                );
                console.error("Error fetching announcements:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchAnnouncements();
    }, []);

    useEffect(() => {
        getSections();
    }, []);

    if (loading) {
        return (
            <div className="h-[calc(100vh-2rem)] flex items-center justify-center">
                <CircularProgress />
            </div>
        );
    }

    if (error) {
        return (
            <div className="h-[calc(100vh-2rem)] flex items-center justify-center text-red-500">
                {error}
            </div>
        );
    }

    return (
        <div className="h-[calc(100vh-2rem)] flex flex-col space-y-4">
            {/* Header */}
            <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow-sm">
                <h1 className="text-xl font-bold text-gray-800">
                    Announcements
                </h1>
                <button
                    onClick={() => setShowCreateModal(true)}
                    className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 
                    transition-colors flex items-center gap-2"
                >
                    <Plus size={20} />
                    Create Announcement
                </button>
            </div>

            {/* Messages Container */}
            <div className="flex-1 relative rounded-lg overflow-hidden">
                <div className="relative h-full overflow-y-auto p-4">
                    <div className="max-w-4xl mx-auto space-y-6">
                        {announcements.map((announcement) => (
                            <div
                                key={announcement.id}
                                className="bg-white rounded-lg shadow-sm p-4 
                                hover:shadow-md transition-shadow border border-gray-100"
                            >
                                <div className="flex gap-4">
                                    {/* Author Avatar */}
                                    <div
                                        className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-500 
                                    to-emerald-600 flex items-center justify-center text-white 
                                    font-semibold shadow-sm"
                                    >
                                        {announcement.author[0]}
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h3 className="font-semibold text-gray-800">
                                                    {announcement.author}
                                                </h3>
                                                <p className="text-sm text-gray-500">
                                                    {new Date(
                                                        announcement.created_at
                                                    ).toLocaleDateString(
                                                        "en-US",
                                                        {
                                                            year: "numeric",
                                                            month: "long",
                                                            day: "numeric",
                                                            hour: "2-digit",
                                                            minute: "2-digit",
                                                        }
                                                    )}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="mt-3">
                                            <h4 className="font-medium text-gray-800 mb-2">
                                                {announcement.title}
                                            </h4>
                                            <p className="text-gray-600 leading-relaxed">
                                                {announcement.body}
                                            </p>
                                        </div>

                                        {announcement.files && (
                                            <div className="mt-4 space-y-2">
                                                {announcement.files.map(
                                                    (file, index) => (
                                                        <div
                                                            key={index}
                                                            className="flex items-center gap-2 text-sm text-gray-600 
                                                        bg-gray-50 p-3 rounded-lg cursor-pointer hover:bg-gray-100
                                                        border border-gray-100 transition-colors"
                                                        >
                                                            <File
                                                                size={16}
                                                                className="text-emerald-500"
                                                            />
                                                            <a
                                                                href={file}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                            >
                                                                View Attachment{" "}
                                                                {index + 1}
                                                            </a>
                                                        </div>
                                                    )
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Create Announcement Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full">
                        <div className="p-6 border-b flex justify-between items-center">
                            <h2 className="text-xl font-semibold text-gray-800">
                                Create New Announcement
                            </h2>
                            <button
                                onClick={() => setShowCreateModal(false)}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                <X size={20} />
                            </button>
                        </div>
                        <div className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Title
                                </label>
                                <input
                                    type="text"
                                    placeholder="Enter announcement title"
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 
                                    focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Content
                                </label>
                                <textarea
                                    rows={4}
                                    placeholder="Write your announcement here..."
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 
                                    focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Section
                                    </label>
                                    <select
                                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 
                                        focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                                    >
                                        <option value="">Select Section</option>
                                        <option value="all">
                                            All Sections
                                        </option>
                                        {sections.map((section) => (
                                            <option
                                                key={section}
                                                value={section}
                                            >
                                                {section}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Class (Optional)
                                    </label>
                                    <select
                                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 
                                        focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                                    >
                                        <option value="">Select Class</option>
                                        {Object.entries(classes).map(
                                            ([section, classList]) => (
                                                <optgroup
                                                    key={section}
                                                    label={section}
                                                >
                                                    {classList.map(
                                                        (className) => (
                                                            <option
                                                                key={className}
                                                                value={
                                                                    className
                                                                }
                                                            >
                                                                Class{" "}
                                                                {className}
                                                            </option>
                                                        )
                                                    )}
                                                </optgroup>
                                            )
                                        )}
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Attachments
                                </label>
                                <div className="flex gap-2">
                                    <button
                                        className="px-4 py-2 border rounded-lg hover:bg-gray-50 
                                    flex items-center gap-2"
                                    >
                                        <ImageIcon size={20} />
                                        Add Image
                                    </button>
                                    <button
                                        className="px-4 py-2 border rounded-lg hover:bg-gray-50 
                                    flex items-center gap-2"
                                    >
                                        <File size={20} />
                                        Add File
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="p-6 border-t bg-gray-50 flex justify-end gap-3">
                            <button
                                onClick={() => setShowCreateModal(false)}
                                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
                            >
                                Cancel
                            </button>
                            <button
                                className="px-4 py-2 bg-emerald-500 text-white rounded-lg 
                                hover:bg-emerald-600 flex items-center gap-2"
                            >
                                <Send size={20} />
                                Post Announcement
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Announcements;
