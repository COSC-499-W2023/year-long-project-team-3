'use client'
import { usePathname } from 'next/navigation'
import Header from '@/components/Header'
import React, { useEffect, useState } from 'react'
import { SessionContextValue, useSession } from 'next-auth/react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { SubmissionBox, Video } from '@prisma/client'
import VideoList from '@/components/VideoList'
import { toast } from 'react-toastify'
import BackButton from '@/components/BackButton'

export default function SubmissionBoxDetailPage() {
    const session: SessionContextValue = useSession()
    const pathname = usePathname()
    const [videos, setVideos] = useState<Video[]>([])
    const [boxInfo, setBoxInfo] = useState<SubmissionBox | null>(null)
    const boxId = pathname?.split('/').pop()

    useEffect(() => {
        fetchVideos(boxId)
            .then((videos: Video[]) => setVideos(videos))
            .catch((error) => toast.error(error))
        fetchBoxInfo(boxId)
            .then((submissionBoxInfo) => setBoxInfo(submissionBoxInfo))
            .catch((error) => toast.error(error))
    }, [boxId])

    return (
        <>
            <Header {...session} />
            <BackButton route={'/dashboard '} title={'Return to Dashboard'} />{' '}
            <Box display='grid' gridTemplateColumns='4fr 1fr' height='100%' width='100%'>
                <Box
                    sx={{
                        borderTopRightRadius: 25,
                        height: '100vh',
                        backgroundColor: 'secondary.lighter',
                        paddingTop: 5,
                    }}
                    borderColor={'secondary.lighter'}
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
                <Box paddingLeft='1rem'>
                    <Typography data-cy='submissionBoxTitleHeading' color={'textSecondary'} sx={{ m: 1 }}>
                        Title
                    </Typography>
                    <Typography data-cy='submissionBoxTitle' variant='h5' color={'textSecondary'} paddingBottom='2rem'
                        sx={{ m: 1, fontWeight: 'bold' }}>
                        { boxInfo ? boxInfo.title : 'N/A' }
                    </Typography>
                    <Typography data-cy='submissionBoxDateHeading' color={'textSecondary'} sx={{ m: 1 }}>
                      Close Date:
                    </Typography>
                    <Typography data-cy='submissionBoxDate' variant='h6' color={'textSecondary'} paddingBottom='2rem'
                        paddingLeft='1rem' sx={{ m: 1 }}>
                        { boxInfo ?
                            !!boxInfo.closesAt ? new Date(boxInfo.closesAt).toDateString().slice(4) : 'N/A'
                            : 'N/A' }
                    </Typography>
                    <Typography data-cy='submissionBoxDescHeading' color={'textSecondary'} sx={{ m: 1 }}>
                      Description
                    </Typography>
                    <Typography data-cy='submissionBoxDate' variant='subtitle2' color={'textSecondary'}
                        paddingBottom='2rem' paddingLeft='1rem' sx={{ m: 1 }}>
                        {boxInfo
                            ? boxInfo.description
                            : 'N/A'}
                    </Typography>
                </Box>
            </Box>
        </>
    )

    async function fetchVideos(boxId: string | undefined): Promise<Video[]> {
        const response = await fetch(`/api/submission-box/myboxes/${ boxId }`)
        const { videos, submissionBoxInfo } = await response.json()
        return videos
    }

    async function fetchBoxInfo(boxId: string | undefined) {
        const response = await fetch(`/api/submission-box/myboxes/${ boxId }`)
        const { videos, submissionBoxInfo } = await response.json()
        return submissionBoxInfo
    }
}
