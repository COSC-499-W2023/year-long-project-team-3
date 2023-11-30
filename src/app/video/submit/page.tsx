'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import PageLoadProgress from '@/components/PageLoadProgress'
import Header from '@/components/Header'
import { Box, Select, Typography, Chip, MenuItem } from '@mui/material'
import ProgressDots from '@/components/ProgressDots'
import { SubmissionBox, Video } from '@prisma/client'
import Image from 'next/image'
import TextField from '@mui/material/TextField'
import HighlightOffIcon from '@mui/icons-material/HighlightOff'
import { useFormik } from 'formik'
import { ObjectSchema } from 'yup'
import * as yup from 'yup'
import { toast } from 'react-toastify'

type FormValues = {
    videoTitle: string
    videoDescription?: string
}

export default function SubmitVideoPage() {
    const session = useSession()
    const { status } = session
    const router = useRouter()

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
        onSubmit: (values: FormValues) => handleSubmitVideo(values),
        validateOnChange: false,
        validateOnBlur: true,
    })

    const [isSubmitVideoPageVisible, setIsSubmitVideoPageVisible] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    // Submission boxes
    const [selectedSubmissionBoxes, setSelectedSubmissionBoxes] = useState<SubmissionBox[]>([])
    const [unSelectedSubmissionBoxes, setUnSelectedSubmissionBoxes] = useState<SubmissionBox[]>([])

    useEffect(() => {
        if (status === 'authenticated') {
            setIsSubmitVideoPageVisible(true)

            setIsLoading(true)
            fetchSubmissionInbox()
                .then((submissionBoxes: SubmissionBox[]) => {
                    setUnSelectedSubmissionBoxes(submissionBoxes)
                })
                .catch((err) => {
                    toast(err)
                })
                .finally(() => {
                    setIsLoading(false)
                })

        } else if (status === 'unauthenticated') {
            cleanPageState()
            router.push('/login')
        } else {
            cleanPageState()
        }
    }, [router, status])

    const video: Video = {
        id: '123',
        title: 'Mock Video',
        description: 'This is a mock video',
        thumbnail: 'https://via.placeholder.com/640x360',
        rawVideoUrl: 'https://via.placeholder.com/640x360',
        createdAt: new Date(),
        updatedAt: new Date(),
        processedVideoUrl: 'https://via.placeholder.com/640x360',
        isCloudProcessed: true,
        s3Key: '123',
        ownerId: '123',
    }

    return (
        <>
            <PageLoadProgress show={isLoading} />
            {isSubmitVideoPageVisible && (
                <>
                    <Header {...session} />
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
                                    {!!video.thumbnail ? (
                                        <Image
                                            src={video.thumbnail}
                                            alt={video.title}
                                            width={0}
                                            height={0}
                                            objectPosition={'100% 0'}
                                            objectFit={'cover'}
                                            style={{
                                                borderRadius: 20,
                                                maxWidth: '21vw',
                                                maxHeight: '14vw',
                                                width: '100%',
                                                height: '100%',
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
                                                formik.touched.videoDescription &&
                                                Boolean(formik.errors.videoDescription)
                                            }
                                            helperText={
                                                formik.touched.videoDescription && formik.errors.videoDescription
                                            }
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
                    </Box>
                </>
            )}
        </>
    )

    function cleanPageState() {
        setIsLoading(false)
    }

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

    function handleSubmitVideo(values: FormValues) {
        console.log(values)
    }

    async function fetchSubmissionInbox(): Promise<SubmissionBox[]> {
        const res = await fetch('/api/submission-box/inboxes')
        if (res.status !== 200) {
            throw new Error('Failed to fetch submission boxes')
        }
        const { submissionBoxes } = await res.json()
        return submissionBoxes
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
