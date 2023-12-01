import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import ListItem from '@mui/material/ListItem'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import List from '@mui/material/List'

export type SubmissionBoxListProps = {
    submissionBoxes: {
        id: number
        title: string
        description: string | null
        createdAt: Date
        closesAt: Date | null
        videoStoreToDate: Date | null
        maxVideoLength: null
        isPublic: boolean
    }[]
}

export default function SubmissionBoxList(props: SubmissionBoxListProps) {
    const [submissionBoxes, setSubmissionBoxes] = useState(props.submissionBoxes)
    const router = useRouter()

    return (
        <List sx={{ maxHeight: 600, overflow: 'auto', position: 'relative', pl: 1, pr: 1 }}>
            {submissionBoxes.map((submissionBox, id: React.Key) => (
                <ListItem key={id}>
                    <Box
                        sx={{ p: 1, background: 'grey', borderRadius: 1, width: '100%' }}
                        borderColor={'textSecondary'}
                        display='grid'
                        gridTemplateColumns='3fr 1fr'
                        alignItems='center'
                    >
                        <Typography sx={{ p: 1, color: 'textSecondary', fontWeight: 'bold' }}>
                            {submissionBox.title}
                        </Typography>
                        <Typography sx={{ p: 1, color: 'textSecondary' }}>
                            Close Date:{' '}
                            {submissionBox.closesAt !== null
                                ? new Date(submissionBox.closesAt).toDateString().slice(4)
                                : 'never'}
                        </Typography>
                    </Box>
                </ListItem>
            ))}
        </List>
    )
}
