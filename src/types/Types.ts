export interface Syllabus {
    ID: number;
    Name: string;
}

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
    code: string;
    classes: string[];
}


export interface CreateSectionProps {
    initialData: Section | null;
    onSave: (section: Section) => void;
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

