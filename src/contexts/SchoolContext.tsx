import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';

interface SchoolInfo {
    id: number | null;
    name: string | null;
    schoolPrefix:string | null;
}

interface SchoolContextType {
    schoolInfo: SchoolInfo;
    setSchoolInfo: (info: SchoolInfo) => void;
}

const SchoolContext = createContext<SchoolContextType | undefined>(undefined);

export const useSchoolContext = () => {
    const context = useContext(SchoolContext);
    if (context === undefined) {
        throw new Error('useSchoolContext must be used within a SchoolProvider');
    }
    return context;
};

interface SchoolProviderProps {
    children: ReactNode;
}

export const SchoolProvider: React.FC<SchoolProviderProps> = ({ children }) => {
    const [schoolInfo, setSchoolInfoState] = useState<SchoolInfo>(() => {
        const storedSchoolInfo = localStorage.getItem('schoolInfo');
        return storedSchoolInfo ? JSON.parse(storedSchoolInfo) : { id: null, name: null };
    });

    const setSchoolInfo = (info: SchoolInfo) => {
        setSchoolInfoState(info);
        localStorage.setItem('schoolInfo', JSON.stringify(info));
    };

    useEffect(() => {
        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === 'schoolInfo') {
                const newSchoolInfo = e.newValue ? JSON.parse(e.newValue) : { id: null, name: null };
                setSchoolInfoState(newSchoolInfo);
            }
        };

        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    return (
        <SchoolContext.Provider value={{ schoolInfo, setSchoolInfo }}>
            {children}
        </SchoolContext.Provider>
    );
};