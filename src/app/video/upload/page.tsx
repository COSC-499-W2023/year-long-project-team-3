import UploadVideoForm from '@/components/UploadVideoForm'
import { Box } from '@mui/material'

export default function UploadVideoPage() {
    return (
        <>
            <Box sx={{display: 'flex', py: '4rem', alignItems: 'center', justifyContent: 'center'}}>
                <UploadVideoForm />
            </Box>
        </>
    )
}
