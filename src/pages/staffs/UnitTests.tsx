/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import { Plus, BookOpenCheck } from "lucide-react";
import EmptyState from "../../components/EmptyState";
import { UnitTest, PublishStatus, Subject, Class } from "../../types/Types";
import {
    getClasses,
    getSubjectsOfStaff,
    createUnitTest,
    getUnitTest,
    updateUnitTest,
    postponeUnitTest,
    cancelUnitTest,
    completeUnitTest,
} from "../../api/staffs";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store/store";
import { message } from "antd";
import MarksModal from "../../components/unitTest/MarksModal";
import PreviewModal from "../../components/unitTest/PreviewModal";
// import DetailsModal from "../../components/unitTest/DetailsModal";
import CreateModal from "../../components/unitTest/CreateModal";
import { UnitTestData } from "../../types/StateTypes";
import UnitTestCard from "../../components/unitTest/UnitTestCard";

const UnitTests = () => {
    const { staffInfo } = useSelector((state: RootState) => state.staffInfo);
    const [unitTests, setUnitTests] = useState<UnitTest[]>([]);
    const [classes, setClasses] = useState<Class[]>([]);
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [selectedTest, setSelectedTest] = useState<UnitTest | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [, setIsDetailsModalOpen] = useState(false);
    const [newTest, setNewTest] = useState<UnitTestData>({
        subject_id: "",
        class_id: "",
        portion_desc: "",
        date: "",
        max_mark: "",
        pass_mark: "",
    });
    const [isManageMarksOpen, setIsManageMarksOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
    const [publishStatus] = useState<PublishStatus>({
        is_published: false,
    });

    useEffect(() => {
        const fetchClasses = async () => {
            try {
                const fetchedClasses = await getClasses({
                    criteria: "all-in-my-sections",
                });
                setClasses(fetchedClasses);
            } catch (error) {
                console.error("Error fetching classes:", error);
            }
        };

        fetchClasses();
    }, []);

    useEffect(() => {
        const fetchSubjects = async () => {
            try {
                const fetchedSubjects = await getSubjectsOfStaff();
                setSubjects(fetchedSubjects);
            } catch (error) {
                console.error("Error fetching subjects of staff:", error);
            }
        };

        fetchSubjects();
    }, []);

    const fetchUnitTests = async () => {
        try {
            const fetchedUnitTests = await getUnitTest({
                staff_unit_test: true,
                page: 1,
                limit: 20,
            });
            setUnitTests(fetchedUnitTests);
        } catch (error) {
            console.error("Error fetching unit tests:", error);
        }
    };

    useEffect(() => {
        fetchUnitTests();
    }, []);

    const handleCreateOrUpdate = async () => {
        if (
            !newTest.subject_id ||
            !newTest.class_id ||
            !newTest.portion_desc ||
            !newTest.date ||
            !newTest.max_mark ||
            !newTest.pass_mark
        ) {
            message.error("All fields are required.");
            return;
        }

        if (Number(newTest.max_mark) <= 0 || Number(newTest.pass_mark) < 0) {
            message.error(
                "Max mark must be greater than 0 and pass mark cannot be negative."
            );
            return;
        }

        try {
            if (isEditMode && selectedTest) {
                const updatedTestData = {
                    unit_test_id: selectedTest.id,
                    subject_id: Number(newTest.subject_id),
                    class_id: Number(newTest.class_id),
                    portion_desc: newTest.portion_desc,
                    date: newTest.date,
                    max_mark: Number(newTest.max_mark),
                    pass_mark: Number(newTest.pass_mark),
                };

                const updatedTest = await updateUnitTest(updatedTestData);
                if (updatedTest) {
                    setUnitTests((tests) =>
                        tests.map((test) =>
                            test.id === updatedTest.id ? updatedTest : test
                        )
                    );
                    setSelectedTest(updatedTest);
                    message.success("Updated unit test");
                }
            } else {
                const unitTestData = {
                    subject_id: Number(newTest.subject_id),
                    class_id: Number(newTest.class_id),
                    portion_desc: newTest.portion_desc,
                    date: newTest.date,
                    max_mark: Number(newTest.max_mark),
                    pass_mark: Number(newTest.pass_mark),
                    created_staff_id: staffInfo?.staffID as number,
                };

                const createdUnitTest = await createUnitTest(unitTestData);
                if (createdUnitTest) {
                    fetchUnitTests();
                }
            }

            setNewTest({
                subject_id: "",
                class_id: "",
                portion_desc: "",
                date: "",
                max_mark: "",
                pass_mark: "",
            });
            setIsModalOpen(false);
            setIsEditMode(false);
            fetchUnitTests();
            message.success("Unit test created");
        } catch (error) {
            if (error instanceof Error) {
                message.error(
                    `Error ${isEditMode ? "updating" : "creating"} unit test `
                );
            }
        }
    };

    useEffect(() => {
        if (selectedTest && isEditMode) {
            handleEdit();
        }
    }, [selectedTest, isEditMode]);

    const handleEdit = () => {
        if (!selectedTest) return;

        setNewTest({
            subject_id: String(selectedTest.subject_id),
            class_id: String(selectedTest.class_id),
            portion_desc: selectedTest.portion_desc,
            date: selectedTest.date.split("T")[0],
            max_mark: String(selectedTest.max_mark),
            pass_mark: String(selectedTest.pass_mark),
        });
        setIsEditMode(true);
        setIsModalOpen(true);
        setIsDetailsModalOpen(false);
    };

    const handleStatusChange = async (testId: number, status: string) => {
        try {
            if (status === "completed") {
                await completeUnitTest(testId);
            } else if (status === "postponed") {
                await postponeUnitTest(testId);
            } else if (status === "cancelled") {
                await cancelUnitTest(testId);
            }
            fetchUnitTests();
        } catch (error) {
            console.log(error);
            message?.error(`Cannot change status to ${status}`);
        }
    };

    const modalTitle = isEditMode ? "Edit Unit Test" : "Schedule New Unit Test";
    const modalButtonText = isEditMode
        ? "Update Unit Test"
        : "Create Unit Test";

    return (
        <div className="h-[calc(100vh-2rem)] flex flex-col space-y-4">
            <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow-sm">
                <h1 className="text-xl font-bold text-gray-800">Unit Tests</h1>
                <button
                    onClick={() => {
                        setNewTest({
                            subject_id: "",
                            class_id: "",
                            portion_desc: "",
                            date: "",
                            max_mark: "",
                            pass_mark: "",
                        });
                        setIsEditMode(false);
                        setIsModalOpen(true);
                    }}
                    className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600
                    transition-colors flex items-center gap-2"
                >
                    <Plus size={20} />
                    Schedule Unit Test
                </button>
            </div>

            <div className="space-y-4 max-h-full overflow-y-auto">
                {unitTests.length === 0 ? (
                    <EmptyState
                        icon={<BookOpenCheck size={48} />}
                        title="No Unit Tests Found"
                        message="Get started by scheduling your first unit test. Click the 'Schedule Unit Test' button above."
                    />
                ) : (
                    unitTests.map((test) => (
                        <UnitTestCard
                            key={test.id}
                            {...{
                                test,
                                setSelectedTest,
                                handleStatusChange,
                                setIsPreviewModalOpen,
                                setIsManageMarksOpen,
                                publishStatus,
                                setIsEditMode,
                                subjects,
                            }}
                        />
                    ))
                )}
            </div>

            {isModalOpen && (
                <CreateModal
                    {...{
                        classes,
                        handleCreateOrUpdate,
                        newTest,
                        setNewTest,
                        setIsModalOpen,
                        subjects,
                        modalButtonText,
                        modalTitle,
                    }}
                />
            )}

            {/* {isDetailsModalOpen && selectedTest && <DetailsModal />} */}

            {/* Marks Management Modal */}
            {/* Add your marks management modal here */}

            {isPreviewModalOpen && selectedTest && (
                <PreviewModal
                    selectedTest={selectedTest}
                    setIsPreviewModalOpen={setIsPreviewModalOpen}
                    publishStatus={
                        selectedTest?.status === "Published" ? true : false
                    }
                />
            )}
            {isManageMarksOpen && selectedTest && (
                <MarksModal
                    selectedTest={selectedTest}
                    setIsManageMarksOpen={setIsManageMarksOpen}
                    subjects={subjects}
                />
            )}
        </div>
    );
};

export default UnitTests;
