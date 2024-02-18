import React, { useCallback } from 'react'
import {useDropzone} from 'react-dropzone'
import styled from 'styled-components'
import { CloudUpload as CloudUploadIcon } from '@mui/icons-material'
import { Typography } from '@mui/material'
import { theme } from '../ThemeRegistry/theme'

const getColor = (props) => {
    if (props.isDragAccept) {
        return '#00e676'
    }
    if (props.isDragReject) {
        return '#ff1744'
    }
    if (props.isFocused) {
        return '#2196f3'
    }
    return '#eeeeee'
}

const Container = styled.div`
  flex: 1;
  display: flex;
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

export function StyledDropzone(props: any) {
    const { setFieldValue } = props
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
            <Typography color={theme.palette.secondary.main}>Drag and drop some files here, or click to select files</Typography>
            <CloudUploadIcon color='secondary' />
        </Container>
    )
}
