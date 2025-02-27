import { Box, Skeleton } from '@mui/material';

const ChatSkeleton = ({ index }: { index: number }) => (
    <Box sx={{
        mb: 2.5,
        width: '70%', // Set fixed width for both left and right skeletons
        ml: index % 2 === 0 ? 0 : 'auto', // Alternate between left and right
    }}>
        <Box sx={{
            backgroundColor: index % 2 === 0 ? '#f1f1f1' : '#eeffee',
            borderRadius: 3,
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
            overflow: 'hidden',
        }}>
            <Box sx={{
                display: 'flex',
                alignItems: 'center',
                p: 2,
                borderBottom: '1px solid rgba(0,0,0,0.05)',
            }}>
                <Skeleton variant="circular" width={48} height={48} sx={{ mr: 1.5 }} />
                <Box sx={{ flexGrow: 1 }}>
                    <Skeleton variant="text" width="40%" height={24} />
                    <Skeleton variant="text" width="20%" height={20} />
                </Box>
                <Box sx={{ display: 'flex', gap: 1, mr: 2 }}>
                    <Skeleton variant="rounded" width={60} height={24} />
                    <Skeleton variant="rounded" width={60} height={24} />
                </Box>
            </Box>

            {/* Content Section Skeleton */}
            <Box sx={{ p: 2.5 }}>
                <Skeleton variant="text" width="60%" height={28} sx={{ mb: 1.5 }} />
                <Skeleton variant="text" width="90%" height={20} />
                <Skeleton variant="text" width="85%" height={20} />
                <Skeleton variant="text" width="70%" height={20} />
            </Box>
        </Box>
    </Box>
);

export default ChatSkeleton;