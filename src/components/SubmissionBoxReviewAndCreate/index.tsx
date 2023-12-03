import { Box, Chip } from '@mui/material'
import Typography from '@mui/material/Typography'
import React from 'react'
import TextField from '@mui/material/TextField'
import dayjs from 'dayjs'
import { DesktopDateTimePicker } from '@mui/x-date-pickers'

type ReviewAndCreateData = {
    title: string
    description: string | undefined
    closingDate: Date | null | undefined
    emails: string[]
}

export default function SubmissionBoxReviewAndCreate({ title, description, closingDate, emails }: ReviewAndCreateData) {
    return (
        <>
            <Box
                gap={1}
                sx={{
                    pt: 3,
                    pb: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    minWidth: 'md',
                    '& .MuiTextField-root': { my: 1.5, mx: 8, width: '100%' },
                }}
            >
                <TextField
                    disabled
                    margin='normal'
                    variant='outlined'
                    type='text'
                    label='Title'
                    name='title'
                    value={title}
                    data-cy='submission-box-title'
                />
                {description && (
                    <TextField
                        disabled
                        margin='normal'
                        variant='outlined'
                        type='text'
                        label='Description'
                        name='description'
                        multiline
                        rows={4}
                        value={description}
                        data-cy='description'
                    />
                )}
                {closingDate && (
                    <DesktopDateTimePicker
                        className='data-cy-date-time' // regular data-cy didn't work
                        disabled
                        label='Closing Date'
                        value={dayjs(closingDate)}
                        asp-format='{0:yyyy-MM-dd}' // DOM error without this
                        format='YYYY/MM/DD hh:mm A'
                    />
                )}

                {emails.length > 0 && (
                    <Box sx={{ width: '20rem' }} data-cy='requested-emails'>
                        <Typography>Requested Emails:</Typography>
                        {emails.map((email, index) => (
                            <Chip key={index} label={email} sx={{ m: 0.5, ml: 0 }} />
                        ))}
                    </Box>
                )}
            </Box>
        </>
    )
}
