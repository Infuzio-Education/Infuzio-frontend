import React, { useState, useEffect } from 'react';
import { TextField, Button } from '@mui/material';
import CustomTabs from '../../components/CustomTabs';

interface Day {
    id: number;
    name: string;
    shortName: string;
}

interface CreateWorkingDaysProps {
    initialData: {
        id: number;
        group_name: string;
        days: number[];
    } | null;
    onSave: (data: { group_name: string; days: number[] }) => void;
    onCancel: () => void;
}

const days: Day[] = [
    { id: 1, name: 'Monday', shortName: 'Mon' },
    { id: 2, name: 'Tuesday', shortName: 'Tue' },
    { id: 3, name: 'Wednesday', shortName: 'Wed' },
    { id: 4, name: 'Thursday', shortName: 'Thu' },
    { id: 5, name: 'Friday', shortName: 'Fri' },
    { id: 6, name: 'Saturday', shortName: 'Sat' },
    { id: 7, name: 'Sunday', shortName: 'Sun' },
    { id: 8, name: 'Second Saturday', shortName: '2nd Sat' },
];

const CreateWorkingDays: React.FC<CreateWorkingDaysProps> = ({ initialData, onSave, onCancel }) => {
    const [groupName, setGroupName] = useState(initialData?.group_name || '');
    const [selectedDays, setSelectedDays] = useState<number[]>(initialData?.days || []);

    useEffect(() => {
        if (initialData) {
            setGroupName(initialData.group_name);
            setSelectedDays(initialData.days);
        }
    }, [initialData]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({
            group_name: groupName,
            days: selectedDays
        });
    };

    const handleDayClick = (dayId: number) => {
        setSelectedDays(prev =>
            prev.includes(dayId)
                ? prev.filter(id => id !== dayId)
                : [...prev, dayId]
        );
    };

    return (
        <div className="flex flex-col min-h-screen">
            <div className="flex-grow p-4">
                <h2 className="text-xl font-bold mb-4">
                    {initialData ? 'Edit Working Days' : 'Create Working Days'}
                </h2>
                <form onSubmit={handleSubmit} className="flex flex-col h-full">
                    <div className="flex-grow">
                        <TextField
                            label="Group Name"
                            variant="outlined"
                            fullWidth
                            value={groupName}
                            onChange={(e) => setGroupName(e.target.value)}
                            required
                            placeholder="e.g., Mon-Fri"
                            className="mb-4"
                        />

                        <CustomTabs labels={['Working Days']}>
                            <div className="mt-4">
                                <h3 className="text-lg font-medium text-gray-700 mb-4">Select Working Days</h3>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                    {days.map((day) => (
                                        <div
                                            key={day.id}
                                            onClick={() => handleDayClick(day.id)}
                                            className={`
                                                p-3 rounded-lg cursor-pointer transition-all duration-200
                                                ${selectedDays.includes(day.id)
                                                    ? 'bg-emerald-500 text-white shadow-md'
                                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                                }
                                            `}
                                        >
                                            <div className="text-sm font-medium">{day.shortName}</div>
                                            <div className="text-xs mt-1">{day.name}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </CustomTabs>
                    </div>
                </form>
            </div>

            <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t">
                <div className="max-w-7xl mx-auto flex justify-end space-x-2">
                    <Button onClick={onCancel} variant="outlined" color="error">
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        variant="contained"
                        color="success"
                        disabled={!groupName || selectedDays.length === 0}
                    >
                        {initialData ? 'Save Changes' : 'Create Working Days'}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default CreateWorkingDays; 