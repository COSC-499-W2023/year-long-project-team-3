'use client'

import React from 'react'
import { Box } from '@mui/material'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import { useFormik } from 'formik'
import { UserSignUpData } from '@/types/auth/user'
import { ObjectSchema } from 'yup'
import * as yup from 'yup'
import { getEmailRegex } from '@/utils/verification'
import { VideoUploadData } from '@/types/video/video'

export default function UploadVideoForm() {
    const formik = useFormik<VideoUploadData>({
        initialValues: {
            title: '',
            description: '',
            video: '',
            blurFace: false,
        },
        validationSchema: validationSchema,
        onSubmit: (values: VideoUploadData) => handleSubmit(values),
    })

    return (
        <Box>
            <Typography variant='h4' sx={{ fontWeight: 'medium' }}>
                Upload Video
            </Typography>
            <form onSubmit={formik.handleSubmit} noValidate>
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
            </form>
        </Box>
    )
}

async function handleSubmit(videoUploadData: VideoUploadData) {

}

const validationSchema: ObjectSchema<UserSignUpData> = yup.object().shape({
    email: yup.string().matches(getEmailRegex(), 'Enter a valid email').required('Email is required'),
    password: yup.string().required('Enter your password'),
})
