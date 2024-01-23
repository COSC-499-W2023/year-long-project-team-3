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
import SubmissionBoxDetails from '@/components/SubmissionBoxDetails'

export default function SubmissionBoxDetailPage() {
    const session: SessionContextValue = useSession()
    const pathname = usePathname()
    const [videos, setVideos] = useState<Video[]>([])
    const [boxInfo, setBoxInfo] = useState<SubmissionBox | null>(null)
    const boxId = pathname?.split('/').pop()

    useEffect(() => {
        fetchVideos(boxId)
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
                    <SubmissionBoxDetails
                        submissionBox = {boxInfo}/>
                </Box>
            </Box>
        </>
    )

    async function fetchVideos(boxId: string | undefined) {
        const response = await fetch(`/api/submission-box/myboxes/${ boxId }`)
        const { videos, submissionBoxInfo } = await response.json()
        setVideos(videos)
        setBoxInfo(submissionBoxInfo)
    }
}
