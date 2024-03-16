import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import List from '@mui/material/List'
import SubmissionBoxCard from 'src/components/SubmissionBoxCard'
import { SubmissionBoxInfo } from '@/types/submission-box/submissionBoxInfo'

export type SubmissionBoxListProps = {
  submissionBoxes: SubmissionBoxInfo[]
  isOwned: boolean
  isSearching: boolean
  emptyMessage: string
}

export default function SubmissionBoxList(props: SubmissionBoxListProps) {
    return !!props.submissionBoxes && props.submissionBoxes.length > 0 ? (
        <List sx={{ maxHeight: 600, overflow: 'auto', position: 'relative', pl: 3, pr: 3 }}>
            {props.submissionBoxes.map((submissionBox, idx: number) => (
                <SubmissionBoxCard
                    key={`submission_box_${ idx }`}
                    title={submissionBox.title}
                    closesAt={submissionBox.closesAt}
                    id={submissionBox.id}
                    isOpen={isOpen(submissionBox)}
                    // Only set numMembers and numSubmissions for boxes the user owns
                    numMembers={getNumMembers(props.isOwned, submissionBox)}
                    numSubmissions={getNumSubmissions(props.isOwned, submissionBox)}
                    // Only set time submitted for boxes the user was invited to, not for those he owns
                    timeSubmitted={getTimeSubmittedTo(props.isOwned, submissionBox)}
                    // Are these the user's submission boxes (under Manage Boxes) or the submission boxes the user has
                    // been invited to (under My Invitations)
                    isOwned={props.isOwned}
                ></SubmissionBoxCard>
            ))}
        </List>
    ) : (
        <Box display='flex' justifyContent='center' alignItems='center'>
            <Typography
                data-cy='no-submission-text'
                variant='h5'
                align='center'
                color={'textSecondary'}
                sx={{ mt: 20 }}
            >
                {props.isSearching
                    ? props.emptyMessage + ' that match this search'
                    : props.emptyMessage}
            </Typography>
        </Box>
    )
}

function isOpen(submissionBox: SubmissionBoxInfo) {
    // Box is open if it either does not have a closing date, or if the closing date is in the future
    return submissionBox.closesAt? (new Date() < new Date(submissionBox.closesAt)) : true
}

function getNumMembers(isOwned: boolean, submissionBox: SubmissionBoxInfo) {
    return isOwned && submissionBox.requestedSubmissions? submissionBox.requestedSubmissions.length : 0
}

function getNumSubmissions(isOwned: boolean, submissionBox: SubmissionBoxInfo) {
    if (!isOwned) { return 0 }
    let totalSubmitted = 0
    submissionBox.requestedSubmissions.forEach(submission => {
        submission.videoVersions.forEach(version => {
            if (version.submittedAt !== null) {
                totalSubmitted++
            }
        })
    })
    return totalSubmitted
}

function getTimeSubmittedTo(isOwned: boolean, submissionBox: SubmissionBoxInfo) {
    // Return submittedAt of last video version
    return !isOwned && submissionBox.requestedSubmissions?.length == 1? submissionBox.requestedSubmissions[0].videoVersions[submissionBox.requestedSubmissions[0].videoVersions.length - 1]?.submittedAt : null
}
