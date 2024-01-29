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
import { Button, TextField, Typography } from '@mui/material'
import ScalingReactPlayer from '@/components/ScalingReactPlayer'
import { BoxStatus } from '@/types/submission-box/boxStatus'
import EditIcon from '@mui/icons-material/Edit'
import { theme } from '@/components/ThemeRegistry/theme'
import logger from '@/utils/logger'
import { toast } from 'react-toastify'

export default function SubmissionBoxDetailPage() {
    const session: SessionContextValue = useSession()
    const pathname = usePathname()

    const [boxInfo, setBoxInfo] = useState<SubmissionBox | null>(null)
    const [boxType, setBoxType] = useState<BoxStatus>('requested')

    const [videoUrl, setVideoUrl] = useState(null)
    const [videos, setVideos] = useState<Video[]>([])

    const [boxTitleEdit, setBoxTitleEdit] = useState('')
    const [boxDescriptionEdit, setBoxDescriptionEdit] = useState('')
    const [boxDateEdit, setBoxDateEdit] = useState<Date|null>()
    const [isEditing, setIsEditing] = useState(false)

    const boxId = pathname?.split('/').pop()

    useEffect(() => {
        fetchSubmissionBox(boxId)
    }, [boxId])

    return (
        <>
            <Box height='100wv' width='100%'>
                <Header {...session} />
                <BackButton route={'/dashboard '} title={'Return to Dashboard'} />{' '}
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
                            />
                        </Box>
                        <Box padding='1rem'>
                            {!isEditing && (
                                <Box
                                    top='2rem'
                                    right='2rem'
                                    onClick={onEditStart}
                                    data-cy='edit-icon'
                                    display='flex'
                                    flexDirection='row-reverse'
                                >
                                    <EditIcon
                                        sx={{
                                            cursor: 'pointer',
                                            color: theme.palette.text.secondary,
                                        }}
                                    />
                                </Box>
                            )}
                            <Typography data-cy='submissionBoxTitleHeading' color={'textSecondary'} sx={{ m: 1, fontWeight: 'bold' }}>
                                Title
                            </Typography>
                            {isEditing ? (
                                <TextField
                                    variant='standard'
                                    sx={{
                                        '& .MuiInputBase-root.MuiOutlinedInput-root': {
                                            borderRadius: '8px',
                                        },
                                        width: '100%',
                                    }}
                                    value={boxTitleEdit}
                                    onChange={(evt) => setBoxTitleEdit(evt.target.value)}
                                    inputProps={{
                                        'data-cy': 'submissionBoxTitleEdit',
                                    }}
                                />
                            ) : (
                                <Typography
                                    data-cy='submissionBoxTitle'
                                    variant='h5'
                                    color={'textSecondary'}
                                    paddingBottom='2rem'
                                    sx={{ m: 1, fontWeight: 'bold' }}
                                >
                                    {boxInfo ? boxInfo.title : 'N/A'}
                                </Typography>
                            )}
                            <Typography data-cy='submissionBoxDateHeading' color={'textSecondary'} sx={{ m: 1, fontWeight: 'bold' }}>
                                Close Date:
                            </Typography>
                            <Typography
                                data-cy='submissionBoxDate'
                                variant='h6'
                                color={'textSecondary'}
                                paddingBottom='2rem'
                                paddingLeft='1rem'
                                sx={{ m: 1 }}
                            >
                                {boxInfo
                                    ? !!boxInfo.closesAt
                                        ? new Date(boxInfo.closesAt).toDateString().slice(4)
                                        : 'N/A'
                                    : 'N/A'}
                            </Typography>
                            <Typography data-cy='submissionBoxDescHeading' color={'textSecondary'} sx={{ m: 1, fontWeight: 'bold' }}>
                                Description
                            </Typography>
                            {isEditing ? (
                                <TextField
                                    variant='outlined'
                                    multiline
                                    sx={{
                                        '& .MuiInputBase-root.MuiOutlinedInput-root': {
                                            borderRadius: '8px',
                                        },
                                        width: '100%',
                                    }}
                                    value={boxDescriptionEdit}
                                    onChange={(evt) => setBoxDescriptionEdit(evt.target.value)}
                                    inputProps={{
                                        'data-cy': 'submissionBoxDescEdit',
                                    }}
                                />
                            ) : (
                                <Typography
                                    data-cy='submissionBoxDesc'
                                    variant='subtitle2'
                                    color={'textSecondary'}
                                    paddingBottom='2rem'
                                    paddingLeft='1rem'
                                    sx={{ m: 1 }}
                                >
                                    {boxInfo ? boxInfo.description ?? 'N/A' : 'N/A'}
                                </Typography>
                            )}
                            {isEditing && (
                                <Box display='flex' justifyContent='flex-end' gap={1} padding='1rem'>
                                    <Button
                                        variant='contained'
                                        color='inherit'
                                        onClick={onCancelEdit}
                                        data-cy='detail-video-cancel-button'
                                    >
                                      Cancel
                                    </Button>
                                    <Button
                                        variant='contained'
                                        onClick={onUpdateVideoInfo}
                                        data-cy='detail-video-update-button'
                                    >
                                      Update
                                    </Button>
                                </Box>
                            )}
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
                                {videos.length !== 0 ? (
                                    videoUrl !== null ? (
                                        <ScalingReactPlayer data-cy='scaling-react-player' url={videoUrl} />
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
                        <Box paddingLeft='1rem'>
                            <SubmissionBoxDetails submissionBox={boxInfo} />
                        </Box>
                    </Box>
                )}
            </Box>
        </>
    )

    async function fetchSubmissionBox(boxId: string | undefined) {
        const response = await fetch(`/api/submission-box/${ boxId }`)
        const { box, videos, submissionBoxInfo } = await response.json()
        setBoxType(box)
        setBoxInfo(submissionBoxInfo)
        setVideos(videos)
        if (videos.length === 1) {
            setVideoUrl(
                videos?.map((video: { processedVideoUrl: any }) => {
                    return video.processedVideoUrl
                })
            )
        }
    }

    function onCancelEdit() {
        setIsEditing(false)
        if (!!boxInfo) {
            setBoxTitleEdit(boxInfo.title)
            setBoxDescriptionEdit(boxInfo.description ?? '')
            setBoxDateEdit(boxInfo.closesAt)
        }
    }

    function onUpdateVideoInfo() {
        setIsEditing(false)

        fetch(`/api/submission-box/update/${ boxId }`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                title: boxTitleEdit,
                description: boxDescriptionEdit,
                closesAt: boxDateEdit,
            }),
        })
            .then((res) => res.json())
            .then((data) => {
                if (!data.submissionBox) {
                    throw new Error('Could not update submission box')
                }
                setBoxInfo(data.submissionBox)
            })
            .catch((err) => {
                logger.error(err.message)
                toast.error('An unexpected error occurred!')
            })
    }

    function onEditStart() {
        setIsEditing(true)
    }
}
