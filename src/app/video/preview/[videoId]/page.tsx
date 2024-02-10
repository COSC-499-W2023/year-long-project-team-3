'use client'
import React, { useEffect, useState } from 'react'
import ProgressDots from '@/components/ProgressDots'
import { Box } from '@mui/material'
import ScalingReactPlayer from '@/components/ScalingReactPlayer'
import { useRouter, usePathname } from 'next/navigation'
import VideoProcessing from '@/components/VideoProcessing'
import PageLoadProgress from '@/components/PageLoadProgress'
import { toast } from 'react-toastify'
import BackButton from '@/components/BackButton'
import FormNavButton from '@/components/FormNavButton'
import logger from '@/utils/logger'

export default function VideoPreviewPage() {
    const router = useRouter()
    const pathname = usePathname()

    const [streamingVideoUrl, setStreamingVideoUrl] = useState<string>('')
    const [isVideoVisible, setIsVideoVisible] = useState(false)
    const [isCloudProcessed, setIsCloudProcessed] = useState(false)

    const videoId = pathname?.split('/').pop()

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
        const interval = setInterval(async () => {
            if (!videoId) {
                cleanUpVideoState()
                return
            }

            fetch(`/api/video/${ videoId }`)
                .then(async (res) => {
                    if (res.status !== 200) {
                        throw new Error('Could not fetch video')
                    }
                    const responseJson = await res.json()
                    const video = responseJson.video
                    if (!video) {
                        throw new Error('No video found')
                    }
                    setStreamingVideoUrl(video.processedVideoUrl)
                    setIsCloudProcessed(video.isCloudProcessed)
                    setIsVideoVisible(true)
                    if (isCloudProcessed) {
                        clearInterval(interval)
                        return
                    }
                })
                .catch((err) => {
                    logger.error(err)
                    cleanUpVideoState()
                    router.push('/dashboard')
                    toast.error(
                        'There was an error accessing the video you requested. Please try again and contact support if the error continues.'
                    )
                })
        }, 2000)
        return () => clearInterval(interval)
    }, [isCloudProcessed, router, videoId])

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
                {!isVideoVisible ? (
                    <PageLoadProgress />
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
                                    pb: '2rem',
                                }}
                            >
                                <Box
                                    sx={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'flex-start',
                                        width: '100%',
                                        m: 0,
                                    }}
                                >
                                    <BackButton route={'/dashboard '} title={'Return to Dashboard'} />
                                </Box>
                                {/*Main Body*/}
                                <Box
                                    sx={{
                                        minWidth: '16rem',
                                        width: '70%',
                                    }}
                                >
                                    <ProgressDots
                                        activeStep={1}
                                        numSteps={3}
                                        labels={['Upload', 'Preview', 'Submit']}
                                    />
                                </Box>
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
                                                {isVideoVisible && (
                                                    <ScalingReactPlayer
                                                        data-cy='scaling-react-player'
                                                        url={streamingVideoUrl}
                                                    />
                                                )}
                                            </Box>

                                            {/*The back and continue buttons*/}
                                            <Box
                                                id='nav-buttons-div'
                                                display='flex'
                                                justifyContent='space-between'
                                                width='70vw'
                                                bottom='4rem'
                                            >
                                                <FormNavButton
                                                    title={'Back'}
                                                    variant={'outlined'}
                                                    handleClick={handleClickBackButton}
                                                ></FormNavButton>
                                                <FormNavButton
                                                    title={'Next'}
                                                    variant={'contained'}
                                                    handleClick={handleClickNextButton}
                                                ></FormNavButton>
                                            </Box>
                                        </Box>
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

    function handleClickNextButton() {
        router.push(`/video/submit/${ videoId }`)
    }

    function handleClickBackButton() {
        router.back()
    }
}
