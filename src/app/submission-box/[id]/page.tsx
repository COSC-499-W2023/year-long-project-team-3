'use client'

import { usePathname, useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { Typography, Box, Link } from '@mui/material'
import { SubmissionBox, Video } from '@prisma/client'
import VideoList from '@/components/VideoList'
import BackButtonWithLink from '@/components/BackButtonWithLink'
import SubmissionBoxDetails from '@/components/SubmissionBoxDetails'
import ScalingReactPlayer from '@/components/ScalingReactPlayer'
import PageLoadProgress from '@/components/PageLoadProgress'
import { BoxStatus } from '@/types/submission-box/boxStatus'
import { toast } from 'react-toastify'
import SelectVideoForSubmission from '@/components/SelectVideoForSubmission'
import { VideoSubmission } from '@/app/api/my-videos/route'

export default function SubmissionBoxDetailPage() {
    const router = useRouter()
    const pathname = usePathname()
    const [isFetchingSubmissionBox, setIsFetchingSubmissionBox] = useState(true)
    const [boxType, setBoxType] = useState<BoxStatus>('requested')
    const [videos, setVideos] = useState<(Video & VideoSubmission)[]>([])
    const [boxInfo, setBoxInfo] = useState<SubmissionBox | null>(null)
    const boxId = pathname?.split('/').pop()

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
                                            description: video.description,
                                            isSubmitted: video.isSubmitted,
                                            createdDate: video.createdAt,
                                            // Not passing submission boxes when video is viewed in submission box
                                            submissionBoxes: [],
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
                            <Box
                                sx={{
                                    display: 'grid',
                                    gridTemplateColumns: '3fr 1fr',
                                    flexGrow: 1,
                                    height: '100%',
                                    width: '100%',
                                }}
                            >
                                <Box
                                    sx={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        width: '100%',
                                        height: '100%',
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
                                            maxHeight: '75%',
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
                                            <SelectVideoForSubmission />
                                        )}
                                    </Box>
                                </Box>
                                <Box padding='1rem'>
                                    <SubmissionBoxDetails submissionBox={boxInfo} />
                                </Box>
                            </Box>
                        </>
                    )}
                </>
            )}
        </>
    )
}
