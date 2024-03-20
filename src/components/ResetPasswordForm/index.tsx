'use client'
import { Box, Button } from '@mui/material'
import Typography from '@mui/material/Typography'
import { useFormik } from 'formik'
import { ForgetPasswordData } from '@/types/auth/user'
import { ObjectSchema } from 'yup'
import * as yup from 'yup'
import { getEmailRegex } from '@/utils/verification'
import TextField from '@mui/material/TextField'
import React from 'react'

export default function ResetPasswordForm() {
    const formik = useFormik<ForgetPasswordData>({
        initialValues: {
            email: '',
        },
        validationSchema: validationSchema,
        onSubmit: (values: ForgetPasswordData) => handleSubmit(values),
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
            <Typography variant='h4' sx={{ fontWeight: 'medium'}}>
                Reset Password
            </Typography>
            <form onSubmit={formik.handleSubmit} noValidate>
                <Box
                    gap={1}
                    sx={{
                        p: 5,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        minWidth: 'md',
                        '& .MuiTextField-root': { my: 1.5, mx: 7, width: '100%' },
                    }}
                >
                    <TextField
                        margin='normal'
                        variant='outlined'
                        type='email'
                        label='Email Address'
                        name='email'
                        value={formik.values.email}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.email && Boolean(formik.errors.email)}
                        // this ensures the layout does not get shifted by the helper text
                        FormHelperTextProps={{ style: { position: 'absolute', bottom: -20 } }}
                        helperText={formik.touched.email && formik.errors.email}
                        data-cy='email'
                    />
                    <Button
                        type='submit'
                        variant='contained'
                        sx={{ mt: 2, px: 5, fontSize: 15, borderRadius: 28, textTransform: 'capitalize' }}
                        data-cy='submit'
                    >
                        Reset Password
                    </Button>
                </Box>
            </form>
        </Box>

    )

    function handleSubmit(data: ForgetPasswordData) {
        throw Error('Not implemented')
    }
}

const validationSchema: ObjectSchema<ForgetPasswordData> = yup.object().shape({
    email: yup.string().matches(getEmailRegex(), 'Enter a valid email').required('Email is required'),
})
