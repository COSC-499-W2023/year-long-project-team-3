'use client'
import { Box, Button } from '@mui/material'
import Typography from '@mui/material/Typography'
import { useFormik } from 'formik'
import { ResetPasswordEmailData } from '@/types/auth/user'
import { ObjectSchema } from 'yup'
import * as yup from 'yup'
import { getEmailRegex } from '@/utils/verification'
import TextField from '@mui/material/TextField'
import React from 'react'
import logger from '@/utils/logger'
import { toast } from 'react-toastify'
import { useRouter } from 'next/navigation'

export default function ResetPasswordEmailAddressForm() {
    const router = useRouter()
    const formik = useFormik<ResetPasswordEmailData>({
        initialValues: {
            email: '',
        },
        validationSchema: validationSchema,
        onSubmit: (values: ResetPasswordEmailData) => handleSubmit(values),
    })

    return (
        <Box
            gap={1}
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                minWidth: 'md',
            }}
        >
            <Typography variant='h4' sx={{ fontWeight: 'medium', my: '1rem'}}>
                Reset Password
            </Typography>
            <Typography sx={{maxWidth: 'sm', textAlign: 'center'}}>
                Please enter your email address below. If there is an account associated with that email, you will be sent a link to reset your password.
            </Typography>
            <form onSubmit={formik.handleSubmit} noValidate>
                <Box
                    gap={1}
                    sx={{
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

    async function handleSubmit(data: ResetPasswordEmailData) {
        try {
            const response = await fetch('/api/reset-password/send-email', {
                method: 'POST',
                body: JSON.stringify({
                    email: data.email,
                }),
            })

            if (response.status == 201) {
                toast.success('If this email was associated with a user, a reset password email will be sent shortly.')
                logger.info(`Sent reset password email to ${ data.email }`)
                router.push('/login')
                router.refresh()
            } else {
                toast.error('There was an error in the password reset process. Please contact support.')
            }
        } catch (err) {
            const errMessage = JSON.stringify(err, Object.getOwnPropertyNames(err))
            logger.error(errMessage)
        }
    }
}

const validationSchema: ObjectSchema<ResetPasswordEmailData> = yup.object().shape({
    email: yup.string().matches(getEmailRegex(), 'Enter a valid email').required('Email is required'),
})
