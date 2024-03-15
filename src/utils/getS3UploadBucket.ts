// Upload to Rekognition bucket if user wants their face blurred, upload to streaming bucket if not. If the video is
// uploaded to the Rekognition bucket, it will be transferred to the streaming bucket using a lambda on AWS, so the
// videos will all end up in the same bucket at the end
export function getS3UploadBucket(isFaceBlurred: boolean): string {
    return isFaceBlurred
        ? (process.env.AWS_UPLOAD_BUCKET_REKOGNITION as string)
        : (process.env.AWS_UPLOAD_BUCKET_STREAMING as string)
}

export function getS3StreamingBucket(): string {
    return process.env.AWS_STREAMING_BUCKET as string
}
