import React, { useEffect } from "react";
import { TextField, Button, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import { AcademicYear } from "../../types/Types";
import { message } from "antd";
import { TermExam } from "../../types/Types";

interface CreateTermExamProps {
    initialData?: TermExam | null;
    academicYears: AcademicYear[];
    onSave: (data: { Name: string; AcademicYear: number }) => void;
    onCancel: () => void;
}

const CreateTermExams: React.FC<CreateTermExamProps> = ({
    initialData,
    academicYears,
    onSave,
    onCancel
}) => {
    const [name, setName] = React.useState(initialData?.Name || "");
    const [academicYearId, setAcademicYearId] = React.useState<number>();

    useEffect(() => {
        if (initialData) {

            const matchingYear = academicYears.find(year => year.name === initialData.AcademicYear);
            if (matchingYear) {
                setAcademicYearId(matchingYear.id);
            }
        } else {

            const currentYear = academicYears.find(year => year.is_current);
            if (currentYear) {
                setAcademicYearId(currentYear.id);
            }
        }
    }, [academicYears, initialData]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!academicYearId) {
            message.error("Please select an academic year");
            return;
        }

        onSave({
            Name: name,
            AcademicYear: academicYearId
        });
    };

    return (
        <div className="p-4">
            <h2 className="text-xl font-bold mb-4">
                {initialData?.id ? "Edit Term Exam" : "Create New Term Exam"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <TextField
                    fullWidth
                    label="Exam Name"
                    variant="outlined"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />

                <FormControl fullWidth required>
                    <InputLabel>Academic Year</InputLabel>
                    <Select
                        value={academicYearId || ''}
                        label="Academic Year"
                        onChange={(e) => setAcademicYearId(Number(e.target.value))}
                    >
                        {academicYears?.map((year) => (
                            <MenuItem key={year.id} value={year.id}>
                                {year.name} {year.is_current && "(Current)"}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <div className="flex justify-end space-x-2 mt-4">
                    <Button variant="outlined" onClick={onCancel}>
                        Cancel
                    </Button>
                    <Button type="submit" variant="contained" color="primary">
                        {initialData?.id ? "Update" : "Create"}
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default CreateTermExams;
