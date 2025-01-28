import { useState, useEffect } from "react";
import {
    User,
    Phone,
    Mail,
    MapPin,
    Calendar,
    Droplet,
    BookOpen,
    Upload,
    X,
} from "lucide-react";
import { getProfileInfo } from "../../api/staffs";
import { message } from "antd";

interface StaffProfile {
    id: number;
    idCardNumber: string;
    name: string;
    gender: string;
    dob: string;
    mobile: string;
    email: string;
    house: string;
    street1: string;
    street2: string;
    city: string;
    state: string;
    pincode: string;
    country: string;
    bloodGroup: string;
    profilePicLink: string;
    remarks: string;
    religion: string;
    caste: string;
    pwd: boolean;
    isTeachingStaff: boolean;
}

const StaffProfile = () => {
    const [profile, setProfile] = useState<StaffProfile | null>(null);
    const [
        ,
        // isEditing
        setIsEditing,
    ] = useState(false);
    const [showPreview, setShowPreview] = useState(false);

    useEffect(() => {
        // TODO: Fetch staff profile from API
        // For now using mock data
        fetchProfileInfo();
    }, []);

    const fetchProfileInfo = async () => {
        try {
            const response = await getProfileInfo();
            setProfile(response);
        } catch (error) {
            if (error instanceof Error) {
                message?.error(
                    "unable to fetch profile details, try again later"
                );
            }
        }
    };

    const handleProfilePicUpload = async (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const file = event.target.files?.[0];
        if (!file) return;

        // TODO: Implement actual file upload to server
        // For now, create a local URL
        const reader = new FileReader();
        reader.onload = () => {
            if (profile) {
                setProfile({
                    ...profile,
                    profilePicLink: reader.result as string,
                });
            }
        };
        reader.readAsDataURL(file);
    };

    if (!profile) return null;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-white p-6 rounded-xl shadow-sm">
                <h1 className="text-xl font-bold text-gray-800">
                    Staff Profile
                </h1>
                <p className="text-sm text-gray-500 mt-1">
                    View and manage your profile information
                </p>
            </div>

            {/* Profile Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column - Basic Info */}
                <div className="bg-white p-6 rounded-xl shadow-sm">
                    <div className="flex flex-col items-center">
                        <div className="w-32 h-32 relative group">
                            <div className="w-full h-full rounded-full overflow-hidden">
                                {profile.profilePicLink ? (
                                    <img
                                        src={profile.profilePicLink}
                                        alt={profile.name}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                        <User
                                            size={48}
                                            className="text-gray-400"
                                        />
                                    </div>
                                )}
                            </div>

                            {/* Upload Overlay */}
                            <label
                                className="absolute inset-0 bg-black bg-opacity-50 rounded-full 
                                flex items-center justify-center opacity-0 group-hover:opacity-100 
                                cursor-pointer transition-opacity duration-200"
                            >
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleProfilePicUpload}
                                    className="hidden"
                                />
                                <div className="text-white flex flex-col items-center">
                                    <Upload size={20} />
                                    <span className="text-xs mt-1">
                                        Upload Photo
                                    </span>
                                </div>
                            </label>
                        </div>
                        <h2 className="text-xl font-bold text-gray-800">
                            {profile.name}
                        </h2>
                        <p className="text-sm text-gray-500 mt-1">
                            {profile?.idCardNumber}
                        </p>
                        <div className="mt-4 flex items-center gap-2">
                            <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm">
                                {profile.isTeachingStaff
                                    ? "Teaching Staff"
                                    : "Non-Teaching Staff"}
                            </span>
                        </div>
                    </div>

                    <div className="mt-6 space-y-4">
                        <div className="flex items-center gap-3 text-gray-600">
                            <Phone size={18} />
                            <span>{profile.mobile}</span>
                        </div>
                        <div className="flex items-center gap-3 text-gray-600">
                            <Mail size={18} />
                            <span>{profile.email}</span>
                        </div>
                        <div className="flex items-center gap-3 text-gray-600">
                            <MapPin size={18} />
                            <span>{`${profile.street1}${
                                profile.street2 ? `, ${profile.street2}` : ""
                            }, ${profile.city}, ${profile.state} ${
                                profile.pincode
                            }`}</span>
                        </div>
                    </div>
                </div>

                {/* Right Column - Detailed Info */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Personal Information */}
                    <div className="bg-white p-6 rounded-xl shadow-sm">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">
                            Personal Information
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="text-sm text-gray-500">
                                    Gender
                                </label>
                                <p className="text-gray-800">
                                    {profile.gender}
                                </p>
                            </div>
                            <div>
                                <label className="text-sm text-gray-500">
                                    Date of Birth
                                </label>
                                <div className="flex items-center gap-2">
                                    <Calendar
                                        size={16}
                                        className="text-gray-400"
                                    />
                                    <p className="text-gray-800">
                                        {new Date(
                                            profile.dob
                                        ).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>
                            <div>
                                <label className="text-sm text-gray-500">
                                    Blood Group
                                </label>
                                <div className="flex items-center gap-2">
                                    <Droplet
                                        size={16}
                                        className="text-gray-400"
                                    />
                                    <p className="text-gray-800">
                                        {profile.bloodGroup}
                                    </p>
                                </div>
                            </div>
                            <div>
                                <label className="text-sm text-gray-500">
                                    Religion
                                </label>
                                <p className="text-gray-800">
                                    {profile.religion}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Professional Information */}
                    <div className="bg-white p-6 rounded-xl shadow-sm">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">
                            Professional Information
                        </h3>
                        <div className="space-y-4">
                            <div>
                                <label className="text-sm text-gray-500">
                                    Remarks
                                </label>
                                <div className="flex items-center gap-2 mt-1">
                                    <BookOpen
                                        size={16}
                                        className="text-gray-400"
                                    />
                                    <p className="text-gray-800">
                                        {profile.remarks}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-end gap-3">
                        <button
                            onClick={() => setIsEditing(true)}
                            className="px-4 py-2 bg-emerald-600 text-white rounded-lg 
                            hover:bg-emerald-700 transition-colors duration-200"
                        >
                            Edit Profile
                        </button>
                    </div>
                </div>
            </div>

            {profile.profilePicLink && (
                <div className="mt-4 text-center">
                    <button
                        onClick={() => {
                            /* Implement preview modal */
                        }}
                        className="text-sm text-emerald-600 hover:text-emerald-700"
                    >
                        View Photo
                    </button>
                </div>
            )}

            {showPreview && profile.profilePicLink && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg p-4 max-w-2xl w-full">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold">
                                Profile Picture
                            </h3>
                            <button
                                onClick={() => setShowPreview(false)}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                <X size={20} />
                            </button>
                        </div>
                        <div className="relative aspect-square w-full">
                            <img
                                src={profile.profilePicLink}
                                alt={profile.name}
                                className="w-full h-full object-contain rounded-lg"
                            />
                        </div>
                        <div className="mt-4 flex justify-end gap-2">
                            <button
                                onClick={() => setShowPreview(false)}
                                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                            >
                                Close
                            </button>
                            <button
                                onClick={() => {
                                    // TODO: Implement remove photo functionality
                                    if (profile) {
                                        setProfile({
                                            ...profile,
                                            profilePicLink: "",
                                        });
                                    }
                                    setShowPreview(false);
                                }}
                                className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg"
                            >
                                Remove Photo
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StaffProfile;
