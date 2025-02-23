/* eslint-disable @typescript-eslint/no-explicit-any */
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
    schoolHeadAlias: string;
    schoolDeputyHeadAlias: string;
}

export interface Section {
    id: number;
    name: string;
    sectionCode: string;
}

export interface CreateSectionProps {
    initialData: Section | null;
    onSave: (data: { sectionName: string; sectionCode: string }) => void;
    onCancel: () => void;
}

export interface Subject {
    id: number;
    name: string;
    code?: string;
    defaultMaxMarks: number;
    hasTermExam: boolean;
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
    standards: AllocationStandard[];
    totalSubjects?: number;
}

export interface CreateSyllabusProps {
    initialData: Syllabus | null;
    onSave: (syllabus: Syllabus) => void;
    onCancel: () => void;
}

export interface Medium {
    ID: number;
    Name: string | null;
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
    id: number | null;
    name: string | null;
    subjects: Subject[];
}

export interface CreateGroupProps {
    initialData: Group | null;
    onSave: (name: string) => void;
    onCancel: () => void;
}

export interface TogglebarProps {
    searchTerm: string;
    setSearchTerm: (term: string) => void;
    viewMode: "grid" | "list";
    setViewMode: (mode: "grid" | "list") => void;
    itemCount: number;
    onSort?: () => void;
    onPrint?: () => void;
    showDeleted?: boolean;
    setShowDeleted?: (show: boolean) => void;
    onSelectAll?: () => void;
    selectedCount?: number;
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
    Name: string | null;
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
    mediumId: number;
    standardId: number;
    classStaffId: number;
    group_id?: number;
    syllabusId: number;
    academicYearId: number;
}

export interface Class {
    id: number;
    name: string;
    classStaffId: number;
    classStaffName: string;
    mediumId: number;
    mediumName: string;
    syllabusId: number;
    syllabus: string;
    standardId: number;
    standard: string;
    groupId?: number;
    group?: string;
    academicYearID: number;
    academicYearName: string;
    studentCount: number;
    // Keep these for backward compatibility
    ID?: number;
    Name?: string;
    ClassStaffId?: number;
    MediumId?: number;
    SyllabusId?: number;
    StandardId?: number;
    GroupID?: number;
    AcademicYearId?: number;
    RollNumsLastSetBy?: null;
}

export interface CreateClassProps {
    initialData: Class | null;
    onSave: (classData: ClassSubmitData) => void;
    onCancel: () => void;
}

// First, define the parent info interfaces
export interface ParentDisplayInfo {
    parentId: number;
    relationshipWithStudent: string;
    name: string;
    phone: string;
    email: string;
}

export interface ParentFormInfo {
    parentId: number;
    relationshipWithStudent: string;
}

export interface Student {
    id: number;
    name: string;
    rollNumber: string | null;
    classID: number;
    className: string;
    profilePic: string;
    idCardNumber: string | null;
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
    parentInfo: ParentInfo[];
}

// Keep StudentFormValues with required parentsInfo
export interface StudentFormValues {
    id?: number;
    name: string;
    dateOfAdmission: string;
    rollNumber: number | null;
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
    parentsInfo: ParentFormInfo[];
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
    regNumber: number;
    gender: "male" | "female" | "other";
    dob: string;
    mobile: string;
    email: string;
    bloodGroup: string;
    religion: string;
    caste: string;
    pwd: boolean;
    isTeachingStaff: boolean;
    remarks?: string;
    category: string;
    house?: string;
    street1: string;
    street2?: string;
    city: string;
    state: string;
    pincode: string;
    country: string;
    subjectIDs?: number[];
    sectionIDs?: number[];
}

// Interface for creating staff
export interface CreateStaffPayload extends BaseStaffProps {
    regNumber: number;
    idCardNumber: string;
    subjectIDs?: number[];
    sectionIDs?: number[];
}

// Interface for staff data from API
export interface Staff extends BaseStaffProps {
    id?: number;
    regNumber: number;
    staffId: number;
    idCardNumber: string | null;
    profilePicLink: string;
    currentRole?: string;
    privilegeType: string;
    subjectIDs: number[];
    subjects: { id: number; name: string }[];
    sectionIDs: number[];
    sections: { id: number; name: string }[];
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
    subjectsTaught: string[] | null;
}

export interface ClassesTabProps {
    setShowTimetable: (show: boolean) => void;
    selectedClass: ClassItem | null;
    setSelectedClass: (cls: any) => void;
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
    subjectID: number;
    classID: number;
    homeworkDesc: string;
    dueDate: string;
    subjectId: number;
    classId: number;
    subjectName: string;
    className: string;
}

// Add these interfaces for TakeAttendance
export interface AttendanceStudent {
    id: string;
    name: string;
    rollNumber: string;
    attendance: "a" | "m" | "e" | "f" | null;
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
    classId: number | string;
}

// Add these interfaces for UnitTests
export interface UnitTest {
    id: number;
    subject_id: number;
    class_id: number;
    portion_desc: string;
    date: string;
    max_mark: number;
    pass_mark: number;
    is_mark_added: boolean;
    status:
    | "Completed"
    | "Not started"
    | "Cancelled"
    | "Postponed Indefinitely"
    | "Published";
    created_staff_id: number;
    FKSubjectID: {
        Name: string;
    };
}

// Add these interfaces for StudentDetails
export interface StudentDetailsProps {
    studentId: string;
    onBack: () => void;
    onEdit: (student: Student) => void;
    onDelete: (id: number) => void;
}

// Add these interfaces for UnitTests
export interface TestMark {
    student_id: string;
    unit_test_mark_id: number;
    mark: number;
    isAbsent: boolean;
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
    // rollNumber: string;
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
    parentInfo: ParentInfo[];
}

