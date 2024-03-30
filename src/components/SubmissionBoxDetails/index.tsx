'use client'

import Typography from '@mui/material/Typography'
import React, { useState } from 'react'
import { RequestedSubmission, SubmissionBox } from '@prisma/client'
import { Box, Chip, Dialog, DialogActions, DialogTitle, Modal } from '@mui/material'
import Button from '@mui/material/Button'
import { AddCircleOutline } from '@mui/icons-material'
import { toast } from 'react-toastify'
import { theme } from '@/components/ThemeRegistry/theme'
import SubmissionBoxRequestSubmission from '@/components/SubmissionBoxRequestSubmission'

export type SubmissionBoxInfoProps = {
    submissionBox: SubmissionBox & { requestedSubmissions: RequestedSubmission[]} | null
    onUnsubmit?: () => void
    isOwned: boolean
}
export default function SubmissionBoxDetails(props: SubmissionBoxInfoProps) {
    const [members, setMembers] = useState(props.submissionBox?.requestedSubmissions.map(requestedSubmission => requestedSubmission.email) ?? [])
    const [proposedDeleteMember, setProposedDeleteMember] = useState<string | null>(null)
    const [inviteMembersModalOpen, setInviteMembersModalOpen] = useState(false)
    const [addedEmails, setAddedEmails] = useState<string[]>([])

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

    function clearAddMembersModal() {
        setAddedEmails([])
        setInviteMembersModalOpen(false)
    }

    function inviteMembers() {
        const newMembers = addedEmails.filter(member => !members.includes(member))
        if (addedEmails.length > 0) {
            fetch('/api/submission-box/invite', {
                method: 'POST',
                body: JSON.stringify({
                    submissionBoxId: props.submissionBox?.id,
                    emails: newMembers,
                }),
            }).then(res => {
                if (!res.ok) {
                    toast.error('Failed to invite entered emails')
                    setMembers(members.filter(member => !newMembers.includes(member)))
                } else {
                    toast.success('Members Successfully Invited!')
                }
            })
        }
        setMembers([...members, ...newMembers])
        clearAddMembersModal()
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
            {props.isOwned && (
                <>
                    <Box>
                        <Typography data-cy='submissionBoxMembersHeading' color={'textSecondary'} sx={{ fontWeight: 'bold' }}>
                            Members
                        </Typography>
                        <Box data-cy='submissionBoxMembers'>
                            {members.map(email =>
                                <Chip sx={{ m: 0.5, ml: 0 }} key={`submission-box-chip-${ email }`} label={email} onDelete={() => setProposedDeleteMember(email)}/>
                            )}
                            <Chip variant='outlined' label='Add Members' icon={<AddCircleOutline fontSize='small'/>} onClick={() => setInviteMembersModalOpen(true)}/>
                        </Box>
                    </Box>
                    <Dialog
                        open={!!proposedDeleteMember}
                        onClose={() => setProposedDeleteMember(null)}
                    >
                        <DialogTitle>Are you sure you want to uninvite {proposedDeleteMember} from this submission box?</DialogTitle>
                        <DialogActions
                            sx={{
                                p: 2,
                            }}
                        >
                            <Button onClick={
                                () => {
                                    setProposedDeleteMember(null)
                                }
                            }>No</Button>
                            <Button
                                onClick={
                                    () => {
                                        proposedDeleteMember && handleMemberDelete(proposedDeleteMember)
                                        setProposedDeleteMember(null)
                                    }
                                }
                                variant='contained'
                                autoFocus
                            >Yes</Button>
                        </DialogActions>
                    </Dialog>
                    <Modal
                        open={inviteMembersModalOpen}
                        onClose={clearAddMembersModal}
                    >
                        <Box sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            position: 'absolute' as 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            width: '70vw',
                            height: '80vh',
                            minHeight: '19rem',
                            minWidth: '29rem',
                            backgroundColor: theme.palette.background.default,
                            boxShadow: 24,
                            borderRadius: '1rem',
                            pb: 3,
                        }}>
                            <Box
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    alignItems: 'start',
                                }}
                            >
                                <Typography
                                    variant='h4'
                                    sx={{
                                        pl: 4,
                                        pt: 3,
                                        fontWeight: 500,
                                        color: 'text.secondary',
                                    }}
                                >Request Submissions</Typography>
                            </Box>
                            <Box
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    width: '100%',
                                    height: '100%',
                                }}
                            >
                                <SubmissionBoxRequestSubmission emails={addedEmails} setEmailFieldText={() => {}} setEmails={setAddedEmails}/>
                            </Box>
                            <Box
                                sx={{
                                    display: 'flex',
                                    gap: '1rem',
                                    justifyContent: 'end',
                                    mx: '1rem',
                                }}
                            >
                                <Button onClick={clearAddMembersModal}>Cancel</Button>
                                <Button variant='contained' onClick={inviteMembers}>Invite All</Button>
                            </Box>
                        </Box>
                    </Modal>
                </>
            )}
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
