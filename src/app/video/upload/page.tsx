'use client'

import { Box, Button } from '@mui/material'
import { CloudUpload as CloudUploadIcon } from '@mui/icons-material'
import { styled } from '@mui/material/styles'
import { type ChangeEvent, useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { useSession } from 'next-auth/react'
import Header from '@/components/Header'
import { useRouter } from 'next/navigation'
import ProgressDots from '@/components/ProgressDots'
import PageLoadProgress from '@/components/PageLoadProgress'

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
    const { status } = session
    const router = useRouter()

    const [isUploadingVideo, setIsUploadingVideo] = useState(false)

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
                router.push('/')
            })
            .finally(() => {
                setIsUploadingVideo(false)
            })
    }

    return (
        <>
            <PageLoadProgress show={isUploadingVideo} />
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
                        <ProgressDots activeStep={0} numSteps={3} labels={['Upload', 'Edit', 'Submit']} />
                    </Box>
                    <Box display='flex' width='100%' flexDirection='column' alignItems='center'>
                        <h1>Upload Video</h1>
                        <Button component='label' variant='contained' startIcon={<CloudUploadIcon />}>
                            Upload
                            <VisuallyHiddenInput type='file' accept='.mp4' onChange={handleFileChanged} />
                        </Button>
                    </Box>
                </Box>
            </>
        </>
    )
}
