'use client'

import React, { useEffect } from 'react'
import Header from '@/components/Header'
import { SessionContextValue, useSession } from 'next-auth/react'
import ProgressDots from '@/components/ProgressDots'
import { Box, Button } from '@mui/material'
import ScalingReactPlayer from '@/components/ScalingReactPlayer'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import EditorTools from '@/components/EditorTools'

export default function VideoPreviewPage() {
    const session: SessionContextValue = useSession()

    const resizeNavButtons = () => {
        const buttonsDiv = document.getElementById('nav-buttons-div')
        const videoPlayer = document.querySelector('.react-wrapper')
        const parentDiv = buttonsDiv ? buttonsDiv.parentNode : null

        if (
            buttonsDiv &&
            videoPlayer &&
            videoPlayer instanceof HTMLElement &&
            parentDiv &&
            parentDiv instanceof HTMLElement
        ) {
            const parentWidth = parentDiv.offsetWidth
            const videoWidth = videoPlayer.offsetWidth
            if (videoWidth < parentWidth) {
                buttonsDiv.style.width = videoWidth + 'px'
            } else {
                buttonsDiv.style.width = '100%'
            }
        }
    }

    useEffect(() => {
        resizeNavButtons()
        window.addEventListener('resize', resizeNavButtons)

        return () => {
            window.removeEventListener('resize', resizeNavButtons)
        }
    }, [])

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
                        width: '100%',
                        height: '100%',
                        padding: '2rem',
                    }}
                >
                    <Box
                        sx={{
                            minWidth: '16rem',
                            width: '70%',
                        }}
                    >
                        <ProgressDots activeStep={1} numSteps={3} labels={['Record', 'Edit', 'Submit']} />
                    </Box>
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'row',
                            flexGrow: 1,
                            gap: '2rem',
                            width: '100%',
                            height: '100%',
                        }}
                    >
                        <Box
                            className='column-1'
                            sx={{
                                width: '20%',
                            }}
                        ></Box>
                        <Box
                            className='column-2'
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                width: '60%',
                                alignItems: 'center',
                                gap: '2rem',
                            }}
                        >
                            {/*Contains video and buttons*/}
                            <Box
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    gap: '2rem',
                                    width: '100%',
                                    height: '100%',
                                    // maxWidth: '70rem',
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
                                        width: '100%',
                                    }}
                                >
                                    <ScalingReactPlayer
                                        url={
                                            'https://d2f59vy9cxchvn.cloudfront.net/9ba9a113-1822-475f-967f-ce4cda67a301/hls/westminster-test.m3u8'
                                        }
                                    />
                                </Box>
                                {/*The back and continue buttons*/}
                                <Box
                                    id='nav-buttons-div'
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
                        <Box
                            className='column-3'
                            sx={{
                                width: '20%',
                                padding: '0 1rem',
                                borderRadius: '1rem',
                            }}
                        >
                            <EditorTools />
                        </Box>
                    </Box>
                </Box>
            </Box>
        </>
    )
}
