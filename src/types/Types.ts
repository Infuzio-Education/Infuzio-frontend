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
    id: number;
    name: string;
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
    SectionId: number;
    SequenceNumber: number;
    section: string;
}

export interface CreateStandardProps {
    initialData: Standard | null;
    onSave: (name: string, hasGroup: boolean, sequence: number, sequenceNumber: number) => void;
    onCancel: () => void;
    sections: Section[];
}

export interface Group {
    ID: number;
    Name: string;
}

export interface CreateGroupProps {
    initialData: Group | null
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
    syllabus: string;
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


export interface CreateStaffProps {
    initialData: Staff | null;
    onSave: (staff: Staff) => void;
    onCancel: () => void;
    schoolPrefix: string
}

export interface ClassSubmitData {
    id?: number;
    name: string;
    section: string;
    mediumId: number;
    standardId: number;
    classStaffId: number;
    group_id: number;
    syllabusId: number;
}

export interface Class {
    ID: number;
    Name: string;
    ClassStaffId: number;
    MediumId: number;
    SyllabusId: number;
    StandardId: number;
    GroupID: number;
    deleted_at?: string;
}

export interface CreateClassProps {
    initialData: Class | null;
    onSave: (classData: ClassSubmitData) => void;
    onCancel: () => void;
}

export interface Student {
    phone: number;
    email: string;
    idCardNumber: number;
    id: number;
    name: string;
    rollNumber: string;
    classID: number;
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

export interface StaffAddress {
    street1: string;
    street2?: string;
    city: string;
    state: string;
    pinCode: string;
    country: string;
}

export interface CreateStaffPayload {
    id_card_number: string;
    name: string;
    gender: 'male' | 'female' | 'other';
    dob: string;
    mobile: string;
    email: string;
    blood_group: string;
    religion: string;
    caste: string;
    category: string;
    pwd: boolean;
    is_teaching_staff: boolean;
    remarks?: string;
    street1: string;
    street2?: string;
    city: string;
    state: string;
    pincode: string;
    country: string;
    responsibility?: string;
    subjects?: string[];
    section?: string;
    ID: number,
    profile_pic_link: string
}

export interface Staff extends Omit<CreateStaffPayload, 'profile_pic'> {
    ID: number;
    profile_pic_link: string;
}


export interface GlobalSyllabus {
    id: number;
    name: string;
    isCustomSyllabus: boolean;
    creatorSchoolCode: string | null;
}

export interface SyllabusData {
    global: GlobalSyllabus[];
    custom: null;
}


export interface SchoolStats {
    totalStudents: number;
    totalClasses: number;
    totalParents: number;
    totalStaffs: number;
}

