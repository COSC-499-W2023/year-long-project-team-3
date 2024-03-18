'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { SubmissionBox, Video } from '@prisma/client'
import logger from '@/utils/logger'
import { toast } from 'react-toastify'
import { Alert, Box, Button, Chip, Modal, TextField, Typography } from '@mui/material'

import ScalingReactPlayer from '@/components/ScalingReactPlayer'
import PageLoadProgress from '@/components/PageLoadProgress'
import BackButton from '@/components/BackButton'
import EditIcon from '@mui/icons-material/Edit'
import { theme } from '@/components/ThemeRegistry/theme'
import dayjs from 'dayjs'

export type VideoDetailedPageProps = {
    params: {
        videoId: string
    }
}

export default function VideoDetailedPage({ params }: VideoDetailedPageProps) {
    const session = useSession()
    const router = useRouter()

    const { videoId } = params

    const [video, setVideo] = useState<Video>()
    const [isFetchingVideo, setIsFetchingVideo] = useState(false)

    const [submissionBoxes, setSubmissionBoxes] = useState<SubmissionBox[]>([])
    const [isFetchingSubmissionBoxes, setIsFetchingSubmissionBoxes] = useState(false)

    const [userId, setUserId] = useState<string>()

    // Edit states
    const [isEditing, setIsEditing] = useState(false)
    const [titleEdit, setTitleEdit] = useState('')
    const [descriptionEdit, setDescriptionEdit] = useState('')

    // Delete confirm modal
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)


    const modalStyle = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '25rem',
        minWidth: '20rem',
        backgroundColor: 'background.default',
        borderRadius: '1rem',
        boxShadow: 24,
        p: '1rem 2rem',
    }

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
        setIsFetchingSubmissionBoxes(true)

        if (!videoId) {
            router.push('/')
        }

        Promise.all([
            fetch(`/api/video/${ videoId }`),
            fetch(`/api/submission-box/video/${ videoId }`),
        ])
            .then(async ([videoRes, submissionBoxesRes]) => [await videoRes.json(), await submissionBoxesRes.json()])
            .then(([videoData, submissionBoxesData]) => {
                if (!videoData.video || !submissionBoxesData.submissionBoxes) {
                    throw new Error('Could not fetch video or submission boxes')
                }
                setVideo(videoData.video)
                setSubmissionBoxes(submissionBoxesData.submissionBoxes)
            })
            .catch((err) => {
                logger.error(err.message)
                toast.error('An unexpected error occurred while trying to load your video!')
                router.push('/dashboard')
            })
            .finally(() => {
                setIsFetchingVideo(false)
                setIsFetchingSubmissionBoxes(false)
            })
    }, [router, videoId])

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
                {isFetchingVideo || isFetchingSubmissionBoxes ? (
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
                                                        variant='h3'
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
                                                {submissionBoxes.length > 0 ? submissionBoxes.map((submissionBox, idx) => (
                                                    <Chip
                                                        key={`submission-box-chip-${ idx }`}
                                                        label={submissionBox.title}
                                                        sx={{ m: 0.5, ml: 0 }}
                                                    />
                                                )) : 'None'}
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
                                            {!isEditing && (
                                                <Box
                                                    sx={{
                                                        mt: '2rem',
                                                    }}
                                                >
                                                    <Button
                                                        variant='contained'
                                                        onClick={() => router.push('/dashboard?tab=my-invitations')}
                                                        data-cy='detail-video-submit-button'
                                                    >
                                                    Submit to a Submission Box
                                                    </Button>
                                                </Box>
                                            )}
                                        </Box>
                                        {isEditing && (
                                            <Box display='flex' justifyContent='space-between' gap={1} marginBottom={1}>
                                                <Box>
                                                    <Button
                                                        variant='contained'
                                                        color='error'
                                                        onClick={onDeleteButtonClicked}
                                                        data-cy='detail-video-delete-button'
                                                    >
                                                        Delete
                                                    </Button>
                                                </Box>
                                                <Box display='flex' gap={1}>
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

            <Modal open={isDeleteModalOpen} onClose={handleModalClose}>
                <Box sx={{
                    ...modalStyle,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: '1rem',
                }}>
                    <Typography
                        component='div'
                        sx={{
                            textAlign: 'center',
                            marginTop: '1rem',
                            width: 'max-content',
                        }}
                    >
                        Are you sure you want to delete this video?

                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                width: '100%',
                                marginTop: '1.5rem',
                                marginBottom: '.5rem',
                            }}
                        >
                            <Button
                                variant='contained'
                                color='inherit'
                                className='modal-close'
                                onClick={handleModalClose}
                                data-cy='detail-video-delete-cancel-button'
                            >
                                Cancel
                            </Button>
                            <Button
                                variant='contained'
                                color='error'
                                className='modal-close'
                                onClick={handleDeleteVideo}
                                data-cy='detail-video-delete-confirm-button'
                            >
                                Delete
                            </Button>
                        </Box>
                    </Typography>
                </Box>
            </Modal>
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

    async function handleDeleteVideo() {
        handleModalClose()
        try {
            const response = await fetch(`/api/video/delete/${ videoId }`, {
                method: 'DELETE',
            })
            if (!response.ok) {
                logger.error(response.statusText)
                toast.error('An unexpected error occurred while trying to delete your video!')
            } else {
                router.push('/dashboard')
                toast.success('Video deleted successfully!')
            }
        } catch (error) {
            if (error instanceof Error) {
                logger.error(error.message)
            }
            toast.error('An unexpected error occurred!')
        }
    }

    function onDeleteButtonClicked() {
        setIsDeleteModalOpen(true)
    }

    function handleModalClose() {
        setIsDeleteModalOpen(false)
    }
}
