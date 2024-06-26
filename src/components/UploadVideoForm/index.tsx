'use client'

import React from 'react'
import { Box, Button, Checkbox, FormControlLabel } from '@mui/material'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import { useFormik } from 'formik'
import { ObjectSchema } from 'yup'
import * as yup from 'yup'
import { VideoUploadData } from '@/types/video/video'
import { VideoUploadDropzone } from '../VideoUploadDropzone'
import { toast } from 'react-toastify'
import logger from '@/utils/logger'
import { useRouter } from 'next/navigation'

export default function UploadVideoForm() {
    const router = useRouter()
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

    async function handleSubmit(videoUploadData: VideoUploadData) {
        const videoUploadFormData = new FormData()
        videoUploadFormData.append('title', videoUploadData.title)
        videoUploadFormData.append('description', videoUploadData.description)
        if(videoUploadData.file) {
            videoUploadFormData.append('file', videoUploadData.file)
        }
        videoUploadFormData.append('blurFace', videoUploadData.blurFace.toString())
        fetch('/api/video/upload', {
            method: 'POST',
            body: videoUploadFormData,
        })
            .then(async (res: Response) => {
                const body = await res.json()
                if (res.status !== 201) {
                    throw new Error(body.error)
                }
                const videoId = body.video.id as string
                router.push(`/video/${ videoId }`)
            })
            .catch((error) => {
                logger.error(error)
                toast.error(error)
                router.push('/dashboard')
            })
    }

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
                        data-cy='title'
                        required
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
                        data-cy='description'
                        multiline
                        minRows={4}
                        value={formik.values.description}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.description && Boolean(formik.errors.description)}
                        // this ensures the layout does not get shifted by the helper text
                        FormHelperTextProps={{ style: { position: 'absolute', bottom: -20 } }}
                        helperText={formik.touched.description && formik.errors.description}
                    />
                    <VideoUploadDropzone file={formik.values.file} setFieldValue={formik.setFieldValue} isFileTouched={formik.touched.file} errorMessage={formik.errors.file} />
                    <FormControlLabel
                        control={
                            <Checkbox
                                data-cy='blur-checkbox'
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
                        color='secondary'
                        data-cy='submit-upload-button'
                    >
                        Submit
                    </Button>
                </Box>
            </form>
        </Box>
    )
}

const validationSchema: ObjectSchema<VideoUploadData> = yup.object().shape({
    title: yup.string().required('Video title is required'),
    description: yup.string().default(''),
    file: yup.mixed<File>().required('You must select a file to upload'),
    blurFace: yup.boolean().required(),
})
