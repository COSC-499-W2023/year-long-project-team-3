import { defineConfig } from 'cypress'
require('dotenv').config()

export default defineConfig({
    e2e: {
        projectId: process.env.CYPRESS_PROJECT_ID,
        baseUrl: process.env.NEXT_PUBLIC_BASE_URL,
        setupNodeEvents(on, config) {
            // implement node event listeners here
        },
        experimentalModifyObstructiveThirdPartyCode: true,
    },

    component: {
        devServer: {
            framework: 'next',
            bundler: 'webpack',
        },
    },
})
