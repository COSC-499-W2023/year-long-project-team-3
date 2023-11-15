'use client'

import React from 'react'
import Header from '@/components/Header'
import { SessionContextValue, useSession } from 'next-auth/react'
import ProgressDots from '@/components/ProgressDots'
import { Box, Button } from '@mui/material'
import ScalingReactPlayer from '@/components/ScalingReactPlayer'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'

export default function VideoPreviewPage() {
    const session: SessionContextValue = useSession()

    return (
        <>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'stretch',
                    margin: 0,
                    padding: 0,
                    width: '100vw',
                    height: '100vh',
                }}
            >
                <Header {...session} />
                {/*Main Body*/}
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '2rem',
                        margin: '2rem 0',
                        width: '100%',
                        height: '100%',
                    }}
                >
                    <Box
                        sx={{
                            minWidth: '16rem',
                            width: '50%',
                        }}
                    >
                        <ProgressDots activeStep={1} numSteps={3} labels={['Record', 'Edit', 'Submit']} />
                    </Box>
                    {/*Contains video and buttons*/}
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between',
                            gap: '2rem',
                            width: '100%',
                            height: '100%',
                            padding: '0 2rem',
                            maxWidth: '70rem',
                        }}
                    >
                        {/*TODO: Replace with a dynamic url later*/}
                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                flexGrow: 1,
                                flexShrink: 1,
                                minWidth: '20vh',
                                minHeight: '20vw',
                            }}
                        >
                            <ScalingReactPlayer url={'https://www.youtube.com/watch?v=iLX_r_WPrIw'} />
                        </Box>
                        {/*The back and continue buttons*/}
                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                width: '100%',
                            }}
                        >
                            <Button variant={'contained'} startIcon={<ArrowBackIcon />}>
                                Back
                            </Button>
                            <Button variant={'contained'} endIcon={<ArrowForwardIcon />}>
                                Continue
                            </Button>
                        </Box>
                    </Box>
                </Box>
            </Box>
        </>
    )
}
