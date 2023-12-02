import { Box, CircularProgress } from '@mui/material'

export type PageLoadProgressProps = {
    show: boolean
}

export default function PageLoadProgress(props: PageLoadProgressProps) {
    return props.show && (
        <Box
            position='absolute'
            top={0}
            left={0}
            width='100vw'
            height='100vh'
            display='flex'
            justifyContent='center'
            alignItems='center'
            sx={{
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                zIndex: 1000,
            }}
        >
            <CircularProgress />
        </Box>
    )
}
