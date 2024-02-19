import React from 'react'
import {useDropzone} from 'react-dropzone'
import styled from 'styled-components'
import { CloudUpload as CloudUploadIcon } from '@mui/icons-material'
import { Box, Typography } from '@mui/material'
import { theme } from '../ThemeRegistry/theme'
// TODO: Fix prop types in this file
const getColor = (props) => {
    if (props.isDragAccept) {
        return theme.palette.success.main
    }
    if (props.isDragReject) {
        return theme.palette.error.main
    }
    if (props.isFocused) {
        return theme.palette.secondary.main
    }
    return '#eeeeee'
}

const Container = styled.div`
  flex: 1;
  display: flex;
  width: 100%;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  border-width: 2px;
  border-radius: 38px;
  border-color: ${ props => getColor(props) };
  border-style: dashed;
  background-color: #fafafa;
  color: #bdbdbd;
  outline: none;
  transition: border .24s ease-in-out;
`

export function VideoUploadDropzone(props: any) {
    const { file, setFieldValue, touchedFile, errorMessage } = props
    const {
        getRootProps,
        getInputProps,
        isFocused,
        isDragAccept,
        isDragReject,
    } = useDropzone({accept: {'video/*': ['.mp4', '.mob']}, maxFiles: 1, onDrop: acceptedFiles => {
        setFieldValue('file', acceptedFiles[0])
    }})

    return (
        <Container {...getRootProps({isFocused, isDragAccept, isDragReject})}>
            <input {...getInputProps()} />
            {file?
                <Box sx={{display: 'flex', alignItems: 'center', flexDirection: 'column'}}>
                    <Typography color={theme.palette.success.main}>File {file.name} successfully uploaded</Typography>
                    <CloudUploadIcon color='success' />
                </Box>:
                <Box>
                    {
                        touchedFile && errorMessage?
                            <Box sx={{display: 'flex', alignItems: 'center', flexDirection: 'column'}}>
                                <Typography color={theme.palette.error.main}>{errorMessage}</Typography>
                                <CloudUploadIcon color='error' />
                            </Box>:
                            <Box  sx={{display: 'flex', alignItems: 'center', flexDirection: 'column'}}>
                                <Typography color={theme.palette.secondary.main}>Drag and drop some files here, or click to select files</Typography>
                                <Typography color={theme.palette.secondary.main}>(Note that only .mp4 and .mov files are accepted)</Typography>
                                <CloudUploadIcon color='secondary' />
                            </Box>
                    }
                </Box>
            }
        </Container>
    )
}
