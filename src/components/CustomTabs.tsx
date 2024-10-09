import React, { useState } from 'react';
import { Tabs, Tab, Box } from '@mui/material';
import { CustomTabsProps } from '../types/Types';

const CustomTabs: React.FC<CustomTabsProps> = ({ labels, children }) => {
  const [value, setValue] = useState(0);

  const handleChange = (_: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="custom tabs"
          TabIndicatorProps={{ style: { backgroundColor: '#2e7d32' } }}
        >
          {labels.map((label, index) => (
            <Tab
              label={label}
              key={index}
              sx={{
                '&.Mui-selected': { color: '#2e7d32' },
              }}
            />
          ))}
        </Tabs>
      </Box>
      {React.Children.map(children, (child, index) => (
        <div
          role="tabpanel"
          hidden={value !== index}
          id={`tabpanel-${index}`}
          aria-labelledby={`tab-${index}`}
          key={index}
          style={{ height: '370px', overflowY: 'auto', background: '#f0f0f0', padding: '10px' }}
        >
          {value === index && <Box>{child}</Box>}
        </div>
      ))}
    </Box>
  );
};

export default CustomTabs;
