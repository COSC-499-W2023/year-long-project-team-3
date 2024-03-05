'use client'

import { useSession } from 'next-auth/react'
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
import { useRouter } from 'next/navigation'

export default function DashboardPage() {
    const session = useSession()
    const router = useRouter()
    // Videos
    const [allVideos, setAllVideos] = useState<Video[]>([])
    const [tempVideos, setTempVideos] = useState<Video[]>([])
    const [displayVideos, setDisplayVideos] = useState<Video[]>([])

    // Submission Boxes
    const [submissionBoxes, setSubmissionBoxes] = useState<SubmissionBox[]>([])
    const [tempSubmissionBoxes, setTempSubmissionBoxes] = useState<SubmissionBox[]>([])

    // Page component controls
    const [sidebarSelectedOption, setSidebarSelectedOption] = useState<SidebarOption>('menu_my_videos')
    const [pageTitle, setPageTitle] = useState('My Videos')
    const [isVideoTabSelected, setIsVideoTabSelected] = useState(true)

    // Page load controls
    const [isFetching, setIsFetching] = useState(false)

    // Search states
    const [searchTerm, setSearchTerm] = useState('')
    const [isSearching, setIsSearching] = useState(false)

    // Fetch all videos for the "recent" tab
    useEffect(() => {
        setIsFetching(true)
        fetchAllVideos()
            .then((videos: Video[]) => setAllVideos(videos))
            .catch((error) => toast.error(error))
            .finally(() => setIsFetching(false))
    }, [])

    useEffect(() => {
        if (!searchTerm) {
            setIsSearching(false)
        } else if (isVideoTabSelected && tempVideos.length === 0) {
            setIsSearching(false)
        } else if (!isVideoTabSelected && tempSubmissionBoxes.length === 0) {
            setIsSearching(false)
        } else {
            setIsSearching(searchTerm.length > 0)
        }
    }, [displayVideos.length, isVideoTabSelected, searchTerm, submissionBoxes.length, tempSubmissionBoxes.length, tempVideos.length])

    useEffect(() => {
        if (isVideoTabSelected) {
            const filteredVideos = tempVideos?.filter(
                (video) =>
                    video.title.toLowerCase().includes(searchTerm.trim().toLowerCase()) ||
                    video.description?.toLowerCase().includes(searchTerm.trim().toLowerCase())
            ) ?? []
            setDisplayVideos(filteredVideos)
        } else {
            const filteredSubmissionBoxes = tempSubmissionBoxes?.filter(
                (submissionBox) =>
                    submissionBox.title.toLowerCase().includes(searchTerm.trim().toLowerCase()) ||
                    submissionBox.description?.toLowerCase().includes(searchTerm.trim().toLowerCase())
            ) ?? []
            setSubmissionBoxes(filteredSubmissionBoxes)
        }
    }, [isVideoTabSelected, searchTerm, tempSubmissionBoxes, tempVideos])

    // If click on video-related tab, filter videos based on sidebar selection
    // If click on submission box-related tab, fetch submission boxes
    useEffect(() => {
        if (!sidebarSelectedOption) {
            return
        }

        if (!session.data?.user?.email) {
            return
        }

        if (sidebarSelectedOption === 'menu_my_videos') {
            setIsVideoTabSelected(true)
            setPageTitle('My Videos')
            const sortedVideos =
                allVideos?.toSorted((video, otherVideo) => {
                    const videoUpdatedAt = new Date(video?.updatedAt).getTime() ?? 0
                    const otherVideoUpdatedAt = new Date(otherVideo?.updatedAt).getTime() ?? 0
                    return otherVideoUpdatedAt - videoUpdatedAt
                }) || []
            setTempVideos(sortedVideos)
        } else if (sidebarSelectedOption === 'submission_boxes_manage_boxes') {
            setIsVideoTabSelected(false)
            setPageTitle('Manage Boxes')

            setIsFetching(true)
            fetchMyBoxes()
                .then((submissionBoxes) => {
                    setTempSubmissionBoxes(submissionBoxes)
                })
                .catch((error) => toast.error(error))
                .finally(() => setIsFetching(false))
        } else if (sidebarSelectedOption === 'submission_boxes_my_invitations') {
            setIsVideoTabSelected(false)
            setPageTitle('My Invitations')

            setIsFetching(true)
            fetchMyRequests()
                .then((submissionBoxes) => {
                    setTempSubmissionBoxes(submissionBoxes)
                })
                .catch((error) => toast.error(error))
                .finally(() => setIsFetching(false))
        }
    }, [sidebarSelectedOption, allVideos, session])

    return (
        <>
            <Box sx={{
                display: 'flex',
                flexDirection: 'row',
                flexGrow: 1,
                height: '100%',
                width: '100%',
            }}>
                <DashboardSidebar
                    sidebarSelectedOption={sidebarSelectedOption}
                    setSidebarSelectedOption={setSidebarSelectedOption}
                />
                <Box width='100%' display='flex' flexDirection='column'>
                    <Box display='flex' justifyContent='space-between' alignItems='center' paddingRight='3rem'>
                        <Typography
                            data-cy='title'
                            variant='h6'
                            color={'textSecondary'}
                            sx={{ m: '1rem', mb: 0, fontWeight: 'bold', py: '1rem' }}
                        >
                            {pageTitle}
                        </Typography>
                        <DashboardSearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
                    </Box>
                    <Box
                        sx={{
                            borderTopLeftRadius: 25,
                            borderBottomLeftRadius: 25,
                            backgroundColor: 'secondary.lighter',
                            height: '100%',
                        }}
                        borderColor={'secondary.lighter'}
                    >
                        {isFetching ? (
                            <PageLoadProgress />
                        ) : (
                            <Box component='section' sx={{ height: '100%', paddingTop: 5 }} width='100%'>
                                {isVideoTabSelected ? (
                                    <VideoList
                                        videos={displayVideos.map((video) => {
                                            return {
                                                title: video.title,
                                                videoId: video.id,
                                                thumbnailUrl: video.thumbnail,
                                                handleVideoClick: handleVideoClick,
                                            }
                                        })}
                                        isSearching={isSearching}
                                    />
                                ) : (
                                    <SubmissionBoxList
                                        submissionBoxes={submissionBoxes}
                                        isSearching={isSearching}
                                        emptyMessage={sidebarSelectedOption === 'submission_boxes_manage_boxes' ? 'You do not own any submission boxes' : 'You have not been invited to any submission boxes'}
                                    />
                                )}
                            </Box>
                        )}
                    </Box>
                </Box>
            </Box>
        </>
    )

    async function fetchAllVideos(): Promise<Video[]> {
        const response = await fetch('/api/my-videos')
        const { videos } = await response.json()
        return videos
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

    function handleVideoClick(videoId: string) {
        console.log('hello')
        router.push(`/video/${ videoId }`)
    }
}
