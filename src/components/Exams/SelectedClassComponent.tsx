import { Class, Exam } from "../../types/Types";
import ClassTeacherView from "./ClassTeacherView";
import SubjectTeacherView from "./SubjectTeacherView";

type PropType = {
    selectedClass: Class;
    selectedExam: Exam;
    setSelectedClass: React.Dispatch<React.SetStateAction<Class | null>>;
};

const SelectedClassComponent = ({
    selectedClass,
    selectedExam,
    setSelectedClass,
}: PropType) => {
    return selectedClass?.isClassTeacher ? (
        <ClassTeacherView
            selectedClass={selectedClass}
            selectedExam={selectedExam}
            onBack={() => setSelectedClass(null)}
        />
    ) : (
        <SubjectTeacherView
            selectedClass={selectedClass}
            selectedExam={selectedExam}
            onBack={() => setSelectedClass(null)}
        />
    );
};

export default SelectedClassComponent;
