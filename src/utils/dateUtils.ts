export const formatDateForDisplay = (date: Date | string): string => {
    if (!date) return '';

    if (typeof date === 'string') {
        if (date.endsWith('Z')) {
            const dateObj = new Date(date);
            return dateObj.toISOString().split('T')[0];
        }


        if (date.match(/^\d{2}-\d{2}-\d{4}$/)) {
            const [day, month, year] = date.split('-');
            return `${year}-${month}-${day}`;
        }
    }

    const dateObj = typeof date === 'string' ? new Date(date) : date;
    if (isNaN(dateObj.getTime())) return '';

    return dateObj.toISOString().split('T')[0];
};

export const formatDateForSubmit = (date: Date | string): string => {
    if (!date) return '';

    let day, month, year;

    if (typeof date === 'string') {
        if (date.match(/^\d{4}-\d{2}-\d{2}$/)) {
            [year, month, day] = date.split('-');
            return `${day}-${month}-${year}`;
        }

        if (date.match(/^\d{2}-\d{2}-\d{4}$/)) {
            return date;
        }
    }

    const dateObj = typeof date === 'string' ? new Date(date) : date;
    day = String(dateObj.getDate()).padStart(2, '0');
    month = String(dateObj.getMonth() + 1).padStart(2, '0');
    year = dateObj.getFullYear();

    return `${day}-${month}-${year}`;
}; 