'use client'

import { Box, Button } from '@mui/material'
import { CloudUpload as CloudUploadIcon } from '@mui/icons-material'
import { styled } from '@mui/material/styles'
import { type ChangeEvent } from 'react'
import { toast } from 'react-toastify'
import { useSession } from 'next-auth/react'
import Header from '@/components/Header'
import { useRouter } from 'next/navigation'

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

    const handleFileChanged = (event: ChangeEvent<HTMLInputElement>) => {
        if (!!event.target?.files) {
            handleUploadVideo(event.target.files[0])
        }
    }

    const handleUploadVideo = (uploadedFile: File) => {
        if (!uploadedFile) {
            toast.error('No file selected')
        }
        const videoUploadForm = new FormData()
        videoUploadForm.append('video', uploadedFile!)

        fetch('/api/video/upload', {
            method: 'POST',
            body: videoUploadForm,
        }).then(() => {
            toast.success('Video uploaded')
            router.push('/')
        })
    }

    return (
        session.status === 'authenticated' && (
            <>
                <Header {...session} />
                <Box display='flex' width='100%' flexDirection='column' alignItems='center'>
                    <h1>Upload Video</h1>
                    <Button component='label' variant='contained' startIcon={<CloudUploadIcon />}>
                        Upload file
                        <VisuallyHiddenInput type='file' accept='.mp4' onChange={handleFileChanged} />
                    </Button>
                </Box>
            </>
        )
    )
}
