import React from "react";

const ActionCard = ({
    onClick,
    iconBgColor,
    iconHoverBgColor,
    iconTextColor,
    title,
    description,
    actionText,
    Icon,
}: {
    onClick: () => void;
    iconBgColor: string;
    iconHoverBgColor: string;
    iconTextColor: string;
    title: string;
    description: string;
    actionText: string;
    Icon: React.ElementType;
}) => {
    return (
        <div
            onClick={onClick}
            className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow cursor-pointer group"
        >
            <div className="p-6 space-y-4">
                <div
                    className={`w-12 h-12 ${iconBgColor} rounded-full flex items-center justify-center group-hover:${iconHoverBgColor} transition-colors`}
                >
                    <Icon className={`w-6 h-6 ${iconTextColor}`} />
                </div>
                <div>
                    <h3 className="text-lg font-semibold text-gray-800">
                        {title}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                        {description}
                    </p>
                </div>
                <div
                    className={`flex items-center ${iconTextColor} text-sm font-medium`}
                >
                    {actionText} →
                </div>
            </div>
        </div>
    );
};

export default ActionCard;
