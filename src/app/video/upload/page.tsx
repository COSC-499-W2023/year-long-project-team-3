'use client'

import { Box, Button, Checkbox, FormControlLabel } from '@mui/material'
import { CloudUpload as CloudUploadIcon } from '@mui/icons-material'
import { styled } from '@mui/material/styles'
import React, { type ChangeEvent, useState } from 'react'
import { toast } from 'react-toastify'
import { useSession } from 'next-auth/react'
import Header from '@/components/Header'
import { useRouter } from 'next/navigation'
import ProgressDots from '@/components/ProgressDots'
import PageLoadProgressBlurBackground from '@/components/PageLoadProgressBlurBackround'
import logger from '@/utils/logger'
import BackButton from '@/components/BackButton'
import Typography from '@mui/material/Typography'

const VisuallyHiddenInput = styled('input')({
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
})

export default function UploadVideoPage() {
    const session = useSession()
    const router = useRouter()

    const [isUploadingVideo, setIsUploadingVideo] = useState(false)
    const [isFaceBlurChecked, setIsFaceBlurChecked] = useState(false)

    const handleFaceBlurChecked = (event: React.ChangeEvent<HTMLInputElement>) => {
        setIsFaceBlurChecked(event.target.checked)
    }

    const handleFileChanged = (event: ChangeEvent<HTMLInputElement>) => {
        if (!!event.target?.files) {
            handleUploadVideo(event.target.files[0])
        }
    }

    const handleUploadVideo = (uploadedFile: File) => {
        if (!uploadedFile) {
            toast.error('No file selected')
        }
        setIsUploadingVideo(true)
        const videoUploadForm = new FormData()
        videoUploadForm.append('video', uploadedFile!)

        fetch('/api/video/upload', {
            method: 'POST',
            body: videoUploadForm,
        })
            .then(async (res: Response) => {
                const body = await res.json()
                if (res.status !== 201) {
                    console.log(body)
                    toast.error(body.error)
                    throw new Error(body.error)
                }
                const videoId = body.video.id as string
                router.push(`/video/edit/${ videoId }`)
            })
            .catch((err) => {
                logger.error(err)
                toast.error('Unexpected error occurred when uploading your video')
                router.push('/dashboard')
            })
            .finally(() => {
                setIsUploadingVideo(false)
            })
    }

    return (
        <>
            <PageLoadProgressBlurBackground show={isUploadingVideo} />
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
                        <ProgressDots activeStep={0} numSteps={3} labels={['Upload', 'Edit', 'Submit']} />
                    </Box>
                    <Box display='flex' width='100%' flexDirection='column' alignItems='center'>
                        <h1>Upload Video</h1>
                        <Typography
                            sx={{
                                maxWidth: '40%',
                                textAlign: 'center',
                                pb: 3,
                            }}
                        >
                            If you would like Harp Video to blur all faces in your video using Amazon Rekognition,
                            please tick the checkbox below before uploading the file.
                        </Typography>
                        <FormControlLabel
                            control={<Checkbox checked={isFaceBlurChecked} onChange={handleFaceBlurChecked} />}
                            label='Yes, I want to blur all faces in my video'
                            sx={{ mb: 3 }}
                        />
                        <Button component='label' variant='contained' startIcon={<CloudUploadIcon />}>
                            Upload
                            <VisuallyHiddenInput
                                data-cy='test-input'
                                type='file'
                                accept='.mp4, .mov'
                                onChange={handleFileChanged}
                            />
                        </Button>
                    </Box>
                </Box>
            </>
        </>
    )
}
