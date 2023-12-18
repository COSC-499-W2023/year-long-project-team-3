import { Box, CircularProgress } from '@mui/material'

export default function PageLoadProgress() {
    return (
        <Box
            width='100%'
            height='100%'
            display='flex'
            justifyContent='center'
            alignItems='center'
        >
            <CircularProgress data-cy='loading-circle' />
        </Box>
    )
}
