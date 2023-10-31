/** @type {import("next").NextConfig} */
const nextConfig = () => {
    const getEnvironmentVariables = () => {
        const environmentVariables = [
            'DATABASE_URL',
            'GOOGLE_CLIENT_ID',
            'GOOGLE_CLIENT_SECRET',
            'NEXT_PUBLIC_BASE_URL',
            'NEXTAUTH_URL',
            'NEXTAUTH_SECRET',
            'CYPRESS_PROJECT_ID',
        ]

        // Check if all environment variables are set
        const missingVariables = environmentVariables.filter((variable) => !process.env[variable])
        if (missingVariables.length > 0) {
            const errorMessage = `The environment variables are missing: ${ missingVariables.join(', ') }`
            throw new ReferenceError(errorMessage)
        }

        // Return environment variables
        return {
            googleClientId: process.env.GOOGLE_CLIENT_ID,
            googleClientSecret: process.env.GOOGLE_CLIENT_SECRET,
            cypressBaseUrl: process.env.CYPRESS_BASE_URL,
            cypressProjectId: process.env.CYPRESS_PROJECT_ID,
        }
    }

    return {
        env: getEnvironmentVariables(),
    }
}

module.exports = nextConfig
