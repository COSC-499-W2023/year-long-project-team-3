import prisma from '@/lib/prisma'

export default async function clearDB() {
    await prisma.requestedEmailVerification.deleteMany({})
    await prisma.submittedVideo.deleteMany({})
    await prisma.requestedSubmission.deleteMany({})
    await prisma.submissionBoxManager.deleteMany({})
    await prisma.submissionBox.deleteMany({})
    await prisma.videoWhitelistedUser.deleteMany({})
    await prisma.videoWhitelist.deleteMany({})
    await prisma.video.deleteMany({})
    await prisma.resetPasswordToken.deleteMany({})
    await prisma.account.deleteMany({})
    await prisma.user.deleteMany({})

    return null
}
