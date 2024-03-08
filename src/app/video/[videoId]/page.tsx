'use client'

import { useSession } from 'next-auth/react'
import { usePathname, useRouter } from 'next/navigation'
import React, {useCallback, useEffect, useState} from 'react'
import { SubmissionBox, Video } from '@prisma/client'
import logger from '@/utils/logger'
import { toast } from 'react-toastify'
import { Alert, Box, Button, TextField, Typography } from '@mui/material'

import ScalingReactPlayer from '@/components/ScalingReactPlayer'
import PageLoadProgress from '@/components/PageLoadProgress'
import EditIcon from '@mui/icons-material/Edit'
import { theme } from '@/components/ThemeRegistry/theme'
import BackButton from '@/components/BackButton'
import dayjs from 'dayjs'
import SubmissionBoxesSelector, { MinifiedSubmissionBox } from '@/components/SubmisionBoxesSeletor'

export default function VideoDetailedPage() {
    const session = useSession()
    const router = useRouter()
    const pathname = usePathname()

    const videoId = pathname?.split('/').pop()

    const [video, setVideo] = useState<Video>()
    const [isFetchingVideo, setIsFetchingVideo] = useState(false)

    const [submittedToSubmissionBoxes, setSubmittedToSubmissionBoxes] = useState<SubmissionBox[]>([])
    const [isFetchingSubmittedToSubmissionBoxes, setIsFetchingSubmittedToSubmissionBoxes] = useState(false)

    const [requestedSubmissionBoxes, setRequestedSubmissionBoxes] = useState<SubmissionBox[]>([])
    const [isFetchingRequestedSubmissionBoxes, setIsFetchingRequestedSubmissionBoxes] = useState(false)

    const [userId, setUserId] = useState<string>()

    // Edit states
    const [isEditing, setIsEditing] = useState(false)
    const [titleEdit, setTitleEdit] = useState('')
    const [descriptionEdit, setDescriptionEdit] = useState('')

    useEffect(() => {
        if (!session || !session?.data?.user?.email) {
            return
        }
        getUserIdByEmail(session.data.user.email)
            .then((userId) => setUserId(userId))
            .catch((err) => {
                logger.error(err)
                toast.error('Unexpected error occurred')
            })
    }, [session])

    useEffect(() => {
        if (!video) {
            return
        }

        setTitleEdit(video.title)
        setDescriptionEdit(video?.description ?? '')
    }, [video])

    useEffect(() => {
        setIsFetchingVideo(true)
        setIsFetchingSubmittedToSubmissionBoxes(true)
        setIsFetchingRequestedSubmissionBoxes(true)

        if (!videoId) {
            router.push('/')
        }

        let errored= false

        fetch(`/api/video/${ videoId }`)
            .then((res) => {
                if (res.status === 403) {
                    if (!errored) {
                        toast.error('You do not have permission to view this video')
                    }
                    errored = true
                    router.push('/dashboard')
                } else if (!res.ok) {
                    throw new Error('Could not fetch video')
                }
                return res
            })
            .then((res) => res.json())
            .then(({ video }: { video: Video }) => {
                if (!video) {
                    throw new Error('Video not found')
                }
                setVideo(video)
                setIsFetchingVideo(false)
            })
            .catch((err) => {
                logger.error(err.message)
                if (!errored) {
                    toast.error('An unexpected error occurred!')
                }
            })

        fetch(`/api/submission-box/video/${ videoId }`)
            .then((res) => {
                if (res.status === 403) {
                    if (!errored) {
                        toast.error('You do not have permission to view this video')
                    }
                    errored = true
                    router.push('/dashboard')
                } else if (!res.ok) {
                    throw new Error('Could not fetch submission boxes')
                }
                return res
            })
            .then((res) => res.json())
            .then(({ submissionBoxes }: { submissionBoxes: SubmissionBox[] }) => {
                if (!submissionBoxes) {
                    throw new Error('Submission boxes not found')
                }
                setSubmittedToSubmissionBoxes(submissionBoxes)
                setIsFetchingSubmittedToSubmissionBoxes(false)
            })
            .catch((err) => {
                logger.error(err.message)
                if (!errored) {
                    toast.error('An unexpected error occurred!')
                }
            })

        fetch('/api/submission-box/requestedsubmissions')
            .then((res) => {
                if (!res.ok) {
                    errored = true
                    throw new Error('Could not fetch requested submission boxes')
                }
                return res
            })
            .then((res) => res.json())
            .then(({ submissionBoxes }: { submissionBoxes: SubmissionBox[] }) => {
                if (!submissionBoxes) {
                    throw new Error('Requested submission boxes not found')
                }
                setRequestedSubmissionBoxes(submissionBoxes)
                setIsFetchingRequestedSubmissionBoxes(false)
            })
            .catch((err) => {
                logger.error(err.message)
                if (!errored) {
                    toast.error(err.message || 'An unexpected error occurred!')
                }
            })
    }, [router, videoId])

    const onSubmit = useCallback((boxes: MinifiedSubmissionBox[]) => {
        fetch('/api/video/submit/new', {
            method: 'POST',
            body: JSON.stringify({
                videoId,
                submissionBoxIds: boxes.map((box) => box.id),
            }),
        }).then(_ => {})
    }, [videoId])

    const onUnsubmit = useCallback((boxes: MinifiedSubmissionBox[]) => {
        fetch('/api/video/submit/new', {
            method: 'DELETE',
            body: JSON.stringify({
                videoId,
                submissionBoxIds: boxes.map((box) => box.id),
            }),
        }).then(_ => {})
    }, [videoId])

    return (
        <>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'stretch',
                    m: 0,
                    p: 0,
                    width: '100%',
                    height: '100%',
                }}
            >
                {isFetchingVideo || isFetchingSubmittedToSubmissionBoxes || isFetchingRequestedSubmissionBoxes ? (
                    <PageLoadProgress />
                ) : (
                    <>
                        <Box>
                            <Box
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'flex-start',
                                    m: 0,
                                    width: '100%',
                                }}
                            >
                                <BackButton title={'Back'} />
                                <Box
                                    sx={{
                                        display: 'flex',
                                        width: '100%',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}
                                >
                                    <Alert
                                        severity='info'
                                        sx={{
                                            visibility: isEditing ? 'block' : 'hidden',
                                            borderRadius: '1rem',
                                        }}
                                    >
                                        You can only edit title and description
                                    </Alert>
                                </Box>
                                <Box display='flex' width='100%' height='70vh' padding='2rem' gap='4rem'>
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            flexGrow: 1,
                                            flexShrink: 1,
                                            minWidth: '20vw',
                                            width: '100%',
                                        }}
                                    >
                                        {!isFetchingVideo && !!video?.processedVideoUrl && (
                                            <ScalingReactPlayer
                                                data-cy='scaling-react-player'
                                                url={video?.processedVideoUrl}
                                                allowKeyDown={!isEditing}
                                            />
                                        )}
                                    </Box>
                                    <Box
                                        width='30vw'
                                        sx={{
                                            borderRadius: '32px',
                                            backgroundColor: '#F7F9FC',
                                            padding: '1rem 2rem',
                                        }}
                                        display='flex'
                                        flexDirection='column'
                                        position='relative'
                                    >
                                        <Box
                                            width='25vw'
                                            height='100%'
                                            sx={{
                                                '&:> *': {
                                                    color: '#6B6C7E',
                                                },
                                                display: 'flex',
                                                flexDirection: 'column',
                                                gap: '1rem',
                                                color: theme.palette.text.secondary,
                                            }}
                                            overflow='auto'
                                            paddingRight='1rem'
                                            paddingTop='1rem'
                                            paddingBottom='0.5rem'
                                        >
                                            <Box>
                                                <Typography noWrap sx={{ fontWeight: 'bold' }}>
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
                                                        value={titleEdit}
                                                        onChange={(evt) => setTitleEdit(evt.target.value)}
                                                        inputProps={{
                                                            'data-cy': 'detail-video-title-edit',
                                                        }}
                                                    />
                                                ) : (
                                                    <Typography
                                                        variant='h4'
                                                        sx={{
                                                            fontWeight: 'bold',
                                                            overflowX: 'auto',
                                                            overflowY: 'hidden',
                                                        }}
                                                        whiteSpace='nowrap'
                                                        data-cy='detail-video-title'
                                                    >
                                                        {video?.title}
                                                    </Typography>
                                                )}
                                            </Box>
                                            <Box>
                                                <Typography
                                                    sx={{
                                                        fontWeight: 'bold',
                                                        display: !!video?.description || isEditing ? 'block' : 'none',
                                                    }}
                                                >
                                                    Description
                                                </Typography>
                                                {isEditing ? (
                                                    <TextField
                                                        variant='outlined'
                                                        multiline
                                                        rows={4}
                                                        sx={{
                                                            '& .MuiInputBase-root.MuiOutlinedInput-root': {
                                                                borderRadius: '8px',
                                                            },
                                                            width: '100%',
                                                        }}
                                                        value={descriptionEdit}
                                                        onChange={(evt) => setDescriptionEdit(evt.target.value)}
                                                        inputProps={{
                                                            'data-cy': 'detail-video-description-edit',
                                                        }}
                                                    />
                                                ) : (
                                                    <Typography data-cy='detail-video-description'>
                                                        {video?.description}
                                                    </Typography>
                                                )}
                                            </Box>
                                            <Box
                                                data-cy='submission-box-chips-wrapper'
                                            >
                                                <Typography sx={{ fontWeight: 'bold' }}>Submitted To</Typography>
                                                <Box
                                                    sx={{
                                                        py: '0.5rem',
                                                    }}
                                                >
                                                    <SubmissionBoxesSelector
                                                        allSubmissionBoxes={toMinimizedBoxes(requestedSubmissionBoxes)}
                                                        submittedBoxes={toMinimizedBoxes(submittedToSubmissionBoxes)}
                                                        onSubmit={onSubmit}
                                                        onUnsubmit={onUnsubmit}
                                                    />
                                                </Box>
                                            </Box>
                                            <Box>
                                                <Typography sx={{ fontWeight: 'bold' }}>Other information</Typography>
                                                <Typography>
                                                    Created at:{' '}
                                                    {!!video?.createdAt
                                                        ? dayjs(video?.createdAt).format('MMM D, h:mma')
                                                        : 'N/A'}
                                                </Typography>
                                                <Typography>
                                                    Updated at:{' '}
                                                    {!!video?.updatedAt
                                                        ? dayjs(video?.updatedAt).format('MMM D, h:mma')
                                                        : 'N/A'}
                                                </Typography>
                                            </Box>
                                        </Box>
                                        {isEditing && (
                                            <Box display='flex' justifyContent='flex-end' gap={1}>
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
                                        {!isEditing && video?.ownerId === userId && (
                                            <Box
                                                position='absolute'
                                                top='2rem'
                                                right='2rem'
                                                onClick={onEditStart}
                                                data-cy='edit-icon'
                                            >
                                                <EditIcon
                                                    sx={{
                                                        cursor: 'pointer',
                                                        color: theme.palette.text.secondary,
                                                    }}
                                                />
                                            </Box>
                                        )}
                                    </Box>
                                </Box>
                            </Box>
                        </Box>
                    </>
                )}
            </Box>
        </>
    )

    function onCancelEdit() {
        setIsEditing(false)
        if (!!video) {
            setTitleEdit(video.title)
            setDescriptionEdit(video.description ?? '')
        }
    }

    function onUpdateVideoInfo() {
        setIsEditing(false)

        fetch(`/api/video/update/${ videoId }`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                title: titleEdit,
                description: descriptionEdit,
            }),
        })
            .then((res) => res.json())
            .then((data) => {
                if (!data.video) {
                    throw new Error('Could not update video')
                }
                setVideo(data.video)
            })
            .catch((err) => {
                logger.error(err.message)
                toast.error('An unexpected error occurred!')
            })
    }

    function onEditStart() {
        setIsEditing(true)
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

function toMinimizedBoxes(boxes: SubmissionBox[]) {
    return boxes.map((box) => {
        return {id: box.id, title: box.title}
    })
}
