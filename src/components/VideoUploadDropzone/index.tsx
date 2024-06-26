import React from 'react'
import {useDropzone} from 'react-dropzone'
import { CloudUpload as CloudUploadIcon } from '@mui/icons-material'
import { Box, Typography } from '@mui/material'
import { theme } from '../ThemeRegistry/theme'

const borderColor = (isDragAccept: boolean, isDragReject: boolean, isFocused: boolean) => {
    if (isDragAccept) {
        return theme.palette.success.main
    }
    if (isDragReject) {
        return theme.palette.error.main
    }
    if (isFocused) {
        return theme.palette.secondary.main
    }
    return '#eeeeee'
}

type VideoUploadDropzoneProps = {
    file: File | undefined
    setFieldValue: (field: string, value: any) => void
    isFileTouched: boolean | undefined
    errorMessage: string | undefined
}


export function VideoUploadDropzone(props: VideoUploadDropzoneProps) {
    const { file, setFieldValue, isFileTouched, errorMessage } = props
    const {
        getRootProps,
        getInputProps,
        isFocused,
        isDragAccept,
        isDragReject,
    } = useDropzone({accept: {'video/*': ['.mp4', '.mov']}, maxFiles: 1, onDrop: acceptedFiles => {
        setFieldValue('file', acceptedFiles[0])
    }})

    return (
        <Box
            {...getRootProps()}
            data-cy='video-upload-dropzone'
            sx={{
                flex: 1,
                display: 'flex',
                width: '100%',
                flexDirection: 'column',
                alignItems: 'center',
                padding: '20px',
                borderWidth: '2px',
                borderRadius: '38px',
                borderColor: borderColor(isDragAccept, isDragReject, isFocused),
                borderStyle: 'dashed',
                backgroundColor: '#fafafa',
                color: '#bdbdbd',
                outline: 'none',
                transition: 'border .24s ease-in-out',
            }}
        >
            <input data-cy='dropzone-file-input' {...getInputProps()} />
            {file?
                <Box sx={{display: 'flex', alignItems: 'center', flexDirection: 'column', textAlign: 'center'}}>
                    <Typography data-cy='dropbox-success-message' color={theme.palette.success.main}>File {file.name} successfully uploaded</Typography>
                    <CloudUploadIcon color='success' />
                </Box>:
                <Box>
                    {
                        isFileTouched && errorMessage?
                            <Box sx={{display: 'flex', alignItems: 'center', flexDirection: 'column',  textAlign: 'center'}}>
                                <Typography data-cy='dropbox-error-message' color={theme.palette.error.main}>{errorMessage}</Typography>
                                <Typography color={theme.palette.error.main}>(Note that only .mp4 and .mov files are accepted)</Typography>
                                <CloudUploadIcon color='error' />
                            </Box>:
                            <Box  sx={{display: 'flex', alignItems: 'center', flexDirection: 'column', textAlign: 'center'}}>
                                <Typography data-cy='dropbox-neutral-message' color={theme.palette.secondary.main}>Drag and drop some files here, or click to select files</Typography>
                                <Typography color={theme.palette.secondary.main}>(Note that only .mp4 and .mov files are accepted)</Typography>
                                <CloudUploadIcon color='secondary' />
                            </Box>
                    }
                </Box>
            }
        </Box>
    )
}
