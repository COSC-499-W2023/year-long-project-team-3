import { CloudFrontClient, GetDistributionCommand } from '@aws-sdk/client-cloudfront'
import logger from '@/utils/logger'
import * as path from 'path'

export default async function getStreamableUrl(s3Key: string): Promise<string> {
    const genericErrorMsg = 'Cannot retrieve streamable video'
    if (!s3Key) {
        logger.error('s3Key not provided')
        throw new Error(genericErrorMsg)
    }

    const client = new CloudFrontClient({
        region: process.env.awsUploadRegion,
        credentials: {
            accessKeyId: process.env.awsAccessKeyId as string,
            secretAccessKey: process.env.awsSecretAccessKey as string,
            sessionToken: process.env.awsSessionToken as string,
        },
    })

    const command = new GetDistributionCommand({
        Id: process.env.cloudfrontDistributionId as string,
    })

    const result = await client.send(command)

    if (!result.Distribution) {
        logger.error('Distribution not found')
        throw new Error(genericErrorMsg)
    }
    if (!result.Distribution.DomainName) {
        logger.error('DomainName not found')
        throw new Error(genericErrorMsg)
    }

    return 'https://' + path.join(result.Distribution.DomainName, s3Key).trim()
}
