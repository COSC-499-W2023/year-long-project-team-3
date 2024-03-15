import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import List from '@mui/material/List'
import SubmissionBoxCard from 'src/components/SubmissionBoxCard'
import { RequestedSubmission, SubmissionBox } from '@prisma/client'

export type SubmissionBoxListProps = {
  submissionBoxes: (SubmissionBox & {requestedSubmissions: RequestedSubmission[]})[]
  isOwned: boolean
  isSearching: boolean
  emptyMessage: string
}

export default function SubmissionBoxList(props: SubmissionBoxListProps) {
    return !!props.submissionBoxes && props.submissionBoxes.length > 0 ? (
        <List sx={{ maxHeight: 600, overflow: 'auto', position: 'relative', pl: 3, pr: 3 }}>
            {props.submissionBoxes.map((submissionBox, idx: number) => (
                <SubmissionBoxCard key={`submission_box_${ idx }`} title={submissionBox.title}
                    closesAt={submissionBox.closesAt} id={submissionBox.id}
                    isOpen={submissionBox.closesAt? (new Date(submissionBox.closesAt) > new Date()) : true } numMembers={submissionBox.requestedSubmissions? submissionBox.requestedSubmissions.length : 0}
                    numSubmissions={submissionBox.requestedSubmissions? submissionBox.requestedSubmissions.filter((submission: { submittedAt: Date | null }) => submission.submittedAt !== null).length : 0}
                    timeSubmitted={submissionBox.requestedSubmissions.length == 1? submissionBox.requestedSubmissions[0].submittedAt : null}
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
