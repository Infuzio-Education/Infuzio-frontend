import { ClassItem } from "./Types";

export interface ClassesTabState {
    loading: boolean;
    error: string;
    classes: ClassItem[];
    showAttendance: boolean;
}

export interface StaffAttendanceData {
    total_w_days: number;
    total_p_days: number;
    total_a_days: number;
    total_hd_days: number;
    DayWiseAttendance: Array<{
        day: number;
        status: "f" | "a" | "m" | "e";
    }> | null;
}

export interface UnitTestData {
    subject_id: string;
    class_id: string;
    portion_desc: string;
    date: string;
    max_mark: string;
    pass_mark: string;
}
