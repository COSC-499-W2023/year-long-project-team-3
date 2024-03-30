'use client'

import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import React, { useEffect, useMemo, useState } from 'react'
import { Video } from '@prisma/client'
import { toast } from 'react-toastify'
import PageLoadProgress from '@/components/PageLoadProgress'
import DashboardSidebar from '@/components/DashboardSidebar'
import { SidebarOption } from '@/types/dashboard/sidebar'
import VideoList from '@/components/VideoList'
import SubmissionBoxList from '@/components/SubmissionBoxList'
import DashboardSearchBar from '@/components/DashboardSearchBar'
import { VideoSubmission } from '@/app/api/my-videos/route'
import { useRouter, useSearchParams } from 'next/navigation'
import { SubmissionBoxInfo } from '@/types/submission-box/submissionBoxInfo'

export default function DashboardPage() {
    const queriedTab = useSearchParams().get('tab')
    const router = useRouter()

    // Page component controls
    const [sidebarSelectedOption, setSidebarSelectedOption] = useState<SidebarOption>(queryParamToSidebarOption(queriedTab))
    const pageTitle = useMemo(() => {
        switch (sidebarSelectedOption) {
        case 'menu_my_videos': return 'My Videos'
        case 'submission_boxes_manage_boxes': return 'Manage Boxes'
        case 'submission_boxes_my_invitations': return 'My Invitations'
        default: return ''
        }
    }, [sidebarSelectedOption])
    const isVideoTabSelected = useMemo(() => sidebarSelectedOption === 'menu_my_videos', [sidebarSelectedOption])

    // Videos
    const [allVideos, setAllVideos] = useState<(Video & VideoSubmission)[]>([])

    // Submission Boxes
    const [mySubmissionBoxes, setMySubmissionBoxes] = useState<SubmissionBoxInfo[]>([])
    const [requestedSubmissionBoxes, setRequestedSubmissionBoxes] = useState<SubmissionBoxInfo[]>([])
    const selectedSubmissionBoxes = useMemo(() => {
        return sidebarSelectedOption === 'submission_boxes_manage_boxes' ? mySubmissionBoxes : requestedSubmissionBoxes
    }, [sidebarSelectedOption, mySubmissionBoxes, requestedSubmissionBoxes])

    // Page load controls
    const [isVideosFetching, setIsVideosFetching] = useState(false)
    const [isMyBoxesFetching, setIsMyBoxesFetching] = useState(false)
    const [isRequestsFetching, setIsRequestsFetching] = useState(false)

    // Search states
    const [searchTerm, setSearchTerm] = useState('')
    const isSearching = useMemo(() => {
        if (!searchTerm) {
            return false
        } else if (isVideoTabSelected && allVideos.length === 0) {
            return false
        } else if (!isVideoTabSelected && selectedSubmissionBoxes.length === 0) {
            return false
        } else {
            return searchTerm.length > 0
        }
    }, [searchTerm, isVideoTabSelected, allVideos.length, selectedSubmissionBoxes.length])

    // Fetch all videos on page load
    useEffect(() => {
        setIsVideosFetching(true)
        fetchAllVideos()
            .then((videos: (Video & VideoSubmission)[]) => setAllVideos(videos.toSorted(sortOnUpdatedAt) || []))
            .catch((error) => toast.error(error))
            .finally(() => setIsVideosFetching(false))
    }, [])

    // Fetch owned submission boxes on page load
    useEffect(() => {
        setIsMyBoxesFetching(true)
        fetchMyBoxes()
            .then((submissionBoxes) => setMySubmissionBoxes(submissionBoxes.toSorted(sortOnUpdatedAt)))
            .catch((error) => toast.error(error))
            .finally(() => setIsMyBoxesFetching(false))
    }, [])

    // Fetch my requests on page load
    useEffect(() => {
        setIsRequestsFetching(true)
        fetchMyRequests()
            .then((submissionBoxes) => setRequestedSubmissionBoxes(submissionBoxes.toSorted(sortOnUpdatedAt)))
            .catch((error) => toast.error(error))
            .finally(() => setIsRequestsFetching(false))
    }, [])

    // Filter videos based on search term
    const displayVideos = useMemo(() => {
        const search = searchTerm.trim().toLowerCase()
        return allVideos?.filter(
            (video) =>
                video.title.toLowerCase().includes(search) ||
                video.description?.toLowerCase().includes(search)
        ) ?? []
    }, [searchTerm, allVideos])

    // Filter submission boxes based on search term
    const displayedSubmissionBoxes = useMemo(() => {
        const search = searchTerm.trim().toLowerCase()
        return selectedSubmissionBoxes?.filter(
            (submissionBox) =>
                submissionBox.title.toLowerCase().includes(search) ||
                submissionBox.description?.toLowerCase().includes(search)
        ) ?? []
    }, [selectedSubmissionBoxes, searchTerm])

    return (
        <>
            <Box sx={{
                display: 'flex',
                flexDirection: 'row',
                height: '100%',
                width: '100%',
            }}>
                <DashboardSidebar
                    sidebarSelectedOption={sidebarSelectedOption}
                    setSidebarSelectedOption={handleSetSidebarSelectedOption}
                />
                <Box display='flex' flexDirection='column' width='100%'>
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
                            backgroundColor: 'secondary.lighter',
                            height: '100%',
                        }}
                        borderColor={'secondary.lighter'}
                    >
                        {isSelectedTabFetching() ? (
                            <PageLoadProgress />
                        ) : (
                            <Box
                                sx={{
                                    height: '100%',
                                    width: '100%',
                                    overflowY: 'auto',
                                    paddingTop: 2,
                                    maxHeight: 'calc(100vh - 170px)',
                                }}
                            >
                                {isVideoTabSelected ? (
                                    <VideoList
                                        videos={displayVideos.map((video) => {
                                            return {
                                                title: video.title,
                                                videoId: video.id,
                                                thumbnailUrl: video.thumbnail,
                                                description: video.description,
                                                isSubmitted: video.isSubmitted,
                                                createdDate: video.createdAt,
                                                submissionBoxes: video.submissions.map(submission => submission.requestedSubmission.submissionBox.title),
                                            }
                                        })}
                                        isSearching={isSearching}
                                        isOwned={true}
                                    />
                                ) : (
                                    <SubmissionBoxList
                                        submissionBoxes={displayedSubmissionBoxes}
                                        isSearching={isSearching}
                                        emptyMessage={sidebarSelectedOption === 'submission_boxes_manage_boxes' ? 'You do not own any submission boxes' : 'You have not been invited to any submission boxes'}
                                        isOwned={sidebarSelectedOption === 'submission_boxes_manage_boxes'}
                                    />
                                )}
                            </Box>
                        )}
                    </Box>
                </Box>
            </Box>
        </>
    )

    function sortOnUpdatedAt(a: {updatedAt: Date}, b: {updatedAt: Date}): number {
        return (new Date(b.updatedAt).getTime()) - (new Date(a.updatedAt).getTime())
    }

    function isSelectedTabFetching() {
        switch (sidebarSelectedOption) {
        case 'menu_my_videos': return isVideosFetching
        case 'submission_boxes_manage_boxes': return isMyBoxesFetching
        case 'submission_boxes_my_invitations': return isRequestsFetching
        default: return false
        }
    }

    async function fetchAllVideos(): Promise<(Video & VideoSubmission)[]> {
        const response = await fetch('/api/my-videos')
        const data = await response.json()
        return data.videoSubmission
    }

    async function fetchMyBoxes(): Promise<SubmissionBoxInfo[]> {
        const response = await fetch('/api/submission-box/myboxes')
        const { submissionBoxes } = await response.json()
        return submissionBoxes
    }

    async function fetchMyRequests(): Promise<SubmissionBoxInfo[]> {
        const response = await fetch('/api/submission-box/requestedsubmissions')
        const { submissionBoxes } = await response.json()
        return submissionBoxes
    }

    function handleSetSidebarSelectedOption(option: SidebarOption) {
        setSidebarSelectedOption(option)
        router.replace(`/dashboard?tab=${ sidebarOptionToQueryParam(option) }`)
    }
}

function queryParamToSidebarOption(queryParam: string | null): SidebarOption {
    switch (queryParam?.toLowerCase()) {
    case 'my-videos': return 'menu_my_videos'
    case 'my-invitations': return 'submission_boxes_my_invitations'
    case 'manage-boxes': return 'submission_boxes_manage_boxes'
    default: return 'menu_my_videos'
    }
}

function sidebarOptionToQueryParam(sidebarOption: SidebarOption): string {
    switch (sidebarOption) {
    case 'menu_my_videos': return 'my-videos'
    case 'submission_boxes_my_invitations': return 'my-invitations'
    case 'submission_boxes_manage_boxes': return 'manage-boxes'
    default: return 'my-videos'
    }
}
