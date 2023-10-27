/** @type {import("next").NextConfig} */
const nextConfig = () => {
    const getEnvironmentVariables = () => {
        const environmentVariables = [
            'NODE_ENV',
            'DATABASE_URL',
            'GOOGLE_CLIENT_ID',
            'GOOGLE_CLIENT_SECRET',
            'NEXT_PUBLIC_BASE_URL',
            'NEXTAUTH_URL',
            'NEXTAUTH_SECRET',
        ]

        // Check if all environment variables are set
        const missingVariables = environmentVariables.filter((variable) => !process.env[variable])
        if (missingVariables.length > 0) {
            const errorMessage = `The environment variables are missing: ${ missingVariables.join(', ') }`
            throw new ReferenceError(errorMessage)
        }

        // Return environment variables
        return {
            databaseURL: process.env.DATABASE_URL,
            googleClientId: process.env.GOOGLE_CLIENT_ID,
            googleClientSecret: process.env.GOOGLE_CLIENT_SECRET,
            baseURL: process.env.NEXT_PUBLIC_BASE_URL,
            nextAuthSecret: process.env.NEXTAUTH_SECRET,
        }
    }

    return {
        env: getEnvironmentVariables(),
    }
}

module.exports = nextConfig
