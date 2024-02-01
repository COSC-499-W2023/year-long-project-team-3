import TextField from '@mui/material/TextField'
import { DateTimePicker } from '@mui/x-date-pickers'
import React, { useEffect } from 'react'
import { ObjectSchema } from 'yup'
import * as yup from 'yup'
import { useFormik } from 'formik'
import { Box } from '@mui/material'
import dayjs from 'dayjs'

type SettingsData = {
    title: string
    description: string | undefined
    closingDate: Date | null
}

type SettingsFormProps = SettingsData & {
    setTitle: React.Dispatch<React.SetStateAction<string>>
    setDescription: React.Dispatch<React.SetStateAction<string | undefined>>
    setClosingDate: React.Dispatch<React.SetStateAction<Date | null>>
    isTitleError: boolean
    setIsTitleError: React.Dispatch<React.SetStateAction<boolean>>
}

export default function SubmissionBoxSettings({
    title,
    setTitle,
    description,
    setDescription,
    closingDate,
    setClosingDate,
    isTitleError,
    setIsTitleError,
}: SettingsFormProps) {
    const formik = useFormik<SettingsData>({
        initialValues: {
            title: title,
            description: description,
            closingDate: closingDate,
        },
        validationSchema: validationSchema,
        onSubmit: () => {},
    })

    useEffect(() => {
        if (!isTitleError || formik.touched.title) {
            return
        }
        formik.setFieldTouched('title', true)
        formik.setFieldError('title', isTitleError ? formik.errors.title : undefined)
    }, [formik, isTitleError])

    useEffect(() => {
        if (!formik.touched.title) {
            return
        }
        setTitle(formik.values.title)
        setIsTitleError(formik.values.title?.length === 0)
    }, [formik.touched.title, formik.values.title, setIsTitleError, setTitle])

    useEffect(() => {
        setDescription(formik.values.description)
    }, [formik.values.description, setDescription])

    useEffect(() => {
        setClosingDate(formik.values.closingDate)
    }, [formik.values.closingDate, setClosingDate])

    return (
        <>
            <Box
                gap={1}
                sx={{
                    p: 3,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    minWidth: 'md',
                    '& .MuiTextField-root': { my: 1.5, mx: 8, width: '100%' },
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
                    // this ensures the layout does not get shifted by the helper text
                    FormHelperTextProps={{ style: { position: 'absolute', bottom: -20 } }}
                    helperText={formik.touched.title && formik.errors.title}
                    data-cy='submission-box-title'
                />
                <TextField
                    margin='normal'
                    variant='outlined'
                    type='text'
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
                <DateTimePicker
                    className='data-cy-date-time-picker' // regular data-cy wasn't working
                    disablePast
                    label='Closing Date (optional)'
                    value={formik.values.closingDate ? dayjs(formik.values.closingDate) : null}
                    onChange={(e) => {
                        formik.setFieldValue('closingDate', e)
                    }}
                    format='YYYY/MM/DD hh:mm A'
                    defaultValue={null}
                    // @ts-ignore
                    textField={(props) => (
                        <TextField
                            margin='normal'
                            variant='outlined'
                            name='closingDate'
                            onBlur={formik.handleBlur}
                            error={formik.touched.closingDate && Boolean(formik.errors.closingDate)}
                            FormHelperTextProps={{ style: { position: 'absolute', bottom: -20 } }}
                            helperText={formik.touched.closingDate && formik.errors.closingDate}
                            data-cy='closingDate'
                            {...props}
                        />
                    )}
                />
            </Box>
        </>
    )
}

export const validationSchema: ObjectSchema<SettingsData> = yup.object().shape({
    title: yup.string().required('Please enter a title for your submission box'),
    description: yup.string(),
    // only future dates can be chosen due to disablePast on DateTimePicker
    closingDate: yup.date().typeError('Please enter a valid date').nullable().default(null),
})
