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

export default function SubmissionBoxDetailPage() {
    const session: SessionContextValue = useSession()
    const pathname = usePathname()
    const [boxType, setBoxType] = useState('')
    const [video, setVideo] = useState<Video | null>(null)
    const [videos, setVideos] = useState<Video[]>([])
    const [boxInfo, setBoxInfo] = useState<SubmissionBox | null>(null)
    const boxId = pathname?.split('/').pop()

    useEffect(() => {
        fetchVideos(boxId)
    }, [boxId])

    return (
        <>
            <Box height='100wv' width='100%'>
                <Header {...session} />
                <BackButton route={'/dashboard '} title={'Return to Dashboard'} />{' '}
                <Box display='grid' gridTemplateColumns='3fr 1fr' height='100%' width='100%'>
                    {boxType === 'Owned' && (
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
                                videos={videos.map((video) => {
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
                    {boxType === 'Requested' &&(
                        <Box
                            sx={{
                                display: 'flex',
                                width: '100wv',
                                height: '70vh',
                                gap: '4rem',
                                padding: '2rem',
                            }}>
                            <Box
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    ...(video === null && {justifyContent: 'center'}),
                                    flexGrow: 1,
                                    flexShrink: 1,
                                    minWidth: '20vh',
                                    width: '100%',
                                    ...(video === null && {backgroundColor: 'secondary.lighter'}),
                                    borderRadius: 1,
                                }}
                            >
                                {video !== null ? (
                                    video.processedVideoUrl !== null ? (
                                        <ScalingReactPlayer
                                            data-cy='scaling-react-player'
                                            url={video?.processedVideoUrl}
                                        />
                                    ) : (
                                        <Typography
                                            variant={'h5'}
                                            color={'textSecondary'}>
                                          Submission Pending
                                        </Typography>
                                    )
                                ) : (
                                    <Typography
                                        variant={'h5'}
                                        color={'textSecondary'}>
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
        const response = await fetch(`/api/submission-box/myboxes/${ boxId }`)
        const { box, videos, submissionBoxInfo } = await response.json()
        setBoxType(box)
        setBoxInfo(submissionBoxInfo)
        if (box === 'Owned') {
            setVideos(videos)
        } else {
            setVideo(videos)
        }
    }
}
