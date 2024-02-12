import { Box, CircularProgress } from '@mui/material'

export default function PageLoadProgress() {
    return (
        <Box
            width='100vh'
            height='100vh'
            display='flex'
            justifyContent='center'
            alignItems='center'
        >
            <CircularProgress data-cy='loading-circle' />
        </Box>
    )
}
