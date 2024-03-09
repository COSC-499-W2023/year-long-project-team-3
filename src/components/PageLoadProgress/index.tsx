import { Box, CircularProgress } from '@mui/material'

export default function PageLoadProgress() {
    return (
        <Box
            height='80vh',
            display='flex'
            justifyContent='center'
            alignItems='center'
        >
            <CircularProgress data-cy='loading-circle' />
        </Box>
    )
}