// Add these interfaces for StudentList
export interface StudentListProps {
    fromClass?: any;
    returnTab?: string;
}

// Add these interfaces for Exams
export interface Exam {
    id: number;
    Name: string;
    AcademicYear: string;
    created_by: number;
    UpdatedBy: number;
    Status: string;
    UpdateAt: string;
    CreatedAt: string;
    subjectMaxMarks?: SubjectMaxMarks[];
}

export interface GradeSystem {
    id: number;
    category_id: number;
    base_percentage: number;
    grade_label: string;
    is_failed?: boolean;
}

export interface Class {
    id: number;
    name: string;
    isClassTeacher: boolean;
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
    name: string;
    update_at: string;
    student_id: number;
    roll_number: number;
    is_failed: boolean;
    is_absent: boolean;
    class_id: number;
}

export interface Student {
    id: number;
    name: string;
    class_id: number;
    marks?: StudentMark[];
    rollNumber: string | null;
    className: string;
    profilePic: string;
    idCardNumber: string | null;
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
    parentsInfo: ParentDisplayInfo[];
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

// Add this interface for CreateStudents component
export interface CreateStudentProps {
    initialData: StudentFormValues | null;
    onSave: (student: StudentFormValues) => void;
    onCancel: () => void;
}

export interface CreateGradeProps {
    initialData?: { id?: number; name: string };
    onSave: (name: string) => void;
    onSaveBoundary?: (data: {
        category_id: number;
        base_percentage: number;
        grade_label: string;
    }) => void;
    onCancel: () => void;
}

// Add these interfaces for grade management
export interface Grade {
    id: number;
    name: string;
}

export interface GradeSystem {
    id: number;
    grade_label: string;
    base_percentage: number;
    category_id: number;
}

export interface CreateBoundaryProps {
    gradeId: number;
    initialData?: {
        id: number;
        base_percentage: number;
        grade_label: string;
    };
    onSave: (data: {
        id?: number;
        category_id: number;
        base_percentage: number;
        grade_label: string;
    }) => void;
    onCancel: () => void;
}

export interface BoundaryFormData {
    base_percentage: string;
    grade_label: string;
}

export interface GradeSnackbar {
    open: boolean;
    message: string;
    severity: "success" | "error";
    position: {
        vertical: "top";
        horizontal: "center";
    };
}

// Add these interfaces if they don't exist
export interface SchoolInfo {
    name: string;
    address: string;
    phone: string;
    email: string;
    syllabus: string;
    isActive: boolean;
    logoUrl?: string;
    schoolPrefix: string;
}

// Or if you're using an interface:
interface FileLink {
    link: string;
    fileType: "Image" | "Document" | "Audio" | "Video";
}

export interface AnnouncementData {
    id: number;
    title: string;
    body: string;
    author: string;
    authorRole: string;
    author_profile_pic: string;
    fileLinks: FileLink[] | null;
    created_at: string;
    audienceCategoryIDs: number[];
    audienceCategoryType: string;
    audienceCategoryNames: string[];
    authorID: number;
    deleted_at: null | string;
    is_deleted: boolean;
}

export interface SubjectAllocationResponse {
    status: boolean;
    data: {
        syllabuses: Syllabus[];
    };
}

export interface SubjectAllocationRequest {
    syllabusId: number;
    standardId: number;
    groupId: number | null;
    subjectAllocations: {
        subjectId: number;
        isElective: boolean;
        hasTermExam: boolean;
        defaultMaxMarks: number;
    }[];
}

export interface AllocationStandard {
    id: number;
    name: string;
    groups: Group[];
    totalSubjects?: number;
}

export interface RemoveSubjectAllocationParams {
    subjectId: number;
    standardId: number;
    syllabusId: number;
    groupId?: number | null;
}

// Modal Props Types
export interface SubjectSelectionModalProps {
    open: boolean;
    onClose: () => void;
    availableSubjects: SchoolSubject[];
    onSubjectSelect: (subject: Subject) => void;
}

export interface GroupSelectionModalProps {
    open: boolean;
    onClose: () => void;
    groups: SchoolGroup[];
    onGroupSelect: (group: Group) => void;
}

// Add these if they don't exist already
export interface SchoolGroup {
    ID: number;
    Name: string;
}

export interface SchoolSubject {
    id: number;
    name: string;
    code: string;
}

// Update the existing Subject interface if needed
export interface Subject {
    id: number;
    name: string;
    code?: string;
    defaultMaxMarks: number;
    hasTermExam: boolean;
}

// Update the existing Group interface if needed
export interface Group {
    id: number | null;
    name: string | null;
    subjects: Subject[];
}

// Update the existing AllocationStandard interface if needed
export interface AllocationStandard {
    id: number;
    name: string;
    groups: Group[];
    totalSubjects?: number;
}

export interface Syllabus {
    id: number;
    name: string;
    standards: AllocationStandard[];
    totalSubjects?: number;
}

interface FileLink {
    link: string;
    fileType: "Image" | "Document" | "Audio" | "Video";
}

export interface Privilege {
    privilege: string;
    alias: string;
}

export interface PrivilegedStaffResponse {
    staffId: number;
    name: string;
    idCardNumber: string;
    mobile: string;
    specialPrivileges: Privilege[];
}

export interface TermExam {
    id: number;
    Name: string;
    AcademicYear: string;
    Status: string;
    CreatedAt: string;
}

export interface AcademicYear {
    id: number;
    name: string;
    is_current: boolean;
}

export interface TermExamStandard {
    id: number;
    term_exam_id: number;
    grade_type_id: number;
    grade_name: string;
    standard_name: string;
}

export interface Timetable {
    id: number;
    classId: number;
    activeFrom: string;
    isActive: boolean;
    className: string;
}
