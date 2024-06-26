import React from 'react'
import { Box, Link } from '@mui/material'
import Logo from '@/components/Logo'
import Typography from '@mui/material/Typography'

export const metadata = {
    title: 'Learn More! - ',
}

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
                        py: '2rem',
                    }}
                >
                    <Box>
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
                            The purpose of our software is to allow you to easily send and receive videos through
                            your web browser. You are able to protect your privacy in those videos by optionally
                            blurring your face.
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
                            <li>Navigate to the <Link href='/signup'>Signup page</Link>, fill out the form, and then
                                click <i>Sign Up</i></li>
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
                                Click on <i>Create New</i> under Submission Boxes on the{' '}
                                <Link href='/dashboard'>Dashboard</Link>.
                            </li>
                            <li>
                                Complete the multi-step form consisting of &quot;Box Settings&quot;, &quot;Request
                                Submissions&quot;, and &quot;Review &amp; Create&quot;.
                            </li>
                        </ol>
                        <Typography>
                            After you finish the creation process, you can go to &quot;Manage Boxes&quot; under
                            &quot;Submission Boxes&quot; on the <Link href='/dashboard'>Dashboard</Link> to see a list
                            of all the boxes you have created.
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
                                Click on <i>Upload New</i> under &quot;Videos&quot; on the <Link href='/dashboard'>
                                Dashboard</Link>. This will redirect you to the &quot;Upload Video&quot; page, where you
                                choose a video from your computer to upload and give it a title. You can optionally
                                add a description. If you want to blur your face in the video, tick the checkbox on the
                                page before submitting.
                            </li>
                            <li>
                                Once you have submitted your video, it will be uploaded for processing and you will be
                                redirected to the video&apos;s page. There you can review details like the title and upload date.
                                Once your video has finished processing, you will also be able to play it back.
                            </li>
                            <li>
                                If you wish to submit your video to a submission box, you can now go to your
                                invitations by clicking <i>Submit to a Submission Box</i>. Alternatively, you access the
                                same page by navigating to your dashboard and heading to &quot;My Invitations&quot;
                            </li>
                        </ol>
                        <Typography>
                            You can see all of your videos on your{' '}
                            <Link href='/dashboard'>Dashboard page</Link> under My Videos.
                        </Typography>
                    </Box>
                </Box>
            </Box>
        </>
    )
}
