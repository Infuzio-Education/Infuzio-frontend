import { ArrowLeft } from "lucide-react";

type PropType = {
    heading: string;
    subHeading: string;
    handleBack?: () => void;
};

const HeaderComponent = ({ heading, subHeading, handleBack }: PropType) => {
    return (
        <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="flex items-center gap-4">
                {handleBack && (
                    <button
                        onClick={handleBack}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <ArrowLeft size={20} />
                    </button>
                )}
                <div>
                    <h1 className="text-xl font-bold text-gray-800">
                        {heading}
                    </h1>
                    <p className="text-sm text-gray-500">{subHeading}</p>
                </div>
            </div>
        </div>
    );
};

export default HeaderComponent;
