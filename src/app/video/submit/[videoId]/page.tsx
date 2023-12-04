'use client'

import React, { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { usePathname, useRouter } from 'next/navigation'
import Header from '@/components/Header'
import { Box, Select, Typography, Chip, MenuItem, Button } from '@mui/material'
import ProgressDots from '@/components/ProgressDots'
import { SubmissionBox, Video } from '@prisma/client'
import Image from 'next/image'
import TextField from '@mui/material/TextField'
import HighlightOffIcon from '@mui/icons-material/HighlightOff'
import { useFormik } from 'formik'
import { ObjectSchema } from 'yup'
import * as yup from 'yup'
import { toast } from 'react-toastify'
import logger from '@/utils/logger'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import PageLoadProgressBlurBackground from '@/components/PageLoadProgressBlurBackround'
import BackButton from '@/components/BackButton'

type FormValues = {
    videoTitle: string
    videoDescription?: string
}

export default function SubmitVideoPage() {
    const session = useSession()
    const router = useRouter()
    const pathname = usePathname()

    const videoId = pathname?.split('/').pop()

    const validationSchema: ObjectSchema<FormValues> = yup.object().shape({
        videoTitle: yup.string().required('Title required'),
        videoDescription: yup.string().default(''),
    })

    const formik = useFormik<FormValues>({
        initialValues: {
            videoTitle: '',
            videoDescription: '',
        },
        validationSchema: validationSchema,
        onSubmit: () => handleSubmitVideo(),
        validateOnChange: false,
        validateOnBlur: true,
    })

    const [isLoading, setIsLoading] = useState(false)
    const [video, setVideo] = useState<Video>()

    // Submission boxes
    const [selectedSubmissionBoxes, setSelectedSubmissionBoxes] = useState<SubmissionBox[]>([])
    const [unSelectedSubmissionBoxes, setUnSelectedSubmissionBoxes] = useState<SubmissionBox[]>([])

    useEffect(() => {
        if (!videoId) {
            return
        }

        setIsLoading(true)
        Promise.all([fetchSubmissionInbox(), fetchVideo(videoId)])
            .then(([submissionBoxes, video]: [SubmissionBox[], Video]) => {
                setUnSelectedSubmissionBoxes(submissionBoxes)
                setVideo(video)
            })
            .catch((err) => {
                logger.error(err)
                router.push('/dashboard')
                toast.error('An unexpected error occurred!')
            })
            .finally(() => {
                setIsLoading(false)
            })
    }, [videoId, router])

    return (
        <>
            <PageLoadProgressBlurBackground show={isLoading && !video} />
            <>
                <Header {...session} />
                <BackButton route={'/dashboard '} title={'Return to Dashboard'} />{' '}
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '1rem',
                        width: '100%',
                        height: '100%',
                        padding: '2rem',
                    }}
                >
                    <Box
                        sx={{
                            minWidth: '16rem',
                            width: '70%',
                        }}
                    >
                        <ProgressDots activeStep={2} numSteps={3} labels={['Upload', 'Edit', 'Submit']} />
                    </Box>
                    <Box display='flex' flexDirection='column' justifyContent='center' alignItems='center'>
                        <Box display='flex'>
                            <Box width={300} height={200} display='flex' alignItems='start' justifyContent='end'>
                                {!!video && !!video.thumbnail ? (
                                    <Image
                                        src={video.thumbnail}
                                        alt='Video Thumbnail'
                                        width={300}
                                        height={200}
                                        quality={50}
                                        objectPosition={'100% 0'}
                                        objectFit={'cover'}
                                        style={{
                                            borderRadius: 20,
                                            maxWidth: '21vw',
                                            maxHeight: '14vw',
                                        }}
                                    />
                                ) : (
                                    <Box
                                        component='span'
                                        sx={{
                                            borderRadius: '20px',
                                            maxWidth: '21vw',
                                            maxHeight: '14vw',
                                            width: '100%',
                                            height: '100%',
                                            backgroundColor: 'grey',
                                        }}
                                    />
                                )}
                            </Box>
                            <Box
                                display='flex'
                                flexDirection='column'
                                paddingLeft='2rem'
                                alignItems='start'
                                gap='0.5rem'
                            >
                                <Box>
                                    <TextField
                                        id='videoTitle'
                                        label='Title'
                                        placeholder='Your video title'
                                        variant='standard'
                                        sx={{
                                            minWidth: '16rem',
                                        }}
                                        InputLabelProps={{ shrink: true }}
                                        value={formik.values.videoTitle}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        error={formik.touched.videoTitle && Boolean(formik.errors.videoTitle)}
                                        helperText={formik.touched.videoTitle && formik.errors.videoTitle}
                                    />
                                </Box>
                                <Box>
                                    <TextField
                                        id='videoDescription'
                                        label='Description'
                                        placeholder='Your video description (optional)'
                                        variant='standard'
                                        sx={{
                                            minWidth: '16rem',
                                            // Remove bottom outline
                                            '& .MuiInput-underline:before': {
                                                borderBottom: 0,
                                            },
                                            '& .MuiInput-underline:after': {
                                                borderBottom: 0,
                                            },
                                            '& .MuiInput-underline:hover:not(.Mui-disabled, .Mui-error):before': {
                                                borderBottom: 0,
                                            },
                                        }}
                                        multiline
                                        rows={6}
                                        InputLabelProps={{ shrink: true }}
                                        value={formik.values.videoDescription}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        error={
                                            formik.touched.videoDescription && Boolean(formik.errors.videoDescription)
                                        }
                                        helperText={formik.touched.videoDescription && formik.errors.videoDescription}
                                    />
                                </Box>
                            </Box>
                        </Box>
                        <Box
                            display='flex'
                            flexDirection='column'
                            sx={{
                                '& .MuiInputBase-root.MuiOutlinedInput-root': {
                                    borderRadius: '8px',
                                },
                                width: '35vw',
                            }}
                        >
                            <Typography variant='h6' fontWeight='600'>
                                Choose boxes to submit to:
                            </Typography>
                            <Select
                                multiple
                                value={selectedSubmissionBoxes}
                                sx={{
                                    '& .MuiOutlinedInput-input': {
                                        borderRadius: '8px',
                                    },
                                    width: '100%',
                                }}
                                renderValue={(selected) => (
                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                        {selected.map(({ id, title }) => (
                                            <Chip
                                                key={id}
                                                label={title}
                                                onMouseDown={(e) => e.stopPropagation()}
                                                onDelete={() => handleRemoveSelectedSubmissionBoxItem(id)}
                                                deleteIcon={<HighlightOffIcon />}
                                                sx={{
                                                    borderRadius: '8px',
                                                }}
                                            />
                                        ))}
                                    </Box>
                                )}
                                MenuProps={MenuProps}
                            >
                                {unSelectedSubmissionBoxes?.length > 0 &&
                                    unSelectedSubmissionBoxes.map((submissionBox) => (
                                        <MenuItem
                                            key={submissionBox.id}
                                            value={submissionBox.title}
                                            onClick={() => handleClickSubmissionBoxListItem(submissionBox.id)}
                                        >
                                            {submissionBox.title}
                                        </MenuItem>
                                    ))}
                            </Select>
                        </Box>
                    </Box>
                    <Box display='flex' justifyContent='space-between' width='70vw' position='absolute' bottom='4rem'>
                        <Button variant={'contained'} startIcon={<ArrowBackIcon />} onClick={handleClickBackButton}>
                            Back
                        </Button>
                        <Button
                            variant={'contained'}
                            startIcon={<ArrowForwardIcon />}
                            onClick={() => formik.handleSubmit()}
                        >
                            Submit
                        </Button>
                    </Box>
                </Box>
            </>
        </>
    )

    function handleClickSubmissionBoxListItem(submissionBoxId: string) {
        const submissionBoxIdx = unSelectedSubmissionBoxes.findIndex((sb) => sb.id === submissionBoxId)
        if (submissionBoxIdx >= 0) {
            // Add to selected
            const newSelectedSubmissionBoxes: SubmissionBox[] = [...selectedSubmissionBoxes]
            newSelectedSubmissionBoxes.push(unSelectedSubmissionBoxes[submissionBoxIdx])
            setSelectedSubmissionBoxes(newSelectedSubmissionBoxes)

            // Remove from unselected
            const newUnSelectedSubmissionBoxes: SubmissionBox[] = [...unSelectedSubmissionBoxes]
            newUnSelectedSubmissionBoxes.splice(submissionBoxIdx, 1)
            setUnSelectedSubmissionBoxes(newUnSelectedSubmissionBoxes)
        }
    }

    function handleRemoveSelectedSubmissionBoxItem(submissionBoxId: string) {
        const submissionBoxIdx = selectedSubmissionBoxes.findIndex((sb) => sb.id === submissionBoxId)
        if (submissionBoxIdx >= 0) {
            //  Add back to unselected
            const newSelectedSubmissionBoxes: SubmissionBox[] = [...selectedSubmissionBoxes]
            newSelectedSubmissionBoxes.splice(submissionBoxIdx, 1)
            setSelectedSubmissionBoxes(newSelectedSubmissionBoxes)

            // Remove from selected
            const newUnSelectedSubmissionBoxes: SubmissionBox[] = [...unSelectedSubmissionBoxes]
            newUnSelectedSubmissionBoxes.push(selectedSubmissionBoxes[submissionBoxIdx])
            setUnSelectedSubmissionBoxes(newUnSelectedSubmissionBoxes)
        }
    }

    function handleSubmitVideo() {
        if (selectedSubmissionBoxes.length === 0) {
            toast.warn('Please select at least one submission box')
            return
        }

        const { videoTitle, videoDescription } = formik.values
        const submissionBoxIds = selectedSubmissionBoxes.map((sb) => sb.id)

        const body = {
            videoTitle,
            videoDescription,
            submissionBoxIds,
            videoId: video?.id,
        }

        setIsLoading(true)
        fetch('/api/video/submit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        })
            .then(async (res) => {
                if (res.status !== 201) {
                    throw new Error('Failed to submit the video')
                }
                const body = await res.json()
                router.push('/dashboard')
                toast.success(body.message)
            })
            .catch((err) => {
                logger.error(err)
                toast.error('Unexpected error occurred while submitting the video')
            })
            .finally(() => {
                setIsLoading(false)
            })
    }

    async function fetchSubmissionInbox(): Promise<SubmissionBox[]> {
        const res = await fetch('/api/submission-box/inboxes')
        if (res.status !== 200) {
            throw new Error('Failed to fetch submission boxes')
        }
        const { submissionBoxes } = await res.json()
        return submissionBoxes
    }

    async function fetchVideo(videoId: string): Promise<Video> {
        const res = await fetch(`/api/video/${ videoId }`)
        if (res.status !== 200) {
            throw new Error('Failed to fetch video')
        }
        const { video } = await res.json()
        return video
    }

    function handleClickBackButton() {
        router.back()
    }
}

const ITEM_HEIGHT = 48
const ITEM_PADDING_TOP = 8
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
            borderRadius: '0 0 8px 8px',
        },
    },
}
