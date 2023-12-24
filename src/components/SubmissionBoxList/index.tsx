'use client'

import React from 'react'
import ListItem from '@mui/material/ListItem'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import List from '@mui/material/List'
import { SubmissionBox } from '@prisma/client'
import { useRouter } from 'next/navigation'
import { darken } from '@mui/system'
import { theme } from '@/components/ThemeRegistry/theme'

export type SubmissionBoxListProps = {
    submissionBoxes: SubmissionBox[]
}

export default function SubmissionBoxList(props: SubmissionBoxListProps) {
    const router = useRouter()

    return !!props.submissionBoxes && props.submissionBoxes.length > 0 ? (
        <List sx={{ maxHeight: 600, overflow: 'auto', position: 'relative', pl: 1, pr: 1 }}>
            {props.submissionBoxes.map((submissionBox, idx: number) => (
                <ListItem key={`submission_box_${ idx }`} onClick={() => handleClickListItem(submissionBox.id)}>
                    <Box
                        sx={{
                            p: 1,
                            backgroundColor: 'secondary.light',
                            borderRadius: 1,
                            width: '100%',
                            padding: '1rem 2rem',
                            cursor: 'pointer',
                            '&:hover': {
                                backgroundColor: darken(theme.palette.secondary.light, 0.2),
                            },
                        }}
                        borderColor={'textSecondary'}
                        display='flex'
                        alignItems='center'
                        justifyContent='space-between'
                    >
                        <Typography
                            data-cy={submissionBox.title}
                            sx={{ p: 1, color: 'textSecondary', fontWeight: 'bold' }}
                        >
                            {submissionBox.title}
                        </Typography>
                        <Typography sx={{ p: 1, color: 'textSecondary' }}>
                            Close Date:{' '}
                            {!!submissionBox.closesAt
                                ? new Date(submissionBox.closesAt).toDateString().slice(4)
                                : 'N/A'}
                        </Typography>
                    </Box>
                </ListItem>
            ))}
        </List>
    ) : (
        <Box display='flex' justifyContent='center' alignItems='center'>
            <Typography>You do not have any submission box</Typography>
        </Box>
    )

    function handleClickListItem(id: string) {
        router.push(`/submission-box/${ id }`)
    }
}
