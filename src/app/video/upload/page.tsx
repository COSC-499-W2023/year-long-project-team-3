'use client'

import { Button } from '@mui/material'
import { CloudUpload as CloudUploadIcon } from '@mui/icons-material'
import { styled } from '@mui/material/styles'
import { ChangeEvent, useState } from 'react'
import sendVideo from '@/utils/sendVideo'

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

const UploadVideoPage = () => {
    const [uploadedFile, setUploadedFile] = useState<File>()

    const handleFileChanged = async (event: ChangeEvent<HTMLInputElement>) => {
        if (!!event.target?.files) {
            setUploadedFile(event.target.files[0])
            await sendVideo(event.target.files[0])
        }
    }

    return (
        <div>
            <h1>Upload Video</h1>
            <Button component='label' variant='contained' startIcon={<CloudUploadIcon />}>
                Upload file
                <VisuallyHiddenInput type='file' onChange={handleFileChanged} />
            </Button>
        </div>
    )
}

export default UploadVideoPage
