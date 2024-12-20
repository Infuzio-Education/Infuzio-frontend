import { ClassItem } from "./Types";

export interface ClassesTabState {
    loading: boolean;
    error: string;
    classes: ClassItem[];
    showAttendance: boolean;
}
