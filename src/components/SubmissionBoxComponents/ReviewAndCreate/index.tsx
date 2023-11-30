import { Box, Chip } from '@mui/material'
import Typography from '@mui/material/Typography'
import React from 'react'
import TextField from '@mui/material/TextField'
import dayjs from 'dayjs'

// TODO: Implement this component (right now it's only a bare bones version for testing)

type ReviewAndCreateData = {
    title: string
    description: string | undefined
    closingDate: Date | null | undefined
    emails: string[]
}

export default function ReviewAndCreate({ title, description, closingDate, emails }: ReviewAndCreateData) {
    return (
        <>
            <Box
                gap={1}
                sx={{
                    p: 5,
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
                    type='title'
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
                        type='description'
                        label='Description'
                        name='description'
                        multiline
                        rows={4}
                        value={description}
                        data-cy='description'
                    />
                )}
                {closingDate && (
                    <TextField
                        disabled
                        margin='normal'
                        variant='outlined'
                        type='date'
                        label='Closing Date'
                        name='closingDate'
                        value={dayjs(closingDate)}
                        data-cy='closing-date'
                    />
                )}

                <Box sx={{ width: '27rem' }}>
                    <Typography>Requested Emails:</Typography>
                    {emails.map((email, index) => (
                        <Chip key={index} label={email} sx={{ m: 0.5, ml: 0 }} />
                    ))}
                </Box>
            </Box>
        </>
    )
}
