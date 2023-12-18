'use client'

import Dashboard from '@/components/Dashboard'
import { useSession } from 'next-auth/react'
import Header from '@/components/Header'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import React, { useEffect, useState } from 'react'
import Logo from '@/components/Logo'
import { Video } from '@prisma/client'
import { toast } from 'react-toastify'
import logger from '@/utils/logger'
import PageLoadProgress from '@/components/PageLoadProgress'
import DashboardSidebar from '@/components/DashboardSidebar'
import { SidebarOption } from '@/types/dashboard/sidebar'
import VideoList from '@/components/VideoList'

export default function DashboardPage() {
    const session = useSession()

    const [allVideos, setAllVideos] = useState<Video[]>([])
    const [displayVideos, setDisplayVideos] = useState<Video[]>([])
    const [sidebarSelectedOption, setSidebarSelectedOption] = useState<SidebarOption>('menu_recent')
    const [pageTitle, setPageTitle] = useState('Recent')

    // Loads
    const [isFetching, setIsFetching] = useState(false)
    const [isDisplayWaiting, setIsDisplayWaiting] = useState(false)

    useEffect(() => {
        setIsFetching(true)
        fetchAllVideos()
            .then((videos: Video[]) => {
                setAllVideos(videos)
            })
            .catch((error) => {
                toast.error(error)
                logger.error(error)
            })
            .finally(() => {
                setIsFetching(false)
            })
    }, [])

    useEffect(() => {
        if (!allVideos || allVideos.length === 0 || !sidebarSelectedOption) {
            return
        }

        if (!session.data?.user?.email) {
            return
        }

        if (sidebarSelectedOption === 'menu_recent') {
            setPageTitle('Recent')
            const sortedVideos = allVideos.toSorted((video, otherVideo) => {
                const videoUpdatedAt = new Date(video?.updatedAt).getTime() ?? 0
                const otherVideoUpdatedAt = new Date(otherVideo?.updatedAt).getTime() ?? 0
                return otherVideoUpdatedAt - videoUpdatedAt
            })
            setDisplayVideos(sortedVideos)
        } else if (sidebarSelectedOption === 'menu_submitted_videos') {
            setPageTitle('Submitted Videos')
            setIsDisplayWaiting(true)
            getUserIdByEmail(session.data.user.email)
                .then((userId) => {
                    setDisplayVideos(allVideos.filter((video) => video.ownerId === userId))
                })
                .catch((error) => {
                    toast.error(error)
                })
                .finally(() => {
                    setIsDisplayWaiting(false)
                })
        } else if (sidebarSelectedOption === 'menu_starred') {
            setPageTitle('Starred')
            // TODO: Added isStarred field to Video model
            setDisplayVideos([])
        } else if (sidebarSelectedOption === 'menu_trash') {
            setPageTitle('Trash')
            // TODO: Added isDeleted field to Video model
            setDisplayVideos([])
        }
    }, [sidebarSelectedOption, allVideos, session])

    return (
        <>
            <Header {...session} />
            {isFetching ? (
                <PageLoadProgress />
            ) : (
                <Box display='grid' gridTemplateColumns='1fr 4fr' height='100%' width='100%'>
                    <DashboardSidebar
                        sidebarSelectedOption={sidebarSelectedOption}
                        setSidebarSelectedOption={setSidebarSelectedOption}
                    />
                    <Box width='100%' display='flex' flexDirection='column'>
                        <Typography
                            data-cy='title'
                            variant='h5'
                            color={'textSecondary'}
                            sx={{ m: 2, fontWeight: 'bold', py: '1rem', marginTop: '1rem' }}
                        >
                            {pageTitle}
                        </Typography>
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
                            {isDisplayWaiting ? (
                                <PageLoadProgress />
                            ) : (
                                <Box component='section' sx={{ height: '80vh', paddingTop: 5 }} width='100%'>
                                    <VideoList
                                        videos={displayVideos.map((video) => {
                                            return {
                                                title: video.title,
                                                videoId: video.id,
                                                thumbnailUrl: video.thumbnail,
                                            }
                                        })}
                                    />
                                </Box>
                            )}
                        </Box>
                    </Box>
                    ; ;
                </Box>
            )}
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
}
