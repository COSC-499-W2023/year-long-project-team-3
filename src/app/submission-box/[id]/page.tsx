'use client'
import { usePathname } from 'next/navigation'
import Header from '@/components/Header'
import React, { useEffect, useState } from 'react'
import { SessionContextValue, useSession } from 'next-auth/react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { Video } from '@prisma/client'
import VideoList from '@/components/VideoList'
import { toast } from 'react-toastify'

export default function SubmissionBoxDetailPage() {
    const session: SessionContextValue = useSession()
    const pathname = usePathname()
    const [videos, setVideos] = useState<Video[]>([])
    const boxId = pathname?.split('/').pop()

    useEffect(() => {
        fetchVideos(boxId)
            .then((videos: Video[]) => setVideos(videos))
            .catch((error) => toast.error(error))
    }, [])

    return(
        <>
            <Header {...session} />
            <Box width='100%' display='flex' flexDirection='column'>
                <Box display='flex' justifyContent='space-between' alignItems='center' paddingLeft='3rem'>
                    <Typography
                        data-cy='title'
                        variant='h5'
                        color={'textSecondary'}
                        sx={{ m: 2, fontWeight: 'bold', py: '1rem', marginTop: '1rem' }}
                    >
                        Dashboard
                    </Typography>
                </Box>
            </Box>
            <Box display='grid' gridTemplateColumns='4fr 1fr' height='100%' width='100%'>
                <Box
                    sx={{
                        borderTopRightRadius: 25,
                        height: '100vh',
                        backgroundColor: 'secondary.lighter',
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
                    <Typography data-cy='submissionBoxTitle' variant='h5' color={'textSecondary'} paddingBottom='2rem' sx={{ m: 1, fontWeight: 'bold'}}>
                        TITLE OF DASHBOARD
                    </Typography>
                    <Typography data-cy='submissionBoxDateHeading' color={'textSecondary'} sx={{ m: 1 }}>
                        Close Date:
                    </Typography>
                    <Typography data-cy='submissionBoxDate' variant='h6' color={'textSecondary'} paddingBottom='2rem' paddingLeft='1rem' sx={{ m: 1 }}>
                        DATE
                    </Typography>
                    <Typography data-cy='submissionBoxDescHeading' color={'textSecondary'} sx={{ m: 1 }}>
                        Description
                    </Typography>
                    <Typography data-cy='submissionBoxDate' variant='subtitle2' color={'textSecondary'} paddingBottom='2rem' paddingLeft='1rem' sx={{ m: 1 }}>
                        A lengthy description of the submission box. Includes instructions of submission and what is required of the submittee to include in their video.
                    </Typography>
                </Box>
            </Box>
        </>
    )

    async function fetchVideos(boxId: string | undefined): Promise<Video[]> {
        const response = await fetch(`/api/submission-box/myboxes/${ boxId }`)
        const { videos } = await response.json()
        return videos
    }
}