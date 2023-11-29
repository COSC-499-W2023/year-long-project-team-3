import { Alert, Box } from '@mui/material'
import ProgressDots from '@/components/ProgressDots'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import { DateTimePicker } from '@mui/x-date-pickers'
import Button from '@mui/material/Button'
import React from 'react'
import logger from '@/utils/logger'
import { ObjectSchema } from 'yup'
import * as yup from 'yup'
import { useFormik } from 'formik'

type SettingsData = {
    title: string
    description: string | undefined
    closingDate: Date | undefined
}

type SettingsFormProps = SettingsData & {
    updateFields: (fields: Partial<SettingsData>) => void
}

export default function Settings({ title, description, closingDate, updateFields }: SettingsFormProps) {
    const formik = useFormik<SettingsData>({
        initialValues: {
            title: title,
            description: description,
            closingDate: closingDate,
        },
        validationSchema: validationSchema,
        // TODO: properly implement handleSubmit
        onSubmit: (values: SettingsData) => handleSubmit(values),
    })

    return (
        <>
            <Box
                sx={{
                    minWidth: '16rem',
                    width: '50%',
                }}
            >
                <ProgressDots
                    activeStep={0}
                    numSteps={3}
                    labels={['Settings', 'Request Submissions', 'Review & Create']}
                />
            </Box>
            <Box display='flex' width='100%' flexDirection='column' alignItems='center' sx={{ pt: 3 }}>
                <Typography data-cy='title' variant='h4' sx={{ fontWeight: 'medium' }}>
                    Submission Box Settings
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
                            '& .MuiTextField-root': { my: 1.5, mx: 7, width: '80%' },
                        }}
                    >
                        <TextField
                            margin='normal'
                            variant='outlined'
                            type='title'
                            label='Title'
                            name='title'
                            value={formik.values.title}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.title && Boolean(formik.errors.title)}
                            // this ensures the layout does not get shifted by the helper text
                            FormHelperTextProps={{ style: { position: 'absolute', bottom: -20 } }}
                            helperText={formik.touched.title && formik.errors.title}
                            data-cy='submission-box-title'
                        />
                        <TextField
                            margin='normal'
                            variant='outlined'
                            type='description'
                            label='Description (optional)'
                            name='description'
                            multiline
                            rows={4} // There is currently a bug with the multiline TextField which makes the TextField reload, see https://github.com/mui/material-ui/issues/38607
                            value={formik.values.description}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.description && Boolean(formik.errors.description)}
                            // this ensures the layout does not get shifted by the helper text
                            FormHelperTextProps={{ style: { position: 'absolute', bottom: -20 } }}
                            helperText={formik.touched.description && formik.errors.description}
                            data-cy='description'
                        />
                        <DateTimePicker disablePast label='Closing Date' />
                        <Button
                            type='submit'
                            variant='contained'
                            sx={{ mt: 2, px: 5, fontSize: 15, borderRadius: 28, textTransform: 'capitalize' }}
                            data-cy='next'
                        >
                            Next
                        </Button>
                        <Alert
                            severity='info'
                            sx={{
                                mt: 2,
                                width: '90%',
                                display: 'flex',
                                alignItems: 'center',
                            }}
                        >
                            <Typography sx={{ textAlign: 'center' }}>
                                You will be able to request submissions to your box in the next step!
                            </Typography>
                        </Alert>
                    </Box>
                </form>
            </Box>
        </>
    )

    async function handleSubmit(values: SettingsData) {
        try {
            // TODO: send form data to API and do some error checking here
        } catch (err) {
            const errMessage = JSON.stringify(err, Object.getOwnPropertyNames(err))
            logger.error(errMessage)
        }
    }
}

const validationSchema: ObjectSchema<SettingsData> = yup.object().shape({
    title: yup.string().required('Please enter a title for your submission box'),
    description: yup.string(),
    // only future dates can be chosen due to disablePast on DateTimePicker
    closingDate: yup.date(),
})
