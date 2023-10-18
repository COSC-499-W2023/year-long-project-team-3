/** @type {import('next').NextConfig} */

const nextConfig = () => {
    const env = {}

    const nodeEnv = process.env.NODE_ENV
    if (nodeEnv === 'test') {
        env.DATABASE_URL = process.env.TEST_DATABASE_URL
    } else if (nodeEnv === 'dev') {
        env.DATABASE_URL = process.env.DEV_DATABASE_URL
    } else if (nodeEnv === 'prod') {
        env.DATABASE_URL = process.env.PROD_DATABASE_URL
    }

    return {
        env,
    }
}

module.exports = nextConfig
