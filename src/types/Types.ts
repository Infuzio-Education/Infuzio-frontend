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
    syllabusIDs: number[];  // Keep this as an array for consistency with the backend
    address: SchoolAddress;
    googleMapsLink: string;
    phone: string;
    email: string;
}