// import { useEffect, useRef } from 'react';
// import { useParams, Outlet } from 'react-router-dom';
// import { useSchoolContext } from '../contexts/SchoolContext';
// import { useSelector } from 'react-redux';
// import { RootState } from '../redux/store/store';

// const SchoolProfileWrapper = () => {
//     const { schoolCode } = useParams<{ schoolCode?: string }>();
//     const { schoolInfo, setSchoolInfo } = useSchoolContext();
//     const staffInfo = useSelector((state: RootState) => state.staffInfo.staffInfo);
//     const isSchoolAdmin = staffInfo?.specialPrivileges?.some(p => p.privilege === 'schoolAdmin');
//     const prevSchoolInfo = useRef(schoolInfo);

//     useEffect(() => {
//         const newSchoolInfo = isSchoolAdmin && staffInfo
//             ? {
//                 id: null,
//                 name: staffInfo.schoolName || '',
//                 schoolPrefix: staffInfo.schoolCode || ''
//             }
//             : schoolCode
//                 ? {
//                     id: null,
//                     name: schoolCode.toUpperCase(),
//                     schoolPrefix: schoolCode
//                 }
//                 : null;

//         // Only update if info has changed
//         if (newSchoolInfo && (
//             newSchoolInfo.name !== prevSchoolInfo.current.name ||
//             newSchoolInfo.schoolPrefix !== prevSchoolInfo.current.schoolPrefix
//         )) {
//             setSchoolInfo(newSchoolInfo);
//             prevSchoolInfo.current = newSchoolInfo;
//         }
//     }, [schoolCode, staffInfo?.schoolCode, staffInfo?.schoolName, isSchoolAdmin, setSchoolInfo]);

// };

// // export default SchoolProfileWrapper;