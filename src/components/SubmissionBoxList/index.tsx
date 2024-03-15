import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import List from '@mui/material/List'
import { SubmissionBox } from '@prisma/client'
import { useRouter } from 'next/navigation'
import ManageSubmissionBoxCard from '@/components/ManageSubmissionBoxCard'

export type SubmissionBoxListProps = {
  submissionBoxes: SubmissionBox[]
  isSearching: boolean
  emptyMessage: string
}

export default function SubmissionBoxList(props: SubmissionBoxListProps) {
    const router = useRouter()

    return !!props.submissionBoxes && props.submissionBoxes.length > 0 ? (
        <List sx={{ maxHeight: 600, overflow: 'auto', position: 'relative', pl: 1, pr: 1 }}>
            {props.submissionBoxes.map((submissionBox, idx: number) => (
                <ManageSubmissionBoxCard key={`submission_box_${ idx }`} title={submissionBox.title}
                    closesAt={submissionBox.closesAt} id={submissionBox.id}
                    isOpen></ManageSubmissionBoxCard>
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

    function handleClickListItem(id: string) {
        router.push(`/submission-box/${ id }`)
    }
}
