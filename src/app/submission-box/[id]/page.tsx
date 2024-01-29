'use client'
import { usePathname } from 'next/navigation'
import Header from '@/components/Header'
import React, { useEffect, useState } from 'react'
import { SessionContextValue, useSession } from 'next-auth/react'
import Box from '@mui/material/Box'
import { SubmissionBox, Video } from '@prisma/client'
import VideoList from '@/components/VideoList'
import BackButton from '@/components/BackButton'
import SubmissionBoxDetails from '@/components/SubmissionBoxDetails'
import { Typography } from '@mui/material'
import ScalingReactPlayer from '@/components/ScalingReactPlayer'
import { BoxStatus } from '@/types/submission-box/boxStatus'

export default function SubmissionBoxDetailPage() {
    const session: SessionContextValue = useSession()
    const pathname = usePathname()
    const [boxType, setBoxType] = useState<BoxStatus>('requested')
    const [videoUrl, setVideoUrl] = useState(null)
    const [videos, setVideos] = useState<Video[]>([])
    const [boxInfo, setBoxInfo] = useState<SubmissionBox | null>(null)
    const boxId = pathname?.split('/').pop()

    useEffect(() => {
        fetchVideos(boxId)
    }, [boxId])

    // @ts-ignore
    return (
        <>
            <Box height='100wv' width='100%'>
                <Header {...session} />
                <BackButton route={'/dashboard '} title={'Return to Dashboard'} />{' '}
                <Box display='grid' gridTemplateColumns='3fr 1fr' height='100%' width='100%'>
                    {boxType === 'owned' && (
                        <Box
                            sx={{
                                borderTopRightRadius: 25,
                                height: '100vh',
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
                                    }
                                })}
                                isSearching={false}
                            />
                        </Box>
                    )}
                    {boxType === 'requested' && (
                        <Box
                            sx={{
                                display: 'flex',
                                width: '100wv',
                                height: '70vh',
                                gap: '4rem',
                                padding: '2rem',
                            }}
                        >
                            <Box
                                data-cy='videoHolder'
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    ...(videos.length !== 1 && { justifyContent: 'center' }),
                                    flexGrow: 1,
                                    flexShrink: 1,
                                    minWidth: '20vh',
                                    width: '100%',
                                    ...(videos.length !== 1 && { backgroundColor: 'secondary.lighter' }),
                                    borderRadius: 1,
                                }}
                            >
                                {videos.length !== 0 ? (
                                    videoUrl !== null ? (
                                        <ScalingReactPlayer data-cy='scaling-react-player' url={videoUrl} />
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
                    )}
                    <Box paddingLeft='1rem'>
                        <SubmissionBoxDetails submissionBox={boxInfo} />
                    </Box>
                </Box>
            </Box>
        </>
    )

    async function fetchVideos(boxId: string | undefined) {
        const response = await fetch(`/api/submission-box/${ boxId }`)
        const { box, videos, submissionBoxInfo } = await response.json()
        setBoxType(box)
        setBoxInfo(submissionBoxInfo)
        setVideos(videos)
        if (videos.length === 1) {
            setVideoUrl(
                videos?.map((video: { processedVideoUrl: any }) => {
                    return video.processedVideoUrl
                })
            )
        }
    }
}
