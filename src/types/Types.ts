export interface SchoolAddress {
    street1: string;
    street2: string;
    city: string;
    state: string;
    pincode: string;
    country: string;
}

export interface SchoolFormData {
    name: string;
    schoolCode: string;
    syllabusIDs: number[];
    address: SchoolAddress;
    googleMapsLink: string;
    phone: string;
    email: string;
}

export interface Section {
    ID: number;
    Name: string;
    SectionCode: string;
}


export interface CreateSectionProps {
    initialData: Section | null;
    onSave: (data: { sectionName: string; sectionCode: string }) => void;
    onCancel: () => void;
}

export interface Subject {
    id: number;
    name: string;
    code: string;
    minMarks: number;
    maxMarks: number;
}

export interface CreateSubjectProps {
    initialData: Subject | null;
    onSave: (subject: Subject) => void;
    onCancel: () => void;
}

export interface CustomTabsProps {
    labels: string[];
    children: React.ReactNode;
}

export interface Teacher {
    id: number;
    name: string;
    email: string;
}

export interface Column {
    id: string;
    label: string;
    minWidth?: number;
}

export interface DynamicListsProps {
    columns: Column[];
    rows: any[];
    selectable?: boolean;
    selectedRows?: any[];
    onRowSelect?: (row: any) => void;
    onRowRemove?: (row: any) => void;
    showCloseIcon?: boolean;
}

export interface Syllabus {
    ID: number;
    Name: string;
}

export interface CreateSyllabusProps {
    initialData: Syllabus | null;
    onSave: (syllabus: Syllabus) => void;
    onCancel: () => void;
}

export interface Medium {
    ID: number;
    Name: string;
}

export interface CreateMediumProps {
    initialData: { ID: number; Name: string } | null;
    onSave: (name: string) => void;
    onCancel: () => void;
}


export interface Standard {
    ID: number;
    Name: string;
    HasGroup: boolean;
    SectionId:number;
    SequenceNumber: number;
    section:string;
}

export interface CreateStandardProps {
    initialData: Standard | null;
    onSave: (name: string, hasGroup: boolean, sequence: number,sequenceNumber:number) => void;
    onCancel: () => void;
    sections:Section[];
}

export interface Group {
    ID: number;
    Name: string;
}

export interface CreateGroupProps {
    onSave: (name: string) => void;
    onCancel: () => void;
}

export interface ListControlsProps {
    searchTerm: string;
    setSearchTerm: (term: string) => void;
    viewMode: 'grid' | 'list';
    setViewMode: (mode: 'grid' | 'list') => void;
    itemCount: number;
}

export interface School {
    id: number;
    name: string;
    school_code: string;
    logo?: string;
}

export interface Religion {
    ID: number,
    Name: string;
}

export interface CreateReligionProps {
    initialData?: { name: string };
    onSave: (name: string) => void;
    onCancel: () => void;
}

export interface Medium {
    ID: number;
    Name: string;
}

export interface CreateMediumProps {
    initialData: { ID: number; Name: string } | null;
    onSave: (name: string) => void;
    onCancel: () => void;
}

export interface Group {
    ID: number;
    Name: string;
}

export interface CreateGroupProps {
    onSave: (name: string) => void;
    onCancel: () => void;
}

export interface Staff {
    id: number;
    name: string;
    isTeachingStaff: boolean;
    responsibility: string;
    subjects: string[];
    email: string;
    mobile: string;
    gender: string;
    dateOfBirth: string;
    address: {
        line1: string;
        city: string;
        state: string;
        pinCode: string;
        country: string;
    };
    section: string;
    imageUrl: string;
}

export interface CreateStaffProps {
    initialData: Staff | null;
    onSave: (staff: Staff) => void;
    onCancel: () => void;
}

export interface Class {
    id: number;
    name: string;
    section: string;
    mediumId: number;
    standardId: number;
    classStaffId: number;
    group_id: number;
    syllabusId: number;
    imageUrl?: string | null;
}

export interface CreateClassProps {
    initialData: Class | null;
    onSave: (classData: Class) => void;
    onCancel: () => void;
}

export interface Student {
    id: number;
    name: string;
    rollNumber: string;
    classId: number;
    dateOfBirth: string;
    gender: string;
    address: {
        line1: string;
        city: string;
        state: string;
        pinCode: string;
        country: string;
    };
    guardianName: string;
    guardianPhone: string;
    guardianEmail: string;
    imageUrl?: string;
}

export interface CreateStudentProps {
    initialData: Student | null;
    onSave: (student: Student) => void;
    onCancel: () => void;
}

export interface Religion {
    ID: number;
    Name: string;
}

export interface CreateReligionProps {
    initialData?: { name: string };
    onSave: (name: string) => void;
    onCancel: () => void;
}

export interface Caste {
    ID: number;
    Name: string;
    ReligionID: number;
}

export interface CreateCasteProps {
    initialData?: Caste;
    onSave: (name: string, religionId: number) => void;
    onCancel: () => void;
}

