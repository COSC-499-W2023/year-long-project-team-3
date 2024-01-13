'use client'

import { useSession } from 'next-auth/react'
import Header from '@/components/Header'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import React, { useEffect, useState } from 'react'
import { SubmissionBox, Video } from '@prisma/client'
import { toast } from 'react-toastify'
import PageLoadProgress from '@/components/PageLoadProgress'
import DashboardSidebar from '@/components/DashboardSidebar'
import { SidebarOption } from '@/types/dashboard/sidebar'
import VideoList from '@/components/VideoList'
import SubmissionBoxList from '@/components/SubmissionBoxList'
import DashboardSearchBar from '@/components/DashboardSearchBar'

export default function DashboardPage() {
    const session = useSession()

    // Videos
    const [allVideos, setAllVideos] = useState<Video[]>([])
    const [displayVideos, setDisplayVideos] = useState<Video[]>([])

    // Submission Boxes
    const [submissionBoxes, setSubmissionBoxes] = useState<SubmissionBox[]>([])

    // Page component controls
    const [sidebarSelectedOption, setSidebarSelectedOption] = useState<SidebarOption>('menu_recent')
    const [pageTitle, setPageTitle] = useState('Recent')
    const [isVideoTabSelected, setIsVideoTabSelected] = useState(true)

    // Page load controls
    const [isFetching, setIsFetching] = useState(false)

    // Fetch all videos for the "recent" tab
    useEffect(() => {
        setIsFetching(true)
        fetchAllVideos()
            .then((videos: Video[]) => setAllVideos(videos))
            .catch((error) => toast.error(error))
            .finally(() => setIsFetching(false))
    }, [])

    // If click on video-related tab, filter videos based on sidebar selection
    // If click on submission box-related tab, fetch submission boxes
    useEffect(() => {
        if (!sidebarSelectedOption) {
            return
        }

        if (!session.data?.user?.email) {
            return
        }

        if (sidebarSelectedOption === 'menu_recent') {
            setIsVideoTabSelected(true)
            setPageTitle('Recent')
            const sortedVideos =
                allVideos?.toSorted((video, otherVideo) => {
                    const videoUpdatedAt = new Date(video?.updatedAt).getTime() ?? 0
                    const otherVideoUpdatedAt = new Date(otherVideo?.updatedAt).getTime() ?? 0
                    return otherVideoUpdatedAt - videoUpdatedAt
                }) || []
            setDisplayVideos(sortedVideos)
        } else if (sidebarSelectedOption === 'menu_submitted_videos') {
            setIsVideoTabSelected(true)
            setPageTitle('Submitted Videos')

            setIsFetching(true)
            getUserIdByEmail(session.data.user.email)
                .then((userId) => {
                    const ownedVideos = allVideos.filter((video) => video.ownerId === userId)
                    setDisplayVideos(ownedVideos)
                })
                .catch((error) => toast.error(error))
                .finally(() => setIsFetching(false))
        } else if (sidebarSelectedOption === 'menu_starred') {
            setIsVideoTabSelected(true)
            setPageTitle('Starred')

            // TODO: Added isStarred field to Video model
            setDisplayVideos([])
        } else if (sidebarSelectedOption === 'menu_trash') {
            setIsVideoTabSelected(true)
            setPageTitle('Trash')

            // TODO: Added isDeleted field to Video model
            setDisplayVideos([])
        } else if (sidebarSelectedOption === 'submission_boxes_my_boxes') {
            setIsVideoTabSelected(false)
            setPageTitle('Submission Boxes')

            setIsFetching(true)
            fetchMyBoxes()
                .then((submissionBoxes) => setSubmissionBoxes(submissionBoxes))
                .catch((error) => toast.error(error))
                .finally(() => setIsFetching(false))
        } else if (sidebarSelectedOption === 'submission_boxes_my_requests') {
            setIsVideoTabSelected(false)
            setPageTitle('Requested Submissions')

            setIsFetching(true)
            fetchMyRequests()
                .then((submissionBoxes) => setSubmissionBoxes(submissionBoxes))
                .catch((error) => toast.error(error))
                .finally(() => setIsFetching(false))
        }
    }, [sidebarSelectedOption, allVideos, session])

    return (
        <>
            <Header {...session} />
            <Box display='grid' gridTemplateColumns='1fr 4fr' height='100%' width='100%'>
                <DashboardSidebar
                    sidebarSelectedOption={sidebarSelectedOption}
                    setSidebarSelectedOption={setSidebarSelectedOption}
                />
                <Box width='100%' display='flex' flexDirection='column'>
                    <Box display='flex' justifyContent='space-between' alignItems='center' paddingRight='3rem'>
                        <Typography
                            data-cy='title'
                            variant='h5'
                            color={'textSecondary'}
                            sx={{ m: 2, fontWeight: 'bold', py: '1rem', marginTop: '1rem' }}
                        >
                            {pageTitle}
                        </Typography>
                        <DashboardSearchBar />
                    </Box>
                    <Box
                        sx={{
                            borderTopLeftRadius: 25,
                            borderBottomLeftRadius: 25,
                            height: '100vh',
                            backgroundColor: 'secondary.lighter',
                        }}
                        borderColor={'secondary.lighter'}
                        width='100%'
                    >
                        {isFetching ? (
                            <PageLoadProgress />
                        ) : (
                            <Box component='section' sx={{ height: '80vh', paddingTop: 5 }} width='100%'>
                                {isVideoTabSelected ? (
                                    <VideoList
                                        videos={displayVideos.map((video) => {
                                            return {
                                                title: video.title,
                                                videoId: video.id,
                                                thumbnailUrl: video.thumbnail,
                                            }
                                        })}
                                    />
                                ) : (
                                    <SubmissionBoxList submissionBoxes={submissionBoxes} />
                                )}
                            </Box>
                        )}
                    </Box>
                </Box>
            </Box>
        </>
    )

    async function fetchAllVideos(): Promise<Video[]> {
        const response = await fetch('/api/videos')
        const { videos } = await response.json()
        return videos
    }

    async function getUserIdByEmail(userEmail: string): Promise<string> {
        const response = await fetch('/api/user/getUserIdByEmail', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userEmail }),
        })
        const { userId } = await response.json()
        return userId
    }

    async function fetchMyBoxes(): Promise<SubmissionBox[]> {
        const response = await fetch('/api/submission-box/myboxes')
        const { submissionBoxes } = await response.json()
        return submissionBoxes
    }

    async function fetchMyRequests(): Promise<SubmissionBox[]> {
        const response = await fetch('/api/submission-box/requestedsubmissions')
        const { submissionBoxes } = await response.json()
        return submissionBoxes
    }
}
