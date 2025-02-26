import React, { useState } from 'react';
import { Search, ChevronLeft, ChevronRight, Grid, List, SortAsc, Printer, Archive, CheckSquare, ArrowLeft, Menu } from "lucide-react";
import { TogglebarProps } from '../types/Types';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store/store';

const Togglebar: React.FC<TogglebarProps> = ({
    searchTerm,
    setSearchTerm,
    viewMode,
    setViewMode,
    itemCount,
    onSort,
    onPrint,
    showDeleted = false,
    setShowDeleted,
    onSelectAll,
    selectedCount = 0
}) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const navigate = useNavigate();
    const staffInfo = useSelector((state: RootState) => state.staffInfo.staffInfo);
    const hasSchoolAdminPrivilege = staffInfo?.specialPrivileges?.some(
        (privilege) => privilege.privilege === "schoolAdmin"
    );

    const handleBack = () => {
        if (hasSchoolAdminPrivilege) {
            navigate(`/schoolAdmin/${staffInfo?.schoolCode}`);
        } else {
            navigate('/infuzAdmin/schools');
        }
    };

    return (
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            {/* Left Section */}
            <div className="flex items-center gap-4 w-full md:w-auto">
                <button
                    onClick={handleBack}
                    className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
                >
                    <ArrowLeft size={20} />
                </button>

                <div className="relative flex-1 md:flex-none">
                    <input
                        type="text"
                        placeholder="Search..."
                        className="w-full md:w-auto pl-10 pr-4 py-2 border rounded-lg"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
                </div>

                {/* Mobile Menu Button */}
                <button
                    className="md:hidden p-2 rounded-lg bg-gray-100 hover:bg-gray-200"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                    <Menu size={20} />
                </button>
            </div>

            {/* Right Section - Desktop */}
            <div className={`${isMenuOpen ? 'flex' : 'hidden'} md:flex flex-col md:flex-row items-start md:items-center gap-4 w-full md:w-auto`}>
                {selectedCount > 0 && (
                    <button
                        onClick={onPrint}
                        className="p-2 rounded bg-gray-200 hover:bg-gray-300 flex items-center gap-2 w-full md:w-auto"
                        title="Print Selected"
                    >
                        <Printer size={20} />
                        <span className="text-sm">Print Selected ({selectedCount})</span>
                    </button>
                )}

                <button
                    onClick={onSelectAll}
                    className="p-2 rounded bg-gray-200 hover:bg-gray-300 flex items-center gap-2 w-full md:w-auto"
                    title="Select All"
                >
                    <CheckSquare size={20} />
                    <span className="text-sm">
                        {selectedCount > 0 ? `Selected (${selectedCount})` : 'Select All'}
                    </span>
                </button>

                <button
                    onClick={onSort}
                    className="p-2 rounded bg-gray-200 hover:bg-gray-300 flex items-center gap-2 w-full md:w-auto"
                    title="Sort"
                >
                    <SortAsc size={20} />
                    <span className="text-sm">Sort</span>
                </button>

                {setShowDeleted && (
                    <button
                        onClick={() => setShowDeleted(!showDeleted)}
                        className="px-3 py-2 rounded-md flex items-center gap-2 bg-gray-100 hover:bg-gray-200 transition-colors text-gray-700 border border-gray-300 w-full md:w-auto"
                        title="View deleted items"
                    >
                        <Archive size={18} />
                        <span className="text-sm font-medium">View Deleted</span>
                    </button>
                )}

                <div className="hidden md:flex items-center gap-4">
                    <span className="text-sm font-medium">
                        {`1-${itemCount} / ${itemCount}`}
                    </span>
                    <ChevronLeft className="text-gray-600 cursor-pointer" size={20} />
                    <ChevronRight className="text-gray-600 cursor-pointer" size={20} />
                </div>

                <div className="flex items-center gap-2 w-full md:w-auto">
                    <button
                        onClick={() => setViewMode('grid')}
                        className={`flex-1 md:flex-none p-2 rounded flex items-center justify-center gap-2 ${viewMode === 'grid' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                    >
                        <Grid size={20} />
                        <span className="text-sm">Grid</span>
                    </button>
                    <button
                        onClick={() => setViewMode('list')}
                        className={`flex-1 md:flex-none p-2 rounded flex items-center justify-center gap-2 ${viewMode === 'list' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                    >
                        <List size={20} />
                        <span className="text-sm">List</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Togglebar;