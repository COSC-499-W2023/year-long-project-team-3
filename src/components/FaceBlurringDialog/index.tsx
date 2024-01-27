import {
    Button,
    Checkbox,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    FormControlLabel,
} from '@mui/material'
import React from 'react'

export type FaceBlurringDialogProps = {
    isFaceBlurChecked: boolean
    open: boolean
    onClose: (value: boolean) => void
    onFaceBlurChecked: (value: boolean) => void
}

export default function FaceBlurringDialog(props: FaceBlurringDialogProps) {
    const { onClose, isFaceBlurChecked, open, onFaceBlurChecked } = props

    const handleClose = () => {
        onClose(isFaceBlurChecked)
    }

    const handleFaceBlurChecked = (event: React.ChangeEvent<HTMLInputElement>) => {
        onFaceBlurChecked(event.target.checked)
    }

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby='alert-dialog-title'
            aria-describedby='alert-dialog-description'
        >
            <DialogTitle id='alert-dialog-title'>{'Anonymize faces in this video?'}</DialogTitle>
            <DialogContent>
                <DialogContentText id='alert-dialog-description'>
                    Allow Harp to blur faces in your video. This means processing the video using Amazon Rekognition,
                    and may lead to an increase in processing time.
                </DialogContentText>
                <FormControlLabel
                    control={<Checkbox checked={isFaceBlurChecked} onChange={handleFaceBlurChecked} />}
                    label='Yes, I want to blur all faces in my video'
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                <Button onClick={handleClose} autoFocus>
                    Continue
                </Button>
            </DialogActions>
        </Dialog>
    )
}
