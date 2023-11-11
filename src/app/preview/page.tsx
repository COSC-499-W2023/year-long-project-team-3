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
                    width: 'auto',
                    height: '100%',
                }}
            >
                <Header {...session} />
                <Box // Main Body
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'stretch',
                        alignItems: 'center',
                        gap: '2rem',
                        margin: '2rem auto',
                        width: '100%',
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
                    <Box // Contains video and buttons
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '2rem',
                            width: '100%',
                            padding: '0 2rem',
                            maxWidth: '70rem',
                        }}
                    >
                        <ScalingReactPlayer url={'https://d29gn7cyj93si1.cloudfront.net/sample.mp4'} />
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
