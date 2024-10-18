
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
    id: number;
    name: string;
    section_code: string;
}


export interface CreateSectionProps {
    initialData: Section | null;
    onSave: (success: boolean) => void;
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
    sequence: number;
}

export interface CreateStandardProps {
    initialData: Standard | null;
    onSave: (name: string, hasGroup: boolean, sequence: number) => void;
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
    id: number,
    name: string;
}

export interface CreateReligionProps {
    initialData?: { name: string };
    onSave: (name: string) => void;
    onCancel: () => void;
}

