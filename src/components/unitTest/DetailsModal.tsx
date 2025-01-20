// import React from "react";

// const DetailsModal = () => {
//     return (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//             <div className="bg-white rounded-xl shadow-xl max-w-3xl w-full p-6">
//                 <div className="flex justify-between items-center mb-6">
//                     <h2 className="text-xl font-semibold text-gray-800">
//                         Unit Test Details
//                     </h2>
//                     <button
//                         onClick={() => setIsDetailsModalOpen(false)}
//                         className="p-2 hover:bg-gray-100 rounded-full"
//                     >
//                         <X size={20} className="text-gray-500" />
//                     </button>
//                 </div>

//                 <div className="space-y-6">
//                     <div className="grid grid-cols-2 gap-4">
//                         <div className="space-y-2">
//                             <p className="text-sm text-gray-500">Subject</p>
//                             <p className="font-medium">
//                                 {selectedTest.FKSubjectID?.Name ||
//                                     "Unknown Subject"}
//                             </p>
//                         </div>
//                         <div className="space-y-2">
//                             <p className="text-sm text-gray-500">Date</p>
//                             <p className="font-medium">
//                                 {new Date(
//                                     selectedTest.date
//                                 ).toLocaleDateString()}
//                             </p>
//                         </div>
//                     </div>

//                     {/* Action Buttons */}
//                     {/* Add your action buttons here */}
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default DetailsModal;
