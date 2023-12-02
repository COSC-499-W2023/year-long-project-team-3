import { Alert, Box } from '@mui/material'

export default function VideoProcessing() {
    return (
        <>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    mt: '2rem',
                }}
            >
                <Alert severity='info'>
                    Your video is currently being processed by our server. Please wait or come back later.
                </Alert>
                <Box sx={{ mt: '2rem' }}>
                    <img src='https://media.tenor.com/DCycRQnBpOYAAAAC/math-hmm.gif' alt='processing gif' />
                </Box>
            </Box>
        </>
    )
}
