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
    isSubjectTeacher: boolean;
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
    onSave: (
        name: string,
        hasGroup: boolean,
        sequence: number,
        sequenceNumber: number
    ) => void;
    onCancel: () => void;
    sections: Section[];
}

export interface Group {
    ID: number;
    Name: string;
}

export interface CreateGroupProps {
    initialData: Group | null;
    onSave: (name: string) => void;
    onCancel: () => void;
}

export interface ListControlsProps {
    searchTerm: string;
    setSearchTerm: (term: string) => void;
    viewMode: "grid" | "list";
    setViewMode: (mode: "grid" | "list") => void;
    itemCount: number;
}

export interface School {
    ID: number;
    name: string;
    code: string;
    city: string;
    isActive: boolean;
    isDeleted: boolean;
    logo?: string;
    syllabus: string[];
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
    schoolPrefix: string;
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
    id: number;
    name: string;
    isClassTeacher: boolean;
    ID?: number;
    Name?: string;
    ClassStaffId?: number;
    MediumId?: number;
    SyllabusId?: number;
    StandardId?: number;
    GroupID?: number;
}

export interface CreateClassProps {
    initialData: Class | null;
    onSave: (classData: ClassSubmitData) => void;
    onCancel: () => void;
}

export interface Student {
    id: number;
    name: string;
    rollNumber: string;
    class_id: number;
    marks?: StudentMark[];
    className: string;
    profilePic: string;
    idCardNumber: string;
    admissionNumber: string | null;
    dateOfAdmission: string;
    gender: string;
    dob: string;
    phone: string;
    email: string;
    house: string;
    street1: string;
    street2: string;
    city: string;
    state: string;
    pincode: string;
    country: string;
    bloodGroup: string;
    remarks: string;
    religion: string;
    caste: string;
    reservationCategory: string;
    isPwd: boolean;
    nationality: string;
    parentsInfo: ParentInfo[];
}

export interface CreateStudentProps {
    initialData: StudentFormValues | null;
    onSave: (student: StudentFormValues) => void;
    onCancel: () => void;
}

export interface ParentInfo {
    parentId: number;
    relationshipWithStudent: string;
    name: string;
    phone: string;
    email: string;
}

