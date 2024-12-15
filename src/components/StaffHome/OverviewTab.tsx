const OverviewTab = () => {
    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-sm">
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">
                        Today's Classes
                    </h3>
                    <p className="text-3xl font-bold text-emerald-600">5</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm">
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">
                        Students Present
                    </h3>
                    <p className="text-3xl font-bold text-blue-600">42/45</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm">
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">
                        Attendance Rate
                    </h3>
                    <p className="text-3xl font-bold text-orange-600">95%</p>
                </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                    Recent Activity
                </h2>
                <div className="space-y-4">
                    <div className="flex items-center justify-between py-2 border-b">
                        <div className="flex items-center space-x-3">
                            <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                            <p className="text-gray-600">
                                Attendance marked for Class X-A
                            </p>
                        </div>
                        <span className="text-sm text-gray-500">
                            2 hours ago
                        </span>
                    </div>
                    <div className="flex items-center justify-between py-2 border-b">
                        <div className="flex items-center space-x-3">
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            <p className="text-gray-600">
                                New announcement posted
                            </p>
                        </div>
                        <span className="text-sm text-gray-500">
                            4 hours ago
                        </span>
                    </div>
                    <div className="flex items-center justify-between py-2 border-b">
                        <div className="flex items-center space-x-3">
                            <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                            <p className="text-gray-600">
                                Exam schedule updated
                            </p>
                        </div>
                        <span className="text-sm text-gray-500">Yesterday</span>
                    </div>
                </div>
            </div>
        </>
    );
};

export default OverviewTab;
