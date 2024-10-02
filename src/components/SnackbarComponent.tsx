import React from 'react';
import { Snackbar, Alert } from '@mui/material';

interface SnackbarComponentProps {
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'warning' | 'info';
    position?: {
        vertical: 'top' | 'bottom';
        horizontal: 'left' | 'center' | 'right';
    };
    onClose: () => void;
}

const SnackbarComponent: React.FC<SnackbarComponentProps> = ({ open, message, severity, position = { vertical: 'bottom', horizontal: 'center' }, onClose }) => {
    return (
        <Snackbar
            open={open}
            autoHideDuration={6000}
            onClose={onClose}
            anchorOrigin={position}
        >
            <Alert onClose={onClose} severity={severity} sx={{ width: '100%' }}>
                {message}
            </Alert>
        </Snackbar>
    );
};

export default SnackbarComponent;