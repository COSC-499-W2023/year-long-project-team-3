/** @type {import("next").NextConfig} */
const nextConfig = () => {
    return {
        images: {
            domains: process.env.NEXT_IMAGE_WHITELIST_HOSTNAMES.split(' '),
        },
        output: 'standalone',
    }
}

module.exports = nextConfig
