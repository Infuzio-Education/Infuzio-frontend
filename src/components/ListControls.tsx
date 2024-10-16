import React from 'react';
import { Search, ChevronLeft, ChevronRight, Grid, List } from "lucide-react";
import { ListControlsProps } from '../types/Types';


const ListControls: React.FC<ListControlsProps> = ({ searchTerm, setSearchTerm, viewMode, setViewMode, itemCount }) => {
    return (
        <div className="flex justify-between items-center mb-6">
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
            <div className="flex items-center space-x-4">
                <span className="text-sm font-medium">
                    {`1-${itemCount} / ${itemCount}`}
                </span>
                <ChevronLeft className="text-gray-600 cursor-pointer" size={20} />
                <ChevronRight className="text-gray-600 cursor-pointer" size={20} />
                <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded ${viewMode === 'grid' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                >
                    <Grid size={20} />
                </button>
                <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded ${viewMode === 'list' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                >
                    <List size={20} />
                </button>
            </div>
        </div>
    );
};

export default ListControls;