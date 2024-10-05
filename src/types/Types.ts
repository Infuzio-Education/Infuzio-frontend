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