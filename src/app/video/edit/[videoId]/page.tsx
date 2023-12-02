'use client'
import React, { useEffect, useState } from 'react'
import Header from '@/components/Header'
import { SessionContextValue, useSession } from 'next-auth/react'
import ProgressDots from '@/components/ProgressDots'
import { Alert, Box, Button } from '@mui/material'
import ScalingReactPlayer from '@/components/ScalingReactPlayer'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import EditorTools from '@/components/EditorTools'
import { useRouter, usePathname } from 'next/navigation'
import VideoProcessing from '@/components/VideoProcessing'

export default function VideoPreviewPage() {
    const session: SessionContextValue = useSession()
    const router = useRouter()
    const pathname = usePathname()

    const [changesMade, setChangesMade] = useState(false)
    const [streamingVideoUrl, setStreamingVideoUrl] = useState<string>('')
    const [isVideoVisible, setIsVideoVisible] = useState(false)
    const [isCloudProcessed, setIsCloudProcessed] = useState(false)

    const videoId = pathname.split('/').pop()

    function resizeNavButtons() {
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
        if (!videoId) {
            cleanUpVideoState()
            return
        }

        fetch(`/api/video/${ videoId }`)
            .then(async (res) => {
                if (res.status !== 200) {
                    throw new Error('Could not fetch video')
                }
                const { videoUrl, isCloudProcessed } = await res.json()
                setIsVideoVisible(true)
                setStreamingVideoUrl(videoUrl)
                setIsCloudProcessed(isCloudProcessed)
            })
            .catch((err) => {
                console.error(err)
                cleanUpVideoState()
                router.push('/dashboard')
            })
    }, [router, videoId])

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
                    m: 0,
                    p: 0,
                    width: '100vw',
                    height: '100vh',
                }}
            >
                <Header {...session} />
                {/*Main Body*/}
                {!isVideoVisible ? (
                    <VideoProcessing />
                ) : (
                    <>
                        {isCloudProcessed ? (
                            <Box
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    gap: '1rem',
                                    width: '100%',
                                    height: '100%',
                                    p: '2rem',
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
                                <Alert
                                    severity='info'
                                    sx={{
                                        visibility: changesMade ? 'block' : 'hidden',
                                        borderRadius: '1rem',
                                    }}
                                >
                                    You have requested changes that will require the video to be processed. These
                                    changes will be processed once you continue to the next page
                                </Alert>
                                <Box
                                    sx={{
                                        display: 'flex',
                                        flexDirection: 'row',
                                        flexGrow: 1,
                                        width: '100%',
                                        height: '100%',
                                    }}
                                >
                                    <Box
                                        className='column-1'
                                        sx={{
                                            width: '20%',
                                            pr: '1rem',
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
                                                {isVideoVisible && <ScalingReactPlayer url={streamingVideoUrl} />}
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
                                            p: '0 1rem',
                                            borderRadius: '1rem',
                                        }}
                                    >
                                        <EditorTools setIsEditorChanged={setChangesMade} />
                                    </Box>
                                </Box>
                            </Box>
                        ) : (
                            <VideoProcessing />
                        )}
                    </>
                )}
            </Box>
        </>
    )

    function cleanUpVideoState() {
        setStreamingVideoUrl('')
        setIsVideoVisible(false)
    }
}
