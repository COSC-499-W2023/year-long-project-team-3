/** @type {import("next").NextConfig} */
const nextConfig = () => {
    const environmentVariables = [
        'NEXT_PUBLIC_BASE_URL',
        'NEXT_IMAGE_WHITELIST_HOSTNAMES',
        'DATABASE_URL',
        'NEXT_PUBLIC_GOOGLE_CLIENT_ID',
        'NEXT_PUBLIC_GOOGLE_CLIENT_SECRET',
        'NEXT_PUBLIC_NEXTAUTH_SECRET',
        'AWS_UPLOAD_BUCKET_STREAMING',
        'AWS_UPLOAD_BUCKET_REKOGNITION',
        'AWS_UPLOAD_REGION_CANADA',
        'AWS_UPLOAD_REGION_US',
        'AWS_STREAMING_BUCKET',
    ]

    // Check if all environment variables are set
    const missingVariables = environmentVariables.filter((variable) => !process.env[variable])
    if (missingVariables.length > 0) {
        const errorMessage = `The environment variables are missing: ${ missingVariables.join(', ') }`
        throw new ReferenceError(errorMessage)
    }

    return {
        images: {
            domains: process.env.NEXT_IMAGE_WHITELIST_HOSTNAMES.split(' '),
        },
        output: 'standalone',
        reactStrictMode: false,
        experimental: {
            serverActions: true,
        },
    }
}

module.exports = nextConfig
