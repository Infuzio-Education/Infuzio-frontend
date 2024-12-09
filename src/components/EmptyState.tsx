import { FolderOpen } from 'lucide-react';

interface EmptyStateProps {
    title: string;
    message: string;
    icon?: React.ReactNode;
}

const EmptyState = ({ title, message, icon }: EmptyStateProps) => {
    return (
        <div className="flex flex-col items-center justify-center h-[400px] bg-white rounded-lg border-2 border-dashed border-gray-200">
            <div className="text-gray-400 mb-4">
                {icon || <FolderOpen size={48} />}
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">{title}</h3>
            <p className="text-gray-500 text-center max-w-sm">{message}</p>
        </div>
    );
};

export default EmptyState; 