'use client'

import React from 'react'
import { Box, Step, StepLabel, Stepper } from '@mui/material'

export type ProgressDotsProps = {
    activeStep: number
    numSteps: number
    labels?: string[]
}

const ProgressDots: React.FC<ProgressDotsProps> = (props: ProgressDotsProps) => {
    const { activeStep, numSteps, labels = [] } = props

    for (let i = labels.length; i < numSteps; i++) {
        labels.push('')
    }

    return (
        <Box sx={{ width: '100%' }}>
            <Stepper activeStep={activeStep} alternativeLabel>
                {labels.length > 0 ? (
                    labels.map((label) => (
                        <Step key={label}>
                            <StepLabel>{label}</StepLabel>
                        </Step>
                    ))
                ) : (
                    <></>
                )}
            </Stepper>
        </Box>
    )
}

export default ProgressDots
