'use client'

import React from 'react'
import { Box, Button, Checkbox, FormControlLabel } from '@mui/material'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import { useFormik } from 'formik'
import { ObjectSchema } from 'yup'
import * as yup from 'yup'
import { VideoUploadData } from '@/types/video/video'
import { StyledDropzone } from '../Dropzone'
// TODO: Add tests for this component
export default function UploadVideoForm() {
    const formik = useFormik<VideoUploadData>({
        initialValues: {
            title: '',
            description: '',
            file: undefined,
            blurFace: false,
        },
        validationSchema: validationSchema,
        onSubmit: (values: VideoUploadData) => handleSubmit(values),
    })

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                minWidth: 'md',
            }}
        >
            <Typography variant='h4' sx={{ fontWeight: 'medium' }}>
                Upload Video
            </Typography>
            <form onSubmit={formik.handleSubmit} noValidate>
                <Box
                    gap={1}
                    sx={{
                        p: 5,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        width: {xs: '25rem', md: '35rem'},
                        '& .MuiTextField-root': { my: 1, mx: 7, width: '100%' },
                    }}
                >
                    <TextField
                        margin='normal'
                        variant='outlined'
                        type='text'
                        label='Title'
                        name='title'
                        value={formik.values.title}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.title && Boolean(formik.errors.title)}
                        FormHelperTextProps={{ style: { position: 'absolute', bottom: -20 } }}
                        helperText={formik.touched.title && formik.errors.title}
                    />
                    <TextField
                        margin='normal'
                        variant='outlined'
                        type='text'
                        label='Description (optional)'
                        name='description'
                        multiline
                        minRows={4}
                        value={formik.values.description}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.description && Boolean(formik.errors.description)}
                        // this ensures the layout does not get shifted by the helper text
                        FormHelperTextProps={{ style: { position: 'absolute', bottom: -20 } }}
                        helperText={formik.touched.description && formik.errors.description}
                        data-cy='description'
                    />
                    <StyledDropzone flexGrow='1' file={formik.values.file} setFieldValue={formik.setFieldValue} touchedFile={formik.touched.file} errorMessage={formik.errors.file} />
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={formik.values.blurFace}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                name='blurFace'
                                color='secondary'
                            />
                        }
                        label='Check to blur faces in video'
                    />
                    <Button
                        type='submit'
                        variant='contained'
                        sx={{ mt: 2, px: 5, fontSize: 15, borderRadius: 28, textTransform: 'capitalize' }}
                        data-cy='submit'
                        color='secondary'
                    >
                        Submit
                    </Button>
                </Box>
            </form>
        </Box>
    )
}

async function handleSubmit(videoUploadData: VideoUploadData) {
    console.log(videoUploadData)
}

// TODO: Fix this type
const validationSchema: ObjectSchema<VideoUploadData> = yup.object().shape({
    title: yup.string().required('Video title is required'),
    description: yup.string().notRequired(),
    file: yup.mixed().required('You must select a file to upload'),
    blurFace: yup.boolean().required(),
})
