'use client'

import { usePathname, useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { Typography, Box, Button, Link, Modal } from '@mui/material'
import { SubmissionBox, Video } from '@prisma/client'
import VideoList from '@/components/VideoList'
import BackButtonWithLink from '@/components/BackButtonWithLink'
import SubmissionBoxDetails from '@/components/SubmissionBoxDetails'
import ScalingReactPlayer from '@/components/ScalingReactPlayer'
import PageLoadProgress from '@/components/PageLoadProgress'
import { BoxStatus } from '@/types/submission-box/boxStatus'
import { toast } from 'react-toastify'
import logger from '@/utils/logger'

export default function SubmissionBoxDetailPage() {
    const router = useRouter()
    const pathname = usePathname()
    const [isFetchingSubmissionBox, setIsFetchingSubmissionBox] = useState(true)
    const [boxType, setBoxType] = useState<BoxStatus>('requested')
    const [videos, setVideos] = useState<Video[]>([])
    const [boxInfo, setBoxInfo] = useState<SubmissionBox | null>(null)
    const boxId = pathname?.split('/').pop()
    const [isSubmissionModalOpen, setIsSubmissionModalOpen] = useState(false)
    const [allVideos, setAllVideos] = useState<Video[]>([])

    const modalStyle = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '25rem',
        minWidth: '20rem',
        backgroundColor: 'background.default',
        borderRadius: '1rem',
        boxShadow: 24,
        p: '1rem 2rem',
    }

    useEffect(() => {
        setIsFetchingSubmissionBox(true)

        fetch(`/api/submission-box/${ boxId }`).then(async (res) => {
            const { box, videos, submissionBoxInfo } = await res.json()
            if (!submissionBoxInfo) {
                router.push('/dashboard')
                toast.error('You do not have permission to view this submission box')
            }
            setBoxType(box)
            setBoxInfo(submissionBoxInfo)
            setVideos(videos)
        }).catch(() => {
            router.push('/dashboard')
            toast.error('An error occurred trying to access submission box')
        }).finally(() => {
            setIsFetchingSubmissionBox(false)
        })
    }, [boxId, router])

    useEffect(() => {
        fetchAllVideos()
            .then((videos: Video[]) => setAllVideos(videos))
            .catch((error) => toast.error(error))
    }, [])


    return (
        <>
            <BackButtonWithLink route={'/dashboard '} title={'Return to Dashboard'} />
            {isFetchingSubmissionBox ? (
                <PageLoadProgress />
            ) : (
                <>
                    {boxType === 'owned' && (
                        <Box flexGrow='1' display='grid' gridTemplateColumns='3fr 1fr' height='100%' width='100%'>
                            <Box
                                sx={{
                                    borderTopRightRadius: 25,
                                    height: '100%',
                                    backgroundColor: 'secondary.lighter',
                                    paddingTop: 5,
                                }}
                                width='100%'
                            >
                                <VideoList
                                    videos={videos?.map((video) => {
                                        return {
                                            title: video.title,
                                            videoId: video.id,
                                            thumbnailUrl: video.thumbnail,
                                            handleVideoClick: handleVideoClick,
                                        }
                                    })}
                                    isSearching={false}
                                    emptyMessage={'No Videos Have Been Submitted to Your Box'}
                                />
                            </Box>
                            <Box paddingLeft='1rem'>
                                <SubmissionBoxDetails submissionBox={boxInfo} />
                            </Box>
                        </Box>
                    )}
                    {boxType === 'requested' && (
                        <>
                            <Box display='grid' gridTemplateColumns='3fr 1fr' height='100%' width='100%'>
                                <Box
                                    sx={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        width: '100%',
                                        padding: '2rem',
                                        flexGrow: 1,
                                        flexShrink: 1,
                                    }}
                                >
                                    {videos?.length !== 0 && (
                                        <Box
                                            data-cy='videoTitleHolder'
                                            sx={{
                                                display: 'flex',
                                                flexDirection: 'column',
                                                alignItems: 'center',
                                            }}
                                        >
                                            <Typography data-cy='videoTitleHeader' variant='subtitle2' color={'textSecondary'}>Video Title</Typography>
                                            <Link sx={{ fontWeight: 'bold' }} paddingBottom='1rem' data-cy='videoTitle' variant={'h5'} color={'textSecondary'} onClick={() => router.push(`/video/${ videos?.[0].id }`)}>{videos?.[0].title}</Link>
                                        </Box>
                                    )}
                                    <Box
                                        data-cy='videoHolder'
                                        sx={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            ...(videos.length !== 1 && { justifyContent: 'center' }),
                                            flexGrow: 1,
                                            flexShrink: 1,
                                            width: '100%',
                                            ...(videos.length !== 1 && { backgroundColor: 'secondary.lighter' }),
                                            borderRadius: 1,
                                        }}
                                    >
                                        {videos?.length !== 0 ? (
                                            videos[0]?.processedVideoUrl ? (
                                                <ScalingReactPlayer data-cy='scaling-react-player' url={videos[0].processedVideoUrl} />
                                            ) : (
                                                <Typography data-cy='pending' variant={'h5'} color={'textSecondary'}>
                                                Submission Pending
                                                </Typography>
                                            )
                                        ) : (
                                            <Typography data-cy='noSubmission' variant={'h5'} color={'textSecondary'}>
                                            No Current Submission
                                            </Typography>
                                        )}
                                    </Box>
                                </Box>
                                <Box padding='1rem'>
                                    <SubmissionBoxDetails submissionBox={boxInfo} />
                                    <Box textAlign='center' padding='1rem'>
                                        <Button
                                            variant='contained'
                                            onClick={onSubmitButtonClicked}
                                            data-cy='submissionButton'
                                        >
                                            { videos?.length === 0 ? 'Create A Submission' : 'Create A Resubmission' }
                                        </Button>
                                    </Box>
                                </Box>
                            </Box>
                        </>
                    )}
                </>
            )}
            <Modal open={isSubmissionModalOpen} onClose={handleModelClosed}>
                <Box sx={{...modalStyle}}>
                    <VideoList
                        videos={allVideos.map((video) => {
                            return {
                                title: video.title,
                                videoId: video.id,
                                thumbnailUrl: video.thumbnail,
                                handleVideoClick: handleSubmitVideo,
                            }
                        })}
                        isSearching={false}
                    />
                </Box>
            </Modal>
        </>
    )

    function onSubmitButtonClicked() {
        setIsSubmissionModalOpen(true)
    }

    function handleModelClosed() {
        setIsSubmissionModalOpen(false)
    }

    async function fetchAllVideos(): Promise<Video[]> {
        const response = await fetch('/api/my-videos')
        const { videos } = await response.json()
        return videos
    }

    function handleVideoClick(videoId: string) {
        console.log('hello')
        // router.push(`/video/${ videoId }`)
    }

    function handleSubmitVideo(videoId: string) {
        const submissionBoxIds = [boxId]
        const body = {
            submissionBoxIds,
            videoId: videoId,
        }
        fetch('/api/video/submit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        })
            .then(async (res) => {
                if (res.status !== 201) {
                    throw new Error('Failed to submit the video')
                }
                const body = await res.json()
                router.push('/dashboard')
                toast.success(body.message)
            })
            .catch((err) => {
                logger.error(err)
                toast.error('Unexpected error occurred while submitting the video')
            })
    }
}
