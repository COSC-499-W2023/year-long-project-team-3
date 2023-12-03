import { Box, CircularProgress } from '@mui/material'

export default function PageLoadProgress() {
    return (
        <Box
            position='absolute'
            top={0}
            left={0}
            width='100vw'
            height='100vh'
            display='flex'
            justifyContent='center'
            alignItems='center'
        >
            <CircularProgress data-cy='loading-circle' />
        </Box>
    )
}
