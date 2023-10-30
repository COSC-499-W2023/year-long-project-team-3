import React from 'react'
import UserAccountNav from '@/components/UserAccountNav/UserAccountNav'
import { Box } from '@mui/material'
import Logo from '@/components/Logo/logo'
import Typography from '@mui/material/Typography'

const page = () => {
    return (
        <>
            <UserAccountNav></UserAccountNav>
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
                    data-cy=''
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
                    data-cy=''
                >
                    The purpose of our software is to allow users to easily send and receive videos through their web
                    browser. Users will be able to protect their privacy in those videos by optionally blurring their
                    faces or their background. These privacy protection features will be implemented using AWS services.
                    Our software will be a web app that is targeted at professional settings which require video
                    submissions, such as recruiting or education. We are hoping to make it easier for our target
                    demographic to send and receive videos, all while maintaining privacy by giving users the ability to
                    blur their faces in recordings before submitting. What sets our solution apart from others is the
                    amount of control users will have over their videos and video requests. Users will be able to either
                    request videos or submit a video to a request. In order to request videos, they would open a
                    “submission box,” where they can request videos from other users by entering their email addresses.
                    These users would then receive an email notification of the submission request. To submit a video to
                    the “submission box,” users would log into the system, where they could then record the video in the
                    browser, or upload a pre-recorded video from their computer. The video would then be processed in
                    our web app. For the processing, we will take advantage of different AWS APIs to enable e.g. face
                    blurring on video recordings. Users will be able to play back their videos after processing, and
                    once they’re satisfied, they can submit them. Once submitted, videos can still be retracted, and
                    users can also set an expiry date on videos before submission. All of these features aim to put as
                    much power as possible into the user’s hands, all while making the workflow as easy as possible.
                    Ultimately, we will help professionals easily send and receive videos while protecting their privacy
                    through the use of cloud technology.
                </Typography>
            </Box>
        </>
    )
}

export default page
