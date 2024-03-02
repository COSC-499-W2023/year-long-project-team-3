import { S3Client, ListObjectsCommand, DeleteObjectsCommand } from '@aws-sdk/client-s3'
export default async function deleteS3StreamingVideo(s3Bucket: string, s3Key: string) {
    const client = new S3Client({
        region: process.env.AWS_UPLOAD_REGION_US,
    })

    const listALlChildrenObjectsCommand = new ListObjectsCommand({
        Bucket: s3Bucket,
        Prefix: s3Key + '/',
    })

    const allChildrenObjects = await client.send(listALlChildrenObjectsCommand)

    if (!allChildrenObjects.Contents || allChildrenObjects.Contents?.length === 0) {
        return
    }

    const deleteObjectKeys: { Key: string }[] = allChildrenObjects.Contents.flatMap((content) => {
        if (content.Key) {
            return {
                Key: content.Key,
            }
        }
        return []
    })

    const deleteParams = {
        Bucket: s3Bucket,
        Delete: { Objects: deleteObjectKeys },
    }

    await client.send(new DeleteObjectsCommand(deleteParams))

    // Note: Videos after deletion are still available to view through cloudfront
    // because AWS needs time to propagate the deletion to all edge locations
    // Details: https://repost.aws/knowledge-center/s3-listing-deleted-bucket/
}
