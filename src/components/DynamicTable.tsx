import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Checkbox, IconButton } from '@mui/material';
import { X } from 'lucide-react';
import { DynamicTableProps } from '../types/Types';


const DynamicTable: React.FC<DynamicTableProps> = ({
    columns,
    rows,
    selectable = false,
    selectedRows = [],
    onRowSelect,
    onRowRemove,
    showCloseIcon = false,
}) => {
    return (
        <TableContainer component={Paper}>
            <Table>
                <TableHead sx={{ backgroundColor: '#e2e2e2' }}>
                    <TableRow sx={{ height: '40px' }}>
                        {selectable && <TableCell sx={{ padding: '8px' }}>Select</TableCell>}
                        {columns.map((column) => (
                            <TableCell
                                key={column.id}
                                sx={{ padding: '8px', minWidth: column.minWidth }}
                            >
                                {column.label}
                            </TableCell>
                        ))}
                        {showCloseIcon && <TableCell sx={{ padding: '8px', width: '48px' }}></TableCell>}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows.map((row, index) => (
                        <TableRow key={index} sx={{ height: '40px' }}>
                            {selectable && (
                                <TableCell sx={{ padding: '8px' }}>
                                    <Checkbox
                                        checked={selectedRows.some((selectedRow) => selectedRow.id === row.id)}
                                        onChange={() => onRowSelect && onRowSelect(row)}
                                    />
                                </TableCell>
                            )}
                            {columns.map((column) => (
                                <TableCell key={column.id} sx={{ padding: '8px' }}>
                                    {row[column.id]}
                                </TableCell>
                            ))}
                            {showCloseIcon && (
                                <TableCell sx={{ padding: '8px' }}>
                                    <IconButton onClick={() => onRowRemove && onRowRemove(row)} size="small">
                                        <X size={16} />
                                    </IconButton>
                                </TableCell>
                            )}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default DynamicTable;