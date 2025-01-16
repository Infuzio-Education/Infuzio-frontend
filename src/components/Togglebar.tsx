import React from 'react';
import { Search, ChevronLeft, ChevronRight, Grid, List, SortAsc, Printer, Archive, CheckSquare } from "lucide-react";
import { TogglebarProps } from '../types/Types';

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
    return (
        <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-4">
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Search..."
                        className="pl-10 pr-4 py-2 border rounded-lg"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
                </div>
            </div>
            <div className="flex items-center gap-4">
                {/* Print Button - Only show when items are selected */}
                {selectedCount > 0 && (
                    <button
                        onClick={onPrint}
                        className="p-2 rounded bg-gray-200 hover:bg-gray-300 flex items-center gap-2 mr-4"
                        title="Print Selected"
                    >
                        <Printer size={20} />
                        <span className="text-sm">Print Selected ({selectedCount})</span>
                    </button>
                )}

                {/* Select All Button */}
                <button
                    onClick={onSelectAll}
                    className="p-2 rounded bg-gray-200 hover:bg-gray-300 flex items-center gap-2 mr-20"
                    title="Select All"
                >
                    <CheckSquare size={20} />
                    <span className="text-sm">
                        {selectedCount > 0 ? `Selected (${selectedCount})` : 'Select All'}
                    </span>
                </button>

                {/* Sort Button */}
                <button
                    onClick={onSort}
                    className="p-2 rounded bg-gray-200 hover:bg-gray-300 flex items-center gap-2 mr-4"
                    title="Sort"
                >
                    <SortAsc size={20} />
                    <span className="text-sm">Sort</span>
                </button>

                {/* Show Deleted Button */}
                {setShowDeleted && (
                    <button
                        onClick={() => setShowDeleted(!showDeleted)}
                        className="px-3 py-2 rounded-md flex items-center gap-2 bg-gray-100 hover:bg-gray-200 transition-colors text-gray-700 border border-gray-300"
                        title="View deleted items"
                    >
                        <Archive size={18} />
                        <span className="text-sm font-medium">View Deleted</span>
                    </button>
                )}

                <span className="text-sm font-medium mr-4">
                    {`1-${itemCount} / ${itemCount}`}
                </span>
                <ChevronLeft className="text-gray-600 cursor-pointer mr-4" size={20} />
                <ChevronRight className="text-gray-600 cursor-pointer mr-4" size={20} />
                <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded flex items-center gap-2 mr-4 ${viewMode === 'grid' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                >
                    <Grid size={20} />
                    <span className="text-sm">Grid</span>
                </button>
                <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded flex items-center gap-2 ${viewMode === 'list' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                >
                    <List size={20} />
                    <span className="text-sm">List</span>
                </button>
            </div>
        </div>
    );
};

export default Togglebar;