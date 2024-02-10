'use client'
import { usePathname, useRouter } from 'next/navigation'
import Header from '@/components/Header'
import React, { useEffect, useState } from 'react'
import { SessionContextValue, useSession } from 'next-auth/react'
import { Typography, Box, Button } from '@mui/material'
import { SubmissionBox, Video } from '@prisma/client'
import VideoList from '@/components/VideoList'
import BackButton from '@/components/BackButton'
import SubmissionBoxDetails from '@/components/SubmissionBoxDetails'
import ScalingReactPlayer from '@/components/ScalingReactPlayer'
import PageLoadProgress from '@/components/PageLoadProgress'
import { BoxStatus } from '@/types/submission-box/boxStatus'
import { toast } from 'react-toastify'

export default function SubmissionBoxDetailPage() {
    const session: SessionContextValue = useSession()
    const router = useRouter()
    const pathname = usePathname()
    const [isFetchingSubmissionBox, setIsFetchingSubmissionBox] = useState(true)
    const [boxType, setBoxType] = useState<BoxStatus>('requested')
    const [videos, setVideos] = useState<Video[]>([])
    const [boxInfo, setBoxInfo] = useState<SubmissionBox | null>(null)
    const boxId = pathname?.split('/').pop()

    useEffect(() => {
        setIsFetchingSubmissionBox(true)
        fetchSubmissionBox(boxId)
    }, [boxId])

    // @ts-ignore
    return (
        <>
            <Box height='100wv' width='100%'>
                <Header {...session} />
                <BackButton route={'/dashboard '} title={'Return to Dashboard'} />{' '}
                {isFetchingSubmissionBox ? (
                    <PageLoadProgress />
                ) : (
                    <>
                        {boxType === 'owned' && (
                            <Box display='grid' gridTemplateColumns='3fr 1fr' height='100%' width='100%'>
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
                                        emptyMessage={'No Videos Have Been Submitted to Your Box'}
                                    />
                                </Box>
                                <Box paddingLeft='1rem'>
                                    <SubmissionBoxDetails submissionBox={boxInfo} />
                                </Box>
                            </Box>
                        )}
                        {boxType === 'requested' && (
                            <Box display='grid' gridTemplateColumns='3fr 1fr' height='100%' width='100%'>
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
                                            onClick={() => router.push('/video/upload')}
                                            data-cy='submissionButton'
                                        >
                                        Create A Submission
                                        </Button>
                                    </Box>
                                </Box>
                            </Box>
                        )}
                    </>
                )}
            </Box>
        </>
    )

    async function fetchSubmissionBox(boxId: string | undefined) {
        const response = await fetch(`/api/submission-box/${ boxId }`)
        const { box, videos, submissionBoxInfo } = await response.json()
        if (!submissionBoxInfo) {
            router.push('/dashboard')
            toast.error('You do not have permission to view this submission box')
        }
        setBoxType(box)
        setBoxInfo(submissionBoxInfo)
        setVideos(videos)
        setIsFetchingSubmissionBox(false)
    }
}
