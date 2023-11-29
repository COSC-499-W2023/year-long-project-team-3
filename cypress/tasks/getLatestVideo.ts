export default async function getLatestVideo() {
    return await prisma.video.findFirst({
        orderBy: {
            createdAt: 'desc',
        },
    })
}
