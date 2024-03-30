'use client'

import Typography from '@mui/material/Typography'
import React, { useState } from 'react'
import { RequestedSubmission, SubmissionBox } from '@prisma/client'
import { Box, Chip } from '@mui/material'
import Button from '@mui/material/Button'
import { AddCircleOutline } from '@mui/icons-material'
import { toast } from 'react-toastify'

export type SubmissionBoxInfoProps = {
    submissionBox: SubmissionBox & { requestedSubmissions: RequestedSubmission[]} | null
    onUnsubmit?: () => void
    isOwned: boolean
}
export default function SubmissionBoxDetails(props: SubmissionBoxInfoProps) {
    const [members, setMembers] = useState(props.submissionBox?.requestedSubmissions.map(requestedSubmission => requestedSubmission.email) ?? [])

    function handleMemberDelete(deletedMember: string) {
        const newMembers = members.filter(member => member !== deletedMember)
        setMembers(newMembers)
        fetch('/api/submission-box/invite', {
            method: 'DELETE',
            body: JSON.stringify({
                submissionBoxId: props.submissionBox?.id,
                emails: [deletedMember],
            }),
        }).then(res => {
            if (!res.ok) {
                toast.error(`Failed to un-invite ${ deletedMember }`)
                setMembers([...newMembers, deletedMember])
            }
        })
    }

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: '2rem',
            }}
        >
            <Box>
                <Typography data-cy='submissionBoxTitleHeading' color={'textSecondary'} sx={{ fontWeight: 'bold' }}>
                    Submission Box Title
                </Typography>
                <Typography
                    data-cy='submissionBoxTitle'
                    variant='h5'
                    color={'textSecondary'}
                    sx={{ fontWeight: 'bold' }}
                >
                    {props.submissionBox ? props.submissionBox.title : 'N/A'}
                </Typography>
            </Box>
            {props.submissionBox && props.submissionBox.closesAt && (
                <Box>
                    <Typography data-cy='submissionBoxDateHeading' color={'textSecondary'} sx={{ fontWeight: 'bold' }}>
                        Close Date
                    </Typography>
                    <Typography
                        data-cy='submissionBoxDate'
                        variant={'subtitle2'}
                        color={'textSecondary'}
                    >
                        {new Date(props.submissionBox.closesAt).toDateString().slice(4)}
                    </Typography>
                </Box>
            )}
            {props.submissionBox && props.submissionBox.description && (
                <Box>
                    <Typography data-cy='submissionBoxDescHeading' color={'textSecondary'} sx={{ fontWeight: 'bold' }}>
                        Description
                    </Typography>
                    <Typography
                        data-cy='submissionBoxDesc'
                        variant='subtitle2'
                        color={'textSecondary'}
                        sx={{ maxHeight: '30rem', overflow: 'auto' }}
                    >
                        {props.submissionBox.description}
                    </Typography>
                </Box>
            )}
            <Box>
                <Typography data-cy='submissionBoxMembersHeading' color={'textSecondary'} sx={{ fontWeight: 'bold' }}>
                    Members
                </Typography>
                <Box data-cy='submissionBoxMembers'>
                    {members.map(email =>
                        <Chip sx={{ m: 0.5, ml: 0 }} key={`submission-box-chip-${ email }`} label={email} onDelete={() => handleMemberDelete(email)}/>
                    )}
                    <Chip variant='outlined' label='Add Members' icon={<AddCircleOutline/>} onClick={() => console.log('boop')}/>
                </Box>
            </Box>
            {props.onUnsubmit && (
                <Box
                    sx={{
                        mt: '2rem',
                    }}
                >
                    <Button
                        variant='contained'
                        onClick={props.onUnsubmit}
                        color='error'
                        data-cy='unsubmit-button'
                    >Unsubmit Video</Button>
                </Box>
            )}
        </Box>
    )
}
