'use client'

import React from 'react'
import Header from '@/components/Header'
import { Box } from '@mui/material'
import Logo from '@/components/Logo'
import Typography from '@mui/material/Typography'
import { type SessionContextValue, useSession } from 'next-auth/react'

export default function FindOutMorePage() {
    const session: SessionContextValue = useSession()

    const missionStatement =
        'The purpose of our software is to allow users to easily send and receive videos through their web\n' +
        'browser. Users will be able to protect their privacy in those videos by optionally blurring their\n' +
        'faces or their background. These privacy protection features will be implemented using AWS services.\n' +
        'Our software will be a web app that is targeted at professional settings which require video\n' +
        'submissions, such as recruiting or education. We are hoping to make it easier for our target\n' +
        'demographic to send and receive videos, all while maintaining privacy by giving users the ability to\n' +
        'blur their faces in recordings before submitting. What sets our solution apart from others is the\n' +
        'amount of control users will have over their videos and video requests. Users will be able to either\n' +
        'request videos or submit a video to a request. In order to request videos, they would open a\n' +
        '“submission box,” where they can request videos from other users by entering their email addresses.\n' +
        'These users would then receive an email notification of the submission request. To submit a video to\n' +
        'the “submission box,” users would log into the system, where they could then record the video in the\n' +
        'browser, or upload a pre-recorded video from their computer. The video would then be processed in\n' +
        'our web app. For the processing, we will take advantage of different AWS APIs to enable e.g. face\n' +
        'blurring on video recordings. Users will be able to play back their videos after processing, and\n' +
        'once they’re satisfied, they can submit them. Once submitted, videos can still be retracted, and\n' +
        'users can also set an expiry date on videos before submission. All of these features aim to put as\n' +
        'much power as possible into the user’s hands, all while making the workflow as easy as possible.\n' +
        'Ultimately, we will help professionals easily send and receive videos while protecting their privacy\n' +
        'through the use of cloud technology.'

    return (
        <>
            <Header {...session} />
            <Box sx={{ marginTop: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Logo fontSize={80} />
            </Box>
            <Box
                sx={{
                    marginTop: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Typography
                    data-cy='title'
                    variant='h2'
                    sx={{
                        fontWeight: 'medium',
                        maxWidth: {
                            md: undefined,
                            lg: '70%',
                            xl: '45%',
                        },
                        textAlign: 'center',
                        pb: 5,
                    }}
                >
                    Mission Statement
                </Typography>
                <Typography
                    variant='body1'
                    sx={{
                        fontWeight: 'medium',
                        maxWidth: {
                            md: undefined,
                            lg: '75%',
                            xl: '50%',
                        },
                        textAlign: 'center',
                    }}
                >
                    { missionStatement }
                </Typography>
            </Box>
        </>
    )
}
