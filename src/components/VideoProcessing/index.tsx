import { Alert, Box } from '@mui/material'
import Image from 'next/image'

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
                <Alert severity='info' data-cy='video-processing-alert'>
                    Your video is currently being processed by our server. Please wait or come back later.
                </Alert>
                <Box sx={{ mt: '2rem' }}>
                    <Image
                        src='https://media.tenor.com/DCycRQnBpOYAAAAC/math-hmm.gif'
                        alt='processing gif'
                        width={300}
                        height={200}
                        style={{
                            borderRadius: '1rem',
                        }}
                    />
                </Box>
            </Box>
        </>
    )
}
