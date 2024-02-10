'use client'

import React from 'react'
import { Box, Link } from '@mui/material'
import Logo from '@/components/Logo'
import Typography from '@mui/material/Typography'

export default function LearnMorePage() {
    // noinspection HtmlUnknownTarget
    return (
        <>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        maxWidth: '45%',
                        p: '1rem',
                    }}
                >
                    <Box sx={{ mt: 4 }}>
                        <Logo fontSize={80} />
                    </Box>
                    <Typography
                        data-cy='title'
                        variant='h2'
                        sx={{
                            fontWeight: 'medium',
                            textAlign: 'center',
                            pb: 5,
                        }}
                    >
                        How to use Harp Video
                    </Typography>
                    <Box>
                        <Typography>
                            The purpose of our software is to allow users to easily send and receive videos through
                            their web browser. Users are able to protect their privacy in those videos by optionally
                            blurring their face.
                        </Typography>
                    </Box>
                    <Box>
                        <Typography
                            variant='h4'
                            sx={{
                                fontWeight: 'medium',
                                my: 2,
                            }}
                        >
                            Creating an Account
                        </Typography>
                        <ol>
                            <li>Navigate to the Signup page and fill out the form, then click sign in</li>
                            <li>
                                You will be redirected to the <Link href='/login'>Login page</Link>, login with the
                                account you created at <Link href='/signup'>Signup</Link>
                            </li>
                            <li>
                                If you are logging in for the first time, you will need to verify your email address.
                                Check your emails and click on the link we have sent to you.
                            </li>
                        </ol>
                        <Typography>
                            If you follow these three steps, you should now have an account and be able to see your{' '}
                            <Link href='/dashboard'>Dashboard page</Link>. Welcome to Harp!
                        </Typography>
                    </Box>
                    <Box>
                        <Typography
                            variant='h4'
                            sx={{
                                fontWeight: 'medium',
                                my: 2,
                            }}
                        >
                            Creating a Submission Box
                        </Typography>
                        <ol>
                            <li>
                                Click on Create New under Submission Boxes on the{' '}
                                <Link href='/dashboard'>Dashboard</Link>.
                            </li>
                            <li>
                                If you are logging in for the first time, you will need to verify your email address.
                                Check your emails and click on the link we have sent to you.
                            </li>
                            <li>
                                Complete the multi-step form consisting of Box Settings, Request Submissions, and Review
                                &amp; Create.
                            </li>
                        </ol>
                        <Typography>
                            After clicking Create, you can now navigate to My Boxes under Submission Boxes on the{' '}
                            <Link href='/dashboard'>Dashboard</Link> to see the box you have created.
                        </Typography>
                    </Box>
                    <Box>
                        <Typography
                            variant='h4'
                            sx={{
                                fontWeight: 'medium',
                                my: 2,
                            }}
                        >
                            Uploading a Video to a Submission Box
                        </Typography>
                        <ol>
                            <li>
                                Click on Upload New under Menu on the <Link href='/dashboard'>Dashboard</Link>. If you
                                want to blur your face in the video, tick the checkbox on the Upload Video page before
                                uploading a video from your computer.
                            </li>
                            <li>
                                Once you have uploaded a video, it will be processed using AWS services. After
                                processing is done, you will be redirected to the Preview page. There, you can playback
                                your video to ensure it is what you want to submit.
                            </li>
                            <li>
                                Upon clicking Next, you will find yourself on the Submit page, there you can see your
                                video&apos;s thumbnail and enter a title and description. You will also choose the
                                Submission Box you want to upload your video to.
                            </li>
                        </ol>
                        <Typography>
                            After clicking Submit, you can see your video on your{' '}
                            <Link href='/dashboard'>Dashboard page</Link> under Recents and Submitted videos.
                        </Typography>
                    </Box>
                </Box>
            </Box>
        </>
    )
}
