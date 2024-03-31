'use client'

import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { Typography, Box, Link, Dialog, DialogTitle, DialogActions, Button, Alert, TextField } from '@mui/material'
import { RequestedSubmission, SubmissionBox, Video } from '@prisma/client'
import VideoList from '@/components/VideoList'
import BackButtonWithLink from '@/components/BackButtonWithLink'
import SubmissionBoxDetails from '@/components/SubmissionBoxDetails'
import ScalingReactPlayer from '@/components/ScalingReactPlayer'
import PageLoadProgress from '@/components/PageLoadProgress'
import { BoxStatus } from '@/types/submission-box/boxStatus'
import { toast } from 'react-toastify'
import SelectVideoForSubmission from '@/components/SelectVideoForSubmission'
import { VideoSubmission } from '@/app/api/my-videos/route'
import EditIcon from '@mui/icons-material/Edit'
import * as yup from 'yup'
import { useFormik } from 'formik'
import { ObjectSchema } from 'yup'
import { SubmissionModificationData } from '@/types/submission-box/submissionModificationData'
import dayjs from 'dayjs'
import { DateTimePicker } from '@mui/x-date-pickers'

export type SubmissionBoxDetailPageProps = {
    params: {
        boxId: string
    }
}

export default function SubmissionBoxDetailPage({ params }: SubmissionBoxDetailPageProps) {
    const router = useRouter()
    const [isFetchingSubmissionBox, setIsFetchingSubmissionBox] = useState(true)
    const [boxType, setBoxType] = useState<BoxStatus>('requested')
    const [videos, setVideos] = useState<(any)[]>([])
    const [boxInfo, setBoxInfo] = useState<SubmissionBox & { requestedSubmissions: RequestedSubmission[]} | null>(null)
    const [isEditing, setIsEditing] = useState(false)
    const [isFormSubmitted, setIsFormSubmitted] = useState(false)

    const { boxId } = params
    const [unsubmitDialogOpen, setUnsubmitDialogOpen] = useState(false)
    const formik = useFormik<SubmissionModificationData>({
        initialValues: {
            title: boxInfo ? boxInfo.title : 'Title',
            description: boxInfo ? boxInfo.description : '',
            closesAt: boxInfo ? boxInfo.closesAt : null,
        },
        enableReinitialize: true,
        validationSchema: validationSchema,
        onSubmit: (values: SubmissionModificationData) => handleSubmit(values),
    })

    async function handleSubmit(submissionModificationData: SubmissionModificationData) {
        const submissionModificationForm = new FormData()
        submissionModificationForm.set('title', submissionModificationData.title)
        if (submissionModificationData.description) {
            submissionModificationForm.set('description', submissionModificationData.description)
        }
        if (submissionModificationData.closesAt) {
            submissionModificationForm.set('closesAt', submissionModificationData.closesAt.toString())
        }
        setIsEditing(false)
        setIsFetchingSubmissionBox(true)
        fetch(`/api/submission-box/update/${ boxId }`, {
            method: 'PUT',
            body: submissionModificationForm,
        })
            .then(async (res: Response) => {
                const body = await res.json()
                if (res.status !== 200) {
                    throw new Error(body.error)
                }
                setBoxInfo(body)
            })
            .catch(() => {
                toast.error('An unexpected error occurred')
            })
            .finally(() => {
                setIsFetchingSubmissionBox(false)
                setIsFormSubmitted(true)
            })
    }

    useEffect(() => {
        setIsFetchingSubmissionBox(true)

        fetch(`/api/submission-box/${ boxId }`)
            .then(async (res) => {
                const { box, videos, submissionBoxInfo } = await res.json()
                if (!submissionBoxInfo) {
                    router.push('/dashboard')
                    toast.error('You do not have permission to view this submission box')
                }
                setBoxType(box)
                setBoxInfo(submissionBoxInfo)
                setVideos(videos)
            })
            .catch(() => {
                router.push('/dashboard')
                toast.error('An error occurred trying to access submission box')
            })
            .finally(() => {
                setIsFetchingSubmissionBox(false)
                setIsFormSubmitted(false)
            })
    }, [boxId, router, isFormSubmitted])

    return (
        <>
            <BackButtonWithLink route={boxType === 'owned'? '/dashboard?tab=manage-boxes' : '/dashboard?tab=my-invitations'} title={'Return to Dashboard'} />
            {isFetchingSubmissionBox ? (
                <PageLoadProgress />
            ) : (
                <>
                    {boxType === 'owned' && (
                        <Box flexGrow='1' display='grid' gridTemplateColumns='3fr 1fr' height='100%' width='100%'>
                            <Box
                                sx={{
                                    borderTopRightRadius: 25,
                                    height: '100%',
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
                                            description: video.description,
                                            // isSubmitted is true always since we are viewing the video inside the box
                                            isSubmitted: true,
                                            createdDate: video.createdAt,
                                            // Not passing submission boxes when video is viewed in submission box
                                            submissionBoxes: [],
                                            userEmail: video.email,
                                            dateSubmitted: video.updatedAt,
                                        }
                                    })}
                                    isSearching={false}
                                    emptyMessage={'No Videos Have Been Submitted to Your Box'}
                                    isOwned={false}
                                />
                            </Box>
                            <Box pr='1rem' pl='2rem'>
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
                                            fill={'textSecondary'}
                                            sx={{
                                                cursor: 'pointer',
                                            }}
                                        />
                                    </Box>
                                )}
                                {!isEditing ? (
                                    <SubmissionBoxDetails submissionBox={boxInfo} isOwned={true}/>
                                ) : (
                                    <>
                                        <form onSubmit={formik.handleSubmit} noValidate>
                                            <Box>
                                                <Typography data-cy='submissionBoxTitleHeading' color={'textSecondary'} sx={{ m: 1, fontWeight: 'bold' }}>
                                                    Title
                                                </Typography>
                                                <TextField
                                                    type='text'
                                                    name='title'
                                                    sx={{ color: 'textSecondary', fontWeight: 'bold', width: '100%', mb: 1 }}
                                                    error={formik.touched.title && Boolean(formik.errors.title)}
                                                    onChange={formik.handleChange}
                                                    onBlur={formik.handleBlur}
                                                    value={formik.values.title}
                                                    FormHelperTextProps={{ style: { position: 'absolute', bottom: -20 } }}
                                                    helperText={formik.touched.title && formik.errors.title}
                                                    data-cy='submissionBoxTitleEditing'
                                                />
                                                <Typography data-cy='submissionBoxDateHeading' color={'textSecondary'} sx={{ m: 1, fontWeight: 'bold' }}>
                                                    Close Date:
                                                </Typography>
                                                <DateTimePicker
                                                    className='data-cy-date-time-picker' // regular data-cy wasn't working
                                                    disablePast
                                                    sx={{ width: '100%', mb: 1 }}
                                                    value={formik.values.closesAt ? dayjs(formik.values.closesAt) : null}
                                                    onChange={(e) => {
                                                        formik.setFieldValue('closesAt', e)
                                                    }}
                                                    format='YYYY/MM/DD hh:mm A'
                                                    defaultValue={null}
                                                    // @ts-ignore
                                                    textField={(props) => (
                                                        <TextField
                                                            margin='normal'
                                                            variant='outlined'
                                                            name='closesAt'
                                                            onBlur={formik.handleBlur}
                                                            error={formik.touched.closesAt && Boolean(formik.errors.closesAt)}
                                                            FormHelperTextProps={{ style: { position: 'absolute', bottom: -20 } }}
                                                            helperText={formik.touched.closesAt && formik.errors.closesAt}
                                                            data-cy='submissionBoxClosesAt'
                                                            {...props}
                                                        />
                                                    )}
                                                />
                                                <Typography data-cy='submissionBoxDescHeading' color={'textSecondary'} sx={{ m: 1, fontWeight: 'bold' }}>
                                                    Description
                                                </Typography>
                                                <TextField
                                                    type='text'
                                                    name='description'
                                                    multiline
                                                    rows={8}
                                                    sx={{ color: 'textSecondary', width: '100%', mb: 1 }}
                                                    error={formik.touched.description && Boolean(formik.errors.description)}
                                                    onChange={formik.handleChange}
                                                    onBlur={formik.handleBlur}
                                                    value={formik.values.description}
                                                    FormHelperTextProps={{ style: { position: 'absolute', bottom: -20 } }}
                                                    helperText={formik.touched.description && formik.errors.description}
                                                    data-cy='submissionBoxDescEditing'
                                                />
                                                <Box display='flex' justifyContent='flex-end' gap={1} padding='1rem'>
                                                    <Button
                                                        variant='contained'
                                                        color='inherit'
                                                        onClick={onCancelEdit}
                                                        data-cy='cancelButton'
                                                    >
                                                        Cancel
                                                    </Button>
                                                    <Button
                                                        type='submit'
                                                        variant='contained'
                                                        data-cy='updateButton'
                                                    >
                                                        Update
                                                    </Button>
                                                </Box>
                                            </Box>
                                        </form>
                                    </>
                                )}
                            </Box>
                        </Box>
                    )}
                    {boxType === 'requested' && (
                        <>
                            <Box
                                sx={{
                                    display: 'grid',
                                    gridTemplateColumns: '3fr 1fr',
                                    flexGrow: 1,
                                    height: '100%',
                                    width: '100%',
                                    pt: '2rem',
                                }}
                            >
                                <Box
                                    sx={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        width: '100%',
                                        height: '100%',
                                        px: '2rem',
                                        flexGrow: 1,
                                        flexShrink: 1,
                                    }}
                                >
                                    {videos?.length !== 0 && (
                                        <Box
                                            data-cy='videoTitleHolder'
                                            sx={{
                                                display: 'flex',
                                                flexDirection: 'column',
                                                alignItems: 'center',
                                            }}
                                        >
                                            <Typography data-cy='videoTitleHeader' variant='subtitle2' color={'textSecondary'}>Video Title</Typography>
                                            <Link sx={{ fontWeight: 'bold' }} paddingBottom='1rem' data-cy='videoTitle' variant={'h5'} color={'textSecondary'} href={`/video/${ videos?.[0].id }`}>
                                                {videos?.[0].title}
                                            </Link>
                                        </Box>
                                    )}
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
                                            maxHeight: '75%',
                                        }}
                                    >
                                        {videos?.length !== 0 ? (
                                            videos[0]?.processedVideoUrl ? (
                                                <ScalingReactPlayer data-cy='scaling-react-player' url={videos[0].processedVideoUrl} />
                                            ) : (
                                                <Alert severity='info'>Your video has been submitted. It will be visible here as soon as cloud processing is finished.</Alert>
                                            )
                                        ) : (
                                            !boxInfo?.closesAt || new Date(boxInfo.closesAt) >= new Date() ? (
                                                <SelectVideoForSubmission
                                                    submissionBoxId={boxId ?? ''}
                                                    onVideoSelect={(video: (Video & VideoSubmission)) => setVideos([video])}
                                                />
                                            ) : (
                                                <Box
                                                    sx={{
                                                        p: 4,
                                                        maxWidth: '35rem',
                                                    }}
                                                >
                                                    <Typography
                                                        data-cy='submissionBoxClosed'
                                                        variant='h5'
                                                        color={'textSecondary'}
                                                        textAlign='center'
                                                    >Sorry, this submission box closed at {dayjs(boxInfo?.closesAt).format('h:mma [on] dddd MMM D, YYYY')}.</Typography>
                                                </Box>
                                            )
                                        )}
                                    </Box>
                                </Box>
                                <Box sx={{
                                    pr: '2rem',
                                }}>
                                    <SubmissionBoxDetails submissionBox={boxInfo} onUnsubmit={videos?.length !== 0 ? () => setUnsubmitDialogOpen(true) : undefined} isOwned={false}/>
                                    <Dialog
                                        open={unsubmitDialogOpen}
                                        onClose={() => setUnsubmitDialogOpen(false)}
                                    >
                                        <DialogTitle>
                                            Are you sure you want to unsubmit this video?
                                        </DialogTitle>
                                        <DialogActions
                                            sx={{
                                                p: 2,
                                            }}
                                        >
                                            <Button onClick={() => setUnsubmitDialogOpen(false)}>No</Button>
                                            <Button
                                                onClick={unsubmitVideo}
                                                variant='contained'
                                                autoFocus
                                            >
                                                Yes
                                            </Button>
                                        </DialogActions>
                                    </Dialog>
                                </Box>
                            </Box>
                        </>
                    )}
                </>
            )}
        </>
    )

    function unsubmitVideo() {
        setUnsubmitDialogOpen(false)

        fetch('/api/video/submit', {
            method: 'DELETE',
            body: JSON.stringify({
                videoId: videos[0].id,
                submissionBoxIds: [boxId],
            }),
        }).then(async (res) => {
            if (res.ok) {
                toast.success('Video Unsubmitted')
                setVideos([])
            } else {
                toast.error('An error occurred trying to unsubmit video')
            }
        }).catch(() => {
            toast.error('An error occurred trying to unsubmit video')
        })
    }

    function onCancelEdit() {
        setIsEditing(false)
        if (!!boxInfo) {
            setBoxInfo(boxInfo)
        }
    }

    function onEditStart() {
        setIsEditing(true)
    }
}

const validationSchema: ObjectSchema<SubmissionModificationData> = yup.object().shape({
    title: yup.string().required('Submission box title is required'),
    description: yup.string().nullable().default(null),
    closesAt: yup.date().typeError('Please enter a valid date').nullable().default(null),
})
