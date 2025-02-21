import React from "react";
import { Checkbox, IconButton } from "@mui/material";
import { Trash2, Mail, Phone, UserCircle2 } from "lucide-react";

interface GridViewProps {
    items: any[];
    selectedItems: number[];
    onSelect: (id: number) => void;
    onDelete?: (id: number) => void;
    onItemClick?: (item: any) => void;
    getItemContent: (item: any) => {
        title: string;
        subtitle?: string | number;
        email?: string;
        phone?: string;
        status?: {
            label: string;
            color: string;
        };
        avatar?: {
            letter: string;
            image?: string;
        };
        action?: {
            label: string;
            onClick: () => void;
            color: string;
        };
    };
    showDeleteIcon?: boolean;
}

const GridView: React.FC<GridViewProps> = ({
    items,
    selectedItems,
    onSelect,
    onDelete = () => {},
    onItemClick = () => {},
    getItemContent,
    showDeleteIcon = true,
}) => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {items.map((item) => {
                const content = getItemContent(item);
                return (
                    <div
                        key={item.ID || item.id}
                        className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer transform transition duration-300 hover:scale-105 hover:shadow-xl"
                        onClick={() => onItemClick(item)}
                    >
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center space-x-3">
                                    <div className="bg-[#308369] rounded-full p-2">
                                        {content.avatar?.image ? (
                                            <img
                                                src={content.avatar.image}
                                                alt={content.title}
                                                className="w-6 h-6 rounded-full"
                                            />
                                        ) : (
                                            <UserCircle2
                                                size={24}
                                                className="text-white"
                                            />
                                        )}
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900">
                                            {content.title}
                                        </h3>
                                        {content.subtitle && (
                                            <span className="text-sm text-gray-500">
                                                {content.subtitle}
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <Checkbox
                                    checked={selectedItems.includes(
                                        item.ID || item.id
                                    )}
                                    onChange={() =>
                                        onSelect(item.ID || item.id)
                                    }
                                    onClick={(e) => e.stopPropagation()}
                                />
                            </div>

                            <div className="space-y-2">
                                {content.email && (
                                    <div className="flex items-center text-gray-600">
                                        <Mail size={16} className="mr-2" />
                                        <span className="text-sm truncate">
                                            {content.email}
                                        </span>
                                    </div>
                                )}
                                {content.phone && (
                                    <div className="flex items-center text-gray-600">
                                        <Phone size={16} className="mr-2" />
                                        <span className="text-sm">
                                            {content.phone}
                                        </span>
                                    </div>
                                )}
                            </div>

                            <div className="mt-4 pt-4 border-t border-gray-200">
                                <div className="flex items-center justify-between">
                                    {content.status && (
                                        <span
                                            className={`px-3 py-1 rounded-full text-xs ${content.status.color}`}
                                        >
                                            {content.status.label}
                                        </span>
                                    )}
                                    {showDeleteIcon && (
                                        <IconButton
                                            aria-label="delete"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onDelete(item.ID || item.id);
                                            }}
                                            size="small"
                                        >
                                            <Trash2
                                                size={16}
                                                className="text-red-500"
                                            />
                                        </IconButton>
                                    )}
                                </div>
                                {content.action && (
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            content.action?.onClick();
                                        }}
                                        className={`
                                            mt-3 w-full py-2 px-4 rounded-md 
                                            border border-red-200 
                                            text-sm font-medium 
                                            transition-colors duration-200
                                            hover:bg-red-50
                                            ${content.action.color}
                                        `}
                                    >
                                        {content.action.label}
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default GridView;