export interface StudentFormValues {
    id?: number;
    name: string;
    dateOfAdmission: string;
    gender: string;
    dob: string;
    phone: string;
    email: string;
    street1: string;
    city: string;
    state: string;
    pincode: string;
    country: string;
    classID: number;
    idCardNumber: string | null;
    admissionNumber: string | null;
    house: string;
    street2: string;
    bloodGroup: string | null;
    remarks: string;
    religion: string;
    caste: string;
    reservationCategory: string;
    isPWD: boolean;
    nationality: string;
    parentsInfo: ParentInfo[];
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

// First, let's define a base interface for common staff properties
interface BaseStaffProps {
    name: string;
    gender: "male" | "female" | "other";
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
}

// Interface for creating staff
export interface CreateStaffPayload extends BaseStaffProps {
    id_card_number: string;
    profile_pic?: File;
}

// Interface for staff data from API
export interface Staff extends BaseStaffProps {
    id: number;
    staffId: number;
    id_card_number: string | null;
    profile_pic_link: string;
    current_role?: string;
    privilegeType: string;
}

// Interface for privileged staff data
export interface PrivilegedStaff {
    staffId: number;
    name: string;
    idCardNumber: string;
    mobile: string;
    privilegeType: string;
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

export interface WorkingDay {
    id: number;
    group_name: string;
    days: number[];
}

export interface CreateWorkingDayProps {
    initialData: WorkingDay | null;
    onSave: (data: { group_name: string; days: number[] }) => void;
    onCancel: () => void;
}

export interface Parent {
    id?: number;
    name: string;
    phone: string;
    email?: string;
}

export interface ParentResponse {
    status: boolean;
    resp_code: string;
    data?: {
        existingParent?: Parent;
    };
    message?: string;
}

export interface ClassesTabProps {
    setShowTimetable: (show: boolean) => void;
    setSelectedClass: (classItem: ClassItem | null) => void;
}

export interface ClassSubject {
    id: string;
    name: string;
}

export interface ClassItem {
    id: string;
    name: string;
    section: string;
    studentCount: number;
    isClassTeacher: boolean;
    subjectsTaught: string[];
}

// Add these exam and attendance related interfaces
export interface ExamScore {
    examName: string;
    subject: string;
    maxMarks: number;
    marksObtained: number;
    isPassed: boolean;
    date: string;
}

export interface UnitTestScore {
    testName: string;
    subject: string;
    maxMarks: number;
    marksObtained: number;
    isPassed: boolean;
    date: string;
}

export interface AttendanceRecord {
    month: string;
    totalDays: number;
    presentDays: number;
    percentage: number;
}

// Mock data interfaces
export const mockExamScores: ExamScore[] = [
    {
        examName: "Onam Exam",
        subject: "Mathematics",
        maxMarks: 100,
        marksObtained: 85,
        isPassed: true,
        date: "2024-03-15",
    },
    // ... other exam scores
];

export const mockUnitTestScores: UnitTestScore[] = [
    {
        testName: "Unit Test 1",
        subject: "Mathematics",
        maxMarks: 50,
        marksObtained: 45,
        isPassed: true,
        date: "2024-02-10",
    },
    // ... other unit test scores
];

export const mockAttendanceRecords: AttendanceRecord[] = [
    {
        month: "January",
        totalDays: 22,
        presentDays: 20,
        percentage: 90.9,
    },
    // ... other attendance records
];

// Add these interfaces for Announcements
export interface Announcement {
    id: string;
    title: string;
    content: string;
    sender: {
        name: string;
        role: string;
        avatar?: string;
    };
    target: {
        type: "section" | "class";
        value: string;
    };
    date: string;
    attachments?: { name: string; type: string; size: string }[];
}

// Add these interfaces for HomeWorkouts
export interface Homework {
    id: number;
    subjectId: number;
    classId: number;
    homeworkDesc: string;
    dueDate: string;
}

// Add these interfaces for TakeAttendance
export interface AttendanceStudent {
    id: string;
    name: string;
    rollNumber: string;
    attendance: "a" | "f" | "m" | "e" | null;
}

export interface AttendanceData {
    student_id: string;
    status: "a" | "f" | "m" | "e" | null;
}

export interface TakeAttendanceProps {
    classInfo: {
        name: string;
        section: string;
        id: string;
    };
    onClose: () => void;
}

// Add these interfaces for TimeTable
export interface Period {
    periodIndex: number;
    subjectName: string;
    staffName: string;
}

export interface TimetableDay {
    weekDay: number;
    periods: Period[];
}

export interface TimeTableProps {
    onBack: () => void;
    classId: string;
}

// Add these interfaces for UnitTests
export interface UnitTest {
    id: number;
    subject_id: number;
    class_id: number;
    portion_desc: string;
    date: string;
    is_completed: boolean;
    is_postponed_indefinitely: boolean;
    max_mark: number;
    pass_mark: number;
    has_submitted_marks: boolean;
    is_exam_cancelled: boolean;
    created_staff_id: number;
    FKSubjectID: {
        Name: string;
    };
}

// Add these interfaces for StudentDetails
export interface StudentDetailsProps {
    student: Student;
    onBack: () => void;
    onEdit: (student: Student) => void;
    onDelete: (id: number) => void;
}

// Add these interfaces for UnitTests
export interface TestMark {
    student_id: number;
    test_id: number;
    marks: number;
    is_absent: boolean;
}

export interface PublishStatus {
    is_published: boolean;
    published_at?: string;
}

// Add this interface for TimeTable
export interface TimetableData {
    id: number;
    classId: number;
    className: string;
    activeFrom: string;
    createdAt: string;
    updatedAt: string;
    isActive: boolean;
    lastUpdatedBy: number;
    lastUpdatedStaffName: string;
    timetableDays: TimetableDay[];
}

// Add these interfaces for UnitTests
export interface Student {
    id: number;
    name: string;
    rollNumber: string;
    class_id: number;
    street1: string;
    street2: string;
    city: string;
    state: string;
    pincode: string;
    country: string;
    bloodGroup: string;
    profilePic: string;
    remarks: string;
    religion: string;
    caste: string;
    reservationCategory: string;
    isPwd: boolean;
    nationality: string;
    className: string;
    parentsInfo: ParentInfo[];
}

// Add these interfaces for StudentList
export interface StudentListProps {
    fromClass?: any;
    returnTab?: string;
}

// Add these interfaces for Exams
export interface Exam {
    ID: number;
    Name: string;
    AcademicYear: string;
    CreatedBy: number;
    UpdatedBy: number;
    gradeSystemId: number;
    UpdateAt: string;
    CreatedAt: string;
    subjectMaxMarks?: SubjectMaxMarks[];
}

export interface GradeSystem {
    category_id: number;
    base_percentage: number;
    grade_label: string;
}

export interface Class {
    id: number;
    name: string;
    isClassTeacher: boolean;
}

export interface Subject {
    id: number;
    name: string;
    isSubjectTeacher: boolean;
}

export interface SubjectMaxMarks {
    subjectId: number;
    maxMarks: number;
}

// Add this interface for attendance data
export interface AttendanceData {
    day_wise_attendance: {
        [key: string]: "P" | "A" | "H" | "HDN" | "HDM" | "SH";
    }[];
    total_a_days: number;
    total_hd_days: number;
    total_p_days: number;
    total_w_days: number;
}

// Add this interface for chart data
export interface ChartData {
    name: string;
    value: number;
    color: string;
}

// Add the StudentMark interface
export interface StudentMark {
    subjectId: number;
    marks: number;
    isAbsent: boolean;
}

// Update the Student interface with consistent property modifiers
export interface Student {
    id: number;
    name: string;
    rollNumber: string;
    class_id: number;
    marks?: StudentMark[];
    className: string;
    profilePic: string;
    idCardNumber: string;
    admissionNumber: string | null;
    dateOfAdmission: string;
    gender: string;
    dob: string;
    phone: string;
    email: string;
    house: string;
    street1: string;
    street2: string;
    city: string;
    state: string;
    pincode: string;
    country: string;
    bloodGroup: string;
    remarks: string;
    religion: string;
    caste: string;
    reservationCategory: string;
    isPwd: boolean;
    nationality: string;
    parentsInfo: ParentInfo[];
}

// Update ParentInfo interface
export interface ParentInfo {
    parentId: number;
    relationshipWithStudent: string;
    name: string;
    phone: string;
    email: string;
}

// Add these interfaces for exam-related types
export interface ExamStudent {
    id: number;
    name: string;
    rollNo: string;
    marks: StudentMark[];
}

export interface StudentMark {
    subjectId: number;
    marks: number;
    isAbsent: boolean;
}

export interface TimeTableData {
    id: number;
    classId: number;
    className: string;
    activeFrom: string;
    createdAt: string;
    updatedAt: string;
    isActive: boolean;
    lastUpdatedBy: number;
    lastUpdatedStaffName: string;
    timetableDays: TimetableDay[];
}
