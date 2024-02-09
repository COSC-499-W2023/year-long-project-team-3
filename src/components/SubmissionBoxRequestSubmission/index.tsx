import { Box, Typography } from '@mui/material'
import TextField from '@mui/material/TextField'
import SubmissionRequestedCard from '@/components/SubmissionRequestedCard'
import React from 'react'
import { ObjectSchema } from 'yup'
import * as yup from 'yup'
import { getEmailRegex } from '@/utils/verification'
import { useFormik } from 'formik'
import { useSession } from 'next-auth/react'
import AddButton from '@/components/AddButton'

interface FormValues {
  email: string
}

type RequestSubmissionProps = {
  emails: string[]
  setEmails: React.Dispatch<React.SetStateAction<string[]>>
}

export default function SubmissionBoxRequestSubmission({ emails, setEmails }: RequestSubmissionProps) {
    const session = useSession()

    const ownerEmail: string = session.data?.user?.email!

    const removeEmail = (emailToRemove: string) => {
        const updatedEmails = emails.filter((email) => email !== emailToRemove)
        setEmails(updatedEmails)
        formik.setTouched({}, false)
    }

    const validationSchema: ObjectSchema<FormValues> = yup.object().shape({
        email: yup
            .string()
            .default('') // set default for checking inside onBlur and errors
            .required('To invite someone to your box, enter their email') // this will show up as a help text, not an error
            .matches(getEmailRegex(), 'Enter a valid email')
            .test('not-own-email', 'You cannot add your own email!', function(value) {
                return value !== ownerEmail
            })
            .test('unique', 'This email has already been added!', function(value) {
                return !emails.includes(value)
            }),
    })

    const formik = useFormik<FormValues>({
        initialValues: {
            email: '',
        },
        validationSchema: validationSchema,
        onSubmit: (values: FormValues) => handleSubmit(values),
    })

    return (
        <>
            <form onSubmit={formik.handleSubmit} noValidate>
                <Box
                    sx={{
                        px: 5,
                        pt: 3,
                        pb: 3,
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        minWidth: 'md',
                        '& .MuiTextField-root': { my: 1.5, mx: 2, minWidth: '22rem', width: '100%' },
                    }}
                >
                    <TextField
                        margin='normal'
                        variant='outlined'
                        type='email'
                        label='Email Address'
                        name='email'
                        value={formik.values.email}
                        onChange={(e) => {
                            formik.handleChange(e)
                        }}
                        onBlur={() => handleBlur()}
                        error={
                            formik.touched.email && Boolean(formik.errors.email) && Boolean(formik.values.email !== '') // error only when email not empty
                        }
                        // this ensures the layout does not get shifted by the helper text
                        FormHelperTextProps={{ style: { position: 'absolute', bottom: -20 } }}
                        helperText={formik.touched.email && formik.errors.email}
                        data-cy='email'
                    />
                    <AddButton />
                </Box>
            </form>
            {/* This is a scrollable container for submission request cards */}
            <Box
                sx={{
                    maxHeight: '17rem',
                    height: '17rem',
                    width: '27rem',
                    overflow: 'auto',
                    p: 2,
                    backgroundColor: '#F5F5F5',
                    borderRadius: 2,
                    mb: 5,
                }}
            >
                {emails.length === 0 && <Typography sx={{ textAlign: 'center', pt: 13 }}>No one has been invited yet</Typography>}
                {/* Add new cards for added submission requests and allow removal */}
                {emails.map((email, index) => (
                    <SubmissionRequestedCard key={index} email={email} removeEmail={removeEmail} />
                ))}
            </Box>
        </>
    )

    function handleBlur() {
        formik.handleBlur
        // if the user clicks out of the TextField and the TextField is empty, reset validation
        if (formik.values.email === '') {
            formik.setTouched({}, false)
        }
    }

    async function handleSubmit(values: FormValues) {
        setEmails([...emails, values.email])
        formik.resetForm()
    }
}
